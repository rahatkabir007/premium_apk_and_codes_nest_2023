import { PartialType } from '@nestjs/mapped-types';
import { CreatePdfBookDto } from './create-pdf-book.dto';

export class UpdatePdfBookDto extends PartialType(CreatePdfBookDto) {}
