"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await bcrypt.hash(dto.password, 12);
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
                    role: client_1.UserRole.SCHOOL_ADMIN,
                    schoolId: school.id,
                },
            });
            return { school, user };
        });
        const tokens = await this.generateTokens(result.user.id, result.user.email, result.user.role, result.school.id, result.school.curriculumVersion);
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
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { school: { select: { id: true, name: true, curriculumVersion: true } } },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('USERNAME_NOT_FOUND');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('WRONG_PASSWORD');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role, user.school?.id || null, user.school?.curriculumVersion || null);
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
    async refreshTokens(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { school: { select: { id: true, curriculumVersion: true } } },
        });
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!tokenValid) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role, user.school?.id || null, user.school?.curriculumVersion || null);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) },
        });
        return tokens;
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { message: 'If the email exists, a reset link has been sent.' };
        const resetToken = await this.jwt.signAsync({ sub: user.id, purpose: 'password_reset' }, { secret: this.config.get('JWT_SECRET'), expiresIn: '1h' });
        console.log(`[Password Reset] Token for ${email}: ${resetToken}`);
        return { message: 'If the email exists, a reset link has been sent.' };
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = await this.jwt.verifyAsync(token, {
                secret: this.config.get('JWT_SECRET'),
            });
            if (payload.purpose !== 'password_reset') {
                throw new common_1.UnauthorizedException('Invalid reset token');
            }
            const passwordHash = await bcrypt.hash(newPassword, 12);
            await this.prisma.user.update({
                where: { id: payload.sub },
                data: { passwordHash, refreshToken: null },
            });
            return { message: 'Password reset successfully. Please log in.' };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
    }
    async verifyEmail(token) {
        try {
            const payload = await this.jwt.verifyAsync(token, {
                secret: this.config.get('JWT_SECRET'),
            });
            if (payload.purpose !== 'email_verification') {
                throw new common_1.UnauthorizedException('Invalid verification token');
            }
            console.log(`[Email Verified] User: ${payload.sub}`);
            return { message: 'Email verified successfully.' };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired verification token');
        }
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    async generateTokens(userId, email, role, schoolId, curriculumVersion) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map