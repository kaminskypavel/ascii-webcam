import {expect, test} from "bun:test";
import {convertToAscii, ASCII_CHAR_SETS} from "./ascii-convertor";

test("convertToAscii converts a simple image to ASCII", () => {
    // Create a simple 2x2 image with varying brightness
    const imageData = {
        width: 2,
        height: 2,
        data: new Uint8ClampedArray([
            255, 255, 255, 255,  // White pixel
            128, 128, 128, 255,  // Gray pixel
            0, 0, 0, 255,        // Black pixel
            64, 64, 64, 255      // Dark gray pixel
        ])
    } as ImageData;

    const result = convertToAscii(imageData, 2, 2, 'standard');

    // Using the standard character set
    const expectedChars = ASCII_CHAR_SETS.standard;
    const expectedResult = `${expectedChars[expectedChars.length - 1]}${expectedChars[Math.floor(expectedChars.length / 2)]}\n${expectedChars[0]}${expectedChars[Math.floor(expectedChars.length / 4)]}\n`;

    expect(result).toBe(expectedResult);
});

test("convertToAscii handles different output dimensions", () => {
    // Create a 4x4 image with all white pixels
    const imageData = {
        width: 4,
        height: 4,
        data: new Uint8ClampedArray(4 * 4 * 4).fill(255)
    } as ImageData;

    const result = convertToAscii(imageData, 2, 2, 'standard');

    // The result should be a 2x2 ASCII image with the brightest character
    const expectedChar = ASCII_CHAR_SETS.standard[ASCII_CHAR_SETS.standard.length - 1];
    const expectedResult = `${expectedChar}${expectedChar}\n${expectedChar}${expectedChar}\n`;

    expect(result).toBe(expectedResult);
});