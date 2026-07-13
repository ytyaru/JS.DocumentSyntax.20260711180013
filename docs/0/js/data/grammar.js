import {Token} from './token.js';
import {AstNode} from './node.js';
import {TokenizeContext, LexContext} from './context.js';

// ============================================================================
// 5. 文法拡張用オブジェクト (Grammar Definition) の完全仕様
// ============================================================================
export interface BaseGrammarDefinition {
    type: string;
    tokenize(text: string, pos: number, context: TokenizeContext): Token | null;
    lex(token: Token, context: LexContext): AstNode;
}

/**
 * フェンス・ブロック完結直後に空行（Blank）が続いていた場合の処理戦略
 */
export type BlankStrategy = 
    | 'keep'    // 1. そのまま保持（Web小説の演出改行）。直後の空行を独立したBlankノードとしてそのまま出力する。
    | 'ignore'  // 2. 無視・削除（設定フェンスや見出し用）。意味のない空白なので、直後の空行を完全に虚空に消し去る。
    | 'suppress'// 3. ページ分割用（先頭消去）。基本は表示するが、画面の「ページ先頭」に出現した時だけ自動で消去する。
    | 'collapse';// 4. 縮退（重複防止）。直前に別の大きな余白がある場合、空行を1行分にキュッと縮める。

export type FenceGrammarDefinition = BaseGrammarDefinition & {
    kind: 'fence';
    /** フェンス完結直後に空行（Blank）が続いていた場合の処理戦略 */
    blankStrategy: BlankStrategy;
};

export type BlockGrammarDefinition = BaseGrammarDefinition & { kind: 'block' };
export type BlankGrammarDefinition = BaseGrammarDefinition & { kind: 'blank' };
export type InlineGrammarDefinition = BaseGrammarDefinition & { kind: 'inline' };

/** ユーザーが options に登録する文法定義の全配列の型 */
export type GrammarDefinition = 
    | FenceGrammarDefinition 
    | BlockGrammarDefinition 
    | BlankGrammarDefinition 
    | InlineGrammarDefinition;

