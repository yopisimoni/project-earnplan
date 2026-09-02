import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (contentLength > 7_000_000) throw new Error("Submission too large");

    const form = await req.formData();
    const cv = form.get("cv");
    if (!(cv instanceof File)) throw new Error("CV is required");
    if (cv.size < 1 || cv.size > 5 * 1024 * 1024) throw new Error("CV must be 5 MB or less");
    if (!allowedTypes.has(cv.type)) throw new Error("CV must be PDF, DOC, or DOCX");

    const fullName = String(form.get("full_name") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const phone = String(form.get("phone") || "").trim();
    const occupation = String(form.get("occupation") || "").trim();
    const consent = String(form.get("consent_to_share") || "") === "true";

    if (fullName.length < 2 || fullName.length > 120) throw new Error("Invalid full name");
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) throw new Error("Invalid email");
    if (phone.length < 6 || phone.length > 40) throw new Error("Invalid phone");
    if (!occupation) throw new Error("Occupation is required");
    if (!consent) throw new Error("Consent is required");

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

    const id = crypto.randomUUID();
    const cleanName = cv.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
    const path = `${new Date().getUTCFullYear()}/${id}/${cleanName}`;

    const { error: uploadError } = await supabase.storage.from("candidate-cvs").upload(path, cv, { contentType: cv.type, upsert: false });
    if (uploadError) throw uploadError;

    const yearsRaw = String(form.get("years_experience") || "").trim();
    const years = yearsRaw === "" ? null : Number(yearsRaw);

    const { error: insertError } = await supabase.from("candidates").insert({
      id,
      full_name: fullName,
      email,
      phone,
      nationality: String(form.get("nationality") || "").trim() || null,
      country_of_residence: String(form.get("country_of_residence") || "").trim() || null,
      occupation,
      years_experience: Number.isFinite(years) ? years : null,
      skills: String(form.get("skills") || "").trim() || null,
      languages: String(form.get("languages") || "").trim() || null,
      preferred_role: String(form.get("preferred_role") || "").trim() || null,
      passport_status: String(form.get("passport_status") || "").trim() || null,
      relocation_ready: String(form.get("relocation_ready") || "") === "true",
      consent_to_share: consent,
      cv_storage_path: path,
      source: "website",
    });

    if (insertError) {
      await supabase.storage.from("candidate-cvs").remove([path]);
      throw insertError;
    }

    return new Response(JSON.stringify({ ok: true, application_id: id }), { status: 201, headers: { ...cors, "Content-Type": "application/json" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit application";
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
