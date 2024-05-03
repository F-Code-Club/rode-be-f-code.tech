import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RoleGuard } from '@auth/role.guard';

@Controller('user-rooms')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('UserRooms')
@ApiBearerAuth()
export class UserRoomsController {}
