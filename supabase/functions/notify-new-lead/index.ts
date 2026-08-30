import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type WebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: Record<string, unknown>;
};

function safe(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char] ?? char));
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const expectedSecret = Deno.env.get("WEBHOOK_SECRET");
  const providedSecret = req.headers.get("x-earnplan-webhook-secret");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const ownerEmail = Deno.env.get("OWNER_EMAIL");
  const fromEmail = Deno.env.get("FROM_EMAIL") || "EarnPlan <onboarding@resend.dev>";
  if (!resendKey || !ownerEmail) {
    return new Response("Notification secrets are not configured", { status: 500 });
  }

  const payload = (await req.json()) as WebhookPayload;
  const record = payload.record ?? {};
  const table = String(payload.table ?? "unknown");
  const subject = table === "project_requests"
    ? "New EarnPlan business project request"
    : "New EarnPlan pilot signup";

  const fields = Object.entries(record)
    .filter(([key]) => !["id"].includes(key))
    .map(([key, value]) => `<tr><td style="padding:6px 10px;font-weight:600">${safe(key)}</td><td style="padding:6px 10px">${safe(value)}</td></tr>`)
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [ownerEmail],
      subject,
      html: `<h2>${safe(subject)}</h2><p>Source table: ${safe(table)}</p><table>${fields}</table>`,
      text: `${subject}\n\n${Object.entries(record).map(([k,v]) => `${k}: ${String(v ?? "")}`).join("\n")}`,
    }),
  });

  if (!response.ok) {
    console.error("Resend delivery failed", response.status, await response.text());
    return new Response("Email delivery failed", { status: 502 });
  }

  return Response.json({ ok: true });
});
