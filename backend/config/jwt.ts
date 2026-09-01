import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gazacare_super_secure_healthcare_secret_key_2026';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
  hospital?: string;
  mrn?: string;
  department?: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
