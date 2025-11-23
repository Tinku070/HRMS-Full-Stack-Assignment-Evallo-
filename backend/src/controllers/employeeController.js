// backend/src/controllers/employeeController.js
// const { Employee, EmployeeTeam, Log, Team, sequelize } = require('../models');
const { Employee, EmployeeTeam, Log, Team, sequelize } = require('../../models');


async function listEmployees(req, res) {
  try {
    const orgId = req.user.orgId;
    const employees = await Employee.findAll({
      where: { organisationId: orgId },
      include: [
        {
          model: Team,
          through: { attributes: [] } // omit join table fields
        }
      ],
      order: [['id', 'ASC']]
    });
    return res.json(employees);
  } catch (err) {
    console.error('listEmployees error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getEmployee(req, res) {
  try {
    const orgId = req.user.orgId;
    const id = parseInt(req.params.id, 10);
    const employee = await Employee.findOne({
      where: { id, organisationId: orgId },
      include: [{ model: Team, through: { attributes: [] } }]
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    return res.json(employee);
  } catch (err) {
    console.error('getEmployee error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function createEmployee(req, res) {
  const t = await sequelize.transaction();
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { first_name, last_name, email, phone } = req.body;

    if (!first_name) {
      await t.rollback();
      return res.status(400).json({ message: 'first_name is required' });
    }

    const employee = await Employee.create({
      organisationId: orgId,
      first_name,
      last_name,
      email,
      phone
    }, { transaction: t });

    await Log.create({
      organisationId: orgId,
      userId,
      action: 'employee_created',
      meta: { employeeId: employee.id, first_name, last_name, email }
    }, { transaction: t });

    await t.commit();
    return res.status(201).json(employee);
  } catch (err) {
    await t.rollback();
    console.error('createEmployee error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateEmployee(req, res) {
  const t = await sequelize.transaction();
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    const { first_name, last_name, email, phone } = req.body;

    const employee = await Employee.findOne({ where: { id, organisationId: orgId }});
    if (!employee) {
      await t.rollback();
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.update({ first_name, last_name, email, phone }, { transaction: t });

    await Log.create({
      organisationId: orgId,
      userId,
      action: 'employee_updated',
      meta: { employeeId: id, updated: { first_name, last_name, email, phone } }
    }, { transaction: t });

    await t.commit();
    return res.json(employee);
  } catch (err) {
    await t.rollback();
    console.error('updateEmployee error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function deleteEmployee(req, res) {
  const t = await sequelize.transaction();
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);

    const employee = await Employee.findOne({ where: { id, organisationId: orgId }});
    if (!employee) {
      await t.rollback();
      return res.status(404).json({ message: 'Employee not found' });
    }

    // delete associations first (if not using ON DELETE CASCADE)
    await EmployeeTeam.destroy({ where: { employeeId: id }, transaction: t });

    await employee.destroy({ transaction: t });

    await Log.create({
      organisationId: orgId,
      userId,
      action: 'employee_deleted',
      meta: { employeeId: id }
    }, { transaction: t });

    await t.commit();
    return res.json({ message: 'Employee deleted' });
  } catch (err) {
    await t.rollback();
    console.error('deleteEmployee error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
