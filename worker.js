const API_END_POINT = "https://api.notion.com";

export default {
    async fetch(request, env) {
        return await handleRequest(request, env)
    }
}

function getCorsHeaders(request) {
    return {
        "Access-Control-Allow-Origin": request.headers.get("Origin"),
        "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Notion-Version",
    };
}

function handleOptions(request) {
    return new Response(null, {
        headers: getCorsHeaders(request),
    });
}

async function handleRequest(request, env) {
    if (request.method === "OPTIONS") {
        return handleOptions(request);
    }

    let url = new URL(request.url);

    let requestUrl = `${API_END_POINT}${url.pathname}`;

    let notionResponse = await fetch(requestUrl, {
        body: request.body,
        headers: {
            "Authorization": `Bearer ${env.NOTION_SECRET}`,
            "Notion-Version": "2022-06-28",
        },
        method: request.method
    });

    return new Response(notionResponse.body, {
        headers: {"Content-Type": "application/json", ...getCorsHeaders(request)},
        status: notionResponse.status,
        statusText: notionResponse.statusText
    });
}