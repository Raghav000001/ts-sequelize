import { QueryInterface} from 'sequelize';

// yaha 2 functions export karni hoti hai, up aur down, up function me hum table create karte hai aur down function me us table ko drop kar dete hai, taki agar hume future me kabhi bhi is migration ko undo karna pade to hum easily kar sake

//up and down functions => up function is used to apply the migration and down function is used to revert the migration, so in our case up function will create the hotel table and down function will drop the hotel table, so if we run the migration it will create the hotel table and if we undo the migration it will drop the hotel table
module.exports = {
  async up(queryInterface: QueryInterface) {
    // ye sirf ek tarika hai table create karne ka, hum raw SQL bhi likh sakte hai queryInterface.sequelize.query('CREATE TABLE Hotels (id INTEGER PRIMARY KEY, name VARCHAR(255), location VARCHAR(255), createdAt DATE, updatedAt DATE)')
    //) method ke through
    await queryInterface.createTable("Hotels", {
      id: {
        type: "INTEGER",
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: "VARCHAR(255)",
        allowNull: false,
      },
      location: {
        type: "VARCHAR(255)",
        allowNull: false,
      },
      createdAt: {
        type: "DATE",
        allowNull: false,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: "DATE",
        allowNull: false,
        defaultValue: new Date(),
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("Hotels");
  },
};
