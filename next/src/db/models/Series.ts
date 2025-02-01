import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import Patient from './Patient';
import Study from './Study';
import Modality from './Modality';

class Series extends Model {
  declare idSeries: number;
  declare idPatient: number;
  declare idStudy: number;
  declare idModality: number;
  declare SeriesName: string;
  declare CreatedDate: Date;
}

Series.init(
  {
    idSeries: {
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
    idStudy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Study,
        key: 'idStudy',
      },
    },
    idModality: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Modality,
        key: 'idModality',
      },
    },
    SeriesName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Series',
    tableName: 'Series',
    timestamps: false,
  }
);

export default Series;