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
  ParseEnumPipe,
  Query,
  StreamableFile,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, Priority, TicketStatus } from '@prisma/client';
import {
  ApproveTicketDto,
  AssignTicketDto,
  RejectTicketDto,
  TicketActionDto,
  ManageAssigneesDto,
} from './dto/ticket-actions.dto';
import { ScheduleTicketDto } from './dto/schedule-ticket.dto';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  create(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(req.user, createTicketDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('status') status?: TicketStatus,
    @Query('filter') filter?: string,
    @Query('technicianId') technicianId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.ticketsService.findAll(
      req.user,
      status,
      filter,
      technicianId,
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.ticketsService.findOne(id, req.user);
  }

  @Post(':id/claim')
  @Roles(Role.STUDENT)
  claim(@Request() req, @Param('id') id: string) {
    return this.ticketsService.claim(id, req.user);
  }

  @Post(':id/join')
  @Roles(Role.STUDENT)
  join(@Request() req, @Param('id') id: string) {
    return this.ticketsService.join(id, req.user);
  }

  @Post(':id/leave')
  @Roles(Role.STUDENT)
  leave(@Request() req, @Param('id') id: string) {
    return this.ticketsService.leave(id, req.user);
  }

  @Post(':id/mark-done')
  @Roles(Role.STUDENT)
  markDone(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: TicketActionDto,
  ) {
    return this.ticketsService.markDone(id, req.user, dto);
  }

  @Post(':id/approve')
  @Roles(Role.ADMIN)
  approve(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: ApproveTicketDto,
  ) {
    return this.ticketsService.approve(id, req.user, dto);
  }

  @Post(':id/reject')
  @Roles(Role.ADMIN)
  reject(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: RejectTicketDto,
  ) {
    return this.ticketsService.reject(id, req.user, dto);
  }

  @Post(':id/rework')
  @Roles(Role.STUDENT)
  rework(@Request() req, @Param('id') id: string) {
    return this.ticketsService.rework(id, req.user);
  }

  @Post(':id/assignees')
  @Roles(Role.ADMIN)
  manageAssignees(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: ManageAssigneesDto,
  ) {
    return this.ticketsService.manageAssignees(id, dto, req.user);
  }

  @Patch(':id/priority')
  @Roles(Role.ADMIN)
  setPriority(
    @Request() req,
    @Param('id') id: string,
    @Body('priority', new ParseEnumPipe(Priority)) priority: Priority,
  ) {
    return this.ticketsService.setPriority(id, priority, req.user);
  }

  @Post(':id/comments')
  addComment(
    @Request() req,
    @Param('id') id: string,
    @Body('message') message: string,
  ) {
    return this.ticketsService.addComment(id, req.user, message);
  }
  @Get(':id/attachments/:attachmentId')
  async downloadAttachment(
    @Request() req,
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileData = await this.ticketsService.getAttachmentStream(
      id,
      attachmentId,
      req.user,
    );

    res.set({
      'Content-Type': fileData.mimeType,
      'Content-Disposition': `attachment; filename="${fileData.fileName}"`,
    });

    return new StreamableFile(fileData.stream);
  }
  @Patch(':id/schedule')
  @Roles(Role.ADMIN)
  schedule(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: ScheduleTicketDto,
  ) {
    return this.ticketsService.schedule(id, req.user, dto.plannedAt, dto.dueAt);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Request() req, @Param('id') id: string) {
    return this.ticketsService.remove(id, req.user);
  }
}
