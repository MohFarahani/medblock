import { FileRepository } from '@/repositories';

const fileRepo = new FileRepository();

export const fileQueries = {
  files: async () => {
    try {
      return await fileRepo.findAll();
    } catch (error) {
      console.error('Query files error:', error);
      throw error;
    }
  },

  file: async (_: unknown, { idFile }: { idFile: string }) => {
    try {
      const file = await fileRepo.findById(parseInt(idFile));

      if (!file) {
        throw new Error(`File with ID ${idFile} not found`);
      }

      return file;
    } catch (error) {
      console.error('Query file error:', error);
      throw error;
    }
  },

  getAllDicomFiles: async () => {
    try {
      // This query needs special handling due to its complex joins
      // You might want to add a specific method in FileRepository for this
      const files = await fileRepo.findAllWithRelations();
      
      return files.map(file => ({
        PatientName: file.Patient?.Name ?? '',
        StudyDate: file.Study?.StudyDate?.toISOString() ?? '',
        StudyDescription: file.Study?.StudyName ?? '',
        SeriesDescription: file.Series?.SeriesName ?? '',
        Modality: file.Series?.Modality?.Name ?? '',
        FilePath: file.FilePath,
      }));
    } catch (error) {
      console.error('Query getAllDicomFiles error:', error);
      throw error;
    }
  }
};