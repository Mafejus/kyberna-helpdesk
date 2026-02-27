import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class WorkOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.workOrder.findMany({
      include: {
        ticket: {
          select: {
            title: true,
            description: true,
            status: true,
            createdAt: true,
            studentWorkNote: true, // Used as how it was fixed
            createdBy: {
              select: {
                fullName: true,
              }
            }
          }
        }
      },
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

  async exportToExcel() {
    const workOrders = await this.findAll();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Výkazy práce');

    worksheet.columns = [
      { header: 'Oddělení', key: 'department', width: 20 },
      { header: 'Datum', key: 'date', width: 15 },
      { header: 'Zadal', key: 'reporter', width: 25 },
      { header: 'Kdo to bude platit', key: 'payer', width: 25 },
      { header: 'Předmět práce', key: 'subject', width: 40 },
      { header: 'Materiál', key: 'material', width: 30 },
      { header: 'Čas (h)', key: 'timeSpent', width: 10 },
      { header: 'Podpis', key: 'signature', width: 20 },
    ];

    workOrders.forEach(wo => {
      worksheet.addRow({
        department: wo.department || '-',
        date: wo.ticket.createdAt.toLocaleDateString('cs-CZ'),
        reporter: wo.ticket.createdBy.fullName,
        payer: wo.payer || '-',
        subject: `${wo.ticket.title} - ${wo.ticket.description}`,
        material: wo.material || '-',
        timeSpent: wo.timeSpent || 0,
        signature: wo.signature || '-',
      });
    });

    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
  }

  async importCsv(file: Express.Multer.File, user: any) {
    const content = file.buffer.toString('utf-8');
    const lines = content.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) return { count: 0 };

    const headerLine = lines[0];
    const separator = headerLine.includes(';') ? ';' : ',';

    let count = 0;
    
    let defaultClassroom = await this.prisma.classroom.findFirst();
    if (!defaultClassroom) {
        defaultClassroom = await this.prisma.classroom.create({
            data: { code: '000' }
        });
    }

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(separator);
      if (parts.length < 8) continue;

      const department = parts[0]?.trim();
      const dateStr = parts[1]?.trim();
      const reporter = parts[2]?.trim();
      const payer = parts[3]?.trim();
      const subject = parts[4]?.trim() || 'Importovaný výkaz';
      const material = parts[5]?.trim();
      const timeSpentStr = parts[6]?.trim();
      const signature = parts[7]?.trim();

      let createdAt = new Date();
      if (dateStr) {
          const parsedDates = dateStr.split('.');
          if (parsedDates.length === 3) {
             createdAt = new Date(Number(parsedDates[2]), Number(parsedDates[1]) - 1, Number(parsedDates[0]));
          } else {
             const d = new Date(dateStr);
             if (!isNaN(d.getTime())) createdAt = d;
          }
      }

      await this.prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.create({
          data: {
             title: subject,
             description: `[CSV Import] Zadal: ${reporter}`,
             status: 'APPROVED',
             priority: 'NORMAL',
             isArchived: true,
             createdAt,
             updatedAt: createdAt,
             classroomId: defaultClassroom.id,
             createdById: user.id,
          }
        });

        await tx.workOrder.create({
           data: {
              ticketId: ticket.id,
              department,
              payer,
              material,
              timeSpent: timeSpentStr ? parseFloat(timeSpentStr.replace(',', '.')) : 0,
              signature,
              createdAt,
              updatedAt: createdAt
           }
        });
      });
      count++;
    }

    return { count };
  }
}
