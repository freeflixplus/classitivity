import { Injectable, Logger } from '@nestjs/common';

/**
 * PDF Watermarking Service
 * Architecture: Section 9 — Content Protection & DRM
 *
 * Generates watermarked copies of downloadable PDFs on-the-fly.
 * Each watermark includes the school name, date, and subscription tier.
 *
 * NOTE: Requires `pdf-lib` package. Install with: npm install pdf-lib
 */
@Injectable()
export class WatermarkService {
  private readonly logger = new Logger(WatermarkService.name);

  /**
   * Apply a diagonal watermark to every page of a PDF
   * Architecture spec: school name + date + subscription tier
   */
  async watermarkPdf(
    pdfBuffer: Buffer,
    schoolName: string,
    subscriptionTier: string = 'Standard',
  ): Promise<Buffer> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib') as any;

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

        // Diagonal watermark (center of page, rotated 45 degrees)
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font: helvetica,
          color: rgb(0.85, 0.85, 0.85),
          rotate: degrees(45),
          opacity: 0.3,
        });

        // Footer watermark (bottom of page)
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
    } catch (error) {
      this.logger.error(`Watermarking failed: ${error.message}`);
      // Return original if watermarking fails — don't block access
      return pdfBuffer;
    }
  }
}
