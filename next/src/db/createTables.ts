import { sequelize } from './connection';

import './models/index'; // Import to ensure relationships are established

async function createTables() {
  try {
    // This will create all tables if they don't exist
    await sequelize.sync({ 
      alter: false, // Set to true only during development if you want to auto-update table structure
      force: false  // Set to true only if you want to drop and recreate all tables (dangerous in production!)
    });
    
    // Verify connection
    await sequelize.authenticate();
    
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
}

export { createTables };