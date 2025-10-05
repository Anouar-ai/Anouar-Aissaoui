import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { tokens } from "@/lib/token-store"; // Updated import
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

  // In a real app, you would handle the actual file download URL from the product object
  // For WP Rocket, we redirect. For others, we serve a file.
  if (product.id === 'wp-rocket-premium' && product.downloadUrl.startsWith('http')) {
      tokens.delete(token); // Invalidate token after use
      return NextResponse.redirect(product.downloadUrl);
  }

  // For local files
  // Note: The filename in `protected_files` must match the product ID.
  const fileName = `${product.id}.zip`;
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
