import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errorMessage = (error as any).errors.map((err: any) => err.message).join(', ');
      next(new ApiError(400, errorMessage));
    } else {
      next(error);
    }
  }
};
