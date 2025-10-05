import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { tokens } from "@/lib/token-store";
import { products } from "@/lib/products";

export async function GET(req: Request, { params }: { params: { token: string } }) {
  const token = params.token;

  if (!token) {
    return NextResponse.json({ error: "Download token is missing" }, { status: 400 });
  }
  
  const record = tokens.get(token);

  if (!record) {
    return NextResponse.json({ error: "Invalid or expired download link." }, { status: 404 });
  }

  if (Date.now() > record.expires) {
    tokens.delete(token); // Clean up expired token
    return NextResponse.json({ error: "This download link has expired." }, { status: 410 });
  }
  
  const productId = record.productIds[0]; // Assuming one product per token
  const product = products.find(p => p.id === productId);

  if (!product) {
     return NextResponse.json({ error: "Product not found for this token." }, { status: 404 });
  }

  // Special handling for external URLs like WP Rocket
  if (product.downloadUrl.startsWith('http')) {
      tokens.delete(token); // Invalidate token after generating the redirect
      return NextResponse.redirect(product.downloadUrl);
  }

  // For local files stored in `protected_files`
  // The local "downloadUrl" in products.ts should be the filename, e.g. "elementor-pro.zip"
  const fileName = product.downloadUrl.split('/').pop();
  if (!fileName) {
      console.error(`Invalid downloadUrl format for product: ${product.id}`);
      return NextResponse.json({ error: "File configuration error." }, { status: 500 });
  }

  const filePath = path.join(process.cwd(), "protected_files", fileName);

  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // Invalidate the token after retrieving the file buffer to prevent reuse
    tokens.delete(token);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${product.name.replace(/\s+/g, '-')}.zip"`,
        "Content-Type": "application/zip",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error(`File not found at path: ${filePath}`, error);
    return NextResponse.json({ error: "File not found. Please contact support." }, { status: 404 });
  }
}

export const dynamic = "force-dynamic";
