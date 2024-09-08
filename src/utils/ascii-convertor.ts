export const ASCII_CHAR_SETS = {
    standard: ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'],
    simple: ['@', '#', '+', '.'],
    complex: ['$', '@', 'B', '%', '8', '&', 'W', 'M', '#', '*', 'o', 'a', 'h', 'k', 'b', 'd', 'p', 'q', 'w', 'm', 'Z', 'O', '0', 'Q', 'L', 'C', 'J', 'U', 'Y', 'X', 'z', 'c', 'v', 'u', 'n', 'x', 'r', 'j', 'f', 't', '/', '\\', '|', '(', ')', '1', '{', '}', '[', ']', '?', '-', '_', '+', '~', '<', '>', 'i', '!', 'l', 'I', ';', ':', ',', '"', '^', '`', '\'', '.']
};

export type CharSet = keyof typeof ASCII_CHAR_SETS;

export function convertToAscii(imageData: ImageData, outputWidth: number, outputHeight: number, charSet: CharSet): string {
    const asciiChars = ASCII_CHAR_SETS[charSet];
    let asciiImage = '';
    const cellWidth = imageData.width / outputWidth;
    const cellHeight = imageData.height / outputHeight;

    for (let y = 0; y < outputHeight; y++) {
        for (let x = 0; x < outputWidth; x++) {
            const pixelX = Math.floor(x * cellWidth);
            const pixelY = Math.floor(y * cellHeight);
            const offset = (pixelY * imageData.width + pixelX) * 4;
            const r = imageData.data[offset];
            const g = imageData.data[offset + 1];
            const b = imageData.data[offset + 2];
            const brightness = (r + g + b) / 3;
            const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
            asciiImage += asciiChars[charIndex];
        }
        asciiImage += '\n';
    }
    return asciiImage;
}