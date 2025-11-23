const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { Employee, Team, Log } = require("../../models");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const orgId = req.user.orgId;

    const employees = await Employee.count({ where: { organisationId: orgId } });
    const teams = await Team.count({ where: { organisationId: orgId } });
    const logs = await Log.count({ where: { organisationId: orgId } });

    return res.json({ employees, teams, logs });
  } catch (err) {
    console.error("metrics error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
