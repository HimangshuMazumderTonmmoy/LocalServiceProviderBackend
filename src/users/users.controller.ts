import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    async getMe(@Req() req: any) {
        return await this.usersService.findMe(req.user.id);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findById(id);
    }
}
