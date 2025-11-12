export async function getCreditBalance(supabase, userId) {
  const { data, error } = await supabase
    .from('users')
    .select('credits, role')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function deductCreditsTx(supabase, userId, amount, metadata = {}) {
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('credits, role')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  if (profile.role === 'admin') {
    return { remaining: profile.credits, unlimited: true };
  }

  if (profile.credits < amount) {
    const error = new Error('Insufficient credits');
    error.code = 'INSUFFICIENT_CREDITS';
    throw error;
  }

  const { data: updated, error: updateError } = await supabase
    .from('users')
    .update({ credits: profile.credits - amount })
    .eq('id', userId)
    .select('credits')
    .single();
  if (updateError) throw updateError;

  await supabase.from('credits_ledger').insert({
    user_id: userId,
    amount: -Math.abs(amount),
    reason: metadata.reason || 'AI extraction',
    metadata
  });

  return { remaining: updated.credits, unlimited: false };
}

export async function addCredits(supabase, userId, amount, reason = 'Manual top-up') {
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  const newBalance = (profile.credits || 0) + amount;
  const { data: updated, error: updateError } = await supabase
    .from('users')
    .update({ credits: newBalance })
    .eq('id', userId)
    .select('credits')
    .single();
  if (updateError) throw updateError;

  await supabase.from('credits_ledger').insert({
    user_id: userId,
    amount,
    reason
  });

  return updated;
}
