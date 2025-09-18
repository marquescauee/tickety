/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module'
import { ValidationPipe } from '@nestjs/common'
import { ExceptionsFilter } from './middlewares/errors/error-handling'
import { AppError } from './middlewares/errors/app-error'

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)
  app.enableCors()
  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        return AppError.fromValidationErrors(validationErrors)
      },
    }),
  )

  app.useGlobalFilters(new ExceptionsFilter())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
