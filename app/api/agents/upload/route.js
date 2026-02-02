import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { auth } from "@/libs/auth";
import {
  extractText,
  isAllowedMimeType,
  getMaxFileSize,
  getAllowedMimeTypes,
} from "@/libs/document-parser";

// POST /api/agents/upload - Upload a file for knowledge base
export async function POST(req) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!isAllowedMimeType(file.type)) {
      const allowedTypes = Object.values(getAllowedMimeTypes()).join(", ");
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowedTypes}` },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = getMaxFileSize();
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Generate unique path for the file
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const blobPath = `knowledge-base/${session.user.id}/${timestamp}-${safeFileName}`;

    // Convert file to buffer for text extraction
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Vercel Blob
    const blob = await put(blobPath, buffer, {
      access: "public",
      contentType: file.type,
    });

    // Extract text content for provider APIs
    const extractedText = await extractText(buffer, file.type);

    return NextResponse.json({
      type: "file",
      fileName: file.name,
      fileUrl: blob.url,
      fileSize: file.size,
      mimeType: file.type,
      extractedText: extractedText?.substring(0, 100000) || null, // Limit text size
      addedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("File upload error:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// DELETE /api/agents/upload - Delete a file from knowledge base
export async function DELETE(req) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 });
    }

    // Verify the URL belongs to the user's folder
    if (!fileUrl.includes(`/knowledge-base/${session.user.id}/`)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await del(fileUrl);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("File delete error:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
