import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'NewStrongPass123', description: 'New password' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ example: 'NewStrongPass123', description: 'Confirm password (must match newPassword)' })
  @IsNotEmpty()
  confirmPassword: string;
}
