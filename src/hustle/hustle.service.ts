import { Injectable } from '@nestjs/common';
import { CreateHustleDto } from './dto/create-hustle.dto';
import { UpdateHustleDto } from './dto/update-hustle.dto';
import { HUSTLE, HUSTLEDocument } from './schemas/hustle.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
<<<<<<< HEAD
=======
let isWorking = false
>>>>>>> 4c8cdaa356a3cfd62d59cafa6077f6af1071361a


@Injectable()
export class HustleService {
  constructor(
    @InjectModel(HUSTLE.name, DATABASE_CONNECTION.HUSTLE)
    private hustleModel: Model<HUSTLEDocument>
    // eslint-disable-next-line no-empty-function
  ) { }

  create(createTorrentDto: CreateHustleDto) {
    return 'This action adds a new torrent';
  }
  findAll() {
    return `This action returns all hustle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hustle`;
  }

  update(id: number, updateHustleDto: UpdateHustleDto) {
    return `This action updates a #${id} hustle`;
  }

  remove(id: number) {
    return `This action removes a #${id} hustle`;
  }
}
