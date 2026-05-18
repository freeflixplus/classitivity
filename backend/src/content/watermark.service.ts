import { Injectable, Logger } from '@nestjs/common';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

@Injectable()
export class WatermarkService {
  private readonly logger = new Logger(WatermarkService.name);

  async addWatermark(pdfBuffer: Buffer, watermarkText: string): Promise<Buffer> {
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - 150,
          y: height / 2,
          size: 40,
          font,
          color: rgb(0.8, 0.8, 0.8), // Light gray
          rotate: degrees(-45),
          opacity: 0.3,
        });
      });

      const watermarkedBytes = await pdfDoc.save();
      return Buffer.from(watermarkedBytes);
    } catch (error) {
      this.logger.error('Failed to watermark PDF', error);
      throw new Error('Watermarking failed');
    }
  }
}
