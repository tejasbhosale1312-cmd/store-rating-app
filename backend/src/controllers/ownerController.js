const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

// GET /api/owner/dashboard - raters list + average rating for the owner's store
async function getOwnerDashboard(req, res) {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store) return res.status(404).json({ message: 'No store assigned to this owner' });

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['updatedAt', 'DESC']],
    });

    const avgRow = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[fn('AVG', col('value')), 'avgRating']],
      raw: true,
    });

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating: avgRow && avgRow.avgRating ? parseFloat(avgRow.avgRating).toFixed(2) : null,
      raters: ratings.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        rating: r.value,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load owner dashboard', error: err.message });
  }
}

module.exports = { getOwnerDashboard };