const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { Op, fn, col } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');

// GET /api/admin/dashboard
async function getDashboard(req, res) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
}

// POST /api/admin/users - Create admin or normal user
async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, address, role } = req.body;
    const allowedRoles = ['admin', 'user', 'owner'];
    const finalRole = allowedRoles.includes(role) ? role : 'user';

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role: finalRole });
    res.status(201).json({
      id: user.id, name: user.name, email: user.email, address: user.address, role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
}

// POST /api/admin/stores - Create store, optionally assign an owner
async function createStore(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, address, ownerId } = req.body;
    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Store email already in use' });

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create store', error: err.message });
  }
}

// GET /api/admin/stores?name=&email=&address=&sortBy=&order=
async function listStores(req, res) {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      order: [[sortBy, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']],
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      attributes: {
        include: [[fn('COALESCE', fn('AVG', col('ratings.value')), 0), 'avgRating']],
      },
      group: ['Store.id'],
      subQuery: false,
    });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list stores', error: err.message });
  }
}

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&order=
async function listUsers(req, res) {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      order: [[sortBy, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']],
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list users', error: err.message });
  }
}

// GET /api/admin/users/:id - includes rating if Store Owner
async function getUserDetail(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Store, as: 'ownedStore' }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let result = user.toJSON();
    if (user.role === 'owner' && user.ownedStore) {
      const avg = await Rating.findOne({
        where: { storeId: user.ownedStore.id },
        attributes: [[fn('AVG', col('value')), 'avgRating']],
        raw: true,
      });
      result.rating = avg && avg.avgRating ? parseFloat(avg.avgRating).toFixed(2) : null;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
}

module.exports = { getDashboard, createUser, createStore, listStores, listUsers, getUserDetail };