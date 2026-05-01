import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MASTER_ACCOUNT_ID = "45138f86-e5ae-4649-a7ce-250793c9fd66";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify the user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create user client to verify auth
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    if (userId === MASTER_ACCOUNT_ID) {
      return new Response(JSON.stringify({ message: "Master account, skipping" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check existing data counts for user (per table)
    const [existingEmissions, existingClients, existingNetzero, existingBudgets, existingCredentials, existingCredLogos] = await Promise.all([
      supabaseAdmin.from("emissions_data").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("clients").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("netzero_targets").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("carbon_budgets").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("sustainability_credentials").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("credential_type_logos").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]);

    // Fetch all master data using admin client
    const [emissions, clients, netzero, budgets, credentials, credLogos] = await Promise.all([
      supabaseAdmin.from("emissions_data").select("*").eq("user_id", MASTER_ACCOUNT_ID),
      supabaseAdmin.from("clients").select("*").eq("user_id", MASTER_ACCOUNT_ID),
      supabaseAdmin.from("netzero_targets").select("*").eq("user_id", MASTER_ACCOUNT_ID),
      supabaseAdmin.from("carbon_budgets").select("*").eq("user_id", MASTER_ACCOUNT_ID),
      supabaseAdmin.from("sustainability_credentials").select("*").eq("user_id", MASTER_ACCOUNT_ID),
      supabaseAdmin.from("credential_type_logos").select("*").eq("user_id", MASTER_ACCOUNT_ID),
    ]);

    // Copy only missing data using admin client
    const results: string[] = [];

    if (emissions.data?.length && !(existingEmissions.count && existingEmissions.count > 0)) {
      const rows = emissions.data.map(({ id, user_id, organization_id, ...rest }) => ({
        ...rest,
        user_id: userId,
      }));
      const { error } = await supabaseAdmin.from("emissions_data").insert(rows);
      if (error) console.error("emissions insert error:", error);
      else results.push(`emissions: ${rows.length}`);
    }

    if (clients.data?.length && !(existingClients.count && existingClients.count > 0)) {
      const rows = clients.data.map(({ id, user_id, organization_id, ...rest }) => ({
        ...rest,
        user_id: userId,
      }));
      const { error } = await supabaseAdmin.from("clients").insert(rows);
      if (error) console.error("clients insert error:", error);
      else results.push(`clients: ${rows.length}`);
    }

    if (netzero.data?.length && !(existingNetzero.count && existingNetzero.count > 0)) {
      const rows = netzero.data.map(({ id, user_id, organization_id, ...rest }) => ({
        ...rest,
        user_id: userId,
      }));
      const { error } = await supabaseAdmin.from("netzero_targets").insert(rows);
      if (error) console.error("netzero insert error:", error);
      else results.push(`netzero: ${rows.length}`);
    }

    if (budgets.data?.length && !(existingBudgets.count && existingBudgets.count > 0)) {
      const rows = budgets.data.map(({ id, user_id, organization_id, ...rest }) => ({
        ...rest,
        user_id: userId,
      }));
      const { error } = await supabaseAdmin.from("carbon_budgets").insert(rows);
      if (error) console.error("budgets insert error:", error);
      else results.push(`budgets: ${rows.length}`);
    }

    if (credentials.data?.length && !(existingCredentials.count && existingCredentials.count > 0)) {
      const rows = credentials.data.map(({ id, user_id, organization_id, ...rest }) => ({
        ...rest,
        user_id: userId,
      }));
      const { error } = await supabaseAdmin.from("sustainability_credentials").insert(rows);
      if (error) console.error("credentials insert error:", error);
      else results.push(`credentials: ${rows.length}`);
    }

    if (credLogos.data?.length && !(existingCredLogos.count && existingCredLogos.count > 0)) {
      const rows = credLogos.data.map(({ id, user_id, ...rest }) => ({
        ...rest,
        user_id: userId,
      }));
      const { error } = await supabaseAdmin.from("credential_type_logos").insert(rows);
      if (error) console.error("credential logos insert error:", error);
      else results.push(`credential_logos: ${rows.length}`);
    }

    // Copy profile fields (banner, logo, name, summary) from master
    const { data: masterProfile } = await supabaseAdmin
      .from("profiles")
      .select("company_name, logo_url, banner_url, summary")
      .eq("user_id", MASTER_ACCOUNT_ID)
      .single();

    if (masterProfile) {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          company_name: masterProfile.company_name,
          logo_url: masterProfile.logo_url,
          banner_url: masterProfile.banner_url,
          summary: masterProfile.summary,
        })
        .eq("user_id", userId);
      if (error) console.error("profile update error:", error);
      else results.push("profile: updated");
    }

    return new Response(JSON.stringify({ message: "Data copied", results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
