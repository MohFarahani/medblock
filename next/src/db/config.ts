import { Dialect } from 'sequelize';

export const config = {
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'your_database',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql' as Dialect,
};