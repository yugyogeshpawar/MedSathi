import { adminDb } from "@/lib/firebaseAdmin";

interface PerformedBy {
  uid: string;
  name: string;
  role: string;
}

interface LogParams {
  performedBy: PerformedBy;
  action: string;
  module: "doctors" | "bookings" | "patients" | "payouts" | "users" | "availability";
  entityId?: string;
  details?: string;
}

interface AuditParams extends LogParams {
  before: any;
  after: any;
}

export const logActivity = async ({ performedBy, action, module, entityId, details }: LogParams) => {
  try {
    await adminDb.collection("activityLogs").add({
      userId: performedBy.uid,
      userName: performedBy.name,
      role: performedBy.role,
      action,
      module,
      entityId: entityId || null,
      details: details || null,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

export const createAuditLog = async ({ performedBy, action, module, entityId, before, after }: AuditParams) => {
  try {
    // Also create a normal activity log for visibility
    await logActivity({ performedBy, action, module, entityId, details: `Audit recorded for ${action}` });

    await adminDb.collection("auditLogs").add({
      userId: performedBy.uid,
      userName: performedBy.name,
      action,
      module,
      entityId,
      before,
      after,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
};

export const createNotification = async (title: string, message: string, type: "info" | "success" | "warning" = "info") => {
  try {
    await adminDb.collection("notifications").add({
      title,
      message,
      type,
      isRead: false,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
