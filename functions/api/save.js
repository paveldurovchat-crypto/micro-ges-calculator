// functions/api/save.js
// POST /api/save  →  saves a project to Cloudflare KV
// Binding: env.PROJECTS  (KV namespace, set in wrangler.toml and CF dashboard)

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const id = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

    const project = {
      id,
      name:    (body.name || 'Проект').slice(0, 80),
      created: new Date().toISOString(),
      params:  body.params  || {},
      results: body.results || {}
    };

    // Store in KV with 1-year TTL
    await env.PROJECTS.put(id, JSON.stringify(project), {
      expirationTtl: 60 * 60 * 24 * 365
    });

    return Response.json({ success: true, id }, {
      headers: corsHeaders()
    });

  } catch (err) {
    return Response.json({ error: err.message }, {
      status: 500,
      headers: corsHeaders()
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
