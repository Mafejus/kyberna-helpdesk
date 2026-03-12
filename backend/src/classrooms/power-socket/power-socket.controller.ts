import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PowerSocketService } from './power-socket.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from '@nestjs/common';

@ApiTags('power-sockets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class PowerSocketController {
  constructor(private readonly powerSocketService: PowerSocketService) {}

  // ---- Sockets ----

  @Get('classrooms/:id/sockets')
  getSockets(@Param('id') id: string) {
    return this.powerSocketService.getSockets(id);
  }

  @Post('classrooms/:id/sockets/generate')
  generateSockets(@Param('id') id: string, @Request() req) {
    return this.powerSocketService.generateSockets(id, req.user);
  }

  @Post('classrooms/:id/sockets')
  createSocket(
    @Param('id') id: string,
    @Body() body: { number?: number; note?: string },
    @Request() req,
  ) {
    return this.powerSocketService.createSocket(id, req.user, body);
  }

  @Patch('sockets/:socketId')
  updateSocket(
    @Param('socketId') socketId: string,
    @Body() body: { isWorking?: boolean; hasProblem?: boolean; note?: string; number?: number },
    @Request() req,
  ) {
    return this.powerSocketService.updateSocket(socketId, req.user, body);
  }

  @Delete('sockets/:socketId')
  deleteSocket(@Param('socketId') socketId: string, @Request() req) {
    return this.powerSocketService.deleteSocket(socketId, req.user);
  }

  // ---- Property values ----

  @Patch('sockets/:socketId/values')
  updateValues(
    @Param('socketId') socketId: string,
    @Body() body: { values: { propertyId: string; valueBool?: boolean; valueText?: string }[] },
    @Request() req,
  ) {
    return this.powerSocketService.updateValues(socketId, req.user, body.values);
  }

  // ---- Properties ----

  @Get('classrooms/:id/socket-properties')
  getProperties(@Param('id') id: string) {
    return this.powerSocketService.getProperties(id);
  }

  @Post('classrooms/:id/socket-properties')
  createProperty(
    @Param('id') id: string,
    @Body() body: { key: string; label: string; type: 'BOOLEAN' | 'TEXT'; order?: number },
    @Request() req,
  ) {
    return this.powerSocketService.createProperty(id, req.user, body);
  }

  @Delete('socket-properties/:id')
  deleteProperty(@Param('id') id: string, @Request() req) {
    return this.powerSocketService.deleteProperty(id, req.user);
  }

  @Patch('classrooms/:id/socket-properties/reorder')
  reorderProperties(@Body() body: { id: string; order: number }[]) {
    return this.powerSocketService.reorderProperties(body);
  }
}
