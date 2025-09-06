import { IsEmail, IsNotEmpty, IsIn, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationType } from '@prisma/client';

export class ForgetVerifyOtpDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234', description: 'OTP code received in email' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: VerificationType.PASSWORD_RESET,
    enum: VerificationType,
    description: 'Type of OTP being verified',
  })
  @IsNotEmpty()
  @IsEnum(VerificationType)
  type: VerificationType;
}