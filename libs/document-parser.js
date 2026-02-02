// Document parser utility for extracting text from various file types
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extract text content from a file buffer
 * @param {Buffer} buffer - File content as buffer
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string|null>} Extracted text or null if extraction fails
 */
export async function extractText(buffer, mimeType) {
  try {
    switch (mimeType) {
      case "application/pdf":
        return await extractPdfText(buffer);

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return await extractDocxText(buffer);

      case "text/plain":
      case "text/markdown":
        return buffer.toString("utf-8");

      default:
        console.warn(`Unsupported file type for text extraction: ${mimeType}`);
        return null;
    }
  } catch (error) {
    console.error("Text extraction error:", error);
    return null;
  }
}

/**
 * Extract text from PDF buffer
 */
async function extractPdfText(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text?.trim() || null;
  } catch (error) {
    console.error("PDF extraction error:", error);
    return null;
  }
}

/**
 * Extract text from DOCX buffer
 */
async function extractDocxText(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() || null;
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return null;
  }
}

/**
 * Get allowed MIME types for file uploads
 */
export function getAllowedMimeTypes() {
  return {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "text/plain": ".txt",
    "text/markdown": ".md",
  };
}

/**
 * Check if a MIME type is allowed
 */
export function isAllowedMimeType(mimeType) {
  return Object.keys(getAllowedMimeTypes()).includes(mimeType);
}

/**
 * Get max file size in bytes (10MB)
 */
export function getMaxFileSize() {
  return 10 * 1024 * 1024;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
