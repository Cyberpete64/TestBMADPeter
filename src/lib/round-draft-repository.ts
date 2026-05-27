import "server-only";

import { normalizeDraftCourseMetadata } from "@/lib/round-drafts";
import type { RoundEntryDraft } from "@/lib/round-entry";
import { createClient } from "@/lib/supabase/server";

type DraftClient = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
};

type RoundDraftRow = {
  draft: RoundEntryDraft;
};

async function getDraftClient(): Promise<DraftClient | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return { supabase, userId: user.id };
}

export async function getActiveRoundDraft() {
  const client = await getDraftClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client.supabase
    .from("round_drafts")
    .select("draft")
    .eq("user_id", client.userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return normalizeDraftCourseMetadata((data as RoundDraftRow).draft);
}

export async function saveActiveRoundDraft(draft: RoundEntryDraft) {
  const client = await getDraftClient();

  if (!client) {
    return;
  }

  const { error } = await client.supabase.from("round_drafts").upsert(
    {
      user_id: client.userId,
      draft: normalizeDraftCourseMetadata(draft),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw error;
  }
}

export async function clearActiveRoundDraft() {
  const client = await getDraftClient();

  if (!client) {
    return;
  }

  const { error } = await client.supabase
    .from("round_drafts")
    .delete()
    .eq("user_id", client.userId);

  if (error) {
    throw error;
  }
}
