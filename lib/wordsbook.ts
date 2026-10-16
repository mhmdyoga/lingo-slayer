import { VOCAB } from "./vocab";

export type WordStats = {correct: number, incorrect: number, last: number}
export type WordBook = Record<string, WordStats>;

const KEY = "blejar-wordbook"

export function loadBook(): WordBook {
    try {
        const raw = localStorage.getItem(KEY)
        return raw ? (JSON.parse(raw) as WordBook) : {}
    } catch {
        return {}
    }
}

export function RecordWord(en: string, right: boolean): WordBook {
    const book = loadBook();
    // chcek apakah katanya benar
    if(!VOCAB.some((v) => v.en === en)) return book;
    
    const curr = book[en] ?? {correct: 0, incorrect: 0, last: 0};
    book[en] = {
        correct: curr.correct + (right ? 1 : 0),
        incorrect: curr.incorrect + (right ? 0 : 1),
        last: Date.now()
    }

    try {
        localStorage.setItem(KEY, JSON.stringify(book))
    } catch{}

    return book;
}

// kumpulan kata yang benar meskipun 1 kali
export function isCollected(s?: WordStats): boolean {
    return !!s && s.correct > 0
}

// ini func medal kita kalau benar lebih dari 5 itu gold kalau lebih dari 3 atau 4 itu perunggu kalau benar 1 atau 2 itu coklat medal lah intinya
export function medalOf(s?: WordStats): 0 | 1 | 2 | 3 {
    const r = s?.correct ?? 0
    return r >= 5 ? 3 : r >= 3 ? 2 : r >= 1 ? 1 : 0; 
}

export function isWeak(s?: WordStats): boolean {
    return !!s && s.incorrect > s.correct
}

