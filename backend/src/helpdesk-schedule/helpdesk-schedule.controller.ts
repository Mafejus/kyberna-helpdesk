import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { HelpdeskScheduleService } from './helpdesk-schedule.service';
import { CheckInService } from './check-in.service';
import { SwapService } from './swap.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ClaimSlotDto, SetSlotDto, RemoveStudentDto } from './dto/schedule.dto';
import {
  CheckInStartDto,
  CheckInEndDto,
  SwapCreateDto,
} from './dto/check-in-swap.dto';

@Controller('schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HelpdeskScheduleController {
  constructor(
    private readonly scheduleService: HelpdeskScheduleService,
    private readonly checkInService: CheckInService,
    private readonly swapService: SwapService,
  ) {}

  @Get('week')
  getWeek(@Query('start') start: string) {
    return this.scheduleService.getWeekSlots(start);
  }

  @Get('now')
  async getCurrentStatus() {
    // Combine planned + active checkins
    const planned = await this.scheduleService.getCurrentStatus();
    const active = await this.checkInService.getActiveCheckIns();
    return { ...planned, activeCheckIns: active };
  }

  // --- CHECK-IN ---

  @Post('checkin/start')
  @Roles(Role.STUDENT)
  startCheckIn(@Request() req, @Body() dto: CheckInStartDto) {
    return this.checkInService.startCheckIn(req.user, dto.date, dto.lesson);
  }

  @Get('checkin/me')
  @Roles(Role.STUDENT)
  getMyCheckIn(@Request() req) {
    return this.checkInService.getUserActiveCheckIn(req.user.id);
  }

  @Post('checkin/end')
  @Roles(Role.STUDENT, Role.ADMIN) // Admin override
  endCheckIn(@Request() req, @Body() dto: CheckInEndDto) {
    return this.checkInService.endCheckIn(req.user, dto.shiftId);
  }

  // --- SWAPS ---

  @Get('swaps')
  listSwaps(@Query('week') week?: string) {
    return this.swapService.listOffers(week);
  }

  @Post('swaps') // create offer
  @Roles(Role.STUDENT)
  createSwap(@Request() req, @Body() dto: SwapCreateDto) {
    return this.swapService.createOffer(req.user, dto.date, dto.lesson);
  }

  @Post('swaps/:id/accept')
  @Roles(Role.STUDENT)
  acceptSwap(@Request() req, @Param('id') id: string) {
    return this.swapService.acceptOffer(req.user, id);
  }

  @Post('swaps/:id/cancel')
  @Roles(Role.STUDENT, Role.ADMIN)
  cancelSwap(@Request() req, @Param('id') id: string) {
    return this.swapService.cancelOffer(req.user, id);
  }

  // --- EXISTING ---

  @Post('claim')
  @Roles(Role.STUDENT)
  claim(@Request() req, @Body() dto: ClaimSlotDto) {
    return this.scheduleService.claimSlot(req.user, dto.date, dto.lesson);
  }

  @Post('unclaim')
  @Roles(Role.STUDENT)
  unclaim(@Request() req, @Body() dto: ClaimSlotDto) {
    return this.scheduleService.unclaimSlot(req.user, dto.date, dto.lesson);
  }

  @Post('admin/set')
  @Roles(Role.ADMIN)
  adminSet(@Body() dto: SetSlotDto) {
    // Missing user for audit? Should add req.user
    // Fix: Pass undefined user for now or update service signature later
    return this.scheduleService.adminSetSlot(
      dto.date,
      dto.lesson,
      dto.studentIds,
    );
  }

  @Post('admin/remove')
  @Roles(Role.ADMIN)
  adminRemove(@Body() dto: RemoveStudentDto) {
    return this.scheduleService.adminRemoveSlot(
      dto.date,
      dto.lesson,
      dto.studentId,
    );
  }
}
