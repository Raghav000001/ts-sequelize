
    import sequelize from './sequelize.ts';
    import { Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';


    class Hotel extends Model<InferAttributes<Hotel>, InferCreationAttributes<Hotel>>{
             declare id: CreationOptional<number>;
             declare name: string; 
             declare location: string;
             declare ratings?: number | null;
             declare createdAt: CreationOptional<Date>;
             declare updatedAt: CreationOptional<Date>;
    }



    Hotel.init(
        {
           id:{
            type: 'INTEGER',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
           },
           name:{
            type: 'STRING',
            allowNull: false,
           },
           location:{
            type: 'STRING',
            allowNull: false,
           },
           ratings:{
            type: 'INTEGER',
            allowNull: true,
           },
           createdAt:{
            type: 'DATE',
           },
           updatedAt:{
            type: 'DATE',
           }
        }
    ,{
    tableName: 'Hotels',
    sequelize:sequelize,
    underscored: false,
    timestamps: true,
    })

    export default Hotel;