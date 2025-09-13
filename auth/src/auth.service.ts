import { Injectable } from '@nestjs/common'
import { SignData } from './dto/sign-data-dto'

@Injectable()
export class AuthService {
  getUser(): string {
    return 'Deu boa'
  }

  signIn(): string {
    return 'Sign In'
  }

  signUp({ email, password }: SignData): SignData {
    return { email, password }
  }

  signOut(): string {
    return 'Sign Out'
  }
}
