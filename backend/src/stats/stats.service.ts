import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyStats(userId: string) {
    // 1. Completed Helpdesk Services (Check-ins with end time)
    const completedServices = await this.prisma.helpdeskCheckIn.count({
      where: {
        userId,
        endedAt: { not: null },
      },
    });

    // 2. Recent History
    const recentHistory = await this.prisma.helpdeskCheckIn.findMany({
      where: {
        userId,
        endedAt: { not: null },
      },
      orderBy: { startedAt: 'desc' },
      take: 5,
    });

    return {
      completedServices,
      recentHistory,
    };
  }

  async getTicketStats(userId: string) {
    // 1. Total Points from UserScore
    const stats = await this.prisma.userScore.aggregate({
      where: { userId },
      _sum: { points: true },
    });

    // 2. Approved Count (positive scores)
    const approvedCount = await this.prisma.userScore.count({
      where: { userId, points: { gt: 0 } },
    });

    return {
      totalPoints: stats._sum.points || 0,
      approvedCount,
    };
  }

  async getAdminOverview() {
    // Legacy support for Admin Dashboard
    const totalTickets = await this.prisma.ticket.count();
    const unassigned = await this.prisma.ticket.count({
      where: { status: 'UNASSIGNED' },
    });
    const inProgress = await this.prisma.ticket.count({
      where: { status: 'IN_PROGRESS' },
    });
    const waiting = await this.prisma.ticket.count({
      where: { status: 'DONE_WAITING_APPROVAL' },
    });
    const approved = await this.prisma.ticket.count({
      where: { status: 'APPROVED' },
    });
    const rejected = await this.prisma.ticket.count({
      where: { status: 'REJECTED' },
    });

    return {
      totalTickets,
      unassigned,
      inProgress,
      waiting,
      approved,
      rejected,
    };
  }

  async getServiceLeaderboard() {
    // Top students by completed services (Check-ins)
    const leaderboard = await this.prisma.helpdeskCheckIn.groupBy({
      by: ['userId'],
      where: {
        endedAt: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Populate user details
    const userIds = leaderboard.map((item) => item.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds }, isActive: true },
      select: { id: true, fullName: true, email: true },
    });

    return leaderboard.map((item) => {
      const user = users.find((u) => u.id === item.userId);
      return {
        user,
        completedServices: item._count.id,
      };
    }).filter(item => item.user); // Only return active users who were found in the isActive: true fetch
  }

  async getAdminLeaderboard() {
    // Restore Ticket Leaderboard for existing widget
    // Aggregate points for all students based on UserScore
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT', isActive: true },
      select: { id: true, fullName: true },
    });

    const leaderboard = [];

    for (const student of students) {
      const scoreStats = await this.prisma.userScore.aggregate({
        where: { userId: student.id },
        _sum: { points: true },
        _count: { _all: true },
      });

      // Count "Solved Tickets" as positive score entries
      const solvedCount = await this.prisma.userScore.count({
        where: { userId: student.id, points: { gt: 0 } },
      });

      const totalPoints = scoreStats._sum.points || 0;

      if (scoreStats._count._all > 0) {
        leaderboard.push({
          userId: student.id,
          fullName: student.fullName,
          points: totalPoints,
          approvedCount: solvedCount,
        });
      }
    }

    return leaderboard.sort((a, b) => b.points - a.points).slice(0, 50);
  }
}
