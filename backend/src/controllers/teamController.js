const { Team, Log, Employee, EmployeeTeam, sequelize } = require('../../models');

// =====================
// LIST TEAMS
// =====================
exports.listTeams = async (req, res) => {
  try {
    const orgId = req.user.orgId;

    const teams = await Team.findAll({
      where: { organisationId: orgId },
      include: [
        {
          model: Employee,
          through: { attributes: [] } // show employees assigned to this team
        }
      ],
      order: [['id', 'ASC']]
    });

    return res.json(teams);
  } catch (err) {
    console.error('listTeams error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// =====================
// GET TEAM BY ID
// =====================
exports.getTeam = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const id = parseInt(req.params.id, 10);

    const team = await Team.findOne({
      where: { id, organisationId: orgId },
      include: [{ model: Employee, through: { attributes: [] } }]
    });

    if (!team) return res.status(404).json({ message: 'Team not found' });

    return res.json(team);
  } catch (err) {
    console.error('getTeam error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// =====================
// CREATE TEAM
// =====================
exports.createTeam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { name, description } = req.body;

    if (!name) {
      await t.rollback();
      return res.status(400).json({ message: 'Team name required' });
    }

    const team = await Team.create(
      {
        organisationId: orgId,
        name,
        description
      },
      { transaction: t }
    );

    await Log.create(
      {
        organisationId: orgId,
        userId,
        action: 'team_created',
        meta: { teamId: team.id, name }
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json(team);
  } catch (err) {
    await t.rollback();
    console.error('createTeam error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// =====================
// UPDATE TEAM
// =====================
exports.updateTeam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    const { name, description } = req.body;

    const team = await Team.findOne({
      where: { id, organisationId: orgId }
    });

    if (!team) {
      await t.rollback();
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.update({ name, description }, { transaction: t });

    await Log.create(
      {
        organisationId: orgId,
        userId,
        action: 'team_updated',
        meta: { teamId: id, updated: { name, description } }
      },
      { transaction: t }
    );

    await t.commit();
    return res.json(team);
  } catch (err) {
    await t.rollback();
    console.error('updateTeam error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// =====================
// DELETE TEAM
// =====================
exports.deleteTeam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);

    const team = await Team.findOne({
      where: { id, organisationId: orgId }
    });

    if (!team) {
      await t.rollback();
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.destroy({ transaction: t });

    await Log.create(
      {
        organisationId: orgId,
        userId,
        action: 'team_deleted',
        meta: { teamId: id }
      },
      { transaction: t }
    );

    await t.commit();
    return res.json({ message: 'Team deleted' });
  } catch (err) {
    await t.rollback();
    console.error('deleteTeam error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// =====================
// ASSIGN EMPLOYEE TO TEAM
// =====================
exports.assignEmployee = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const teamId = parseInt(req.params.teamId);
    const { employeeId } = req.body;

    // Validate team
    const team = await Team.findOne({ where: { id: teamId, organisationId: orgId }});
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Validate employee
    const employee = await Employee.findOne({ where: { id: employeeId, organisationId: orgId }});
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Check duplicate
    const exists = await EmployeeTeam.findOne({
      where: { employeeId, teamId }
    });

    if (exists) {
      await t.rollback();
      return res.status(400).json({ message: 'Employee already assigned to this team' });
    }

    // Assign
    await EmployeeTeam.create(
      { employeeId, teamId, assigned_at: new Date() },
      { transaction: t }
    );

    // Log
    await Log.create(
      {
        organisationId: orgId,
        userId,
        action: 'employee_assigned_to_team',
        meta: { employeeId, teamId }
      },
      { transaction: t }
    );

    await t.commit();
    return res.json({ message: 'Employee assigned to team' });

  } catch (err) {
    await t.rollback();
    console.error('assignEmployee error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// =====================
// UNASSIGN EMPLOYEE FROM TEAM
// =====================
exports.unassignEmployee = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const teamId = parseInt(req.params.teamId);
    const { employeeId } = req.body;

    const assignment = await EmployeeTeam.findOne({
      where: { employeeId, teamId }
    });

    if (!assignment) {
      await t.rollback();
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.destroy({ transaction: t });

    await Log.create(
      {
        organisationId: orgId,
        userId,
        action: 'employee_unassigned_from_team',
        meta: { employeeId, teamId }
      },
      { transaction: t }
    );

    await t.commit();
    return res.json({ message: 'Employee unassigned from team' });

  } catch (err) {
    await t.rollback();
    console.error('unassignEmployee error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
