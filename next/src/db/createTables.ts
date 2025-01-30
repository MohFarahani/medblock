import { sequelize } from './connection';

async function createTables() {
  try {
    // Create Patients table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Patients (
        idPatient INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(255) NOT NULL,
        CreatedDate DATETIME NOT NULL
      );
    `);

    // Create Studies table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Studies (
        idStudy INT PRIMARY KEY AUTO_INCREMENT,
        idPatient INT NOT NULL,
        StudyName VARCHAR(255) NOT NULL,
        StudyDate DATETIME NOT NULL,
        CreatedDate DATETIME NOT NULL,
        FOREIGN KEY (idPatient) REFERENCES Patients(idPatient)
      );
    `);

    // Create Modalities table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Modalities (
        idModality INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(50) NOT NULL
      );
    `);

    // Create Series table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Series (
        idSeries INT PRIMARY KEY AUTO_INCREMENT,
        idPatient INT NOT NULL,
        idStudy INT NOT NULL,
        idModality INT NOT NULL,
        SeriesName VARCHAR(255) NOT NULL,
        CreatedDate DATETIME NOT NULL,
        FOREIGN KEY (idPatient) REFERENCES Patients(idPatient),
        FOREIGN KEY (idStudy) REFERENCES Studies(idStudy),
        FOREIGN KEY (idModality) REFERENCES Modalities(idModality)
      );
    `);

    // Create Files table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Files (
        idFile INT PRIMARY KEY AUTO_INCREMENT,
        idPatient INT NOT NULL,
        idStudy INT NOT NULL,
        idSeries INT NOT NULL,
        FilePath VARCHAR(1024) NOT NULL,
        CreatedDate DATETIME NOT NULL,
        FOREIGN KEY (idPatient) REFERENCES Patients(idPatient),
        FOREIGN KEY (idStudy) REFERENCES Studies(idStudy),
        FOREIGN KEY (idSeries) REFERENCES Series(idSeries)
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
}

export { createTables };