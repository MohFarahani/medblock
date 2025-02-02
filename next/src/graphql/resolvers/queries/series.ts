import { Series, File } from '@/db/models';

export const seriesQueries = {
  allSeries: async () => {
    try {
      return await Series.findAll({
        include: [File]
      });
    } catch (error) {
      console.error('Query series error:', error);
      throw error;
    }
  },

  series: async (_: unknown, { idSeries }: { idSeries: string }) => {
    try {
      const series = await Series.findByPk(idSeries, {
        include: [File]
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