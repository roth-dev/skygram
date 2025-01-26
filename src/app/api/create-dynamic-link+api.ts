import crypto from "crypto";

// Mock database for storing dynamic links
const dynamicLinksDB: Record<string, { targetUrl: string; params?: any }> = {};

export const BASE_URL = "https://expo-deeplink--tlpz37gnyg.expo.app";

export async function POST(req: Request) {
  try {
    // Parse the JSON body
    const body = await req.json();
    const { targetUrl, params } = body;

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: "Missing targetUrl" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const uniqueId = crypto.randomBytes(8).toString("hex");
    const dynamicLink = `${BASE_URL}/api/resolve-dynamic-link/${uniqueId}`;

    // Store in mock database
    dynamicLinksDB[uniqueId] = { targetUrl, params };

    return new Response(JSON.stringify({ dynamicLink }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
