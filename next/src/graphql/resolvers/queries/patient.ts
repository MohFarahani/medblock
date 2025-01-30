import { models } from '@/db/models';

export const patientQueries = {
  patients: async () => {
    try {
      return await models.Patient.findAll({
        include: [{
          model: models.Study,
          include: [{
            model: models.Series,
            include: [models.File]
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
      const patient = await models.Patient.findByPk(idPatient, {
        include: [{
          model: models.Study,
          include: [{
            model: models.Series,
            include: [models.File]
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
