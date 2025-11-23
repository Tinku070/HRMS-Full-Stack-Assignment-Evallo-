const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { Organisation, User, Log } = require('../models');
const { Organisation, User, Log } = require('../../models');


exports.register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // Create organisation
    const organisation = await Organisation.create({
      name: orgName
    });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await User.create({
      organisationId: organisation.id,
      name: adminName,
      email,
      password_hash: hashed
    });

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Log event
    await Log.create({
      organisationId: organisation.id,
      userId: user.id,
      action: 'organisation_registered',
      meta: { organisationId: organisation.id, adminUserId: user.id }
    });

    return res.status(201).json({
      message: 'Organisation registered successfully',
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password, orgName } = req.body;

    if (!email || !password || !orgName) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const organisation = await Organisation.findOne({ where: { name: orgName } });
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    const user = await User.findOne({
      where: {
        email,
        organisationId: organisation.id
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Log login
    await Log.create({
      organisationId: organisation.id,
      userId: user.id,
      action: 'user_logged_in',
      meta: { email }
    });

    return res.json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
