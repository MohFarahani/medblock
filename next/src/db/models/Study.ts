import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class Study extends Model {
  declare idPatient: number;
  declare idStudy: number;
  declare StudyName: string;
  declare CreatedDate: Date;
}

Study.init(
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
      primaryKey: true,
      autoIncrement: true,
    },
    StudyName: {
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
    modelName: 'Study',
    timestamps: false,
  }
);