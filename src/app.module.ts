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
import { TorrentsModule } from './torrents/torrents.module';
import { PdfBooksModule } from './pdf-books/pdf-books.module';


@Module({
  imports: [
    // ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      "mongodb+srv://apkDownloader:apkDownloader@cluster0.ugc7c.mongodb.net/apk_data?retryWrites=true&w=majority" ?? "",
      {
        connectionName: DATABASE_CONNECTION.APK
      }
    ),
    MongooseModule.forRoot(
      "mongodb+srv://premiumCodebase:JOjWFZsaGf5icUiG@cluster0.bvy9met.mongodb.net/codes?retryWrites=true&w=majority" ?? "",
      {
        connectionName: DATABASE_CONNECTION.CODE
      }
    ),
    MongooseModule.forRoot(
      "mongodb+srv://torrentData:torrentData@cluster0.ugc7c.mongodb.net/torrentData?retryWrites=true&w=majority" ?? "",
      {
        connectionName: DATABASE_CONNECTION.HUSTLE
      }
    ),
    MongooseModule.forRoot(
      "mongodb+srv://scrap_server:2fwAOzG03cjqTHix@scrapcluster.vqkigpj.mongodb.net/scrap_server?retryWrites=true&w=majority" ?? "",
      {
        connectionName: DATABASE_CONNECTION.SCRAP_SERVER
      }
    ),
    MongooseModule.forRoot(
      "mongodb+srv://torrentData:torrentData@cluster0.ugc7c.mongodb.net/torrentData?retryWrites=true&w=majority" ?? "",
      {
        connectionName: DATABASE_CONNECTION.TORRENTS
      }
    ),
    ApksModule,
    CodesModule,
    HustleModule,
    NewspapersModule,
    TorrentsModule,
    PdfBooksModule,
    // TasksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
