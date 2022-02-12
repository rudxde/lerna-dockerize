import { detectIdent } from '../src/detect-ident';

describe('detect-ident', () => {
    it('should detect indent from json of 2', () => {
        const result = detectIdent(JSON.stringify({ a: 1, b: 2 }, undefined, 2));
        expect(result).toBe(2);
    });
    it('should detect indent from json of 4', () => {
        const result = detectIdent(JSON.stringify({ a: 1, b: 2 }, undefined, 4));
        expect(result).toBe(4);
    });
    it('should detect indent from json of 4 with trailing empty lines', () => {
        const result = detectIdent(JSON.stringify({ a: 1, b: 2 }, undefined, 4) + '\n\n\n');
        expect(result).toBe(4);
    });
});
