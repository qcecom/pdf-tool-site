import { PDFDocument } from 'pdf-lib';

export interface CompressOptions {
  targetSizeMB?: number;
  imageQuality?: number;
  removeMetadata?: boolean;
  optimizeImages?: boolean;
}

export interface CompressResult {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
}

export async function compressPDF(file: File, options: CompressOptions = {}): Promise<CompressResult> {
  const {
    targetSizeMB = 2,
    imageQuality = 0.7,
    removeMetadata = true,
    optimizeImages = true,
  } = options;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    if (removeMetadata) {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setCreator('');
      pdfDoc.setProducer('');
    }

    if (optimizeImages) {
      await optimizeImagesInPDF(pdfDoc, imageQuality);
    }

    let compressedBytes = await pdfDoc.save({ useObjectStreams: false });

    const currentSizeMB = compressedBytes.length / (1024 * 1024);

    if (currentSizeMB > targetSizeMB) {
      const newQuality = Math.max(0.3, imageQuality - 0.2);
      console.log(`Size ${currentSizeMB.toFixed(2)}MB > target. Reducing quality to ${newQuality}`);
      return await compressPDF(file, { ...options, imageQuality: newQuality });
    }

    return {
      data: compressedBytes,
      originalSize: file.size,
      compressedSize: compressedBytes.length,
      compressionRatio: ((file.size - compressedBytes.length) / file.size * 100).toFixed(1),
    };
  } catch (error) {
    console.error('Compression failed:', error);
    throw new Error('Failed to compress PDF');
  }
}

async function optimizeImagesInPDF(pdfDoc: PDFDocument, quality: number): Promise<PDFDocument> {
  console.log('Image optimization not yet implemented');
  return pdfDoc;
}

export function hasImages(pdfFile: File): boolean {
  return pdfFile.size > 500 * 1024;
}
