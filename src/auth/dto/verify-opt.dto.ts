import { IsEmail, IsNotEmpty, IsIn, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationType } from '@prisma/client';

export class VerifyOtpDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234', description: 'OTP code received in email' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: VerificationType.EMAIL_VERIFICATION,
    enum: VerificationType,
    description: 'Type of OTP being verified',
  })
  @IsNotEmpty()
  @IsEnum(VerificationType)
  type: VerificationType;
}
