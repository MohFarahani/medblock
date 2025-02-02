import { PatientRepository } from './PatientRepository';
import { StudyRepository } from './StudyRepository';
import { SeriesRepository } from './SeriesRepository';

export const repositories = {
  patients: new PatientRepository(),
  studies: new StudyRepository(),
  series: new SeriesRepository(),
};

export {
  PatientRepository,
  StudyRepository,
  SeriesRepository,
}; 