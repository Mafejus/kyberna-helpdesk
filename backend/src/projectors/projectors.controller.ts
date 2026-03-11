import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectorsService } from './projectors.service';
import { CreateProjectorDto } from './dto/create-projector.dto';
import { UpdateProjectorDto } from './dto/update-projector.dto';
import { CreateEquipmentPropertyDto } from './dto/create-equipment-property.dto';
import { UpdateEquipmentValuesDto } from './dto/update-equipment-values.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, EquipmentType } from '@prisma/client';

@ApiTags('projectors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projectors')
export class ProjectorsController {
  constructor(private readonly projectorsService: ProjectorsService) {}

  // ── Static routes BEFORE parameterized :id ───────────────────────────────

  @Get('property-defs')
  @Roles(Role.ADMIN, Role.STUDENT)
  getProperties(@Query('type') type: EquipmentType) {
    return this.projectorsService.getProperties(type);
  }

  @Post('property-defs')
  @Roles(Role.ADMIN, Role.STUDENT)
  createProperty(@Body() dto: CreateEquipmentPropertyDto) {
    return this.projectorsService.createProperty(dto);
  }

  @Delete('property-defs/:id')
  @Roles(Role.ADMIN, Role.STUDENT)
  deleteProperty(@Param('id') id: string) {
    return this.projectorsService.deleteProperty(id);
  }

  // ── Equipment CRUD ────────────────────────────────────────────────────────

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT)
  findAll(@Query('type') type?: EquipmentType) {
    return this.projectorsService.findAll(type);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT)
  findOne(@Param('id') id: string) {
    return this.projectorsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.STUDENT)
  create(@Body() createProjectorDto: CreateProjectorDto) {
    return this.projectorsService.create(createProjectorDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STUDENT)
  update(@Param('id') id: string, @Body() updateProjectorDto: UpdateProjectorDto) {
    return this.projectorsService.update(id, updateProjectorDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.STUDENT)
  remove(@Param('id') id: string) {
    return this.projectorsService.remove(id);
  }

  // ── Property values ───────────────────────────────────────────────────────

  @Patch(':id/values')
  @Roles(Role.ADMIN, Role.STUDENT)
  updateValues(@Param('id') id: string, @Body() dto: UpdateEquipmentValuesDto) {
    return this.projectorsService.updateValues(id, dto);
  }
}
