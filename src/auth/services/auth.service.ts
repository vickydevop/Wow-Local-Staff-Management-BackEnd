import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
// import { CreateUserInterface } from 'src/users/interface/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: any): Promise<string> {
    return await this.jwtService.signAsync({ user });
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt();
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return await bcrypt.compare(password, storedPasswordHash);
  }

  async verifyJwt(jwt: string): Promise<any> {
    return await this.jwtService.verifyAsync(jwt);
  }
}
