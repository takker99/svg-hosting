import {NowRequest, NowResponse} from '@vercel/node';

export default async (request: NowRequest, response: NowResponse) => {
    const {svg} = request.query;

    let resSvgText = '';
    try {
        const res = await fetch(svg);
        if (!res.ok) throw new Error('No image response');
        const contentType = res.headers.get('content-type') ?? '';
        if (!['text/plain', 'text/xml', 'image/svg+xml'].includes(contentType))
            throw Error(`Invalid content-type: ${contentType}`);
        resSvgText = await res.text();
    } catch (error) {
        response.status(400).end(error.message);
    }

    response.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `private, max-age=${60 * 60 * 24}` // 1 day
    });
    response.end(resSvgText);
};

