"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_NOTIFICATIONS = void 0;
var client_1 = require("@prisma/client");
exports.ROLE_NOTIFICATIONS = (_a = {},
    _a[client_1.Role.STUDENT] = [
        client_1.NotificationType.TICKET_ASSIGNED,
        client_1.NotificationType.TICKET_UNASSIGNED,
        client_1.NotificationType.TICKET_APPROVED,
        client_1.NotificationType.TICKET_RETURNED, // Was REWORK
        client_1.NotificationType.TICKET_PRIORITY_CHANGED,
        client_1.NotificationType.TICKET_DUE_DATE_CHANGED,
        client_1.NotificationType.SWAP_OFFER_CREATED,
        client_1.NotificationType.SWAP_OFFER_ACCEPTED,
        client_1.NotificationType.SWAP_OFFER_CANCELLED,
    ],
    _a[client_1.Role.TEACHER] = [
        client_1.NotificationType.TICKET_WAITING_APPROVAL,
        client_1.NotificationType.TICKET_RETURNED, // Teacher might want to know if admin returned their student's ticket
        // Add more if needed.
    ],
    _a[client_1.Role.ADMIN] = [
        client_1.NotificationType.TICKET_WAITING_APPROVAL,
        client_1.NotificationType.SWAP_OFFER_ACCEPTED, // Mapped as "Swap Completed/Accepted" for Admin
        client_1.NotificationType.SLOT_CHANGED_BY_ADMIN, // Maybe redundant for admin to notify themselves, but keeps consistency
        client_1.NotificationType.SLOT_CANCELLED_LATE,
    ],
    _a);
