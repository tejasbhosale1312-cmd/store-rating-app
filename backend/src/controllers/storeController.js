const { validationResult } = require('express-validator');
const { Op, fn, col } = require('sequelize');
const { Store, Rating } = require('../models');

// GET /api/stores?name=&address= - list with overall rating + this user's rating
async function listStoresForUser(req, res) {
  try {
    const { name, address } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({ where, order: [['name', 'ASC']] });

    const storeIds = stores.map((s) => s.id);
    const myRatings = await Rating.findAll({
      where: { userId: req.user.id, storeId: storeIds },
    });
    const myRatingMap = {};
    myRatings.forEach((r) => { myRatingMap[r.storeId] = r.value; });

    const avgRows = await Rating.findAll({
      where: { storeId: storeIds },
      attributes: ['storeId', [fn('AVG', col('value')), 'avgRating']],
      group: ['storeId'],
      raw: true,
    });
    const avgMap = {};
    avgRows.forEach((r) => { avgMap[r.storeId] = parseFloat(r.avgRating).toFixed(2); });

    const result = stores.map((s) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      overallRating: avgMap[s.id] || null,
      myRating: myRatingMap[s.id] || null,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list stores', error: err.message });
  }
}

// POST /api/stores/:storeId/rating - submit rating (body: value)
async function submitRating(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { storeId } = req.params;
    const { value } = req.body;
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [rating, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { value },
    });
    if (!created) {
      rating.value = value;
      await rating.save();
    }
    res.status(created ? 201 : 200).json(rating);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
}

module.exports = { listStoresForUser, submitRating };