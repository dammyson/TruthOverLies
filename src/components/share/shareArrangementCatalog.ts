export type ShareArrangementId =
  | 'classic'
  | 'side-accent'
  | 'bold-center'
  | 'framed';

export type ShareArrangementOption = {
  id: ShareArrangementId;
  label: string;
  /** Short hint shown under the picker label. */
  hint: string;
};

/** Content layout styles — independent from background visuals. */
export const SHARE_ARRANGEMENTS: ShareArrangementOption[] = [
  {
    id: 'classic',
    label: 'Classic',
    hint: 'Badge on top, verse centered',
  },
  {
    id: 'side-accent',
    label: 'Editorial',
    hint: 'Side accent bar, clean columns',
  },
  {
    id: 'bold-center',
    label: 'Bold',
    hint: 'Large centered verse',
  },
  {
    id: 'framed',
    label: 'Framed',
    hint: 'Elegant double border',
  },
];

export function getShareArrangement(id: string): ShareArrangementOption {
  return SHARE_ARRANGEMENTS.find(a => a.id === id) ?? SHARE_ARRANGEMENTS[0];
}

export function isValidArrangementId(id: string): boolean {
  return SHARE_ARRANGEMENTS.some(a => a.id === id);
}
