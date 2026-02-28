import { QueryInterface } from 'sequelize';



module.exports = {
  async up (queryInterface: QueryInterface) {
        await queryInterface.addColumn('Hotels','ratings',{
          type: 'DECIMAL(3,2)',
          allowNull: true,
        })
  },

  async down (queryInterface: QueryInterface) {
     await queryInterface.removeColumn('Hotels','ratings')
  }
};
