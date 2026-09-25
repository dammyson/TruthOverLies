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
  return raw.map(toSermonNote);
}

export async function getSermonNote(token: string, id: number): Promise<SermonNote> {
  const raw = await request<RawSermonNote>(`/sermon-notes/${id}`, {}, token);
  return toSermonNote(raw);
}

export async function createSermonNote(token: string, params: CreateSermonNoteParams): Promise<SermonNote> {
  const raw = await request<RawSermonNote>(
    '/sermon-notes',
    {
      method: 'POST',
      body: JSON.stringify({
        title: params.title,
        sermon_date: params.sermonDate,
        body: params.body,
      }),
    },
    token,
  );
  return toSermonNote(raw);
}

export async function updateSermonNote(token: string, id: number, params: UpdateSermonNoteParams): Promise<SermonNote> {
  const raw = await request<RawSermonNote>(
    `/sermon-notes/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        title: params.title,
        sermon_date: params.sermonDate,
        body: params.body,
      }),
    },
    token,
  );
  return toSermonNote(raw);
}

export async function deleteSermonNote(token: string, id: number): Promise<void> {
  await request<void>(`/sermon-notes/${id}`, {method: 'DELETE'}, token);
}
