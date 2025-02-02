import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import Series from './Series';

class File extends Model {
  declare idFile: number;
  declare idSeries: number;
  declare FilePath: string;
  declare CreatedDate: Date;
}

File.init(
  {
    idFile: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idSeries: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Series,
        key: 'idSeries',
      },
    },
    FilePath: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'File',
    tableName: 'Files',
    timestamps: false,
  }
);

export default File;

