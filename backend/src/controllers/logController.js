const { Log, User } = require('../../models');

exports.getLogs = async (req, res) => {
  try {
    const orgId = req.user.orgId;

    // Optional filters
    const { userId, action, from, to } = req.query;

    const where = { organisationId: orgId };

    if (userId) where.userId = userId;
    if (action) where.action = action;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.$gte = new Date(from);
      if (to) where.createdAt.$lte = new Date(to);
    }

    const logs = await Log.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return res.json(logs);
  } catch (err) {
    console.error('getLogs error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
