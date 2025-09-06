import { IsEmail, IsNotEmpty, IsIn, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationType } from '@prisma/client';

export class ForgetSendOtpDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: VerificationType.PASSWORD_RESET,
    enum: VerificationType,
    description: 'Type of OTP being sent',
  })
  @IsNotEmpty()
  @IsEnum(VerificationType)
  type: VerificationType;
}