import { PatientRepository } from '@/repositories';

const patientRepo = new PatientRepository();

export const patientQueries = {
  patients: async () => {
    try {
      return await patientRepo.findAll();
    } catch (error) {
      console.error('Query patients error:', error);
      throw error;
    }
  },

  patient: async (_: unknown, { idPatient }: { idPatient: string }) => {
    try {
      const patient = await patientRepo.findById(parseInt(idPatient));

      if (!patient) {
        throw new Error(`Patient with ID ${idPatient} not found`);
      }

      return patient;
    } catch (error) {
      console.error('Query patient error:', error);
      throw error;
    }
  }
};
