import { Injectable } from '@nestjs/common';
import { CreateNewspaperDto } from './dto/create-newspaper.dto';
import { UpdateNewspaperDto } from './dto/update-newspaper.dto';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { Newspaper, NewspaperDocument } from './schemas/newspaper.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { newspaperDataScrapping } from 'src/utils/NewspaperScrapping/NewspaperScrapHomepage';


export interface codeDataType {
  title: string;
  img: string;
  category: string;
  url: string;

}
var isWorking = false;
@Injectable()
export class NewspapersService {
  @InjectModel(Newspaper.name, DATABASE_CONNECTION.NEWSPAPER)
  private newspaperModel: Model<NewspaperDocument>

  async create(createNewspaperDto: CreateNewspaperDto) {
    const cr = await this.newspaperModel.findOneAndUpdate({ title: createNewspaperDto.newspaperName }, createNewspaperDto, { upsert: true, new: true });
    return "Insert";
  }

  async createNewspaperDatas(res) {
    if (isWorking) {
      return res.status(409).json({ message: 'Work in progress' });
    }
    isWorking = true
    res.send('Scrapping Initiated');
    console.log("newspaper route hit");
    setTimeout(async () => {
      try {
        console.log('Set Timeout hit');
        const result = await newspaperDataScrapping();

        console.log('DB insert');
        isWorking = false;
        return "Inserted to DB"
      } catch (error) {
        console.error(error);
        isWorking = false;
        res.status(500).send('Error occurred during scraping');
      }
    }, 3000)
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
