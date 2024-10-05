import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async create(data: SignupDto) {
    return this.prisma.users.create({ data });
  }
}
