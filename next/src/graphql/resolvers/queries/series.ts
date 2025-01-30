import { models } from '@/db/models';

export const seriesQueries = {
  allSeries: async () => {
    try {
      return await models.Series.findAll({
        include: [models.File]
      });
    } catch (error) {
      console.error('Query series error:', error);
      throw error;
    }
  },

  series: async (_: unknown, { idSeries }: { idSeries: string }) => {
    try {
      const series = await models.Series.findByPk(idSeries, {
        include: [models.File]
      });

      if (!series) {
        throw new Error(`Series with ID ${idSeries} not found`);
      }

      return series;
    } catch (error) {
      console.error('Query series error:', error);
      throw error;
    }
  }
};