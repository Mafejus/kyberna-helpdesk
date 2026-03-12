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
  generateSockets(@Param('id') id: string) {
    return this.powerSocketService.generateSockets(id);
  }

  @Post('classrooms/:id/sockets')
  createSocket(
    @Param('id') id: string,
    @Body() body: { number?: number; note?: string },
  ) {
    return this.powerSocketService.createSocket(id, body);
  }

  @Patch('sockets/:socketId')
  updateSocket(
    @Param('socketId') socketId: string,
    @Body() body: { isWorking?: boolean; hasProblem?: boolean; note?: string; number?: number },
  ) {
    return this.powerSocketService.updateSocket(socketId, body);
  }

  @Delete('sockets/:socketId')
  deleteSocket(@Param('socketId') socketId: string) {
    return this.powerSocketService.deleteSocket(socketId);
  }

  // ---- Property values ----

  @Patch('sockets/:socketId/values')
  updateValues(
    @Param('socketId') socketId: string,
    @Body() body: { values: { propertyId: string; valueBool?: boolean; valueText?: string }[] },
  ) {
    return this.powerSocketService.updateValues(socketId, body.values);
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
  ) {
    return this.powerSocketService.createProperty(id, body);
  }

  @Delete('socket-properties/:id')
  deleteProperty(@Param('id') id: string) {
    return this.powerSocketService.deleteProperty(id);
  }

  @Patch('classrooms/:id/socket-properties/reorder')
  reorderProperties(@Body() body: { id: string; order: number }[]) {
    return this.powerSocketService.reorderProperties(body);
  }
}
