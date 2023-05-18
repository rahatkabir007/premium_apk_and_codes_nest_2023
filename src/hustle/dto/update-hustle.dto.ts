import { PartialType } from '@nestjs/mapped-types';
import { CreateHustleDto } from './create-hustle.dto';

export class UpdateHustleDto extends PartialType(CreateHustleDto) {}
