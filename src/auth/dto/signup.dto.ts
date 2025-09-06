import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Username (optional)', required: false })
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Password (min 6 chars)' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Password (min 6 chars)' })
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}

