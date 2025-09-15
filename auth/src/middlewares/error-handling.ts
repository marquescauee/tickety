import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

interface ErrorResponse {
  field?: string
  messages: string[]
}

interface ValidationErrorResponse {
  errors: ErrorResponse[]
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let errors: ErrorResponse[] = [{ messages: ['Internal server error'] }]

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const excRes = exception.getResponse()

      if (typeof excRes === 'string') {
        errors = [{ messages: [excRes] }]
      } else if ((excRes as ValidationErrorResponse).errors) {
        errors = (excRes as ValidationErrorResponse).errors
      } else if ((excRes as { message?: string | string[] }).message) {
        const msg = (excRes as { message?: string | string[] }).message
        errors = Array.isArray(msg)
          ? [{ messages: msg.filter((m): m is string => !!m) }]
          : msg
            ? [{ messages: [msg] }]
            : [{ messages: ['Unknown error'] }]
      }
    } else {
      console.error('Unexpected exception:', exception)
    }

    response.status(status).json({ errors })
  }
}
