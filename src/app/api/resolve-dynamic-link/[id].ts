const dynamicLinksDB: Record<string, { targetUrl: string; params?: any }> = {};

export async function GET(req: Request) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop();

  if (!id || !dynamicLinksDB[id]) {
    return new Response(JSON.stringify({ error: "Dynamic link not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { targetUrl, params } = dynamicLinksDB[id];

  // Redirect to the target URL
  const url = new URL(targetUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value as string);
    });
  }

  return Response.redirect(url.toString(), 302);
}
