import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { AppError, ErrorResponse } from './app-error'

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let errors: ErrorResponse[] = [{ messages: ['Internal server error'] }]

    if (exception instanceof AppError) {
      status = exception.getStatus()
      errors = (exception.getResponse() as { errors: ErrorResponse[] }).errors
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      errors = [{ messages: [exception.message] }]
    } else {
      console.error('Unexpected exception:', exception)
    }

    response.status(status).json({ errors })
  }
}
