export declare class WatermarkService {
    private readonly logger;
    watermarkPdf(pdfBuffer: Buffer, schoolName: string, subscriptionTier?: string): Promise<Buffer>;
}
