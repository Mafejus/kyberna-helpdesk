import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectorsService } from './projectors.service';
import { CreateProjectorDto } from './dto/create-projector.dto';
import { UpdateProjectorDto } from './dto/update-projector.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('projectors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projectors')
export class ProjectorsController {
  constructor(private readonly projectorsService: ProjectorsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT)
  findAll() {
    return this.projectorsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT)
  findOne(@Param('id') id: string) {
    return this.projectorsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createProjectorDto: CreateProjectorDto) {
    return this.projectorsService.create(createProjectorDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateProjectorDto: UpdateProjectorDto) {
    return this.projectorsService.update(id, updateProjectorDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.projectorsService.remove(id);
  }
}
