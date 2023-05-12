import { ValidationError } from "express-validator";

export default class ApiError {
  message: string;
  status: number;
  errors: ValidationError[];

  constructor(status: number, message: string, errors: ValidationError[] = []) {
    this.message = (message);
    this.status = status;
    this.errors = errors;
  }

  static UnathorizedError() {
    return new ApiError(401, 'The user is not authorized');
  }

  static BadRequest(message: string, errors: ValidationError[] = []) {
    return new ApiError(400, message, errors )
  }
}
