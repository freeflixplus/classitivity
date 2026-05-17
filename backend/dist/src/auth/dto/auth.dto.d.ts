import { CurriculumVersion } from '@prisma/client';
export declare class RegisterDto {
    schoolName: string;
    curriculumVersion: CurriculumVersion;
    country: string;
    phone?: string;
    adminName: string;
    email: string;
    password: string;
}
export declare class LoginDto {
    email: string;
    password: string;
    loginPortal?: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class VerifyEmailDto {
    token: string;
}
