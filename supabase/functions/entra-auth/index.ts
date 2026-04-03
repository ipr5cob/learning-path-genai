import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function decodeJwtPayload(token: string) {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(base64);
  return JSON.parse(json);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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
      authUrl.searchParams.set("scope", "openid profile email");
      authUrl.searchParams.set("response_mode", "query");
      const state = crypto.randomUUID();
      authUrl.searchParams.set("state", state);

      return new Response(
        JSON.stringify({ auth_url: authUrl.toString(), state }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
          scope: "openid profile email",
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

      // Extract user info from id_token (no Graph API call needed)
      let user = null;
      if (tokens.id_token) {
        try {
          const claims = decodeJwtPayload(tokens.id_token);
          user = {
            id: claims.oid || claims.sub,
            email: claims.email || claims.preferred_username || claims.upn,
            name: claims.name,
            given_name: claims.given_name,
            surname: claims.family_name,
          };
        } catch (e) {
          console.error("Failed to decode id_token:", e);
        }
      }

      return new Response(
        JSON.stringify({
          id_token: tokens.id_token,
          expires_in: tokens.expires_in,
          user,
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
