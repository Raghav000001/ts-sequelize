import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface:QueryInterface) {
       queryInterface.addColumn('Hotels','deletedAt',{
          type:DataTypes.DATE,
          allowNull:true,
          defaultValue:null

       })

  },

  async down (queryInterface:QueryInterface) {
     await queryInterface.removeColumn('Hotels','deleted_at')
  
  }
};
