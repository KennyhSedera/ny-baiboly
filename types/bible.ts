export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Book {
  nr: number;
  name: string;
  nameMg?: string;
  chapters: Chapter[];
}

export interface BibleData {
  translation: string;
  abbreviation: string;
  lang: string;
  direction: string;
  books: Book[];
  distribution_about: string;
  distribution_version: string;
  distribution_source: string;
  distribution_versification: string;
  distribution_license: string;
  distribution_version_date: string;
  distribution_history: {
    [key: string]: string;
  };
}

export type ViewMode = 'books' | 'chapters' | 'verses' | 'verseRange' | 'verse' | 'verseNumbers';

const malagasyBookNames: Record<string, string> = {
  // Ancien Testament (Testamenta Taloha)
  Genesis: 'Genesisy',
  Exodus: 'Eksodosy',
  Leviticus: 'Levitikosy',
  Numbers: 'Nomery',
  Deuteronomy: 'Deotornomia',
  Joshua: 'Josoa',
  Judges: 'Mpitsara',
  Ruth: 'Rota',
  '1 Samuel': 'I Samoela',
  '2 Samuel': 'II Samoela',
  '1 Kings': 'I Mpanjaka',
  '2 Kings': 'II Mpanjaka',
  '1 Chronicles': 'I Tantara',
  '2 Chronicles': 'II Tantara',
  Ezra: 'Ezra',
  Nehemiah: 'Nehemia',
  Esther: 'Estera',
  Job: 'Joba',
  Psalms: 'Salamo',
  Proverbs: 'Ohabolana',
  Ecclesiastes: 'Mpitoriteny',
  'Song of Solomon': "Tonon-kiran'i Solomona",
  'Song of Songs': "Tonon-kiran'i Solomona",
  Isaiah: 'Isaia',
  Jeremiah: 'Jeremia',
  Lamentations: 'Fitomaniana',
  Ezekiel: 'Ezekiela',
  Daniel: 'Daniela',
  Hosea: 'Hosea',
  Joel: 'Joela',
  Amos: 'Amosa',
  Obadiah: 'Obadia',
  Jonah: 'Jona',
  Micah: 'Mika',
  Nahum: 'Nahoma',
  Habakkuk: 'Habakoka',
  Zephaniah: 'Zefania',
  Haggai: 'Hagay',
  Zechariah: 'Zakaria',
  Malachi: 'Malakia',

  // Nouveau Testament (Testamenta Vaovao)
  Matthew: 'Matio',
  Mark: 'Marka',
  Luke: 'Lioka',
  John: 'Jaona',
  Acts: "Asan'ny Apostoly",
  Romans: 'Romana',
  '1 Corinthians': 'I Korintiana',
  '2 Corinthians': 'II Korintiana',
  Galatians: 'Galatiana',
  Ephesians: 'Efesiana',
  Philippians: 'Filipiana',
  Colossians: 'Kolosiana',
  '1 Thessalonians': 'I Tessaloniana',
  '2 Thessalonians': 'II Tessaloniana',
  '1 Timothy': 'I Timoty',
  '2 Timothy': 'II Timoty',
  Titus: 'Titosy',
  Philemon: 'Filemona',
  Hebrews: 'Hebreo',
  James: 'Jakoba',
  '1 Peter': 'I Petera',
  '2 Peter': 'II Petera',
  '1 John': 'I Jaona',
  '2 John': 'II Jaona',
  '3 John': 'III Jaona',
  Jude: 'Joda',
  'Revelation of John': 'Apokalypsy',
  Revelation: 'Apokalypsy',
};

// Fonction utilitaire pour récupérer le nom malgache
export const getMalagasyName = (originalName: string): string => {
  return malagasyBookNames[originalName] || originalName;
};

export interface DataBible {
  info: infoBible;
  books: bookBible[];
  verses: verseBible[]
}


export interface infoBible {
  description: string,
  chapter_string: string,
  language: string,
  russian_numbering: boolean,
  strong_numbers: boolean,
  right_to_left: boolean,
  chapter_string_ps: string,
  distribution_version: string,
  distribution_version_date: string,
  distribution_about: string,
}

export interface verseBible {
  book_number: number,
  chapter: number,
  verse: number,
  text: string
}

export interface bookBible {
  book_color: string,
  book_number: number,
  short_name: string,
  long_name: string
}

export interface versesBible {
  verse: number,
  text: string,
  book_number?: number
}

export interface readingVersesBible {
  book: string,
  chapter: number,
  verses: versesBible[]
}

export interface verseRandom {
  book: string;
  book_number: number;
  chapter: number;
  verse: number;
  text: string;
}