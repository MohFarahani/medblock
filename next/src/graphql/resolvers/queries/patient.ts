import { Patient, Study, Series, File } from '@/db/models';

export const patientQueries = {
  patients: async () => {
    try {
      return await Patient.findAll({
        include: [{
          model: Study,
          include: [{
            model: Series,
            include: [File]
          }]
        }]
      });
    } catch (error) {
      console.error('Query patients error:', error);
      throw error;
    }
  },

  patient: async (_: unknown, { idPatient }: { idPatient: string }) => {
    try {
      const patient = await Patient.findByPk(idPatient, {
        include: [{
          model: Study,
          include: [{
            model: Series,
            include: [File]
          }]
        }]
      });

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
