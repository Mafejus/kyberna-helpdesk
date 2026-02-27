import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

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
      { header: '#', key: 'orderNumber', width: 10 },
      { header: 'Název / Typ práce', key: 'title', width: 25 },
      { header: 'Technik', key: 'technician', width: 20 },
      { header: 'Datum a čas', key: 'date', width: 25 },
      { header: 'Popis problému', key: 'problemDescription', width: 35 },
      { header: 'Řešení', key: 'resolution', width: 35 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    workOrders.forEach(wo => {
      worksheet.addRow({
        orderNumber: wo.orderNumber || '',
        title: wo.title || '',
        technician: wo.technician || '',
        date: wo.date || '',
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
    if (!file || !file.buffer) return { count: 0 };

    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const stream = Readable.from(file.buffer);

      stream
        .pipe(csv({ separator: ',' }))
        .on('data', (row: any) => {
          // Normalizujeme klíče ignorováním mezer a malými písmeny
          const normalizedRow: Record<string, string> = {};
          for (const key in row) {
             normalizedRow[key.trim().toLowerCase()] = row[key]?.trim();
          }

          results.push(normalizedRow);
        })
        .on('end', async () => {
          let count = 0;
          for (const row of results) {
            const title = row['upřesnění'] || row['typ'] || 'Bez názvu';
            const technician = row['technik'] || '';
            
            const datum = row['datum'] || '';
            const od = row['od'] || '';
            const doTime = row['do'] || '';
            let dateVal = datum;
            if (od || doTime) {
                dateVal = `${datum} (${od} - ${doTime})`.trim();
            }

            const problemDescription = row['popis problému'] || '';
            const resolution = row['řešení problému'] || '';
            const status = row['status'] || 'Uzavřeno';
            
            let orderNumber: number | null = null;
            if (row['událost č.']) {
                const parsed = parseInt(row['událost č.'], 10);
                if (!isNaN(parsed)) orderNumber = parsed;
            }

            await this.prisma.workOrder.create({
              data: {
                orderNumber,
                title,
                technician,
                date: dateVal,
                problemDescription,
                resolution,
                status,
              },
            });
            count++;
          }
          resolve({ count });
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async deleteOne(id: string) {
      await this.prisma.workOrder.delete({ where: { id } });
      return { success: true };
  }

  async deleteAll() {
      await this.prisma.workOrder.deleteMany();
      return { success: true };
  }
}
