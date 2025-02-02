import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

class Patient extends Model {
  declare idPatient: number;
  declare Name: string;
  declare CreatedDate: Date;
}

Patient.init(
  {
    idPatient: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
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
    modelName: 'Patient',
    tableName: 'Patients',
    timestamps: false,
  }
);

export default Patient;