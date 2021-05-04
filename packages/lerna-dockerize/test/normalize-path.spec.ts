import 'jasmine';
import { normalizePath } from '../src/normalize-path';
import { loadOptions } from '../src/options';

describe('normalizePath', () => {

    beforeAll(async () => {
        await loadOptions([]);
    });

    it('should not change empty strings', () => {
        const input = '';
        expect(normalizePath(input)).toEqual(input);
    });
    it('should not change filenames without path slashes', () => {
        const input = 'document.pdf';
        expect(normalizePath(input)).toEqual(input);
    });
    it('should not change unix style paths', () => {
        const input = '/tmp/test/foo.bar';
        expect(normalizePath(input)).toEqual(input);
    });
    it('should replace backslashes to be unix like paths', () => {
        const input = '/tmp/test/foo.bar';
        expect(normalizePath(input)).toEqual(input);
    });
    it('should replace backslashes to be unix like paths', () => {
        const input = '.\\files\\test\\1.pdf';
        const expected = './files/test/1.pdf';
        expect(normalizePath(input)).toEqual(expected);
    });
    it('should replace backslashes in mixed style paths to be unix like paths', () => {
        const input = './files/test\\1.pdf';
        const expected = './files/test/1.pdf';
        expect(normalizePath(input)).toEqual(expected);
    });
});
