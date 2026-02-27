import { Controller, Get, Patch, Param, Body, UseGuards, Res, Post, UseInterceptors, UploadedFile, Request, BadRequestException, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WorkOrdersService } from './work-orders.service';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('work-orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Get()
  @Roles(Role.STUDENT, Role.ADMIN)
  findAll() {
    return this.workOrdersService.findAll();
  }

  @Post('import')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('Nebyl nahrán žádný soubor');
    }
    return this.workOrdersService.importCsv(file, req.user);
  }

  @Get('export')
  @Roles(Role.STUDENT, Role.ADMIN)
  async exportExcel(@Res() res: Response) {
    await this.workOrdersService.exportToExcel(res);
  }

  @Patch(':id')
  @Roles(Role.STUDENT, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateWorkOrderDto) {
    return this.workOrdersService.update(id, dto);
  }

  @Delete()
  @Roles(Role.ADMIN)
  deleteAll() {
    return this.workOrdersService.deleteAll();
  }
}
