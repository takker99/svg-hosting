import { ServerRequest } from "https://deno.land/std@0.105.0/http/server.ts";

export default async (req: ServerRequest) => {
  const base = `${req.headers.get("x-forwarded-proto")}://${
    req.headers.get(
      "x-forwarded-host",
    )
  }`;
  const url = new URL(req.url, base);
  // svgのURLを取得する
  const params = url.searchParams;
  const svgURL = params.get("url");
  if (!svgURL) {
    req.respond({ status: 400, body: "No svg URL found." });
    return;
  }
  let svgBody = "";
  try {
    svgBody = await fetchSVGText(svgURL);
  } catch (e) {
    req.respond({ status: 400, body: e.message });
  }
  respondSVG(svgBody, req);
};

async function fetchSVGText(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Image response is not OK");
  }
  const text = await response.text();
  if (!text.trim()) {
    throw new Error(`Image is empty`);
  }
  return text;
}
function respondSVG(body: string, req: ServerRequest) {
  const headers = new Headers();
  headers.set("Content-Type", "image/svg+xml; charaset=utf-8");
  headers.set("Cache-Control", "no-cache, max-age=0");
  req.respond({
    headers,
    body: body,
  });
}
