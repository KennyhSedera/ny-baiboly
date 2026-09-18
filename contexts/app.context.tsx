import * as archivesDB from '@/api/archives.repository';
import * as colorDB from '@/api/colors.repository';
import { getDB } from '@/api/database';
import * as favoritesDB from '@/api/favories.repository';
import * as imagesDB from '@/api/image.repository';
import { createLangue, getLangues, LangueType, updateLangue } from '@/api/langues.repository';
import * as lastReadDB from '@/api/last.read.repository';
import * as lastSearchDB from '@/api/last.search.repository';
import * as noteVerseDB from '@/api/note.verse.repository';
import * as notesDB from '@/api/notes.repository';
import * as settingDB from '@/api/setting.read.repository';
import { Setting } from '@/api/setting.read.repository';
import { getDailyPrayer } from '@/constants/prayer';
import { Theme } from '@/hooks/use-theme';
import { bookBible, verseBible } from '@/types/bible';
import { Colors } from '@/types/colors.type';
import { bookEn, versesEn } from '@/utils/bible.en.util';
import { bookFr, versesFr } from '@/utils/bible.fr.util';
import { books as booksMg, verses as versesMg, versesToRangeString } from '@/utils/bible.util';
import { appColors } from '@/utils/color.util';
import * as Localization from 'expo-localization';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState, } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from './theme.context';

const SUPPORTED_LANGUES = ['fr', 'en', 'mg'] as const;

function getDeviceDefaultLangue(): LangueType {
  const deviceLang = Localization.getLocales()[0]?.languageCode;
  const bibleLng = (SUPPORTED_LANGUES as readonly string[]).includes(deviceLang ?? '')
    ? (deviceLang as typeof SUPPORTED_LANGUES[number])
    : 'mg';

  return { id: 1, appLng: bibleLng, bibleLng, created_at: new Date().toISOString() } as LangueType;
}

interface AppContextValue {
  isReady: boolean;
  error: Error | null;
  isDark: boolean;
  theme: Theme;
  resolvedTheme: 'dark' | 'light'

  colors: typeof colorDB;
  images: typeof imagesDB;
  notes: notesDB.Note[];

  appColors: Colors[];

  color: colorDB.Color | null;
  image: imagesDB.ImageRecord | null;
  settingRead: Setting | null;
  books: bookBible[];
  verses: verseBible[];
  oldTestament: bookBible[];
  newTestament: bookBible[];
  langues: LangueType | undefined;

  lastReads: lastReadDB.LastRead[];
  lastSearchs: lastSearchDB.LastSearch[];
  favorites: favoritesDB.Favorite[];
  archives: archivesDB.Archive[];
  prayer: { title: string, text: string } | null;
  noteVerses: noteVerseDB.NoteVerse[];

  setTheme: (theme: Theme) => void
  getColor: () => void;
  createColor: (color: colorDB.CreatColorProps) => void;
  updateColor: (color: colorDB.Color, id: number) => void;
  deleteColor: (id: number) => void;

  getImages: () => void;
  createImages: (uri?: string,
    imageIndex?: number
  ) => void;
  updateImages: (
    id: number,
    uri?: string,
    imageIndex?: number
  ) => void;
  deleteImages: (id: number) => void;

  getSettingRead: () => void;
  createSettingRead: (data: settingDB.SettingCreateProps) => void;
  updateSettingRead: (data: settingDB.SettngUpdateProps) => void;
  deleteSettingRead: (id: number) => void;

  updateLangue: (data: LangueType) => void;

  addNewLastRead: (data: lastReadDB.LastRead) => void;
  removeLastRead: (id: number) => void;
  updateLastRead: (id: number) => void;

  addNewLastSearch: (data: lastSearchDB.LastSearch) => void;
  removeLastSearch: (id: number) => void;
  updateLastSearch: (id: number) => void;

  addNewFavorite: (data: favoritesDB.Favorite) => void;
  removeFavorite: (id: number) => void;
  replaceFavoritesForChapter: (bookId: number, chapterId: number, verseNumbers: number[]) => Promise<void>;

  addNewArchive: (data: archivesDB.Archive) => void;
  removeArchive: (id: number) => void;
  replaceArchivesForChapter: (bookId: number, chapterId: number, verseNumbers: number[]) => Promise<void>;

  getNoteVerses: (id: number) => void;
  addNewNoteVerse: (data: noteVerseDB.NoteVerse) => void;
  removeNoteVerse: (id: number) => void;


}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AppProvider({ children, fallback }: AppProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [color, setColor] = useState<colorDB.Color | null>(null);
  const [image, setImage] = useState<imagesDB.ImageRecord | null>(null);
  const [settingRead, setSettingRead] = useState<Setting | null>(null);
  const [booksLng, setBooksLng] = useState<bookBible[]>([]);
  const [versesLng, setVersesLng] = useState<verseBible[]>([]);
  const [oldTestamentLng, setOldTestamentLng] = useState<bookBible[]>([]);
  const [newTestamentLng, setNewTestamentLng] = useState<bookBible[]>([]);
  const [lang, setLang] = useState<LangueType>();
  const [lastReads, setLastReads] = useState<lastReadDB.LastRead[]>([]);
  const [lastSearchs, setLastSearchs] = useState<lastSearchDB.LastSearch[]>([]);
  const [favorites, setFavorites] = useState<favoritesDB.Favorite[]>([]);
  const [archives, setArchives] = useState<archivesDB.Archive[]>([]);
  const [notes, setNotes] = useState<notesDB.Note[]>([]);
  const [prayer, setPrayer] = useState<{ title: string, text: string } | null>(null);
  const [noteVerses, setNoteVerse] = useState<noteVerseDB.NoteVerse[]>([]);

  const { isDark, setTheme, theme, resolvedTheme } = useTheme();

  useEffect(() => {
    let isMounted = true;

    getDB()
      .then(() => {
        if (!isMounted) return;
        setIsReady(true);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        console.error('Erreur SQLite:', err);
        setError(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Langues
  useEffect(() => {
    if (lang !== undefined) {
      getPrayers(lang);
      if (lang.bibleLng === 'en') {
        setBooksLng(bookEn);
        setVersesLng(versesEn);
        setOldTestamentLng(bookEn.filter(b => b.book_number < 470));
        setNewTestamentLng(bookEn.filter(b => b.book_number >= 470));
        return;
      } else if (lang.bibleLng === 'fr') {
        setBooksLng(bookFr);
        setVersesLng(versesFr);
        setOldTestamentLng(bookFr.filter(b => b.book_number < 470));
        setNewTestamentLng(bookFr.filter(b => b.book_number >= 470));
        return;
      }
      setBooksLng(booksMg);
      setVersesLng(versesMg);
      setOldTestamentLng(booksMg.filter(b => b.book_number < 470));
      setNewTestamentLng(booksMg.filter(b => b.book_number >= 470));
    }
  }, [lang])

  const getLang = useCallback(async () => {
    try {
      const lngs = await getLangues();

      if (lngs.length === 0) {
        const defaultLangue = getDeviceDefaultLangue();
        await createLangue(defaultLangue);
        setLang(defaultLangue as LangueType);
        return;
      }
      setLang(lngs[0]);
    } catch (err) {
      console.error('Erreur SQLite (getLang):', err);
      setError(err as Error);
    }
  }, []);

  const updateLng = useCallback(
    async (data: LangueType) => {
      try {
        await updateLangue(data);
        await getLang();
      } catch (err) {
        console.error('Erreur SQLite (updateLangue):', err);
        setError(err as Error);
      }
    },
    [getLang],
  )

  // Colors
  const getAppColors = useCallback(() => {
    return appColors.map((color, index) => ({
      ...color,
      bg: isDark ? color.bg : color.text,
      text: !isDark ? color.bg : color.text,
      borderColor: !isDark ? color.bg : color.text,
      colorIndex: index,
    }))
  }, [isDark]);

  const getColors = useCallback(async () => {
    await colorDB.getColors()
      .then((colorsdb) => {

        if (colorsdb.length > 0) {
          const c = colorsdb[0];
          setColor({
            ...c,
            bg: isDark ? c.bg : c.text,
            text: !isDark ? c.bg : c.text,
            borderColor: !isDark ? c.bg : c.text,
            colorIndex: c.colorIndex,
          });
        } else {
          colorDB.createColor({ ...appColors[0], colorIndex: 0 }).then(() => {
            getColors();
          });
        }
      })
      .catch((err: Error) => {
        console.error('Erreur SQLite:', err);
        setError(err);
      });
  }, [isDark]);

  const createColor = useCallback(
    async (newColor: colorDB.CreatColorProps) => {
      await colorDB.createColor(newColor);
      await getColors();
    },
    [getColors]
  );

  const updateColor = useCallback(
    async (updatedColor: colorDB.UpdateColorProps, id: number) => {
      await colorDB.updateColor(id, updatedColor);
      await getColors();
    },
    [getColors]
  );

  const deleteColor = useCallback(
    async (id: number) => {
      await colorDB.deleteColor(id);
      await getColors();
    },
    [getColors]
  );

  // Images
  const createImages = useCallback(
    async (
      uri?: string,
      imageIndex?: number
    ) => {
      await imagesDB.createImage(uri, imageIndex);
      await getImages();
    },
    []
  );

  const updateImages = useCallback(
    async (
      id: number,
      uri?: string,
      imageIndex?: number
    ) => {
      await imagesDB.updateImage(id, uri, imageIndex);
      await getImages();
    },
    []
  );

  const deleteImages = useCallback(
    async (id: number) => {
      await imagesDB.deleteImage(id);
      await getImages();
    },
    []
  );

  const getImages = useCallback(
    async () => {
      await imagesDB.getImages()
        .then((images) => {
          if (images.length > 0) {
            setImage(images[0]);
          }
          else {
            imagesDB.createImage('', 1).then(() => {
              imagesDB.getImages().then((images) => {
                setImage(images[0]);
              });
            });
          }
        }).catch((err: Error) => {
          console.error('Erreur SQLite:', err);
          setError(err);
        })
    },
    []
  );

  // Setting read
  const getSettingRead = useCallback(
    async () => {
      await settingDB.getSetting()
        .then((setting) => {
          if (setting.length > 0) {
            setSettingRead(setting[0]);
          }
          else {
            settingDB.createSetting({ fontSize: 16, textAlign: 'left', titeFormat: 'col' }).then(() => {
              settingDB.getSetting().then((setting) => {
                setSettingRead(setting[0]);
              });
            });
          }
        }).catch((err: Error) => {
          console.error('Erreur SQLite:', err);
          setError(err);
        })
    },
    []
  );

  const createSettingRead = useCallback(
    async (data: settingDB.SettingCreateProps) => {
      await settingDB.createSetting(data);
      await getSettingRead();
    },
    [getSettingRead]
  );

  const updateSettingRead = useCallback(
    async (data: settingDB.SettngUpdateProps) => {
      await settingDB.updateSetting(data);
      await getSettingRead();
    },
    [getSettingRead]
  );

  const deleteSettingRead = useCallback(
    async (id: number) => {
      await settingDB.deleteSetting(id);
      await getSettingRead();
    },
    [getSettingRead]
  );

  // Last read
  const getLastRead = useCallback(
    async () => {
      try {
        const res = await lastReadDB.getAllLastRead();
        setLastReads(res);
      } catch (err) {
        console.error('Erreur SQLite (getLastRead):', err);
        setError(err as Error);
      }
    },
    []
  );

  const addNewLastRead = useCallback(
    async (data: lastReadDB.LastRead) => {
      try {
        await lastReadDB.createLastRead(data);
        await getLastRead();
      } catch (err) {
        console.error('Erreur SQLite (addNewLastRead):', err);
        setError(err as Error);
      }
    },
    [getLastRead]
  );

  const removeLastRead = useCallback(
    async (id: number) => {
      try {
        await lastReadDB.removeLastRead(id);
        await getLastRead();
      } catch (err) {
        console.error('Erreur SQLite (removeLastRead):', err);
        setError(err as Error);
      }
    },
    [getLastRead]
  );

  const updateLastRead = useCallback(
    async (id: number) => {
      try {
        await lastReadDB.updateLastRead(id);
        await getLastRead();
      } catch (error) {
        console.error("Erreur: ", error);
      }
    }, [],
  )

  // Last search
  const getLastSearch = useCallback(
    async () => {
      try {
        const res = await lastSearchDB.getAllLastSearch();
        setLastSearchs(res);
      } catch (err) {
        console.error('Erreur SQLite (getLastSearch):', err);
        setError(err as Error);
      }
    },
    []
  );

  const addNewLastSearch = useCallback(
    async (data: lastSearchDB.LastSearch) => {
      try {
        await lastSearchDB.createLastSearch(data);
        await getLastSearch();
      } catch (err) {
        console.error('Erreur SQLite (addNewLastSearch):', err);
        setError(err as Error);
      }
    },
    [getLastSearch]
  );

  const removeLastSearch = useCallback(
    async (id: number) => {
      try {
        await lastSearchDB.removeLastSearch(id);
        await getLastSearch();
      } catch (err) {
        console.error('Erreur SQLite (removeLastSearch):', err);
        setError(err as Error);
      }
    },
    [getLastSearch]
  );

  const updateLastSearch = useCallback(
    async (id: number) => {
      try {
        await lastSearchDB.updateLastSearch(id);
        await getLastSearch();
      } catch (err) {
        console.error('Erreur SQLite (updateLastSearch):', err);
        setError(err as Error);
      }
    },
    [getLastSearch]
  );

  // Favorites
  const getFavorites = useCallback(
    async () => {
      try {
        const res = await favoritesDB.getFavorites();
        setFavorites(res);
      } catch (err) {
        console.error('Erreur SQLite (getFavorites):', err);
        setError(err as Error);
      }
    },
    []
  );

  const addNewFavorite = useCallback(
    async (data: favoritesDB.Favorite) => {
      try {
        await favoritesDB.createFavorite(data);
        await getFavorites();
      } catch (err) {
        console.error('Erreur SQLite (addNewFavorite):', err);
        setError(err as Error);
      }
    },
    [getFavorites]
  );

  const removeFavorite = useCallback(
    async (id: number) => {
      try {
        await favoritesDB.deleteFavorite(id);
        await getFavorites();
      } catch (err) {
        console.error('Erreur SQLite (removeFavorite):', err);
        setError(err as Error);
      }
    },
    [getFavorites]
  );

  const updateFavorite = useCallback(
    async (id: number, data: favoritesDB.Favorite) => {
      try {
        await favoritesDB.updateFavorite(id, data);
        await getFavorites();
      } catch (err) {
        console.error('Erreur SQLite (updateFavorite):', err);
        setError(err as Error);
      }
    },
    [getFavorites]
  );

  async function replaceFavoritesForChapter(bookId: number, chapterId: number, verseNumbers: number[]) {
    await favoritesDB.deleteFavoritesByChapter(bookId, chapterId);
    if (verseNumbers.length > 0) {
      await addNewFavorite({ book_number: bookId, chapter: chapterId, verse: versesToRangeString(verseNumbers) });
    } else {
      await getFavorites();
    }
  }

  // Archives
  const getArchives = useCallback(
    async () => {
      try {
        const res = await archivesDB.getArchives();
        setArchives(res);
      } catch (err) {
        console.error('Erreur SQLite (getArchives):', err);
        setError(err as Error);
      }
    },
    []
  );

  const addNewArchive = useCallback(
    async (data: archivesDB.Archive) => {
      try {
        await archivesDB.createArchive(data);
        await getArchives();
      } catch (err) {
        console.error('Erreur SQLite (addNewArchive):', err);
        setError(err as Error);
      }
    },
    [getArchives]
  );

  const removeArchive = useCallback(
    async (id: number) => {
      try {
        await archivesDB.deleteArchive(id);
        await getArchives();
      } catch (err) {
        console.error('Erreur SQLite (removeArchive):', err);
        setError(err as Error);
      }
    },
    [getArchives]
  );

  const updateArchive = useCallback(
    async (id: number, data: archivesDB.Archive) => {
      try {
        await archivesDB.updateArchive(id, data);
        await getArchives();
      } catch (err) {
        console.error('Erreur SQLite (updateArchive):', err);
        setError(err as Error);
      }
    },
    [getArchives]
  );

  async function replaceArchivesForChapter(bookId: number, chapterId: number, verseNumbers: number[]) {
    await archivesDB.deleteArchivesByChapter(bookId, chapterId);
    if (verseNumbers.length > 0) {
      await addNewArchive({ book_number: bookId, chapter: chapterId, verses: versesToRangeString(verseNumbers) });
    } else {
      await getArchives();
    }
  }

  // Notes
  const getNotes = useCallback(
    async () => {
      try {
        const res = await notesDB.getNotes();
        setNotes(res);
      } catch (err) {
        console.error('Erreur SQLite (getNotes):', err);
        setError(err as Error);
      }
    }, []
  );

  const addNewNote = useCallback(
    async (data: notesDB.Note) => {
      try {
        await notesDB.createNote(data);
        await getNotes();
      } catch (err) {
        console.error('Erreur SQLite (addNewNote):', err);
        setError(err as Error);
      }
    },
    [getNotes]
  );

  const removeNote = useCallback(
    async (id: number) => {
      try {
        await notesDB.deleteNote(id);
        await getNotes();
      } catch (err) {
        console.error('Erreur SQLite (removeNote):', err);
        setError(err as Error);
      }
    },
    [getNotes]
  );

  // Notes versets
  const getNoteVerses = useCallback(
    async (noteId: number) => {
      try {
        const res = await noteVerseDB.getAllNoteVerseByNote(noteId);
        setNoteVerse(res);
        return res;
      } catch (err) {
        console.error('Erreur SQLite (getNoteVerses):', err);
        setError(err as Error);
      }
    }, []
  )

  const addNewNoteVerse = useCallback(
    async (data: noteVerseDB.NoteVerse) => {
      try {
        const res = await noteVerseDB.createNoteVerse(data);
        await getNotes();
      } catch (err) {
        console.error('Erreur SQLite (addNewNoteVerse):', err);
        setError(err as Error);
      }
    },
    [getNotes]
  );

  const removeNoteVerse = useCallback(
    async (id: number) => {
      try {
        await noteVerseDB.removeNoteVerse(id);
        await getNotes();
      } catch (err) {
        console.error('Erreur SQLite (removeNoteVerse):', err);
        setError(err as Error);
      }
    },
    [getNotes]
  );

  // Prière
  const getPrayers = useCallback(
    (langue: LangueType) => {
      const prayer = getDailyPrayer();
      const title = prayer.title[langue?.bibleLng as 'fr' | 'en'];
      const text = prayer.text[langue?.bibleLng as 'fr' | 'en'];
      setPrayer({ title, text });
    }, []
  );

  useEffect(() => {
    if (!isReady) return;
    getImages();
  }, [isReady, getImages]);

  useEffect(() => {
    if (!isReady) return;
    getLang();
  }, [isReady, getLang]);

  useEffect(() => {
    if (!isReady) return;
    getSettingRead();
  }, [isReady, getSettingRead]);

  useEffect(() => {
    if (!isReady) return;
    getColors();
  }, [isReady, getColors]);

  useEffect(() => {
    if (!isReady) return;
    getLastRead();
  }, [isReady, getLastRead]);

  useEffect(() => {
    if (!isReady) return;
    getLastSearch();
  }, [isReady, getLastSearch]);

  useEffect(() => {
    if (!isReady) return;
    getFavorites();
  }, [isReady, getFavorites]);

  useEffect(() => {
    if (!isReady) return;
    getArchives();
  }, [isReady, getArchives]);

  useEffect(() => {
    if (!isReady) return;
    getNotes();
  }, [isReady, getNotes]);

  if (!isReady) {
    if (fallback !== undefined) return <>{fallback}</>;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        {error && <Text style={{ marginTop: 12, color: 'red' }}>{error.message}</Text>}
      </View>
    );
  }

  const value: AppContextValue = {
    isReady,
    isDark,
    error,
    colors: colorDB,
    images: imagesDB,
    notes,
    appColors: getAppColors(),
    theme,
    resolvedTheme,
    color,
    image,
    settingRead,
    verses: versesLng,
    books: booksLng,
    oldTestament: oldTestamentLng,
    newTestament: newTestamentLng,
    langues: lang,
    lastReads,
    lastSearchs,
    favorites,
    archives,
    prayer,
    noteVerses,

    setTheme,
    getColor: getColors,
    createColor,
    updateColor,
    deleteColor,

    getImages,
    createImages,
    updateImages,
    deleteImages,

    getSettingRead,
    createSettingRead,
    updateSettingRead,
    deleteSettingRead,
    updateLangue: updateLng,

    addNewLastRead,
    removeLastRead,
    updateLastRead,

    addNewLastSearch,
    removeLastSearch,
    updateLastSearch,

    addNewFavorite,
    removeFavorite,
    replaceFavoritesForChapter,

    addNewArchive,
    removeArchive,
    replaceArchivesForChapter,

    addNewNoteVerse,
    removeNoteVerse,
    getNoteVerses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp() doit être utilisé à l\'intérieur de <AppProvider>.');
  }
  return ctx;
}