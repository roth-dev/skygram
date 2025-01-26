import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    // Load the file from the "public/.well-known" directory
    const filePath = path.join(
      process.cwd(),
      "public",
      ".well-known",
      "apple-app-site-association"
    );
    const fileContent = await fs.readFile(filePath, "utf8");

    return new Response(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error serving apple-app-site-association:", error);
    return new Response(JSON.stringify({ error: "File not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
