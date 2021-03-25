import { Locale } from ".";
export declare function getNumberFromPixel(pixel: string): number;
export declare function compute(originText: string, maxWidth: number, maxHeight: number, lineHeight: number, locales: Locale, controlled: boolean): {
    computed: boolean;
    text: string;
};
