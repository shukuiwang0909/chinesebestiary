import { existsSync } from 'node:fs';

const IMAGE_EXTS = ['jpg', 'png', 'gif', 'webp'];

export function getCreatureImage(id: string): string | null {
  const ext = IMAGE_EXTS.find(e =>
    existsSync(new URL(`../../public/images/creatures/${id}.${e}`, import.meta.url))
  );
  return ext ? `/images/creatures/${id}.${ext}` : null;
}
