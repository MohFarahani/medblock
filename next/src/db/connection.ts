import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import { createTables } from './createTables';

const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: mysql2,
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER || 'dicom_user',
  password: process.env.DB_PASS || 'dicom_password',
  database: process.env.DB_NAME || 'dicom_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  logging: console.log,
});
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

// Initialize the database when the application starts
initializeDatabase();

export { sequelize };