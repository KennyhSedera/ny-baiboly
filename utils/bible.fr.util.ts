
import rawBibleDataFr from '@/assets/json/fr_apee.json';
import { bookBible, verseBible } from '@/types/bible';
import { bibleFr, chapter } from '@/types/bible.fr.typr';
import { capitalizeText } from '@/utils/text.util';
import { books } from './bible.util';

export const bibleFrParsed = rawBibleDataFr as bibleFr;

export const bookFr: bookBible[] = bibleFrParsed.bible.map((b, i) => {
  return ({
    book_color: books[i].book_color,
    book_number: books[i].book_number,
    short_name: capitalizeText(b.abbrev),
    long_name: b.name
  });
});


const getVerses = (
  chapters: chapter[],
  book_number: number
): verseBible[] => {
  return chapters.flatMap((chapterVerses, chapterIndex) =>
    chapterVerses.map((text, verseIndex) => ({
      book_number,
      chapter: chapterIndex + 1,
      verse: verseIndex + 1,
      text,
    }))
  );
};

export const versesFr: verseBible[] = bibleFrParsed.bible.flatMap((b, i) => {
  const book_number = books[i].book_number;
  return getVerses(b.chapters, book_number);
});


export const oldTestamentFr = bookFr.filter((book) => book.book_number < 470);

export const newTestamentFr = bookFr.filter((book) => book.book_number >= 470);