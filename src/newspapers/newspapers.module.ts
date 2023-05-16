import { Module } from '@nestjs/common';
import { NewspapersService } from './newspapers.service';
import { NewspapersController } from './newspapers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Newspaper, NewspaperSchema } from './schemas/newspaper.schema';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Newspaper.name, schema: NewspaperSchema }], DATABASE_CONNECTION.SCRAP_SERVER),
  ],
  controllers: [NewspapersController],
  providers: [NewspapersService]
})
export class NewspapersModule { }
