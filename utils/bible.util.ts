import rawBibleData from '@/assets/json/bibleJson.json';
import { bookBible, DataBible, readingVersesBible, verseBible, versesBible } from "../types/bible";
import { adjustColor } from './color.util';

const parsedData = rawBibleData as DataBible;

export const books = parsedData.books.map((book) => ({ ...book, book_color: adjustColor(book.book_color, -30) })) as bookBible[];
export const verses = parsedData.verses as verseBible[];

export const groupVerseByBook = (bookLng: bookBible[], verses: verseBible[]) => {

  const book = bookLng.map((verse) => ({
    ...verse,
    verses: verses.filter((book) => book.book_number === verse.book_number),
  }));

  return book;
};

export const getChapterByBookId = (bookId: number, verseLng: verseBible[]) => {

  const chapters = [...new Set(
    verseLng
      .filter((book) => book.book_number === bookId)
      .map((book) => book.chapter)
  )].sort((a, b) => a - b);

  return chapters;
}

export const getVerseNumberByChapterId = (bookId: number, chapterId: number, bookLng: bookBible[], verses: verseBible[]) => {

  const verse = groupVerseByBook(bookLng, verses)
    .filter((book) => book.book_number === bookId)[0]
    .verses.filter((verse) => verse.chapter === chapterId)
    .map((verse) => verse.verse)
    .sort((a, b) => a - b);

  return verse;
}

export const getVerseByChapterId = (bookId: number, chapterId: number, bookLng: bookBible[], verses: verseBible[]
): readingVersesBible => {
  const book = groupVerseByBook(bookLng, verses)
    .filter((book) => book.book_number === bookId)[0];
  const b = { book_number: book.book_number, short_name: book.short_name, long_name: book.long_name };

  const verse: versesBible[] = groupVerseByBook(bookLng, verses)
    .filter((book) => book.book_number === bookId)[0]
    .verses.filter((verse) => verse.chapter === chapterId)
    .map((verse) => ({ verse: verse.verse, text: verse.text }))
    .sort((a, b) => a.verse - b.verse);

  const reading = { book: b.long_name, chapter: chapterId, verses: verse };
  return reading;
}

export const getVerseBetweenTwoVerseId = (
  bookId: number,
  chapterId: number,
  startVerse: number,
  verseLng: verseBible[],
  bookLng?: bookBible[],
  endVerse?: number,
): readingVersesBible => {
  const book = groupVerseByBook(bookLng ? bookLng : books, verseLng).find((b) => b.book_number === bookId);

  if (!book) {
    throw new Error(`Book with id ${bookId} not found`);
  }

  const end = endVerse ?? startVerse;

  const verses: versesBible[] = book.verses
    .filter((verse) => verse.chapter === chapterId)
    .filter((verse) => verse.verse >= startVerse && verse.verse <= end)
    .map((verse) => ({ verse: verse.verse, text: verse.text, book_number: verse.book_number }))
    .sort((a, b) => a.verse - b.verse);

  return {
    book: book.long_name,
    chapter: chapterId,
    verses,
  };
};

export const lastTestament = books.filter((book) => book.book_number < 470);

export const newTestament = books.filter((book) => book.book_number >= 470);

export const getBookById = (bookId: number, bookLng: bookBible[]) => bookLng.find((book) => book.book_number === bookId);

export const info = parsedData.info;

export const getPrevAndNextChapter = (bookId: number, chapterId: number, bookLng: bookBible[], verses: verseBible[]) => {
  const books = groupVerseByBook(bookLng, verses).sort((a, b) => a.book_number - b.book_number);
  const bookIndex = books.findIndex((book) => book.book_number === bookId);

  if (bookIndex === -1) {
    return { prevBookId: undefined, prevChapter: undefined, nextBookId: undefined, nextChapter: undefined };
  }

  const currentBook = books[bookIndex];
  const chapters = [...new Set(currentBook.verses.map((v) => v.chapter))].sort((a, b) => a - b);
  const maxChapter = chapters[chapters.length - 1];

  let prevBookId: number | undefined;
  let prevChapter: number | undefined;
  let nextBookId: number | undefined;
  let nextChapter: number | undefined;

  if (chapterId > 1) {
    prevBookId = bookId;
    prevChapter = chapterId - 1;
  } else if (bookIndex > 0) {
    const prevBook = books[bookIndex - 1];
    const prevChapters = [...new Set(prevBook.verses.map((v) => v.chapter))];
    prevBookId = prevBook.book_number;
    prevChapter = Math.max(...prevChapters);
  }

  if (chapterId < maxChapter) {
    nextBookId = bookId;
    nextChapter = chapterId + 1;
  } else if (bookIndex < books.length - 1) {
    const nextBook = books[bookIndex + 1];
    nextBookId = nextBook.book_number;
    nextChapter = 1;
  }

  const prevBook = books.find((b) => b.book_number === prevBookId) || currentBook;
  const nextBook = books.find((b) => b.book_number === nextBookId) || currentBook;
  const bookCurrent = books.find((b) => b.book_number === bookId) || currentBook;

  const prev = prevBook ? { bookName: prevBook.short_name, chapter: prevChapter } : { bookName: bookCurrent.short_name, chapter: prevChapter };
  const next = nextBook ? { bookName: nextBook.short_name, chapter: nextChapter } : { bookName: bookCurrent.short_name, chapter: nextChapter };

  return { prevBookId, prevChapter, nextBookId, nextChapter, prev, next };
};

export const getOneVerse = (
  dataLng: verseBible[],
  bookLng: bookBible[]
) => {
  if (!dataLng.length) {
    return {
      book: '',
      book_number: 0,
      chapter: 0,
      verse: 0,
      text: '',
    };
  }

  const today = new Date();

  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const randomSeed = Math.sin(seed) * 10000;
  const random = randomSeed - Math.floor(randomSeed);

  const index = Math.floor(random * dataLng.length);

  const verse = dataLng[index];

  const book = verse
    ? getBookById(verse.book_number, bookLng)
    : undefined;

  return {
    book: book?.long_name ?? '',
    book_number: verse?.book_number ?? 0,
    chapter: verse?.chapter ?? 0,
    verse: verse?.verse ?? 0,
    text: verse ? removeNTag(verse.text) : '',
  };
};

export const getSearch = (text: string, verse: verseBible[] = parsedData.verses, bookLng: bookBible[]) => {
  const search = text.toLowerCase();

  const dataVerse = verse.map((verse) => ({
    book: getBookById(verse.book_number, bookLng)?.long_name,
    book_number: verse.book_number,
    chapter: verse.chapter,
    verse: verse.verse,
    text: removeNTag(verse.text),
  }));

  const data = dataVerse.filter((verse) =>
    verse.text.toLowerCase().includes(search) ||
    verse.book?.toLowerCase().includes(search) ||
    (verse.book + ' ' + verse.chapter.toString() + ':' + verse.verse.toString()).toLowerCase().includes(search) ||
    (verse.book + ' toko ' + verse.chapter.toString()).toLowerCase().includes(search) ||
    (verse.book + ' toko voalohany ' + verse.chapter.toString()).toLowerCase().includes(search) ||
    (verse.book + ' toko faha ' + verse.chapter.toString()).toLowerCase().includes(search) ||
    (verse.book + ' toko voalohany ' + verse.chapter.toString() + 'andininy voalohany ' + verse.verse.toString()).toLowerCase().includes(search) ||
    (verse.book + ' toko voalohany ' + verse.chapter.toString() + 'andininy faha ' + verse.verse.toString()).toLowerCase().includes(search) ||
    (verse.book + ' toko faha ' + verse.chapter.toString() + 'andininy faha ' + verse.verse.toString()).toLowerCase().includes(search) ||
    (verse.book + ' ' + verse.chapter.toString() + ' ' + verse.verse.toString()).toLowerCase().includes(search) ||
    (verse.book + ' ' + verse.chapter.toString() + ':' + verse.verse.toString()).toLowerCase().includes(search) ||
    (verse.book + ' ' + verse.chapter.toString()).toLowerCase().includes(search)
  )
    .sort((a, b) => a.book_number - b.book_number).slice(0, 20);

  const result = data.map((verse) => ({
    ...verse,
    text: wrapTextAroundWord(verse.text, search, 5),
  }));

  return result;
}

export function removeNTag(text: string): string {
  return text.replace(/<n>\{.*?\}<\/n>\s*/g, "").trim();
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Extrait un aperçu du texte autour d'un mot/expression recherché,
 * avec "..." si le texte est tronqué avant/après.
 *
 * @param text Le texte complet
 * @param searchTerm Le mot ou l'expression à chercher (insensible à la casse)
 * @param wordsAround Nombre de mots à garder avant/après le terme trouvé
 */
export function wrapTextAroundWord(
  text: string,
  searchTerm: string,
  wordsAround: number = 5
): string {
  if (!searchTerm.trim()) return text;

  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerTerm);

  if (matchIndex === -1) return text;

  const words = text.split(/\s+/);
  let charCount = 0;
  let matchWordIndex = -1;

  for (let i = 0; i < words.length; i++) {
    const wordStart = charCount;
    const wordEnd = wordStart + words[i].length;

    if (matchIndex >= wordStart && matchIndex < wordEnd + 1) {
      matchWordIndex = i;
      break;
    }
    charCount = wordEnd + 1;
  }

  if (matchWordIndex === -1) return text;

  const start = Math.max(0, matchWordIndex - wordsAround);
  const end = Math.min(words.length, matchWordIndex + wordsAround + 1);

  const snippet = words.slice(start, end).join(' ');
  const prefix = start > 0 ? '... ' : '';
  const suffix = end < words.length ? ' ...' : '';

  return `${prefix}${snippet}${suffix}`;
}

// utilitaire à ajouter dans bible.util ou text.util
export function versesToRangeString(verseNumbers: number[]): string {
  const sorted = [...new Set(verseNumbers)].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = sorted[i];
    }
  }
  return ranges.join(',');
}