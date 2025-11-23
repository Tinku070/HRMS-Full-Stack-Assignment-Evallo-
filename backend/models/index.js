'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

// Initialize Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load all model files
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Extract models for associations
const {
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log,
} = db;

// ============================
// ASSOCIATIONS
// ============================

// Organisation → Users
if (Organisation && User) {
  Organisation.hasMany(User, { foreignKey: 'organisationId' });
  User.belongsTo(Organisation, { foreignKey: 'organisationId' });
}

// Organisation → Employees
if (Organisation && Employee) {
  Organisation.hasMany(Employee, { foreignKey: 'organisationId' });
  Employee.belongsTo(Organisation, { foreignKey: 'organisationId' });
}

// Organisation → Teams
if (Organisation && Team) {
  Organisation.hasMany(Team, { foreignKey: 'organisationId' });
  Team.belongsTo(Organisation, { foreignKey: 'organisationId' });
}

// Employee ↔ Team (Many-to-Many)
if (Employee && Team && EmployeeTeam) {
  Employee.belongsToMany(Team, {
    through: EmployeeTeam,
    foreignKey: 'employeeId',
    otherKey: 'teamId',
  });

  Team.belongsToMany(Employee, {
    through: EmployeeTeam,
    foreignKey: 'teamId',
    otherKey: 'employeeId',
  });
}

// Logs → User
if (User && Log) {
  User.hasMany(Log, { foreignKey: 'userId' });
  Log.belongsTo(User, { foreignKey: 'userId' });
}

// Logs → Organisation
if (Organisation && Log) {
  Log.belongsTo(Organisation, { foreignKey: 'organisationId' });
}

// Export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
