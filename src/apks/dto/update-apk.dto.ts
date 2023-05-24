import { PartialType } from '@nestjs/mapped-types';
import { CreateApkDto } from './create-apk.dto';

export class UpdateApkDto extends PartialType(CreateApkDto) {}
