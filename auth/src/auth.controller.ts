import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignData } from './dto/sign-data-dto'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/currentuser')
  currentUser(): string {
    return this.authService.getUser()
  }

  @Post('/signin')
  signIn(): string {
    return this.authService.signIn()
  }

  @Post('/signup')
  signUp(@Body() body: SignData): SignData | BadRequestException {
    const { email, password } = body

    return this.authService.signUp({
      email,
      password,
    })
  }

  @Post('/signout')
  signOut(): string {
    return this.authService.signOut()
  }
}
