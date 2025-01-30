import { models } from '@/db/models';

export const fileQueries = {
  files: async () => {
    try {
      return await models.File.findAll();
    } catch (error) {
      console.error('Query files error:', error);
      throw error;
    }
  },

  file: async (_: unknown, { idFile }: { idFile: string }) => {
    try {
      const file = await models.File.findByPk(idFile);

      if (!file) {
        throw new Error(`File with ID ${idFile} not found`);
      }

      return file;
    } catch (error) {
      console.error('Query file error:', error);
      throw error;
    }
  }
};