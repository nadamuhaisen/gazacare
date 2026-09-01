export class Logger {
  static info(message: string, meta?: any) {
    const ts = new Date().toISOString();
    console.log(`[INFO] [${ts}] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  static warn(message: string, meta?: any) {
    const ts = new Date().toISOString();
    console.warn(`[WARN] [${ts}] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  static error(message: string, error?: any) {
    const ts = new Date().toISOString();
    console.error(`[ERROR] [${ts}] ${message}`, error || '');
  }

  static audit(actorId: string, action: string, resource: string, patientId?: string, details?: any) {
    const ts = new Date().toISOString();
    console.log(`[AUDIT] [${ts}] [Actor: ${actorId}] [Action: ${action}] [Resource: ${resource}] [Patient: ${patientId || 'N/A'}]`, details ? JSON.stringify(details) : '');
  }
}
