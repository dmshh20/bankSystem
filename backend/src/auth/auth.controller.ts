import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUp.dto';
import { SignInDto } from './dto/SignIn.dto';

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
  async verifyViaOtp(@Body() body: any) {
    return this.authService.verifyViaOtp(body)
  }

  @Post('forgetpassword-otp-verify')
  async forgetPasswordOtpVerify(@Body() body: {email: string, otp: string}) {
    return this.authService.forgetPasswordOtpVerify(body)
  }

  @Post('email-verify')
  async emailVerify(@Body() body: {email: string}) {
    return this.authService.emailVerify(body)
  }


}
