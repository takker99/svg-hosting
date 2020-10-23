import { NowRequest, NowResponse } from '@vercel/node';

export default async (request: NowRequest, response: NowResponse) => {
  const { svg } = request.query;
  let svgUrl = '';
  try {
    svgUrl = new URL(svg);
  } catch (error) {
    response.status(400).end(error.message);
  }

  let resSvgText = '';
  try {
    resSvgText = await fetch(svgUrl).then(res => res.text);
  } catch (error) {
    response.status(400).end(error.message);
  }

  response.writeHead(200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': `private, max-age=${60 * 60 * 24}` // 1 day
  });
  response.end(resSvgText);
};

