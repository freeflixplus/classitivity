import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private config: ConfigService) {
    const databaseUrl = config.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured. Check your .env file.');
    }

    // Log the host (without password) for debugging
    const safeUrl = databaseUrl.replace(/:[^@]*@/, ':***@');
    console.log(`[PrismaService] Connecting to: ${safeUrl}`);

    // Prisma 7 adapter — pass connection string directly
    // Supabase session pooler handles connection pooling server-side
    const adapter = new PrismaPg(databaseUrl);

    // Enable query logging in development for debugging
    const logLevel = config.get('NODE_ENV') === 'development'
      ? (['query', 'warn', 'error'] as any)
      : (['warn', 'error'] as any);

    super({
      adapter,
      log: logLevel,
    });
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
}

