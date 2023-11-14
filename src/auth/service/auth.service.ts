import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UsersService } from 'src/users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UserRole } from 'src/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationEntity } from '../entities/emailverification.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interface/jwt-payload.interface';
import 'dotenv/config';
import { JwtPayloadService } from 'src/common/service/jwt.payload.service';
import { transporter } from 'src/constants';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(EmailVerificationEntity) 
        private readonly emailVerification: Repository<EmailVerificationEntity>,

        private readonly usersService: UsersService,

        private readonly jwtService: JwtService,

        private readonly jwtPayloadService: JwtPayloadService,
    ) {}

    async register({ email, password, name }: RegisterDto) {
        const user = await this.usersService.findOneByEmail(email);

        if (user) {
            throw new BadRequestException('User already exists');
        }

        await this.usersService.create({
            email,
            password: await bcryptjs.hash(password, 10),
            name,
            role: UserRole.GRADUATE,
        });

        

        return {
            email,
            name,
        }
    }

    async login({ email, password }: LoginDto) {
        
        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user) {
            throw new UnauthorizedException('email is wrong');
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (user.verified === false) {
            throw new UnauthorizedException('Correo no verificado');
        }

        if (!isPasswordValid) {
            throw new UnauthorizedException('password is wrong');
        }

        const payload = { email: user.email, id: user.id, role: user.role };
        const token = await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET});

        return {
            token,
            email,
            role: user.role,
            id: user.id,
        }
    }


    async createEmailToken(email: string) {
        const emailVerification = await this.emailVerification.findOne({
            where: { email: email },
        });
    
        if (!emailVerification) {
          const emailVerificationToken = await this.emailVerification.save(
            {
              email,
              emailToken: (
                Math.floor(Math.random() * 9000000) + 1000000
              ).toString(),
              timestamp: new Date(),
            },
          );
          return emailVerificationToken;
        }
        return false;
      }

    async validateUserByJwt(payload: JwtPayload) {
        const user = await this.usersService.findOneByEmail(payload.email);
    
        if (user) {
          return this.jwtPayloadService.createJwtPayload(user);
        } else {
          throw new UnauthorizedException();
        }
      }

      async verifyEmail(token: string): Promise<boolean> {
        const emailVerif = await this.emailVerification.findOne({
          where: { emailToken: token },
        });
        if (emailVerif && emailVerif.email) {
            const userFromDb = await this.usersService.findOneByEmail(
                emailVerif.email,
            );
            if (userFromDb) {
                await this.usersService.update(userFromDb.id, {
                    ...userFromDb,
                    verified: true,
                });

                await this.emailVerification.delete({ emailToken: token });
                return true;
            }
        } else {
            throw new HttpException('Token invalido', HttpStatus.FORBIDDEN);
        }
      }

      async sendEmailVerification(email: string) {
        const repository = await this.emailVerification.findOne({
          where : { email: email },
        });
    
        if (repository && repository.emailToken) {
          const mailOptions = {
            from: '"Company" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'Verify Email',
            text: 'Verify Email',
            html: `Hi! <br><br> Thanks for your registration<br><br>
              <a href='${process.env.DATABASE_URL}/auth/email/verify/${repository.emailToken}'>Click here to activate your account</a>`,
          };
    
          return await this.sendEmail(mailOptions);
        } else {
          throw new HttpException('User not found', HttpStatus.FORBIDDEN);
        }
      }
    
      async sendEmail(mailOptions) {
        return await new Promise<{}>(async (resolve, reject) => {
          return await transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              Logger.log(
                `Error while sending message: ${error}`,
                'sendEmailVerification',
              );
              return reject(error);
            }
            Logger.log(`Send message: ${info.messageId}`, 'sendEmailVerification');
            resolve({ message: 'Successfully send email' });
          });
        });
      }
}
