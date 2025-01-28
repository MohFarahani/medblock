export * from './Patient';
export * from './Study';
export * from './Modality';
export * from './Series';
export * from './File';

import { Patient } from './Patient';
import { Study } from './Study';
import { Modality } from './Modality';
import { Series } from './Series';
import { File } from './File';

// Define associations
Patient.hasMany(Study, { foreignKey: 'idPatient' });
Study.belongsTo(Patient, { foreignKey: 'idPatient' });

Study.hasMany(Series, { foreignKey: 'idStudy' });
Series.belongsTo(Study, { foreignKey: 'idStudy' });

Modality.hasMany(Series, { foreignKey: 'idModality' });
Series.belongsTo(Modality, { foreignKey: 'idModality' });

Series.hasMany(File, { foreignKey: 'idSeries' });
File.belongsTo(Series, { foreignKey: 'idSeries' });

export const models = {
  Patient,
  Study,
  Modality,
  Series,
  File,
};