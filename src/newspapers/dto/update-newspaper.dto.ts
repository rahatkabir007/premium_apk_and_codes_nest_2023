import { PartialType } from '@nestjs/mapped-types';
import { CreateNewspaperDto } from './create-newspaper.dto';

export class UpdateNewspaperDto extends PartialType(CreateNewspaperDto) {}
