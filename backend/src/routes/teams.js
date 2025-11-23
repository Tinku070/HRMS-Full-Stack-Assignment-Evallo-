const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  unassignEmployee
} = require('../controllers/teamController');

// All routes protected
router.use(authMiddleware);

router.get('/', listTeams);
router.get('/:id', getTeam);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

// ASSIGN & UNASSIGN ROUTES
router.post('/:teamId/assign', assignEmployee);
router.delete('/:teamId/unassign', unassignEmployee);

module.exports = router;
