import { Module } from '@nestjs/common';
import { HustleService } from './hustle.service';
import { HustleController } from './hustle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HUSTLE, HustleSchema } from './schemas/hustle.schema';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HUSTLE.name, schema: HustleSchema }], DATABASE_CONNECTION.HUSTLE),
  ],
  controllers: [HustleController],
  providers: [HustleService]
})
export class HustleModule { }
