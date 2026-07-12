
// ============================================================================
// 1. Tokenオブジェクト (範囲の限定のみに責任を持つ不変データ)
// ============================================================================
/**
 * tokenize メソッドが切り出しに成功した際、必ず返却しなければならない定形データ構造。
 * 文字列の「物理的な範囲」を限定することだけを記録する。
 */
export interface Token {
    /** DocSynが物理的に管理する4つの要素種別（檻）: 'fence' | 'block' | 'blank' | 'inline' */
    kind: 'fence' | 'block' | 'blank' | 'inline';
    
    /** 呼び出し元のGrammarDefinition.typeと同じ詳細種別名 (例: 'heading', 'ruby') */
    type: string;
    
    /** 原稿テキスト内における、この文法の物理的な開始文字インデックス (pos) */
    start: number;
    
    /** この文法の物理的な終了文字インデックス（次の走査の開始位置） */
    end: number;
}

// ============================================================================
// 2. AstNodeオブジェクト (Tokenを内包し、構造と意味を拡張した完成ノード)
// ============================================================================
/**
 * lex メソッド、および DocSyn 全体が最終的に順次 yield する構文木ノード。
 * 位置情報は内包する token オブジェクトと100%メモリ共有されるため、
 * 10万字規模の長編であっても重複データによるメモリ圧迫が物理的に発生しない。
 */
export interface AstNode {
    /** 範囲情報を完全に共有・保持するための、元となった不変のTokenデータ */
    token: Token;
    
    /** 
     * 各文法が独自に解析・抽出して格納する、詳細な意味論データ、および原稿の完全復元用データ。
     * （例: ルビなら親文字・読み仮名のテキスト、｜の有無フラグ。フェンスなら引数文字列や記号の数など）
     */
    data: Record<string, any>;

    /** 
     * [オプショナル] ネストした子ノード（インライン要素の子供や、フェンス内のブロック等）の配列。
     * これを持つことで、単なる範囲データ（Token）から深さを持った構文木へと昇華する。
     */
    children?: AstNode[];
}

// ============================================================================
// 3. 文法拡張用オブジェクト (Grammar Definition)
// ============================================================================
export interface GrammarDefinition {
    kind: 'fence' | 'block' | 'blank' | 'inline';
    type: string;
    
    /** 【動詞: 字句解析】位置ポインタから自身の「範囲」だけをマークしてTokenを返す */
    tokenize(text: string, pos: number, context: TokenizeContext): Token | null;

    /** 【動詞: 構文解析】Tokenをそのまま受け取り、詳細データを解析(data)・ネスト(children)してNodeを返す */
    lex(token: Token, context: LexContext): AstNode;
}

// ============================================================================
// 4. Contextインターフェース (API入出力の極限のシンプル化)
// ============================================================================
export interface TokenizeContext {
    /** 物理的な範囲(start, end)だけを渡し、Tokenオブジェクトを安全に生成する */
    makeToken(start: number, end: number): Token;
}
export interface LexContext {
    /** 
     * 渡されたTokenをそのまま「持たせた」状態の、AstNodeの土台を生成する。
     * 内部実装的には、単に `{ token: token, data: {}, children: [] }` というオブジェクトを生成して返す。
     */
    makeNode(token: Token): AstNode;
    
    /** 
     * [原稿復元・解析用] startからendまでの部分テキストを、原稿全体から複製せずに軽量参照する
     */
    getRawText(start: number, end: number): string;
    
    // プラグイン側がパース能力を個別に引き出して手動制御するための再帰API群
    parseFence(text: string, options?: { parentMarkerCount?: number; exclude?: string[] }): AstNode[];
    parseBlock(text: string, options?: { exclude?: string[] }): AstNode[];
    parseBlank(text: string, options?: { exclude?: string[] }): AstNode[];
    parseInline(text: string, options?: { exclude?: string[] }): AstNode[];
}
