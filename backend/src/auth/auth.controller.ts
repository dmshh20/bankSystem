import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUp.dto';
import { SignInDto } from './dto/SignIn.dto';
import { verifyViaOtpDto } from './dto/verifyViaOtp.dto';
import { forgetPasswordEnterOtpDto } from './dto/forgetPasswordEnterOtp.dto';
import { forgetPasswirdEmailVerifyDto } from './dto/forgetPasswirdEmailVerify.dto';
import { updatePasswordDto } from './dto/updatePassword.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { GetUser } from './getUser/getUser';
import { GetUserDto } from './getUser/dto/getUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body)
  }

  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body)
  }
  
  @Post('verify')
  async verifyViaOtp(@Body() body: verifyViaOtpDto) {
    return this.authService.verifyViaOtp(body)
  }

  @Post('forgetpassword-enter-otp')
  async forgetPasswordEnterOtp(@Body() body: forgetPasswordEnterOtpDto) {
    return this.authService.forgetPasswordEnterOtp(body)
  }

  @Post('forgetpassword-email-verify')
  async forgetPasswordEmailVerify(@Body() body: forgetPasswirdEmailVerifyDto) {
    return this.authService.forgetPasswordEmailVerify(body)
  }

  @Post('update-password')
  async updatePassword(@Body() body: updatePasswordDto) {
    return this.authService.updatePassword(body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async aboutUser(@GetUser() user: GetUserDto) {
    return this.authService.aboutUser(user)
  }

}
