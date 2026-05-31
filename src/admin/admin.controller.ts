import { Controller, UseGuards, Get, Param, Patch, Delete, Body, ParseIntPipe,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateProviderStatusDto } from './dtos/update-provider-status.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ------------------ USER MANAGEMENT ------------------

  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('users/:id')
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findUserById(id);
  }

  @Patch('users/:id/role')
  updateUserRole( @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRoleDto, ) {
    return this.adminService.updateUserRole(id, dto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  // ------------------ PROVIDER APPROVAL ------------------

  @Get('providers/pending')
  findPendingProviders() {
    return this.adminService.findPendingProviders();
  }

  @Patch('providers/:id/status')
  updateProviderStatus(@Param('id', ParseIntPipe) id: number,@Body() dto: UpdateProviderStatusDto,) {
    return this.adminService.updateProviderStatus(id, dto);
  }

  // ------------------ SERVICE MANAGEMENT ------------------

  @Get('services')
  findAllServices() {
    return this.adminService.findAllServices();
  }

  @Delete('services/:id')
  deleteService(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteService(id);
  }
}
