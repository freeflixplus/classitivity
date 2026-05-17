"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    config;
    logger = new common_1.Logger(PrismaService_1.name);
    constructor(config) {
        const databaseUrl = config.get('DATABASE_URL');
        if (!databaseUrl) {
            throw new Error('DATABASE_URL is not configured. Check your .env file.');
        }
        const safeUrl = databaseUrl.replace(/:[^@]*@/, ':***@');
        console.log(`[PrismaService] Connecting to: ${safeUrl}`);
        const adapter = new adapter_pg_1.PrismaPg(databaseUrl);
        const logLevel = config.get('NODE_ENV') === 'development'
            ? ['query', 'warn', 'error']
            : ['warn', 'error'];
        super({
            adapter,
            log: logLevel,
        });
        this.config = config;
    }
    async onModuleInit() {
        this.logger.log('Connecting to database...');
        await this.$connect();
        this.logger.log(`Database connected (pool: ${this.config.get('DB_POOL_SIZE', '10')})`);
    }
    async onModuleDestroy() {
        this.logger.log('Disconnecting from database...');
        await this.$disconnect();
        this.logger.log('Database disconnected');
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map