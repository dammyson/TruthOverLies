import request from './client';
import {Journal} from '../types/app';

type RawJournal = {
  id: number;
  entry_text: string;
  feeling_id: number | null;
  struggle: string | null;
  saved_scripture_id: number | null;
  created_at: string;
};

function toJournal(r: RawJournal): Journal {
  return {
    id: r.id,
    entryText: r.entry_text,
    feelingId: r.feeling_id,
    struggle: r.struggle,
    savedScriptureId: r.saved_scripture_id,
    createdAt: r.created_at,
  };
}

export type CreateJournalParams = {
  entryText: string;
  feelingId?: number;
  struggle?: string;
  savedScriptureId?: number;
};

export type UpdateJournalParams = Partial<CreateJournalParams>;

export async function listJournals(token: string): Promise<Journal[]> {
  const raw = await request<RawJournal[]>('/journals', {}, token);
  return raw.map(toJournal);
}

export async function createJournal(
  token: string,
  params: CreateJournalParams,
): Promise<Journal> {
  const raw = await request<RawJournal>(
    '/journals',
    {
      method: 'POST',
      body: JSON.stringify({
        entry_text: params.entryText,
        feeling_id: params.feelingId,
        struggle: params.struggle ?? undefined,
        saved_scripture_id: params.savedScriptureId,
      }),
    },
    token,
  );
  return toJournal(raw);
}

export async function updateJournal(
  token: string,
  id: number,
  params: UpdateJournalParams,
): Promise<Journal> {
  const raw = await request<RawJournal>(
    `/journals/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        entry_text: params.entryText,
        feeling_id: params.feelingId,
        struggle: params.struggle,
        saved_scripture_id: params.savedScriptureId,
      }),
    },
    token,
  );
  return toJournal(raw);
}

export async function deleteJournal(token: string, id: number): Promise<void> {
  await request<void>(`/journals/${id}`, {method: 'DELETE'}, token);
}
