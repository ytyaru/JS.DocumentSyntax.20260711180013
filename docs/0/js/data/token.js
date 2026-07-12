import {AffixData} from './affix.js';

/** 
 * 全てのTokenが共通して持つ、位置の範囲にのみ責任を持つフラットなデータ構造
 */
export interface BaseToken {
    type: string;
    start: number;
    end: number;
}

// ----------------------------------------------------------------------------
// 各種別ごとに、「 BaseToken ＋ 固有データ 」を1つの平坦なオブジェクトに結合する
// ----------------------------------------------------------------------------

/** 1. フェンス専用Token：BaseToken と 固有データをフラットに結合 */
export type FenceToken = BaseToken & {
    kind: 'fence'; // リテラル型で、このオブジェクトのkindは確実に 'fence' であると決定
    enclosure: {// 囲い
        char: string;
        num: number;
    };
    affix: AffixData;
    content: {
        start: number;
        end: number;
    };
};

/** 2. ブロック専用Token */
export type BlockToken = BaseToken & {
    kind: 'block';
};

/** 3. ブランク専用Token */
export type BlankToken = BaseToken & {
    kind: 'blank';
    count: number;
};

/** 4. インライン専用Token */
export type InlineToken = BaseToken & {
    kind: 'inline';
};

/** 
 * 結論：最上位ループが扱う「Token」の最終形態
 * これにより、どのTokenも裏に隠しプロパティを持たない、
 * メモリ上でも構造上でも「完全に1階層の平坦なオブジェクト」であることが保証されます。
 */
export type Token = FenceToken | BlockToken | BlankToken | InlineToken;
