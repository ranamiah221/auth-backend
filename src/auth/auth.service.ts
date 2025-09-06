import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from './token.service';
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { generateOTP } from '../utils/otp';
import { VerificationType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private tokenService: TokenService,
    private mailer: MailerService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(email: string, password: string, confirmPassword:string, username?: string) {
    const user = await this.users.createUser(email, password, confirmPassword, username);
    // const code = generateOTP(4);
    // await this.tokenService.createToken(user.id, code, VerificationType.EMAIL_VERIFICATION, Number(this.config.get('OTP_EXPIRES_MINUTES') || 10));
    // await this.mailer.sendVerificationEmail(email, code);
    return { message: 'User Registered. Please Verify Your Email.' };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if(!user.isEmailVerified ){
       throw new BadRequestException("Please Verify your Email.")
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials Password Doesn Not Match');
    const payload = { sub: user.id, email: user.email };
    return { user,access_token: this.jwt.sign(payload) };
  }

  async sendOtpForType(email: string, type: VerificationType) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('No such user');
    const code = generateOTP(4);
    await this.tokenService.createToken(user.id, code, type, Number(this.config.get('OTP_EXPIRES_MINUTES') || 10));
    if (type === VerificationType.PASSWORD_RESET) {
      await this.mailer.sendPasswordResetEmail(email, code);
    } else {
      await this.mailer.sendVerificationEmail(email, code);
    }
    return { message: 'Code sent' };
  }

  async verifyOtp(email: string, code: string, type: VerificationType) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('No such user');
    await this.tokenService.consumeValidTokenForUser(user.id, code, type);

    if (type === VerificationType.EMAIL_VERIFICATION) {
      await this.users.setEmailVerified(user.id);
      return { message: 'Email verified' };
    } else if (type === VerificationType.PASSWORD_RESET) {
      const expiresIn = Number(this.config.get('RESET_TOKEN_EXPIRES_SECONDS') || 900);
      const token = this.jwt.sign({ sub: user.id, reset: true }, { expiresIn });
      return { resetToken: token };
    }
    return { message: 'OK' };
  }

  
  async resetPassword(userId: string, newPassword: string) {
    const user = await this.users.findById(userId)
    if(!user){
      throw new UnauthorizedException("Unauthorized Access")
    }
    if(!user.isEmailVerified ){
       throw new BadRequestException("Please Verify your Email.")
    }
    return this.users.updatePassword(userId, newPassword);
  }



}
