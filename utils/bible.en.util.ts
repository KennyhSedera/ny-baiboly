
import rawBibleDataEn from '@/assets/json/en_bbe.json';
import { bookBible, verseBible } from '@/types/bible';
import { bibleFr, chapter } from '@/types/bible.fr.typr';
import { capitalizeText } from '@/utils/text.util';
import { books } from './bible.util';

export const bibleEnParsed = rawBibleDataEn as bibleFr;

export const bookEn: bookBible[] = bibleEnParsed.bible.map((b, i) => {
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

export const versesEn: verseBible[] = bibleEnParsed.bible.flatMap((b, i) => {
  const book_number = books[i].book_number;
  return getVerses(b.chapters, book_number);
});


export const oldTestamentEn = bookEn.filter((book) => book.book_number < 470);

export const newTestamentEn = bookEn.filter((book) => book.book_number >= 470);