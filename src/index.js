export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const callbackUrl = `${url.origin}/callback`;

    if (url.pathname === '/auth') {
      const provider = url.searchParams.get('provider');
      if (provider !== 'github') {
        return new Response('Unsupported provider', { status: 400 });
      }

      const scope = url.searchParams.get('scope') || 'repo';
      const state = crypto.randomUUID();

      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', callbackUrl);
      authUrl.searchParams.set('scope', scope);
      authUrl.searchParams.set('state', state);

      return Response.redirect(authUrl.toString(), 302);
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return renderMessage('error', { message: 'Missing OAuth code' });
      }

      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: callbackUrl,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) {
        return renderMessage('error', {
          message: tokenData.error_description || tokenData.error || 'Failed to get access token',
        });
      }

      return renderMessage('success', {
        token: tokenData.access_token,
        provider: 'github',
      });
    }

    return new Response('Decap CMS GitHub OAuth Proxy is running', { status: 200 });
  },
};

function renderMessage(status, content) {
  const payload = JSON.stringify(content);
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Authenticating...</title></head>
<body>
<script>
(function() {
  const status = ${JSON.stringify(status)};
  const payload = ${JSON.stringify(payload)};
  const message = "authorization:github:" + status + ":" + payload;

  function receiveMessage(e) {
    if (window.opener) {
      window.opener.postMessage(message, e.origin);
      window.close();
    }
  }

  window.addEventListener("message", receiveMessage, false);

  if (window.opener) {
    window.opener.postMessage("authorizing:github", "*");
  }
})();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
