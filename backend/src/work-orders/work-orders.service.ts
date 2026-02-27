import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class WorkOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.workOrder.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, dto: UpdateWorkOrderDto) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id } });
    if (!workOrder) throw new NotFoundException('WorkOrder not found');

    return this.prisma.workOrder.update({
      where: { id },
      data: dto,
    });
  }

  async exportToExcel(res: Response) {
    const workOrders = await this.findAll();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Výkazy práce');

    worksheet.columns = [
      { header: 'Událost', key: 'event', width: 20 },
      { header: 'Datum', key: 'dateRange', width: 25 },
      { header: 'Popis problému', key: 'problemDescription', width: 35 },
      { header: 'Řešení', key: 'resolution', width: 35 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    workOrders.forEach(wo => {
      worksheet.addRow({
        event: wo.event || '',
        dateRange: wo.dateRange || '',
        problemDescription: wo.problemDescription || '',
        resolution: wo.resolution || '',
        status: wo.status || '',
      });
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'vykazy_prace.xlsx'
    );
    await workbook.xlsx.write(res);
    res.end();
  }

  async importCsv(file: Express.Multer.File, user: any) {
    // Try to handle CP1250 mangling or standard UTF-8
    const content = file.buffer.toString('utf-8');
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return { count: 0 }; // Need at least header + 1 row

    let count = 0;
    
    // Zjistit separator z prvniho radku
    const firstLine = lines[0];
    const separator = firstLine.includes(';') ? ';' : ',';

    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(separator);
      if (columns.length < 12) continue; // We expect roughly 12 columns based on instructions

      const event = columns[0]?.trim();
      const dateOd = columns[3]?.trim();
      const dateDo = columns[4]?.trim();
      const problemDescription = columns[9]?.trim();
      const resolution = columns[10]?.trim();
      const status = columns[11]?.trim();

      let dateRange = dateOd;
      if (dateDo && dateOd !== dateDo) {
          dateRange = `${dateOd} - ${dateDo}`;
      }

      await this.prisma.workOrder.create({
         data: {
            event,
            dateRange,
            problemDescription,
            resolution,
            status
         }
      });
      count++;
    }

    return { count };
  }

  async deleteAll() {
      await this.prisma.workOrder.deleteMany();
      return { success: true };
  }
}
