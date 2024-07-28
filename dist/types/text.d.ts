export declare const cdu_chars: Record<string, number>;
export type modifier = 'inverted' | 'big';
export declare const modifiers: Record<modifier, number>;
export type CduCharMap = Record<string | number, number>;
export declare const defaultCharacterMap: CduCharMap;
export declare const map_chars: (str: string, mapper: CduCharMap) => number[];
