import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, IsString } from 'class-validator';
import { CurriculumVersion } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  schoolName: string;

  @IsEnum(CurriculumVersion)
  curriculumVersion: CurriculumVersion;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  adminName: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  loginPortal?: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @MinLength(8)
  newPassword: string;
}

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

