import { promises as fs } from 'fs';
import * as path from 'path';

export async function createFolder(folderPath: string): Promise<void> {
  try {
    const newFolderPath = path.join(__dirname, folderPath);
    await fs.mkdir(newFolderPath, { recursive: true });
    console.log(`Folder created at: ${newFolderPath}`);
  } catch (error) {
    console.error(`Failed to create folder: ${error}`);
  }
}

export async function saveToFile(dir: string, fileName: string, data: string): Promise<void> {
  try {
    const fullDirPath = path.join(__dirname, dir);
    const filePath = path.join(fullDirPath, fileName);

    // Ensure the directory exists
    await fs.mkdir(fullDirPath, { recursive: true });

    // Now write the file
    await fs.writeFile(filePath, data, 'utf-8');
    console.log(`JSON saved to: ${filePath}`);
  } catch (error) {
    console.error(`Failed to save JSON: ${error}`);
  }
}
