import {Token} from './token.js';
import {AstNode} from './node.js';

// ============================================================================
// 6. Contextインターフェース
// ============================================================================
export interface TokenizeContext {
    makeToken(start: number, end: number): Token;
}

export interface LexContext {
    makeNode(token: Token, data: Record<string, any>, props: Record<string, any>): AstNode;
    getRawText(start: number, end: number): string;
    parseFence(text: string, options?: { parentMarkerCount?: number; exclude?: string[] }): AstNode[];
    parseBlock(text: string, options?: { exclude?: string[] }): AstNode[];
    parseBlank(text: string, options?: { exclude?: string[] }): AstNode[];
    parseInline(text: string, options?: { exclude?: string[] }): AstNode[];
}

