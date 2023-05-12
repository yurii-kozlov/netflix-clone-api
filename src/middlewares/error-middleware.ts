import ApiError from '../exceptions/api-error';
import { Request, Response, NextFunction } from "express";

function handleErrors(err: ApiError | Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors});
  }

  return res.status(500).json({message: 'Something went wrong'});
}

export default handleErrors;
