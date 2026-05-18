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
const pdf_lib_1 = require("pdf-lib");
let WatermarkService = WatermarkService_1 = class WatermarkService {
    logger = new common_1.Logger(WatermarkService_1.name);
    async addWatermark(pdfBuffer, watermarkText) {
        try {
            const pdfDoc = await pdf_lib_1.PDFDocument.load(pdfBuffer);
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
            pages.forEach((page) => {
                const { width, height } = page.getSize();
                page.drawText(watermarkText, {
                    x: width / 2 - 150,
                    y: height / 2,
                    size: 40,
                    font,
                    color: (0, pdf_lib_1.rgb)(0.8, 0.8, 0.8),
                    rotate: (0, pdf_lib_1.degrees)(-45),
                    opacity: 0.3,
                });
            });
            const watermarkedBytes = await pdfDoc.save();
            return Buffer.from(watermarkedBytes);
        }
        catch (error) {
            this.logger.error('Failed to watermark PDF', error);
            throw new Error('Watermarking failed');
        }
    }
};
exports.WatermarkService = WatermarkService;
exports.WatermarkService = WatermarkService = WatermarkService_1 = __decorate([
    (0, common_1.Injectable)()
], WatermarkService);
//# sourceMappingURL=watermark.service.js.map