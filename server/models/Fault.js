const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Fault = sequelize.define("Fault", {
  type: DataTypes.STRING,
  severity: DataTypes.STRING,
  location: DataTypes.STRING,

  status: {
    type: DataTypes.STRING,
    defaultValue: "open"
  }
});

module.exports = Fault;