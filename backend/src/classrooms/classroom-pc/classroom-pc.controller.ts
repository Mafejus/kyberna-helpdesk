import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClassroomPcService } from './classroom-pc.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('classrooms/:classroomId')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassroomPcController {
  constructor(private readonly classroomPcService: ClassroomPcService) {}

  // --- PROPERTIES (Admin/Teacher only) ---

  @Get('pc-properties')
  getProperties(@Param('classroomId') classroomId: string) {
    return this.classroomPcService.getProperties(classroomId);
  }

  @Post('pc-properties')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  createProperty(@Param('classroomId') classroomId: string, @Body() body: any, @Request() req) {
    return this.classroomPcService.createProperty(classroomId, req.user, body);
  }

  @Delete('pc-properties/:id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  deleteProperty(@Param('id') id: string, @Request() req) {
    return this.classroomPcService.deleteProperty(id, req.user);
  }

  @Patch('pc-properties/reorder')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  reorderProperties(@Body() body: { id: string; order: number }[]) {
    return this.classroomPcService.reorderProperties(body);
  }

  // --- PCs (Admin/Teacher/Student) ---

  @Get('pcs')
  findAll(@Param('classroomId') classroomId: string) {
    return this.classroomPcService.findAll(classroomId);
  }

  // Student CAN create PC now
  @Post('pcs')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  create(@Param('classroomId') classroomId: string, @Body() createDto: any, @Request() req) {
    return this.classroomPcService.create(classroomId, req.user, createDto);
  }

  @Post('pcs/generate')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  generate(@Param('classroomId') classroomId: string, @Request() req) {
    return this.classroomPcService.generatePcs(classroomId, req.user);
  }

  // Student CAN update PC (label/note)
  @Patch('pcs/:id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  update(@Param('id') id: string, @Body() updateDto: any, @Request() req) {
    return this.classroomPcService.update(id, req.user, updateDto);
  }

  // Student CAN delete PC
  @Delete('pcs/:id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.classroomPcService.remove(id, req.user);
  }

  // Student CAN update values
  @Patch('pcs/:id/values')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  updateValues(@Param('id') id: string, @Body() body: { values: any[] }, @Request() req) {
    return this.classroomPcService.updateValues(id, req.user, body.values);
  }
}
