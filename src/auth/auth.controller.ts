import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))  
  refresh(@Req() req: any) {
    return this.authService.refresh(req.user.id, req.user.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))    
  logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }
}
