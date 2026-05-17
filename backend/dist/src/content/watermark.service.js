"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WatermarkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatermarkService = void 0;
const common_1 = require("@nestjs/common");
let WatermarkService = WatermarkService_1 = class WatermarkService {
    logger = new common_1.Logger(WatermarkService_1.name);
    async watermarkPdf(pdfBuffer, schoolName, subscriptionTier = 'Standard') {
        try {
            const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
            const watermarkText = `${schoolName} | ${subscriptionTier} | ${dateStr}`;
            const pages = pdfDoc.getPages();
            for (const page of pages) {
                const { width, height } = page.getSize();
                const fontSize = 14;
                const textWidth = helvetica.widthOfTextAtSize(watermarkText, fontSize);
                page.drawText(watermarkText, {
                    x: (width - textWidth) / 2,
                    y: height / 2,
                    size: fontSize,
                    font: helvetica,
                    color: rgb(0.85, 0.85, 0.85),
                    rotate: degrees(45),
                    opacity: 0.3,
                });
                page.drawText(watermarkText, {
                    x: 20,
                    y: 15,
                    size: 8,
                    font: helvetica,
                    color: rgb(0.7, 0.7, 0.7),
                    opacity: 0.5,
                });
            }
            const watermarkedBytes = await pdfDoc.save();
            this.logger.log(`Watermarked PDF for "${schoolName}" (${pages.length} pages)`);
            return Buffer.from(watermarkedBytes);
        }
        catch (error) {
            this.logger.error(`Watermarking failed: ${error.message}`);
            return pdfBuffer;
        }
    }
};
exports.WatermarkService = WatermarkService;
exports.WatermarkService = WatermarkService = WatermarkService_1 = __decorate([
    (0, common_1.Injectable)()
], WatermarkService);
//# sourceMappingURL=watermark.service.js.map