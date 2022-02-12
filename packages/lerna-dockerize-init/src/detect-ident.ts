export function detectIdent(text: string): number {
    let result: number | undefined;
    for (let line of text.split('\n')) {
        let startingSpaces = 0;
        for (let i = 0; i < line.length; i++) {
            if (line.charAt(i) !== ' ') {
                break;
            }
            startingSpaces++;
        }
        if (startingSpaces > 0 && (!result || startingSpaces < result)) {
            result = startingSpaces;
        }
    }
    return result ?? 4;
}
