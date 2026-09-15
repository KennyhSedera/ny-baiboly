import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import * as colorDB from '@/api/colors.repository';
import { getDB } from '@/api/database';
import * as imagesDB from '@/api/image.repository';
import { createLangue, getLangues, LangueType, updateLangue, UpdateLangueType } from '@/api/langues.repository';
import * as lastReadDB from '@/api/last.read.repository';
import * as lastSearchDB from '@/api/last.search.repository';
import * as notesDB from '@/api/notes.repository';
import * as settingDB from '@/api/setting.read.repository';
import { Setting } from '@/api/setting.read.repository';
import { Theme } from '@/hooks/use-theme';
import { bookBible, verseBible } from '@/types/bible';
import { Colors } from '@/types/colors.type';
import { bookEn, versesEn } from '@/utils/bible.en.util';
import { bookFr, versesFr } from '@/utils/bible.fr.util';
import { books as booksMg, verses as versesMg } from '@/utils/bible.util';
import { appColors } from '@/utils/color.util';
import { useTheme } from './theme.context';

export const indexChangeDark = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

interface AppContextValue {
  isReady: boolean;
  error: Error | null;
  isDark: boolean;
  theme: Theme;
  resolvedTheme: 'dark' | 'light'

  colors: typeof colorDB;
  images: typeof imagesDB;
  notes: typeof notesDB;

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

  updateLangue: (data: UpdateLangueType) => void;

  addNewLastRead: (data: lastReadDB.LastRead) => void;
  removeLastRead: (id: number) => void;

  addNewLastSearch: (data: lastSearchDB.LastSearch) => void;
  removeLastSearch: (id: number) => void;
  updateLastSearch: (id: number) => void;
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
  const [booksLng, setBooksLng] = useState<bookBible[] | []>([]);
  const [versesLng, setVersesLng] = useState<verseBible[] | []>([]);
  const [oldTestamentLng, setOldTestamentLng] = useState<bookBible[] | []>([]);
  const [newTestamentLng, setNewTestamentLng] = useState<bookBible[] | []>([]);
  const [lang, setLang] = useState<LangueType>();
  const [lastReads, setLastReads] = useState<lastReadDB.LastRead[] | []>([]);
  const [lastSearchs, setLastSearchs] = useState<lastSearchDB.LastSearch[] | []>([]);

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
    const lngs = await getLangues();

    if (lngs.length === 0) {
      await createLangue({ appLng: 'mg', bibleLng: 'mg' });
      return;
    }
    setLang(lngs[0]);
  }, []);

  const updateLng = useCallback(
    async (data: UpdateLangueType) => {
      await updateLangue(data);
      await getLang();
    },
    [],
  )

  // Colors
  const getAppColors = useCallback(() => {
    return appColors.map((color, index) => ({
      ...color,
      bg: !(indexChangeDark.includes(index) && isDark) ? appColors[index].text : appColors[index].bg,
      text: !(indexChangeDark.includes(index) && isDark) ? appColors[index].bg : appColors[index].text,
      borderColor: !(indexChangeDark.includes(index) && isDark) ? appColors[index].borderColor : appColors[index].text,
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
          colorDB.createColor({ ...appColors[0], colorIndex: 1 }).then(() => {
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
      const res = await lastReadDB.getAllLastRead();
      setLastReads(res);
    },
    []
  );

  const addNewLastRead = useCallback(
    async (data: lastReadDB.LastRead) => {
      await lastReadDB.createLastRead(data);
      await getLastRead();
    },
    [getLastRead]
  );

  const removeLastRead = useCallback(
    async (id: number) => {
      await lastReadDB.removeLastRead(id);
      await getLastRead();
    },
    [getLastRead]
  );

  // Last search
  const getLastSearch = useCallback(
    async () => {
      const res = await lastSearchDB.getAllLastSearch();
      setLastSearchs(res);
    },
    []
  );

  const addNewLastSearch = useCallback(
    async (data: lastSearchDB.LastSearch) => {
      await lastSearchDB.createLastSearch(data);
      await getLastSearch();
    },
    [getLastSearch]
  );

  const removeLastSearch = useCallback(
    async (id: number) => {
      await lastSearchDB.removeLastSearch(id);
      await getLastSearch();
    },
    [getLastSearch]
  );

  const updateLastSearch = useCallback(
    async (id: number) => {
      await lastSearchDB.updateLastSearch(id);
      await getLastSearch();
    },
    [getLastSearch]
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
    notes: notesDB,
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
    addNewLastSearch,
    removeLastSearch,
    updateLastSearch
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp() doit être utilisé à l’intérieur de <AppProvider>.');
  }
  return ctx;
}