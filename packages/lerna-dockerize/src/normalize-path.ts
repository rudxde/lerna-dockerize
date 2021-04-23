// returns path with the unix notation
export function normalizePath(path: string): string {
    return path.replace(/\\/gm, '/');
}
