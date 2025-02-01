import { Model, ModelStatic, Transaction, WhereOptions } from 'sequelize';
import { sequelize } from '../db/connection';

export interface IBaseRepository<T extends Model> {
  findAll(options?: { transaction?: Transaction }): Promise<T[]>;
  findById(id: number, options?: { transaction?: Transaction }): Promise<T | null>;
  create(data: Partial<T>, options?: { transaction?: Transaction }): Promise<T>;
  update(id: number, data: Partial<T>, options?: { transaction?: Transaction }): Promise<[number, T[]]>;
  delete(id: number, options?: { transaction?: Transaction }): Promise<number>;
  createTransaction(): Promise<Transaction>;
}

export abstract class BaseRepository<T extends Model> implements IBaseRepository<T> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll(options?: { transaction?: Transaction }): Promise<T[]> {
    return this.model.findAll({ transaction: options?.transaction });
  }

  async findById(id: number, options?: { transaction?: Transaction }): Promise<T | null> {
    return this.model.findByPk(id, { transaction: options?.transaction });
  }

  async create(data: Partial<T>, options?: { transaction?: Transaction }): Promise<T> {
    return this.model.create(data as T['_creationAttributes'], { transaction: options?.transaction });
  }

  async update(id: number, data: Partial<T>, options?: { transaction?: Transaction }): Promise<[number, T[]]> {
    const where = { [`id${this.model.name}`]: id } as WhereOptions<T['_attributes']>;
    return this.model.update(data as T['_attributes'], {
      where,
      returning: true,
      transaction: options?.transaction
    });
  }

  async delete(id: number, options?: { transaction?: Transaction }): Promise<number> {
    const where = { [`id${this.model.name}`]: id } as WhereOptions<T['_attributes']>;
    return this.model.destroy({
      where,
      transaction: options?.transaction
    });
  }

  async createTransaction(): Promise<Transaction> {
    return sequelize.transaction();
  }
}