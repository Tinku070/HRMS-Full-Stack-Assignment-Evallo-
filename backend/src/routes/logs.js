const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getLogs } = require('../controllers/logController');

// Protected route
router.use(authMiddleware);

// GET /api/logs
router.get('/', getLogs);

module.exports = router;
