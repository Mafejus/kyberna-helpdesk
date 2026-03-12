import {
  Controller,
  Get,
  Post,
  Patch,
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

  @Get('classrooms/:id/sockets')
  getSockets(@Param('id') id: string) {
    return this.powerSocketService.getSockets(id);
  }

  @Post('classrooms/:id/sockets/generate')
  generateSockets(@Param('id') id: string) {
    return this.powerSocketService.generateSockets(id);
  }

  @Patch('sockets/:socketId')
  updateSocket(
    @Param('socketId') socketId: string,
    @Body() body: { isWorking?: boolean; note?: string },
  ) {
    return this.powerSocketService.updateSocket(socketId, body);
  }
}
