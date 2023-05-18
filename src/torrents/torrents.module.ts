import { Module } from '@nestjs/common';
import { TorrentsService } from './torrents.service';
import { TorrentsController } from './torrents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TORRENT, TORRENTSchema } from './schemas/torrent.schema';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TORRENT.name, schema: TORRENTSchema }], DATABASE_CONNECTION.TORRENTS),
  ],
  controllers: [TorrentsController],
  providers: [TorrentsService]
})
export class TorrentsModule { }
