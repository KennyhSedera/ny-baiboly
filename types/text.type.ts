export type Language = "mg" | "fr" | "en";

export type Theme = "dark" | "light" | "system";

export type ThemeIcon = "moon" | "sunny" | "phone-portrait-outline";

export type TextAlign = "left" | "center" | "right" | "justify" | "auto";

export interface Translation {
  infoText: string;

  selectText: string;

  theme: {
    title: string;
    data: {
      value: Theme;
      title: string;
      icon: ThemeIcon;
    }[];
  };

  langue: {
    title: string;
    titleApp: string;
    data: {
      value: Language;
      title: string;
      flag: string;
    }[];
  };

  color: {
    title: string;
    bold: string;
  };

  settingRead: {
    title: string;
    fontSize: string;
    textAlign: string;
    header: string;
    bible: {
      book: string;
      chapter: string;
      verse: string;
    };
    buttonText: string;
  };

  searchResult: {
    noValue: string;
    empty: string;
    result: string;
    results: string;
  };

  // Général
  showAllText: string;
  searchText: string;
  settingText: string;
  bibleText: string;
  noteText: string;
  image: string;
  buttonRead: string;

  // Testament
  oldTest: string;
  newTest: string;

  // Navigation
  homeText: string;
  backText: string;
  nextText: string;
  previousText: string;
  closeText: string;
  doneText: string;

  // Actions
  saveText: string;
  cancelText: string;
  deleteText: string;
  editText: string;
  updateText: string;
  addText: string;
  confirmText: string;
  yesText: string;
  noText: string;

  // Bible
  bookText: string;
  chapterText: string;
  verseText: string;
  chaptersText: string;
  versesText: string;
  readText: string;
  continueReadingText: string;

  // Recherche
  searchBibleText: string;
  searchInBibleText: string;
  clearSearchText: string;
  noSearchResultText: string;

  // Notes
  notesText: string;
  addNoteText: string;
  editNoteText: string;
  deleteNoteText: string;
  noteTitleText: string;
  noteContentText: string;
  noteEmptyText: string;

  // Favoris
  favoriteText: string;
  favoritesText: string;
  addFavoriteText: string;
  removeFavoriteText: string;
  noFavoriteText: string;

  // Historique
  historyText: string;
  readingHistoryText: string;
  clearHistoryText: string;
  noHistoryText: string;

  // Archives
  archiveText: string;
  archivesText: string;
  addArchiveText: string;
  removeArchiveText: string;
  noArchiveText: string;

  // Partage / copie
  shareText: string;
  copyText: string;
  copiedText: string;
  shareVerseText: string;
  shareChapterText: string;

  // Surlignage
  highlightText: string;
  removeHighlightText: string;
  highlightsText: string;
  noHighlightText: string;

  // Affichage
  showText: string;
  hideText: string;
  showMoreText: string;
  showLessText: string;

  // Messages
  successText: string;
  errorText: string;
  warningText: string;
  loadingText: string;

  // Confirmation
  confirmDeleteText: string;
  confirmRemoveText: string;
}