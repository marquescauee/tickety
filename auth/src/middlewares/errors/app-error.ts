import { HttpException, HttpStatus } from '@nestjs/common'
import { ValidationError } from 'class-validator'

export interface ErrorResponse {
  field?: string
  messages: string[]
}

export class AppError extends HttpException {
  constructor(
    errors: ErrorResponse[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ errors }, status)
  }

  static fromMessage(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    return new AppError([{ messages: [message] }], status)
  }

  static fromMessages(
    messages: string[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    return new AppError([{ messages }], status)
  }

  static fromFieldError(
    field: string,
    messages: string[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    return new AppError([{ field, messages }], status)
  }

  static fromValidationErrors(
    validationErrors: ValidationError[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    const errors: ErrorResponse[] = validationErrors.map((err) => ({
      field: err.property,
      messages: Object.values(err.constraints ?? {}),
    }))

    return new AppError(errors, status)
  }
}
