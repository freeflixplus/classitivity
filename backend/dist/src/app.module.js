"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const content_module_1 = require("./content/content.module");
const storage_module_1 = require("./storage/storage.module");
const teacher_module_1 = require("./teacher/teacher.module");
const school_admin_module_1 = require("./school-admin/school-admin.module");
const platform_admin_module_1 = require("./platform-admin/platform-admin.module");
const subscription_module_1 = require("./subscription/subscription.module");
const webhook_module_1 = require("./webhook/webhook.module");
const curriculum_module_1 = require("./curriculum/curriculum.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 60,
                }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            content_module_1.ContentModule,
            storage_module_1.StorageModule,
            teacher_module_1.TeacherModule,
            school_admin_module_1.SchoolAdminModule,
            platform_admin_module_1.PlatformAdminModule,
            subscription_module_1.SubscriptionModule,
            webhook_module_1.WebhookModule,
            curriculum_module_1.CurriculumModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map