import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import Patient from './Patient';

class Study extends Model {
  declare idStudy: number;
  declare idPatient: number;
  declare StudyName: string;
  declare StudyDate: Date;
  declare CreatedDate: Date;
}

Study.init(
  {
    idStudy: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idPatient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Patient,
        key: 'idPatient',
      },
    },
    StudyName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    StudyDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Study',
    tableName: 'Studies',
    timestamps: false,
  }
);

export default Study;