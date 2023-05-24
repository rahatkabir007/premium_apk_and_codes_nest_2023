import { Module } from '@nestjs/common';
import { ApksService } from './apks.service';
import { ApksController } from './apks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { APK, APKSchema } from './schemas/apk.schema';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: APK.name, schema: APKSchema }], DATABASE_CONNECTION.APK),
  ],
  controllers: [ApksController],
  providers: [ApksService]
})
export class ApksModule { }
