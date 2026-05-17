import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create school + admin user in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          name: dto.schoolName,
          slug: dto.schoolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          country: dto.country,
          phone: dto.phone,
          curriculumVersion: dto.curriculumVersion,
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.adminName,
          role: UserRole.SCHOOL_ADMIN,
          schoolId: school.id,
        },
      });

      // Create trial subscription (3-day free trial as per architecture)
      // Subscriptions are created when the admin adds classes

      return { school, user };
    });

    const tokens = await this.generateTokens(
      result.user.id,
      result.user.email,
      result.user.role,
      result.school.id,
      result.school.curriculumVersion,
    );

    // Save refresh token hash
    await this.prisma.user.update({
      where: { id: result.user.id },
      data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) },
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        schoolId: result.school.id,
        schoolName: result.school.name,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    // ── Step 1: Check if email exists ──────────────────────────────────
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { school: { select: { id: true, name: true, curriculumVersion: true } } },
    });

    if (!user || !user.isActive) {
      // Email not found at all
      throw new UnauthorizedException('USERNAME_NOT_FOUND');
    }

    // ── Step 2: Check password ─────────────────────────────────────────
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('WRONG_PASSWORD');
    }



    // ── Step 4: Issue tokens ───────────────────────────────────────────
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.school?.id || null,
      user.school?.curriculumVersion || null,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        lastLoginAt: new Date(),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        schoolId: user.school?.id,
        schoolName: user.school?.name,
        curriculumVersion: user.school?.curriculumVersion,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { school: { select: { id: true, curriculumVersion: true } } },
    });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenValid) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.school?.id || null,
      user.school?.curriculumVersion || null,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) },
    });

    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration attacks
    if (!user) return { message: 'If the email exists, a reset link has been sent.' };

    // Generate a short-lived reset token (1 hour)
    const resetToken = await this.jwt.signAsync(
      { sub: user.id, purpose: 'password_reset' },
      { secret: this.config.get('JWT_SECRET'), expiresIn: '1h' },
    );

    // TODO: Send reset email via AWS SES / SendGrid
    // For now, log the token (remove in production)
    console.log(`[Password Reset] Token for ${email}: ${resetToken}`);

    return { message: 'If the email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      if (payload.purpose !== 'password_reset') {
        throw new UnauthorizedException('Invalid reset token');
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash, refreshToken: null }, // Invalidate all sessions
      });

      return { message: 'Password reset successfully. Please log in.' };
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      if (payload.purpose !== 'email_verification') {
        throw new UnauthorizedException('Invalid verification token');
      }

      // Mark user as verified — requires adding emailVerified field to schema
      // For now, we log the verification
      console.log(`[Email Verified] User: ${payload.sub}`);

      return { message: 'Email verified successfully.' };
    } catch {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: UserRole,
    schoolId: string | null,
    curriculumVersion: string | null,
  ) {
    const payload = { sub: userId, email, role, schoolId, curriculumVersion };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
