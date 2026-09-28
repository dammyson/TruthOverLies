import request from './client';
import {SermonNote} from '../types/app';

type RawSermonNote = {
  id: number;
  title: string;
  sermon_date: string;
  body: string;
  created_at: string;
  updated_at: string;
};

function toSermonNote(raw: RawSermonNote): SermonNote {
  return {
    id: raw.id,
    title: raw.title,
    sermonDate: raw.sermon_date,
    body: raw.body,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export type CreateSermonNoteParams = {
  title: string;
  sermonDate: string;
  body: string;
};

export type UpdateSermonNoteParams = Partial<CreateSermonNoteParams>;

export async function listSermonNotes(token: string): Promise<SermonNote[]> {
  const raw = await request<RawSermonNote[]>('/sermon-notes', {}, token);
  console.log('[SermonNotes] GET /sermon-notes response:', JSON.stringify(raw, null, 2));
  return raw.map(toSermonNote);
}

export async function getSermonNote(token: string, id: number): Promise<SermonNote> {
  const raw = await request<RawSermonNote>(`/sermon-notes/${id}`, {}, token);
  return toSermonNote(raw);
}

export async function createSermonNote(token: string, params: CreateSermonNoteParams): Promise<SermonNote> {
  const payload = {
    title: params.title,
    sermon_date: params.sermonDate,
    body: params.body,
  };
  console.log('[SermonNotes] POST /sermon-notes payload:', JSON.stringify(payload, null, 2));
  const raw = await request<RawSermonNote>(
    '/sermon-notes',
    {method: 'POST', body: JSON.stringify(payload)},
    token,
  );
  console.log('[SermonNotes] POST /sermon-notes response:', JSON.stringify(raw, null, 2));
  return toSermonNote(raw);
}

export async function updateSermonNote(token: string, id: number, params: UpdateSermonNoteParams): Promise<SermonNote> {
  const payload = {
    title: params.title,
    sermon_date: params.sermonDate,
    body: params.body,
  };
  console.log(`[SermonNotes] PATCH /sermon-notes/${id} payload:`, JSON.stringify(payload, null, 2));
  const raw = await request<RawSermonNote>(
    `/sermon-notes/${id}`,
    {method: 'PATCH', body: JSON.stringify(payload)},
    token,
  );
  console.log(`[SermonNotes] PATCH /sermon-notes/${id} response:`, JSON.stringify(raw, null, 2));
  return toSermonNote(raw);
}

export async function deleteSermonNote(token: string, id: number): Promise<void> {
  await request<void>(`/sermon-notes/${id}`, {method: 'DELETE'}, token);
}
