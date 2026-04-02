import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are T-Hub Learning Path Studio AI — an expert learning path architect. When a user provides a topic, you generate a structured, enterprise-grade learning path.

RESPONSE FORMAT (use markdown):

## Learning Path: [Topic]

**Target Proficiency:** [Beginner → Advanced]  
**Estimated Duration:** [X hours]  
**Modules:** [N]  
**Confidence:** [High/Medium/Low]

---

### 🟢 Beginner Track

#### Module 1: [Title]
- **Duration:** Xh | **Modality:** Self-paced | **Source:** Internal
- **Description:** [Brief description]
- **Prerequisites:** None
- **Learning Outcomes:**
  - Outcome 1
  - Outcome 2
- **Tags:** \`Prerequisite\` \`Recommended\`

---

[Continue with more modules across Beginner, Intermediate, Advanced tracks]

### ⚠️ Gap Analysis

If you identify gaps in coverage, highlight them:
- **Missing Area:** [Description]
- **Severity:** High/Medium/Low
- **Suggested Module:** [Title and source]

### 🧠 AI Reasoning

Explain why you chose this order, dependencies between modules, and confidence levels.

### 📚 Citations

List any sources or references used.

RULES:
- Always structure paths from Beginner → Intermediate → Advanced
- Include 5-8 modules typically
- Mark AI-generated modules explicitly
- Identify gaps and suggest fixes
- Show dependency chains between modules
- Be specific and actionable, not generic
- Use real tool/technology names relevant to the topic`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
