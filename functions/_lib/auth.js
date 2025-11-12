import { errorResponse } from './response.js';
import { getServiceSupabase } from './supabase.js';

const DEFAULT_ROLE = 'user';

export async function requireUser(context, options = {}) {
  const { allowUnauthenticated = false } = options;
  const authorization = context.request.headers.get('Authorization');
  if (!authorization) {
    if (allowUnauthenticated) return { user: null, profile: null };
    return { response: errorResponse('Missing Authorization header', 401) };
  }

  const token = authorization.replace('Bearer', '').trim();
  if (!token) {
    return { response: errorResponse('Invalid authorization token', 401) };
  }

  const supabase = getServiceSupabase(context.env);
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) {
    if (allowUnauthenticated) return { user: null, profile: null };
    return { response: errorResponse('Invalid session token', 401, authError) };
  }

  const authUser = authData.user;
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (profileError) {
    return { response: errorResponse('Unable to load profile', 500, profileError) };
  }

  let ensuredProfile = profile;
  if (!profile) {
    const defaultCredits = Number(context.env.DEFAULT_STARTING_CREDITS || 50);
    const { data: inserted, error: insertError } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email,
        display_name: authUser.user_metadata?.full_name || authUser.email,
        role: DEFAULT_ROLE,
        credits: defaultCredits
      })
      .select('*')
      .single();
    if (insertError) {
      return { response: errorResponse('Unable to initialise profile', 500, insertError) };
    }
    ensuredProfile = inserted;
  }

  return {
    user: authUser,
    profile: ensuredProfile,
    supabase,
    accessToken: token
  };
}

export function assertRole(profile, allowedRoles) {
  if (!allowedRoles.includes(profile.role)) {
    return errorResponse('Insufficient permissions', 403);
  }
  return null;
}
