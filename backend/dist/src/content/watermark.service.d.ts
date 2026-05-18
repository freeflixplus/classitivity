export declare class WatermarkService {
    private readonly logger;
    addWatermark(pdfBuffer: Buffer, watermarkText: string): Promise<Buffer>;
}
