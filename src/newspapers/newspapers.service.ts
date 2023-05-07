import { Injectable } from '@nestjs/common';
import { CreateNewspaperDto } from './dto/create-newspaper.dto';
import { UpdateNewspaperDto } from './dto/update-newspaper.dto';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { Newspaper, NewspaperDocument } from './schemas/newspaper.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


export interface codeDataType {
  title: string;
  img: string;
  category: string;
  url: string
}

@Injectable()
export class NewspapersService {
  @InjectModel(Newspaper.name, DATABASE_CONNECTION.NEWSPAPER)
  private newspaperModel: Model<NewspaperDocument>

  async create(createNewspaperDto: CreateNewspaperDto) {
    const cr = await this.newspaperModel.findOneAndUpdate({ title: createNewspaperDto.title }, createNewspaperDto, { upsert: true, new: true });
    return "Insert";
  }

  findAll() {
    return `This action returns all newspapers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newspaper`;
  }

  update(id: number, updateNewspaperDto: UpdateNewspaperDto) {
    return `This action updates a #${id} newspaper`;
  }

  remove(id: number) {
    return `This action removes a #${id} newspaper`;
  }
}
