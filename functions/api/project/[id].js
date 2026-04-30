// functions/api/project/[id].js
// GET    /api/project/:id  →  get one project
// DELETE /api/project/:id  →  delete one project

export async function onRequestGet({ params, env }) {
  try {
    const raw = await env.PROJECTS.get(params.id);
    if (!raw) {
      return Response.json({ error: 'Project not found' }, {
        status: 404, headers: corsHeaders()
      });
    }
    return Response.json(JSON.parse(raw), { headers: corsHeaders() });
  } catch (err) {
    return Response.json({ error: err.message }, {
      status: 500, headers: corsHeaders()
    });
  }
}

export async function onRequestDelete({ params, env }) {
  try {
    await env.PROJECTS.delete(params.id);
    return Response.json({ success: true, id: params.id }, {
      headers: corsHeaders()
    });
  } catch (err) {
    return Response.json({ error: err.message }, {
      status: 500, headers: corsHeaders()
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
