import { Language, Translation } from "@/types/text.type";

export const mg: Translation = {
  theme: {
    title: "Lohahevitra",
    data: [
      {
        value: "dark",
        title: "Maizina",
        icon: "moon",
      },
      {
        value: "light",
        title: "Mazava",
        icon: "sunny",
      },
      {
        value: "system",
        title: "Araka ny finday",
        icon: "phone-portrait",
      },
    ],
  },

  langue: {
    title: "Fitenin'ny Baiboly",
    titleApp: "Fiteny amin'ny ankapobeany",
    data: [
      { value: "mg", title: "Malagasy", flag: '🇲🇬' },
      { value: "fr", title: "Frantsay", flag: '🇫🇷' },
      { value: "en", title: "Anglisy", flag: '🇺🇸' },
    ],
  },

  color: {
    title: "Loko amin'ny ankapobeany",
    bold: "Soratra",
  },

  settingRead: {
    title: "Fikirakirana ny famakiana",
    fontSize: "Haben'ny soratra",
    textAlign: "Fandaminana ny soratra",
    header: "Endriky ny lohatenin'ny boky sy toko",
    bible: {
      book: "Boky",
      chapter: "Toko",
      verse: "Andininy",
    },
    buttonText: "Tehirizo ny fiovana",
  },

  searchResult: {
    noValue: "Tsy nahitana valiny mifandraika amin'ny",
    empty:
      "Atombohy ny fikarohana amin'ny fanoratana litera 3 farafahakeliny.",
    result: "valiny hita",
    results: "valiny hita",
  },

  // Général
  showAllText: "Asehoy manontolo",
  searchText: "Hikaroka",
  settingText: "Fikirakirana",
  bibleText: "Baiboly",
  noteText: "Ny naotiko",
  image: "Sary ambadika",
  buttonRead: "Vakiana",

  // Testament
  oldTest: "Testamenta Taloha",
  newTest: "Testamenta Vaovao",

  // Navigation
  homeText: "Fandraisana",
  backText: "Hiverina",
  nextText: "Manaraka",
  previousText: "Teo aloha",
  closeText: "Hidio",
  doneText: "Vita",

  // Actions
  saveText: "Tehirizo",
  cancelText: "Hanafoana",
  deleteText: "Fafao",
  editText: "Ovay",
  updateText: "Havaozy",
  addText: "Ampio",
  confirmText: "Hamafiso",
  yesText: "Eny",
  noText: "Tsia",

  // Bible
  bookText: "Boky",
  chapterText: "Toko",
  verseText: "Andininy",
  chaptersText: "Toko",
  versesText: "Andininy",
  readText: "Vakio",
  continueReadingText: "Tohizo ny famakiana",

  // Recherche
  searchBibleText: "Hikaroka ao amin'ny Baiboly",
  searchInBibleText: "Karohy ao amin'ny Baiboly",
  clearSearchText: "Esory ny fikarohana",
  noSearchResultText: "Tsy nahitana valiny",

  // Notes
  notesText: "Naoty",
  addNoteText: "Hanampy naoty",
  editNoteText: "Hanova naoty",
  deleteNoteText: "Hamafa naoty",
  noteTitleText: "Lohatenin'ny naoty",
  noteContentText: "Votoatin'ny naoty",
  noteEmptyText: "Tsy mbola misy naoty",

  // Favoris
  favoriteText: "Tiana",
  favoritesText: "Ireo tiako",
  addFavoriteText: "Ampidiro amin'ny tiako",
  removeFavoriteText: "Esory amin'ny tiako",
  noFavoriteText: "Tsy mbola misy andininy tiana",

  // Historique
  historyText: "Tantara",
  readingHistoryText: "Tantaran'ny famakiana",
  clearHistoryText: "Fafao ny tantara",
  noHistoryText: "Tsy mbola misy tantaran'ny famakiana",

  // Archives
  archiveText: "Tahiry",
  archivesText: "Ireo tahiry",
  addArchiveText: "Tehirizo ao amin'ny tahiry",
  removeArchiveText: "Esory ao amin'ny tahiry",
  noArchiveText: "Tsy mbola misy tahiry",

  // Partage / copie
  shareText: "Zarao",
  copyText: "Adikao",
  copiedText: "Voadika",
  shareVerseText: "Zarao ity andininy ity",
  shareChapterText: "Zarao ity toko ity",

  // Surlignage
  highlightText: "Asio loko",
  removeHighlightText: "Esory ny loko",
  highlightsText: "Ireo nasiana loko",
  noHighlightText: "Tsy mbola misy andininy nasiana loko",

  // Affichage
  showText: "Asehoy",
  hideText: "Afeno",
  showMoreText: "Asehoy bebe kokoa",
  showLessText: "Asehoy kely kokoa",

  // Messages
  successText: "Vita soa aman-tsara",
  errorText: "Nisy olana",
  warningText: "Fampitandremana",
  loadingText: "Miandry...",

  // Confirmation
  confirmDeleteText: "Tena hamafa an'ity ve ianao?",
  confirmRemoveText: "Tena hanala an'ity ve ianao?",
};

export const fr: Translation = {
  theme: {
    title: "Thème",
    data: [
      {
        value: "dark",
        title: "Sombre",
        icon: "moon",
      },
      {
        value: "light",
        title: "Clair",
        icon: "sunny",
      },
      {
        value: "system",
        title: "Système",
        icon: "phone-portrait",
      },
    ],
  },

  langue: {
    title: "Langue de la Bible",
    titleApp: "Langue de l'application",
    data: [
      { value: "mg", title: "Malgache", flag: '🇲🇬' },
      { value: "fr", title: "Français", flag: '🇫🇷' },
      { value: "en", title: "Anglais", flag: '🇺🇸' },
    ],
  },

  color: {
    title: "Couleur de l'application",
    bold: "Texte",
  },

  settingRead: {
    title: "Paramètres de lecture",
    fontSize: "Taille du texte",
    textAlign: "Alignement du texte",
    header: "Style de l'en-tête du livre et du chapitre",
    bible: {
      book: "Livre",
      chapter: "Chapitre",
      verse: "Verset",
    },
    buttonText: "Enregistrer les modifications",
  },

  searchResult: {
    noValue: "Aucun résultat trouvé pour",
    empty:
      "Commencez votre recherche en saisissant au moins 3 lettres.",
    result: "résultat trouvé",
    results: "résultats trouvés",
  },

  // Général
  showAllText: "Afficher tout",
  searchText: "Rechercher",
  settingText: "Paramètres",
  bibleText: "Bible",
  noteText: "Mes notes",
  image: "Image d'arrière-plan",
  buttonRead: "Lire",

  // Testament
  oldTest: "Ancien Testament",
  newTest: "Nouveau Testament",

  // Navigation
  homeText: "Accueil",
  backText: "Retour",
  nextText: "Suivant",
  previousText: "Précédent",
  closeText: "Fermer",
  doneText: "Terminé",

  // Actions
  saveText: "Enregistrer",
  cancelText: "Annuler",
  deleteText: "Supprimer",
  editText: "Modifier",
  updateText: "Mettre à jour",
  addText: "Ajouter",
  confirmText: "Confirmer",
  yesText: "Oui",
  noText: "Non",

  // Bible
  bookText: "Livre",
  chapterText: "Chapitre",
  verseText: "Verset",
  chaptersText: "Chapitres",
  versesText: "Versets",
  readText: "Lire",
  continueReadingText: "Continuer la lecture",

  // Recherche
  searchBibleText: "Rechercher dans la Bible",
  searchInBibleText: "Rechercher dans la Bible",
  clearSearchText: "Effacer la recherche",
  noSearchResultText: "Aucun résultat trouvé",

  // Notes
  notesText: "Notes",
  addNoteText: "Ajouter une note",
  editNoteText: "Modifier la note",
  deleteNoteText: "Supprimer la note",
  noteTitleText: "Titre de la note",
  noteContentText: "Contenu de la note",
  noteEmptyText: "Aucune note pour le moment",

  // Favoris
  favoriteText: "Favori",
  favoritesText: "Mes favoris",
  addFavoriteText: "Ajouter aux favoris",
  removeFavoriteText: "Retirer des favoris",
  noFavoriteText: "Aucun verset favori",

  // Historique
  historyText: "Historique",
  readingHistoryText: "Historique de lecture",
  clearHistoryText: "Effacer l'historique",
  noHistoryText: "Aucun historique de lecture",

  // Archives
  archiveText: "Archive",
  archivesText: "Archives",
  addArchiveText: "Archiver",
  removeArchiveText: "Désarchiver",
  noArchiveText: "Aucune archive",

  // Partage / copie
  shareText: "Partager",
  copyText: "Copier",
  copiedText: "Copié",
  shareVerseText: "Partager ce verset",
  shareChapterText: "Partager ce chapitre",

  // Surlignage
  highlightText: "Surligner",
  removeHighlightText: "Supprimer le surlignage",
  highlightsText: "Mes surlignages",
  noHighlightText: "Aucun verset surligné",

  // Affichage
  showText: "Afficher",
  hideText: "Masquer",
  showMoreText: "Afficher plus",
  showLessText: "Afficher moins",

  // Messages
  successText: "Opération réussie",
  errorText: "Une erreur est survenue",
  warningText: "Avertissement",
  loadingText: "Chargement...",

  // Confirmation
  confirmDeleteText: "Voulez-vous vraiment supprimer cet élément ?",
  confirmRemoveText: "Voulez-vous vraiment retirer cet élément ?",
};

export const en: Translation = {
  theme: {
    title: "Theme",
    data: [
      {
        value: "dark",
        title: "Dark",
        icon: "moon",
      },
      {
        value: "light",
        title: "Light",
        icon: "sunny",
      },
      {
        value: "system",
        title: "System",
        icon: "phone-portrait",
      },
    ],
  },

  langue: {
    title: "Bible language",
    titleApp: "App language",
    data: [
      { value: "mg", title: "Malagasy", flag: '🇲🇬' },
      { value: "fr", title: "French", flag: '🇫🇷' },
      { value: "en", title: "English", flag: '🇺🇸' },
    ],
  },

  color: {
    title: "App color",
    bold: "Text",
  },

  settingRead: {
    title: "Reading settings",
    fontSize: "Font size",
    textAlign: "Text alignment",
    header: "Book and chapter header style",
    bible: {
      book: "Book",
      chapter: "Chapter",
      verse: "Verse",
    },
    buttonText: "Save changes",
  },

  searchResult: {
    noValue: "No results found for",
    empty: "Start your search by typing at least 3 letters.",
    result: "result found",
    results: "results found",
  },

  // General
  showAllText: "Show all",
  searchText: "Search",
  settingText: "Settings",
  bibleText: "Bible",
  noteText: "My notes",
  image: "Background image",
  buttonRead: "Read",

  // Testament
  oldTest: "Old Testament",
  newTest: "New Testament",

  // Navigation
  homeText: "Home",
  backText: "Back",
  nextText: "Next",
  previousText: "Previous",
  closeText: "Close",
  doneText: "Done",

  // Actions
  saveText: "Save",
  cancelText: "Cancel",
  deleteText: "Delete",
  editText: "Edit",
  updateText: "Update",
  addText: "Add",
  confirmText: "Confirm",
  yesText: "Yes",
  noText: "No",

  // Bible
  bookText: "Book",
  chapterText: "Chapter",
  verseText: "Verse",
  chaptersText: "Chapters",
  versesText: "Verses",
  readText: "Read",
  continueReadingText: "Continue reading",

  // Search
  searchBibleText: "Search the Bible",
  searchInBibleText: "Search in the Bible",
  clearSearchText: "Clear search",
  noSearchResultText: "No results found",

  // Notes
  notesText: "Notes",
  addNoteText: "Add a note",
  editNoteText: "Edit note",
  deleteNoteText: "Delete note",
  noteTitleText: "Note title",
  noteContentText: "Note content",
  noteEmptyText: "No notes yet",

  // Favorites
  favoriteText: "Favorite",
  favoritesText: "My favorites",
  addFavoriteText: "Add to favorites",
  removeFavoriteText: "Remove from favorites",
  noFavoriteText: "No favorite verses",

  // History
  historyText: "History",
  readingHistoryText: "Reading history",
  clearHistoryText: "Clear history",
  noHistoryText: "No reading history",

  // Archives
  archiveText: "Archive",
  archivesText: "Archives",
  addArchiveText: "Archive",
  removeArchiveText: "Remove from archive",
  noArchiveText: "No archives",

  // Share / copy
  shareText: "Share",
  copyText: "Copy",
  copiedText: "Copied",
  shareVerseText: "Share this verse",
  shareChapterText: "Share this chapter",

  // Highlight
  highlightText: "Highlight",
  removeHighlightText: "Remove highlight",
  highlightsText: "My highlights",
  noHighlightText: "No highlighted verses",

  // Display
  showText: "Show",
  hideText: "Hide",
  showMoreText: "Show more",
  showLessText: "Show less",

  // Messages
  successText: "Operation successful",
  errorText: "An error occurred",
  warningText: "Warning",
  loadingText: "Loading...",

  // Confirmation
  confirmDeleteText: "Are you sure you want to delete this item?",
  confirmRemoveText: "Are you sure you want to remove this item?",
};

export const translations = {
  mg,
  fr,
  en,
} satisfies Record<Language, Translation>;

export function getTranslation(language: Language): Translation {
  return translations[language];
}