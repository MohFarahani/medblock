import { models } from '@/db/models';

export const studyQueries = {
  studies: async () => {
    try {
      return await models.Study.findAll({
        include: [{
          model: models.Series,
          include: [models.File]
        }]
      });
    } catch (error) {
      console.error('Query studies error:', error);
      throw error;
    }
  },

  study: async (_: unknown, { idStudy }: { idStudy: string }) => {
    try {
      const study = await models.Study.findByPk(idStudy, {
        include: [{
          model: models.Series,
          include: [models.File]
        }]
      });

      if (!study) {
        throw new Error(`Study with ID ${idStudy} not found`);
      }

      return study;
    } catch (error) {
      console.error('Query study error:', error);
      throw error;
    }
  }
};