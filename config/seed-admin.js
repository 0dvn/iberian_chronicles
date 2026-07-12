import bcrypt from 'bcrypt';
import User from '../models/User.js';

export async function seedAdmin() {
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) return;

  const exists = await User.findOne({ role: 'admin' });
  if (exists) return;

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    passwordHash,
    role: 'admin',
  });

  console.log('[seed] admin user created');
}
