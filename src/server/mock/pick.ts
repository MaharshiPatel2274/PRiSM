let cadIdx = 0;
let cktIdx = 0;

export function pickCad(): number {
  cadIdx = (cadIdx + 1) % 7;
  return cadIdx;
}

export function pickCkt(): number {
  cktIdx = (cktIdx + 1) % 7;
  return cktIdx;
}