import { ApiProperty } from '@nestjs/swagger';
import { Carrera, Profile } from '../entities/profile.entity';
import { Skill } from 'src/core/skills/entities/skill.entity';
import { Experience } from 'src/core/experience/entities/experience.entity';
import { User } from 'src/core/users/entities/user.entity';

export class UserProfileData {
  @ApiProperty()
  name: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  email: string;
}

export class ExperienceData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  profileId: number;
  @ApiProperty()
  businessName: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
}

export class SkillData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  level: string;
}

export class AddSkillResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  mainTitle: string;
  @ApiProperty()
  countryResidence: string;
  @ApiProperty()
  deleteAt: Date;
  @ApiProperty({
    type: [SkillData],
  })
  skills: SkillData[];
}

export class PaginationMessage {
  @ApiProperty()
  itemCount: number;
  @ApiProperty()
  totalItems: number;
  @ApiProperty()
  itemsPerPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  randomSeed: number;
}

export class LanguageProfileData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  profileId: number;
  @ApiProperty()
  level: string;
  @ApiProperty()
  languageId: number;
}

export class ResponseProfile {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({
    type: UserProfileData,
  })
  user: User;

  @ApiProperty()
  description: string;

  @ApiProperty()
  mainTitle: string;

  @ApiProperty()
  career: Carrera;

  @ApiProperty()
  countryResidence: string;

  @ApiProperty({
    type: [ExperienceData],
  })
  experience: Experience[];

  @ApiProperty({
    type: [SkillData],
  })
  skills: Skill[];

  @ApiProperty({
    type: [LanguageProfileData],
  })
  languageProfile: LanguageProfileData[];

  @ApiProperty()
  deletedAt: Date;
}

export class LanguageProfileDataExtend {
  @ApiProperty()
  id: number;
  @ApiProperty()
  profileId: number;
  @ApiProperty()
  level: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  languageId: number;
}

export class ResponseProfileGet {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({
    type: UserProfileData,
  })
  user: User;

  @ApiProperty()
  description: string;

  @ApiProperty()
  mainTitle: string;

  @ApiProperty()
  career: Carrera;

  @ApiProperty()
  countryResidence: string;

  @ApiProperty({
    type: [ExperienceData],
  })
  experience: Experience[];

  @ApiProperty({
    type: [SkillData],
  })
  skills: Skill[];

  @ApiProperty({
    type: [LanguageProfileDataExtend],
  })
  languageProfile: LanguageProfileDataExtend[];

  @ApiProperty()
  deletedAt: Date;
}

export class ResponsePaginationProfile {
  @ApiProperty({
    type: ResponseProfile,
  })
  profiles: ResponseProfile[];

  @ApiProperty({
    type: PaginationMessage,
  })
  pagination: PaginationMessage;
}

export class SwaggerResponsePagination {
  @ApiProperty({
    type: ResponseProfileGet,
  })
  profiles: ResponseProfileGet[];

  @ApiProperty({
    type: PaginationMessage,
  })
  pagination: PaginationMessage;
}
