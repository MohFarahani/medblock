import { Modality } from '../db/models/Modality';
import { BaseRepository } from './BaseRepository';

export class ModalityRepository extends BaseRepository<Modality> {
  constructor() {
    super(Modality);
  }

  async findByName(name: string): Promise<Modality[]> {
    return this.model.findAll({
      where: {
        Name: name,
      },
    });
  }

  async findOrCreate(name: string): Promise<[Modality, boolean]> {
    return this.model.findOrCreate({
      where: { Name: name },
      defaults: { Name: name },
    });
  }
} 