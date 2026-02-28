# API Flow — Full MVC Architecture with TypeScript

A complete reference of how a request travels through the entire application — from route to database and back.

---

## The Big Picture

### File Creation Order (how you build it)

```
DTO              → define the shape of data first
   ↓
Repository       → write DB queries (uses DTO)
   ↓
Service          → business logic (calls repository)
   ↓
Controller       → handle req/res (calls service)
   ↓
Validator        → Zod schema for request validation
   ↓
Router           → wire everything together
```

### Request Flow (how a request travels at runtime)

```
Incoming Request
   ↓
Router           → matches URL and HTTP method
   ↓
Validator        → validates req.body using Zod schema
   ↓
Controller       → reads req, calls service, sends res
   ↓
Service          → business logic, calls repository
   ↓
Repository       → talks to DB via Sequelize Model
   ↓
Database (MySQL)
```

> Build order and request flow are opposite — you build from the inside out, but requests flow from the outside in.

Each layer has **one job only** — this is the MVC pattern.

---

## Project Structure

```
src/
├── dto/
│   └── hotel.dto.ts               # Type definitions for request data
├── validators/
│   └── validator.ts               # Zod schemas for validation
├── middlewares/
│   ├── zod.middleware.ts          # Runs Zod validation before controller
│   ├── error.middleware.ts        # Catches all errors globally
│   └── correlation.middleware.ts  # Attaches correlationId to every request
├── repositories/
│   └── hotel.repository.ts        # All DB queries live here
├── service/
│   └── hotel.service.ts           # Business logic lives here
├── controllers/
│   └── hotel.controller.ts        # Handles req/res
└── routes/
    └── v1/
        └── hotel.routes.ts        # URL definitions
```

---

## Layer 1 — DTO (Data Transfer Object)

**File:** `src/dto/hotel.dto.ts`

```typescript
export type createHotelDto = {
  name: string;
  location: string;
  ratings?: number;
};
```

### What is a DTO?

A **DTO** defines the **shape of data** that travels between layers. It is a plain TypeScript type — no logic, just types.

- `ratings?` → optional field (user may or may not send it)
- Used in repository, service, and controller to keep types consistent across all layers
- If the shape of request data changes, you update it here and TypeScript will catch all the places that need updating

---

## Layer 2 — Validator (Zod Schema)

**File:** `src/validators/validator.ts`

```typescript
import { z } from 'zod';

export const createHotelValidatorSchema = z.object({
  name: z.string().trim()
    .min(3, "name must be at least 3 characters")
    .max(50, "name can not be bigger than 50 characters"),
  location: z.string().trim()
    .min(3, "location must be at least 3 characters")
    .max(50, "location can not be bigger than 50 characters"),
  ratings: z.number()
    .min(0, "ratings can not be less than 0")
    .max(5, "ratings can not be greater than 5")
    .optional(),
});
```

### What is this doing?

Zod is a **runtime validation library** — TypeScript types only exist at compile time, but Zod validates actual data at runtime when a real request comes in.

| Zod Method | What it does |
|---|---|
| `z.object({})` | Validates that the input is an object with these exact fields |
| `z.string()` | Field must be a string |
| `.trim()` | Removes leading/trailing spaces before validating |
| `.min(3, "msg")` | String must be at least 3 characters, shows "msg" if not |
| `.max(50, "msg")` | String must not exceed 50 characters |
| `z.number()` | Field must be a number |
| `.optional()` | Field is not required |

---

## Layer 3 — Zod Middleware

**File:** `src/middlewares/zod.middleware.ts`

This middleware runs the Zod schema against `req.body` **before** the controller is called.

```typescript
import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.errors[0]?.message || 'Validation failed',
      });
    }
    req.body = result.data; // replace body with parsed/cleaned data
    next();
  };
};
```

### Why a separate middleware for validation?

- Keeps validation **out of the controller** — controller only handles req/res
- `validate(schema)` is a **higher order function** — it takes a schema and returns a middleware function, so you can reuse it for any route with any schema
- `safeParse` does not throw — it returns `{ success, data, error }` so you can handle it cleanly
- `req.body = result.data` replaces the raw body with Zod's cleaned/trimmed version

---

## Layer 4 — Router

**File:** `src/routes/v1/hotel.routes.ts`

```typescript
import Router from 'express';
import { createHotelHandler, getAllHotelsHandler, getHotelByIdHandler } from '../../controllers/hotel.controller.ts';
import { validate } from '../../middlewares/zod.middleware.ts';
import { createHotelValidatorSchema } from '../../validators/validator.ts';

const hotelRouter = Router();

hotelRouter.route('/create').post(validate(createHotelValidatorSchema), createHotelHandler);
hotelRouter.route('/all-hotels').get(getAllHotelsHandler);
hotelRouter.route('/:id').get(getHotelByIdHandler);

export default hotelRouter;
```

### What is happening here?

| Route | Method | Middleware | Handler |
|---|---|---|---|
| `/create` | POST | `validate(schema)` → then controller | `createHotelHandler` |
| `/all-hotels` | GET | none | `getAllHotelsHandler` |
| `/:id` | GET | none | `getHotelByIdHandler` |

- `Router()` creates a **mini Express app** for just hotel routes
- `.route('/create').post(...)` is cleaner than `hotelRouter.post('/create', ...)`
- `validate(createHotelValidatorSchema)` runs first — if validation fails, controller never runs
- `/:id` is a **dynamic segment** — `:id` becomes available as `req.params.id`

---

## Layer 5 — Controller

**File:** `src/controllers/hotel.controller.ts`

```typescript
import type { Request, Response } from 'express';
import { createHotelService, getAllHotelsService, getHotelByIdService } from '../service/hotel.service.ts';

export const createHotelHandler = async (req: Request, res: Response) => {
  const { name, location, ratings } = req.body;
  const createdHotel = await createHotelService({ name, location, ratings });
  return res.status(201).json({
    message: 'Hotel created successfully',
    hotel: createdHotel,
    success: true,
  });
};

export const getAllHotelsHandler = async (req: Request, res: Response) => {
  const hotels = await getAllHotelsService();
  return res.status(200).json({
    message: 'Hotels retrieved successfully',
    hotels,
    success: true,
  });
};

export const getHotelByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const hotel = await getHotelByIdService(Number(id));
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found', success: false });
  }
  return res.status(200).json({
    message: 'Hotel retrieved successfully',
    hotel,
    success: true,
  });
};
```

### Controller's only job

- Read data from `req.body` or `req.params`
- Call the service
- Send back `res.status().json()`
- **No business logic here** — no DB calls, no validation

---

## Layer 6 — Service

**File:** `src/service/hotel.service.ts`

```typescript
import { createHotel, getAllHotels, getHotelById } from '../repositories/hotel.repository.ts';
import { type createHotelDto } from '../dto/hotel.dto.ts';

export async function createHotelService(hotelData: createHotelDto) {
  const createdHotel = await createHotel(hotelData);
  return createdHotel;
}

export async function getAllHotelsService() {
  const hotels = await getAllHotels();
  return hotels;
}

export async function getHotelByIdService(id: number) {
  const hotel = await getHotelById(id);
  return hotel;
}
```

### Service's job

- Contains **business logic** — e.g. "before creating a hotel, check if it already exists"
- Calls the repository for DB operations
- Right now the services are thin (just calling repository) — but as your app grows, logic like sending emails, calling other services, transforming data etc. goes here
- **Never touches `req` or `res`** — completely decoupled from HTTP

---

## Layer 7 — Repository

**File:** `src/repositories/hotel.repository.ts`

```typescript
import logger from '../config/logger.config.ts';
import Hotel from '../db/models/hotel.ts';
import { type createHotelDto } from '../dto/hotel.dto.ts';
import { badRequest } from '../errors/app.errors.ts';

export const createHotel = async (hotelData: createHotelDto) => {
  try {
    const hotel = await Hotel.create({
      name: hotelData.name,
      location: hotelData.location,
      ratings: hotelData.ratings ?? null,
    });
    return hotel;
  } catch (error) {
    logger.error('Error while creating hotel', error);
    throw new badRequest('Error while creating hotel');
  }
};

export const getAllHotels = async () => {
  try {
    const hotels = await Hotel.findAll();
    return hotels;
  } catch (error) {
    logger.error('Error while fetching hotels', error);
    throw new badRequest('Error while fetching hotels');
  }
};

export const getHotelById = async (id: number) => {
  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) throw new badRequest('Hotel not found');
    return hotel;
  } catch (error) {
    if (error instanceof badRequest) throw error;
    logger.error('Error while fetching hotel', error);
    throw new badRequest('Error while fetching hotel');
  }
};
```

### Repository's job

- **Only layer that talks to the database**
- Uses Sequelize model methods — `Hotel.create()`, `Hotel.findAll()`, `Hotel.findByPk()`
- Wraps all DB calls in try/catch and throws custom errors
- `ratings: hotelData.ratings ?? null` — if ratings not provided, store `null` in DB

---

## Full Request Lifecycle Example

**POST `/api/v1/hotels/create`**

```
1. Request hits router
      ↓
2. validate(createHotelValidatorSchema) runs
   → if body invalid → 400 response, stops here
   → if body valid → next()
      ↓
3. createHotelHandler runs
   → destructures name, location, ratings from req.body
   → calls createHotelService()
      ↓
4. createHotelService runs
   → calls createHotel() from repository
      ↓
5. createHotel repository function runs
   → calls Hotel.create() — Sequelize sends INSERT query to MySQL
   → returns created hotel
      ↓
6. Response travels back up:
   repository → service → controller
      ↓
7. Controller sends res.status(201).json({ success: true, hotel })
```

---

## Error Flow

```
Repository throws new badRequest("Error while creating hotel")
      ↓
Service does not catch it — bubbles up
      ↓
Controller does not catch it — bubbles up
      ↓
genericErrorHandler middleware catches it
      ↓
res.status(err.statusCode).json({ success: false, message: err.message })
```

This is why error classes must `extend Error`:

```typescript
export class badRequest extends Error implements AppError {
  statusCode: number;
  constructor(message: string) {
    super(message);          // ← required to properly extend Error
    this.statusCode = 400;
    this.name = 'bad request';
  }
}
```

---

## Things to Remember

- **DTO** → shape of data, shared across all layers
- **Validator** → runtime check using Zod, runs before controller
- **Controller** → only reads req, calls service, sends res
- **Service** → business logic, calls repository
- **Repository** → only layer that touches the DB
- **Never skip `extends Error`** in custom error classes — `statusCode` will be undefined otherwise
- **Always add `express.json()`** middleware in `server.ts` — without it `req.body` is undefined
- **`instanceof` check in repository** catch blocks when you throw custom errors inside try — otherwise catch will swallow your own error and re-wrap it