import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  const CLIENT_ID = Deno.env.get("ENTRA_CLIENT_ID")!;
  const TENANT_ID = Deno.env.get("ENTRA_TENANT_ID")!;
  const CLIENT_SECRET = Deno.env.get("ENTRA_CLIENT_SECRET")!;

  if (!CLIENT_ID || !TENANT_ID || !CLIENT_SECRET) {
    return new Response(
      JSON.stringify({ error: "Entra ID configuration missing" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action, code, redirect_uri } = body as {
      action?: string;
      code?: string;
      redirect_uri?: string;
    };

    // Step 1: Generate authorization URL
    if (action === "login") {
      if (!redirect_uri) {
        return new Response(
          JSON.stringify({ error: "redirect_uri is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const authUrl = new URL(
        `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`
      );
      authUrl.searchParams.set("client_id", CLIENT_ID);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("redirect_uri", redirect_uri);
      authUrl.searchParams.set("scope", "openid profile email User.Read");
      authUrl.searchParams.set("response_mode", "query");
      // Generate a random state for CSRF protection
      const state = crypto.randomUUID();
      authUrl.searchParams.set("state", state);

      return new Response(
        JSON.stringify({ auth_url: authUrl.toString(), state }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Exchange authorization code for tokens
    if (action === "callback") {
      if (!code || !redirect_uri) {
        return new Response(
          JSON.stringify({ error: "code and redirect_uri are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri,
          grant_type: "authorization_code",
          scope: "openid profile email User.Read",
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", errorText);
        return new Response(
          JSON.stringify({ error: "Token exchange failed", details: errorText }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const tokens = await tokenResponse.json();

      // Fetch user profile from Microsoft Graph
      const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      let user = null;
      if (profileResponse.ok) {
        user = await profileResponse.json();
      }

      return new Response(
        JSON.stringify({
          access_token: tokens.access_token,
          id_token: tokens.id_token,
          expires_in: tokens.expires_in,
          user: user
            ? {
                id: user.id,
                email: user.mail || user.userPrincipalName,
                name: user.displayName,
                given_name: user.givenName,
                surname: user.surname,
                job_title: user.jobTitle,
              }
            : null,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'login' or 'callback'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Entra auth error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
