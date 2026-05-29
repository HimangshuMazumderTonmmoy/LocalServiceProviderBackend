import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register() {
        return this.authService.register();
    }

    @Post('login')
    login() {
        return this.authService.login();
    }

    @Post('refresh')
    refresh() {
        return this.authService.refreshToken();
    }

    @Post('logout')
    logout() {
        return this.authService.logout();
    }

    @Get('me')
    getMe() {
        return this.authService.getMe();
    }


}
