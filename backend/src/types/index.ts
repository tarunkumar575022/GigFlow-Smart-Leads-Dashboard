import { Request } from 'express';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

export interface AuthRequest extends Request {
  user?: IUser;
}
