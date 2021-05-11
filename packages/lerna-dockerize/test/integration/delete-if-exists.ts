import { promises, existsSync } from 'fs';
import { isAbsolute, join } from 'path';

export async function deleteIfExists(path: string): Promise<void> {
    if (!isAbsolute(path)) {
        path = join(__dirname, path);
    }
    if (!existsSync(path)) {
        return;
    }
    await promises.unlink(path);
}
