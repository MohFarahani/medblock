import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class File extends Model {
  declare idPatient: number;
  declare idStudy: number;
  declare idSeries: number;
  declare idFile: number;
  declare FilePath: string;
  declare CreatedDate: Date;
}

File.init(
  {
    idPatient: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Patients',
        key: 'idPatient',
      },
    },
    idStudy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Studies',
        key: 'idStudy',
      },
    },
    idSeries: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Series',
        key: 'idSeries',
      },
    },
    idFile: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FilePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'File',
    timestamps: false,
  }
);