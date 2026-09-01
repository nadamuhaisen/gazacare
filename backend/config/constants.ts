export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  HOSPITAL_MANAGER = 'HOSPITAL_MANAGER',
  LAB_ANALYST = 'LAB_ANALYST',
  PHARMACIST = 'PHARMACIST',
  ADMIN = 'ADMIN'
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500
}

export enum BedStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved'
}

export enum LabStatus {
  PENDING = 'pending',
  SAMPLE_COLLECTED = 'sample_collected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum LabPriority {
  NORMAL = 'عادي',
  URGENT = 'عاجل',
  CRITICAL = 'حرج'
}

export enum AppointmentStatus {
  PENDING = 'في الانتظار',
  CONFIRMED = 'مؤكد',
  IN_PROGRESS = 'جاري الكشف',
  COMPLETED = 'مكتمل',
  CANCELLED = 'ملغي'
}
