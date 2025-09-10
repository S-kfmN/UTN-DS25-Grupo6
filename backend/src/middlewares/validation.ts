
import { ZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

type ValidatedRequestSource = 'body' | 'query' | 'params';

export const validate = <T extends ZodObject<any, any>>(schema: T, source: ValidatedRequestSource = 'body') => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Zod Validation Error:', error.issues);
        return res.status(400).json({
          status: 'fail',
          message: error.issues && error.issues.length > 0 ? error.issues[0].message : 'Validation failed: Please check your input data.', 
        });
      }
      next(error); // Pass other errors to the next error handling middleware
    }
  };
