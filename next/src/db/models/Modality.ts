import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

class Modality extends Model {
  declare idModality: number;
  declare Name: string;
}

Modality.init(
  {
    idModality: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Modality',
    tableName: 'Modalities',
    timestamps: false,
  }
);

export default Modality;