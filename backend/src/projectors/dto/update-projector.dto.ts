import { PartialType } from '@nestjs/swagger';
import { CreateProjectorDto } from './create-projector.dto';

export class UpdateProjectorDto extends PartialType(CreateProjectorDto) {}
