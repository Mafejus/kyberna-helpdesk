import { Role, NotificationType } from '@prisma/client';

export const ROLE_NOTIFICATIONS: Record<Role, NotificationType[]> = {
  [Role.STUDENT]: [
    NotificationType.TICKET_ASSIGNED,
    NotificationType.TICKET_UNASSIGNED,
    NotificationType.TICKET_APPROVED,
    NotificationType.TICKET_RETURNED, // Was REWORK
    NotificationType.TICKET_PRIORITY_CHANGED,
    NotificationType.TICKET_DUE_DATE_CHANGED,
    NotificationType.SWAP_OFFER_CREATED,
    NotificationType.SWAP_OFFER_ACCEPTED,
    NotificationType.SWAP_OFFER_CANCELLED,
  ],
  [Role.TEACHER]: [
    NotificationType.TICKET_WAITING_APPROVAL,
    NotificationType.TICKET_RETURNED, // Teacher might want to know if admin returned their student's ticket
    // Add more if needed.
  ],
  [Role.ADMIN]: [
    NotificationType.TICKET_WAITING_APPROVAL,
    NotificationType.SWAP_OFFER_ACCEPTED, // Mapped as "Swap Completed/Accepted" for Admin
    NotificationType.SLOT_CHANGED_BY_ADMIN, // Maybe redundant for admin to notify themselves, but keeps consistency
    NotificationType.SLOT_CANCELLED_LATE,
  ],
};
