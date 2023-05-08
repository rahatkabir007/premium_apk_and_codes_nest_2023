import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from '@nestjs/config';
import { ApksModule } from './apks/apks.module';
import { CodesModule } from './codes/codes.module';
import { DATABASE_CONNECTION } from './utils/DatabaseConstants';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { NewspapersModule } from './newspapers/newspapers.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DATABASE_URL_APK ?? "",
      {
        connectionName: DATABASE_CONNECTION.APK
      }
    ),
    MongooseModule.forRoot(
      process.env.DATABASE_URL_CODE ?? "",
      {
        connectionName: DATABASE_CONNECTION.CODE
      }
    ),
    MongooseModule.forRoot(
      process.env.DATABASE_URL_NEWSPAPER ?? "",
      {
        connectionName: DATABASE_CONNECTION.NEWSPAPER
      }
    ),
    ApksModule,
    CodesModule,
    NewspapersModule,
    // TasksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
