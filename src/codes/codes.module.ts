import { Module } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Code, CodeSchema } from './schemas/code.schema';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Code.name, schema: CodeSchema }], DATABASE_CONNECTION.CODE),
  ],
  controllers: [CodesController],
  providers: [CodesService]
})
export class CodesModule { }
