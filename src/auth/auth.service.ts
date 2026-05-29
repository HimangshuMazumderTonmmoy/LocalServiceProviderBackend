import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    register() {
        return { message: 'Register' };
    }

    login() {
        return { message: 'Login' };
    }

    refreshToken() {
        return { message: 'Refresh' };
    }

    logout() {
        return { message: 'Logout' };
    }

    getMe() {
        return { message: 'Profile' };
    }
}
