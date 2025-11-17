import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { AuthJwtService } from 'src/lib/services/jwt.service';
import { UserRepo } from 'src/lib/repo/UserRepo';
import { PasswordService } from 'src/lib/services/password.service';
import { Auth } from 'src/lib/decorators/auth.decorator';
import { UserRole } from 'src/lib/enums/user.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authJwtService: AuthJwtService,
    private readonly userRepo: UserRepo,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userRepo.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await this.passwordService.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.authJwtService.generateToken(payload);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  @Get('members')
  @Auth({ role: UserRole.TEAM_LEAD }, { role: UserRole.MEMBER })
  async getMembers() {
    const members = await this.userRepo.find({ role: UserRole.MEMBER });

    return {
      message: 'Members fetched successfully',
      data: members.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
      })),
    };
  }

  @Get('leaders')
  @Auth({ role: UserRole.TEAM_LEAD }, { role: UserRole.MEMBER })
  async getLeaders() {
    const leaders = await this.userRepo.find({ role: UserRole.TEAM_LEAD });

    return {
      message: 'Leaders fetched successfully',
      data: leaders.map((leader) => ({
        id: leader.id,
        name: leader.name,
        email: leader.email,
      })),
    };
  }
}
