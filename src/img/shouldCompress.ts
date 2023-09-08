import config from '@/config/settings';
import { Request } from 'express';

const MIN_COMPRESS_LENGTH = config.minCompressLength;
const MIN_TRANSPARENT_COMPRESS_LENGTH = MIN_COMPRESS_LENGTH * 100;

function shouldCompress(req: Request): boolean {
  const { originType, originSize, webp } = req.params;

  if (!originType.startsWith('image')) return false;
  if (Number(originSize) === 0) return false;
  if (webp && Number(originSize) < MIN_COMPRESS_LENGTH) return false;
  if (
    !webp &&
    (originType.endsWith('png') || originType.endsWith('gif')) &&
    Number(originSize) < MIN_TRANSPARENT_COMPRESS_LENGTH
  ) {
    return false;
  }

  return true;
}

export { shouldCompress };
