const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Log = sequelize.define("Log", {
  tool_id: DataTypes.INTEGER,
  action: DataTypes.STRING,
  user: DataTypes.STRING
}, {
  tableName: "logs",
  timestamps: true
});

module.exports = Log;