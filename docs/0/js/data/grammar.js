import {Token} from './token.js';
import {AstNode} from './node.js';

// ============================================================================
// 5. 文法拡張用オブジェクト (Grammar Definition) の完全仕様
// ============================================================================
export interface BaseGrammarDefinition {
    type: string;
    tokenize(text: string, pos: number, context: TokenizeContext): Token | null;
    lex(token: Token, context: LexContext): AstNode;
}

export type BlankStrategy = 'keep' | 'consume' | 'merge';

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

