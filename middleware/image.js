import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export async function optimizeImage(file, maxWidth = 1600) {
  const outputName = path.parse(file.filename).name + '.webp';
  const tempPath = path.join('uploads', '_tmp_' + outputName);
  const finalPath = path.join('uploads', outputName);

  await sharp(file.path)
    .resize(maxWidth, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(tempPath);

  await fs.unlink(file.path);
  await fs.rename(tempPath, finalPath);

  return '/uploads/' + outputName;
}
