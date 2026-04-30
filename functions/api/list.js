// functions/api/list.js
// GET /api/list  →  returns all saved projects (sorted by date, newest first)

export async function onRequestGet({ env }) {
  try {
    const listing = await env.PROJECTS.list({ prefix: 'proj_' });

    const projects = [];
    for (const key of listing.keys) {
      const raw = await env.PROJECTS.get(key.name);
      if (raw) {
        try { projects.push(JSON.parse(raw)); } catch (_) {}
      }
    }

    // Sort newest first
    projects.sort((a, b) => new Date(b.created) - new Date(a.created));

    return Response.json(projects, { headers: corsHeaders() });

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
