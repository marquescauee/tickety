import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    const exceptionResponse = exception.getResponse() as {
      errors: { field?: string; messages: string[] }[]
    }

    response.status(status).json({
      errors: exceptionResponse.errors,
    })
  }
}

@Catch(InternalServerErrorException)
export class InternalServerErrorFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    const exceptionResponse = exception.getResponse() as
      | string
      | { message: string | string[]; error?: string }

    const errors =
      typeof exceptionResponse === 'string'
        ? [{ messages: [exceptionResponse] }]
        : Array.isArray(exceptionResponse.message)
          ? [{ messages: exceptionResponse.message }]
          : [{ messages: [exceptionResponse.message] }]

    response.status(status).json({
      errors,
    })
  }
}
