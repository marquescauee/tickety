import { IsEmail, IsString, Length } from 'class-validator'

export class SignData {
  @IsEmail({}, { message: 'Email inválido' })
  email: string

  @IsString()
  @Length(4, 16, { message: 'Senha deve ter entre 4 e 16 caracteres' })
  password: string
}
