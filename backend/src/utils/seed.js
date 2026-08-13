// Bootstraps the first System Administrator account.
// Run with: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

async function seed() {
  await sequelize.sync();

  const email = 'admin@storerating.com';
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log('Admin already exists:', email);
    return process.exit(0);
  }

  const hashed = await bcrypt.hash('Admin@1234', 10);
  await User.create({
    name: 'System Administrator Account User', // 20-60 chars
    email,
    password: hashed,
    address: 'HQ Office',
    role: 'admin',
  });

  console.log('Admin created:');
  console.log('  email:', email);
  console.log('  password: Admin@1234');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});