import { existsSync } from "fs";
import { mkdir, writeFile, unlink } from "fs/promises";
import { nanoid } from "nanoid";

export async function uploadImage(folder: string, image: File) {
  if (!existsSync(folder)) {
    await mkdir(folder, { recursive: true });
  }
  const filename = nanoid();
  const imagePath = `${folder}/${filename}`;
  await writeFile(imagePath, Buffer.from(await image.arrayBuffer()));
  return filename;
}

export async function replaceImage(
  folder: string,
  oldImageFilename: string | undefined | null,
  newImage: File
) {
  if (oldImageFilename && existsSync(`${folder}/${oldImageFilename}`)) {
    await unlink(`${folder}/${oldImageFilename}`);
  }
  return await uploadImage(folder, newImage);
}
