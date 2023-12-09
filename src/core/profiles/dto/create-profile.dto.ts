import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Carrera } from 'src/core/career/enum/career.enum';

export class CreateProfileDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mainTitle: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  countryResidence: string;

  @ApiProperty()
  @IsEnum(Carrera, { message: 'Invalid Career' })
  @IsNotEmpty()
  career: Carrera;
}
