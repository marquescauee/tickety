/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import {
  InternalServerErrorFilter,
  ValidationExceptionFilter,
} from './middlewares/error-handling'

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        const errors = validationErrors.map((err) => {
          return {
            message: Object.values(err.constraints ?? {}),
            field: err.property,
          }
        })

        return new BadRequestException({ errors })
      },
    }),
  )

  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new InternalServerErrorFilter(),
  )

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
