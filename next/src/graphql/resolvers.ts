import { models } from '@/db/models';
import { DicomUploadInput } from './types';

export const resolvers = {
  Query: {
    patients: async () => {
      return await models.Patient.findAll();
    },
    studies: async (_: any, { patientId }: { patientId: string }) => {
      return await models.Study.findAll({
        where: { idPatient: patientId }
      });
    },
    series: async (_: any, { studyId }: { studyId: string }) => {
      return await models.Series.findAll({
        where: { idStudy: studyId }
      });
    },
    files: async (_: any, { seriesId }: { seriesId: string }) => {
      return await models.File.findAll({
        where: { idSeries: seriesId }
      });
    },
  },
  Mutation: {
    processDicomUpload: async (_: any, input: DicomUploadInput) => {
      try {
        // Create or find patient
        const [patient] = await models.Patient.findOrCreate({
          where: { Name: input.patientName },
          defaults: { CreatedDate: new Date() }
        });

        // Create or find modality
        const [modality] = await models.Modality.findOrCreate({
          where: { Name: input.modalityName }
        });

        // Create study
        const study = await models.Study.create({
          idPatient: patient.idPatient,
          StudyName: input.studyDescription,
          CreatedDate: new Date()
        });

        // Create series
        const series = await models.Series.create({
          idPatient: patient.idPatient,
          idStudy: study.idStudy,
          idModality: modality.idModality,
          SeriesName: input.seriesDescription,
          CreatedDate: new Date()
        });

        // Create file
        await models.File.create({
          idPatient: patient.idPatient,
          idStudy: study.idStudy,
          idSeries: series.idSeries,
          FilePath: input.filePath,
          CreatedDate: new Date()
        });

        return {
          success: true,
          message: 'DICOM data processed successfully',
          patientId: patient.idPatient
        };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    }
  }
};