import { EmailDto, PasswordDto } from './base-credentials.dto';
import { IntersectionType } from '@nestjs/mapped-types';

export class CredentialsDto extends IntersectionType(EmailDto, PasswordDto) {}