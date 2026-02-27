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
    if (lines.length < 1) return { count: 0 };

    let startIndex = 0;
    if (lines[0].includes('Oddělení')) {
      startIndex = 1; // Ignorovat hlavičku
    }

    const separator = ';'; // Rozdělovat pevně podle středníku
    let count = 0;
    
    let defaultClassroom = await this.prisma.classroom.findFirst();
    if (!defaultClassroom) {
        defaultClassroom = await this.prisma.classroom.create({
            data: { code: '000' }
        });
    }

    // Pomocná funkce na parsování data
    const parseDateStr = (dateStr: string) => {
      if (!dateStr) return new Date();
      const cleanStr = dateStr.replace(/\s+/g, '');
      const parts = cleanStr.split('.');
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
      return new Date(); // fallback
    };

    for (let i = startIndex; i < lines.length; i++) {
      const columns = lines[i].split(separator);
      if (columns.length < 7) continue;

      const department = columns[0]?.trim();
      const dateStr = columns[1]?.trim();
      const reporter = columns[2]?.trim();
      const payer = columns[3]?.trim();
      const subject = columns[4]?.trim() || 'Importovaný výkaz';
      const material = columns[5]?.trim();
      const timeSpentStr = columns[6]?.trim();
      const signature = columns[7]?.trim();

      const createdAt = parseDateStr(dateStr);
      let timeSpent = 0;
      if (timeSpentStr) {
          const parsed = parseFloat(timeSpentStr.replace(',', '.'));
          if (!isNaN(parsed)) timeSpent = parsed;
      }
      const description = reporter ? `Zadal: ${reporter}` : 'Importovaný záznam';

      await this.prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.create({
          data: {
             title: subject,
             description: description,
             status: 'APPROVED',
             priority: 'NORMAL',
             isArchived: true,
             studentWorkNote: 'CSV_IMPORT', // marker pro snadnější budoucí smazání fantomových ticketů
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
              timeSpent,
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

  async deleteAll() {
      await this.prisma.$transaction(async (tx) => {
          // Smazat všechny work orders
          await tx.workOrder.deleteMany();
          // Smazat i fantomové tickety spojené s CSV importem
          await tx.ticket.deleteMany({
              where: { studentWorkNote: 'CSV_IMPORT' }
          });
      });
      return { success: true };
  }
}
