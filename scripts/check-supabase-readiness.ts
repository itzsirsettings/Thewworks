import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is missing.`);
  }

  return value;
}

async function main() {
  const supabaseUrl = getRequiredEnv('VITE_SUPABASE_URL');
  const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    throw new Error('ADMIN_EMAILS must include at least one admin email.');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const checks: string[] = [];

  const { data: userPage, error: usersError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (usersError) {
    throw new Error(`Failed to list Supabase users: ${usersError.message}`);
  }

  for (const email of adminEmails) {
    const user = userPage.users.find((candidate) => candidate.email?.toLowerCase() === email);

    if (!user) {
      throw new Error(`Admin user not found in Supabase Auth: ${email}`);
    }

    if (user.app_metadata?.role !== 'admin') {
      throw new Error(`Supabase user missing app_metadata.role=admin: ${email}`);
    }

    checks.push(`Verified admin metadata for ${email}`);
  }

  const { data: rpcResult, error: rpcError } = await supabase.rpc('is_admin');

  if (rpcError) {
    throw new Error(
      [
        `Missing or broken public.is_admin RPC: ${rpcError.message}`,
        'Apply supabase/migrations/20260430_restore_is_admin_rpc.sql to the connected Supabase project, then rerun this check.',
      ].join('\n'),
    );
  }

  checks.push(`Verified public.is_admin RPC exists (returned ${String(rpcResult)})`);

  for (const check of checks) {
    console.log(check);
  }
}

await main();
