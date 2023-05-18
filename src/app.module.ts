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
import { HustleModule } from './hustle/hustle.module';
import { NewspapersModule } from './newspapers/newspapers.module';
<<<<<<< HEAD
import { TorrentsModule } from './torrents/torrents.module';
=======
import { PdfBooksModule } from './pdf-books/pdf-books.module';

>>>>>>> a4423c14e88a3291f4b1d813ea58a32176157415

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
      process.env.DATABASE_URL_HUSTLE ?? "",
      {
        connectionName: DATABASE_CONNECTION.HUSTLE
      }
    ),
    MongooseModule.forRoot(
      process.env.DATABASE_URL_SCRAP_SERVER ?? "",
      {
        connectionName: DATABASE_CONNECTION.SCRAP_SERVER
      }
    ),
    MongooseModule.forRoot(
      process.env.DATABASE_URL_TORRENTS ?? "",
      {
        connectionName: DATABASE_CONNECTION.TORRENTS
      }
    ),
    ApksModule,
    CodesModule,
    TasksModule,
    HustleModule,
    NewspapersModule,
<<<<<<< HEAD
    TorrentsModule,
=======
    PdfBooksModule,
>>>>>>> a4423c14e88a3291f4b1d813ea58a32176157415
    // TasksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
