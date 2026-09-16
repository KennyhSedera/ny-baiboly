import { getArchiveByChapter } from '@/api/archives.repository';
import AppModal from '@/components/modal';
import { ThemedView } from '@/components/themed-view';
import { VerseText } from '@/components/verse-text';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { readingVersesBible } from '@/types/bible';
import { TextAlign } from '@/types/text.type';
import { getBookById, getPrevAndNextChapter, getVerseBetweenTwoVerseId, getVerseByChapterId } from '@/utils/bible.util';
import { adjustColor } from '@/utils/color.util';
import { convertVersesToArrayNumber } from '@/utils/text.util';
import { Entypo } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { styles } from '../(tabs)';

export default function BookReading() {
  const { bookId, chapterId, startVerse, endVerse, } = useLocalSearchParams();
  const { settingRead, updateSettingRead, isDark, books, verses, langues, addNewArchive, addNewFavorite } = useApp();
  const language = getTranslation(langues?.appLng || "mg");
  const { prev, next } = getPrevAndNextChapter(Number(bookId), Number(chapterId), books, verses);
  const router = useRouter()
  const book = getBookById(Number(bookId), books);

  const inputRef = React.useRef<TextInput | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const versePositions = useRef<Record<number, number>>({});

  const [data, setData] = useState<readingVersesBible>();
  const [all, setAll] = useState(false);
  const [search, setSearch] = useState('');
  const [onSearch, setOnSearch] = useState(false);
  const [copied, setCopied] = useState(false);
  const [archived, setArchived] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [fontSize, setFontSize] = React.useState(settingRead?.fontSize || 16);
  const [textAlign, setTextAlign] = React.useState<TextAlign>(settingRead?.textAlign || 'left');
  const [modalVisible, setModalVisible] = useState(false);
  const [titeFormat, settiteFormat] = useState<"row" | "col">(settingRead?.titeFormat || 'row');
  const [selectedVerse, setSelectedVerse] = useState<number[]>([]);
  const [archives, setArchives] = useState<number[]>([]);

  useEffect(() => {
    setAll((startVerse === undefined && endVerse === undefined) ? true : false)
  }, [endVerse, startVerse])

  useEffect(() => {
    if (search.length > 0) {
      setOnSearch(true);
    }
  }, [search])

  const fetchData = useCallback(() => {
    const res = all
      ? getVerseByChapterId(Number(bookId), Number(chapterId), books, verses)
      : getVerseBetweenTwoVerseId(Number(bookId), Number(chapterId), Number(startVerse)!, verses, books, endVerse ? Number(endVerse) : undefined);

    setData(res);
  }, [all]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handlePress = () => {
    setAll((prev) => !prev);
  };

  const handleBtnFooterPress = (type: 'prev' | 'next' | 'bible') => {
    switch (type) {
      case 'prev':
        if (prev) {
          router.push({ pathname: `/book-reading`, params: { bookId: prev.chapter ? bookId : 730, chapterId: prev.chapter ? prev.chapter : 22 } });
        }
        break;
      case 'next':
        if (next) {
          router.push({ pathname: `/book-reading`, params: { bookId: next.chapter ? bookId : 10, chapterId: next.chapter ? next.chapter : 1 } });
        }
        break;
      case 'bible':
        router.push('/book');
        break;
      default:
        break;
    }
  };

  const affichage = all ? `${book?.long_name} ${chapterId}` : endVerse ? `${book?.long_name} ${chapterId} : ${startVerse}-${endVerse}` : `${book?.long_name} ${chapterId} : ${startVerse}`;

  const affButton = endVerse ? `${book?.long_name} ${chapterId} : ${startVerse}-${endVerse}` : `${book?.long_name} ${chapterId} : ${startVerse}`;

  const firstMatchVerse = useMemo(() => {
    if (!search.trim()) return null;

    const normalize = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const q = normalize(search.trim());
    const found = data?.verses.find((v) => normalize(v.text).includes(q));

    return found?.verse ?? null;
  }, [search, data?.verses]);

  useEffect(() => {
    if (firstMatchVerse === null) return;

    let attempts = 0;
    const tryScroll = () => {
      const y = versePositions.current[firstMatchVerse];
      if (y !== undefined) {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 80), animated: true });
      } else if (attempts < 5) {
        attempts++;
        setTimeout(tryScroll, 100);
      }
    };

    tryScroll();
  }, [firstMatchVerse]);

  useEffect(() => {
    fetchArchives();
  }, [bookId, chapterId]);

  async function fetchArchives() {
    const res = await getArchiveByChapter(
      Number(bookId),
      Number(chapterId)
    );

    if (res) {
      const numbers = res.flatMap((item) =>
        convertVersesToArrayNumber(item.verses as string)
      );

      setArchives(numbers);
    }
  }

  const handleUpdateSetting = () => {
    if (!settingRead || typeof settingRead.id === 'undefined') return;
    setTimeout(() => {
      updateSettingRead({ id: settingRead.id, data: { fontSize, textAlign, titeFormat } });
    }, 1000);
  };

  function editTextAlign(params: TextAlign) {
    setTextAlign(params);
  }

  function editFontSize(params: number) {
    setFontSize(params);
  }

  function editTiteFormat(params: "row" | "col") {
    settiteFormat(params);
  }

  function handleSelected(v: number) {
    if (archives.includes(v)) return;
    setSelectedVerse([...(selectedVerse || []), v]);
  }

  function handleVersePress(v: number) {
    if (selectedVerse.length === 0) return;
    if (selectedVerse.includes(v)) {
      setSelectedVerse(selectedVerse.filter((item) => item !== v));
    } else {
      setSelectedVerse([...selectedVerse, v]);
    }
  }

  const copyToClipboard = async () => {
    const text = data?.verses.filter((v) => selectedVerse.includes(v.verse)).map((v) => v.text).join("\n") || '';
    await Clipboard.setStringAsync(text);

    setCopied(true);
    setTimeout(() => { setCopied(false); setSelectedVerse([]); }, 3000);
  };

  const handleArchive = async () => {
    const data = { book_number: Number(bookId), chapter: Number(chapterId), verses: selectedVerse.toLocaleString() }
    addNewArchive(data);
    setArchived(true);
    setTimeout(() => { setArchived(false); setSelectedVerse([]); }, 3000);

    fetchArchives();
  }

  async function handleFavorite() {
    const data = { book_number: Number(bookId), chapter: Number(chapterId), verse: selectedVerse.toLocaleString() }
    addNewFavorite(data);
    setFavorited(true);
    setTimeout(() => { setFavorited(false); setSelectedVerse([]); }, 3000);
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: book?.book_color, borderColor: adjustColor(book?.book_color || "#FFF", -30) }]}>
        {!onSearch && <View style={styles.flexRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: "#FFF" }]}>
            {affichage}
          </Text>
        </View>}

        {onSearch &&
          <View style={[
            styles.flexRow,
            { width: onSearch ? '90%' : 'auto', borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20), backgroundColor: `${adjustColor(book?.book_color || '#e2e2e2', -30)}30`, marginVertical: 4, borderWidth: 1, borderRadius: 20, }
          ]}
          >
            <TextInput
              ref={inputRef}
              style={[styles.searchInput, { color: 'white', width: '100%', height: 40, paddingVertical: 0 }]}
              placeholder={`${language.searchText} ...`}
              placeholderTextColor={'#ffffff80'}
              onChangeText={(text) => setSearch(text)}
              value={search}
              onBlur={() => search.length === 0 && setOnSearch(false)}
            />
          </View>
        }
        <View style={[styles.flexRow]}>
          <Pressable
            onPress={() => { setOnSearch((prev) => !prev); onSearch && setSearch('') }}
            style={[styles.flexRow, { width: 32, height: 32, justifyContent: 'center', borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20), backgroundColor: `${adjustColor(book?.book_color || '#e2e2e2', -30)}30`, borderWidth: 1, borderRadius: 20, }]}
          >
            <Ionicons name={onSearch ? "close" : "search"} size={20} color="#e9e9e9" />
          </Pressable>
          {!onSearch && <Pressable
            onPress={() => setModalVisible(true)}
            style={[styles.flexRow, { width: 32, height: 32, justifyContent: 'center', borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20), backgroundColor: `${adjustColor(book?.book_color || '#e2e2e2', -30)}30`, borderWidth: 1, borderRadius: 20, }]}
          >
            <Ionicons name={"text-outline"} size={20} color="#e9e9e9" />
          </Pressable>}
        </View>
      </View>

      {selectedVerse.length > 0 && (<View style={[styles.buttonFlotting, styles.flexCol, { width: "auto", height: "auto", bottom: 90, right: 10, backgroundColor: `${book?.book_color}ef`, padding: 10, paddingVertical: 15, gap: 12 }]}>
        <Ionicons onPress={copyToClipboard} name={copied ? "checkmark" : "copy-outline"} size={22} color={"#fff"} />
        <Ionicons onPress={handleFavorite} name={favorited ? "checkmark" : "heart"} size={26} color={"#fff"} />
        <Entypo onPress={handleArchive} name={archived ? "check" : "archive"} size={26} color={"#fff"} />
        <Ionicons name="document-text-outline" size={26} color={"#fff"} />
        <Ionicons name="close" size={26} color={"#fff"} onPress={() => setSelectedVerse([])} />
      </View>)}

      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 10, paddingBottom: 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.flexRow, { justifyContent: "center", marginBottom: 8 }]}>
          <View style={[titeFormat === 'row' ? styles.flexRow : styles.flexCol, { borderColor: book?.book_color, backgroundColor: `${book?.book_color}30`, justifyContent: "center", marginBottom: 8, width: "auto", height: 'auto', paddingVertical: 8, borderRadius: 20, paddingHorizontal: titeFormat === 'row' ? 20 : 50 }]}>
            <Text style={[styles.headerTitle, { color: book?.book_color, textTransform: 'capitalize', fontSize: 24, wordWrap: "break-word" }]}>{book?.long_name}</Text>
            <View style={{ borderRadius: 2, height: titeFormat === 'row' ? 34 : 0, width: titeFormat === 'row' ? 0 : "100%", marginHorizontal: 8, borderColor: book?.book_color, borderWidth: 1 }} />
            <Text style={[styles.headerTitle, { color: book?.book_color, fontSize: titeFormat === 'row' ? 32 : 60 }]}>{chapterId}</Text>
          </View>
        </View>

        {data?.verses.map((verse) => (
          <View
            key={verse.verse}
            onLayout={(e) => {
              versePositions.current[verse.verse] = e.nativeEvent.layout.y;
            }}
          >
            <VerseText
              text={verse.text}
              verseNumber={verse.verse}
              color={book?.book_color}
              highlight={search}
              size={fontSize}
              textAlign={textAlign}
              onLongPress={handleSelected}
              onPress={handleVersePress}
              isSelected={archives.includes(verse.verse) || selectedVerse?.includes(verse.verse)}
            />
          </View>
        ))}

        {startVerse !== undefined && (
          <Pressable onPress={handlePress} style={[styles.showAllButton, { borderColor: book?.book_color, backgroundColor: `${book?.book_color}20` }]}>
            <Text style={[styles.showAllButtonText, { color: book?.book_color }]}>
              {all ? affButton : language.showAllText}
            </Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: book?.book_color, borderColor: adjustColor(book?.book_color || "#FFF", -30) }]}>
        <Pressable style={[styles.buttonFooter, { borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20), backgroundColor: `${adjustColor(book?.book_color || '#e2e2e2', -30)}30`, }]} onPress={() => handleBtnFooterPress("prev")}>
          <Ionicons name="chevron-back" size={16} color="#FFF" />
          <Text style={[styles.buttonFooterText, { color: '#fff', fontSize: 12 }]}> {prev?.chapter ? prev?.bookName : books[books.length - 1].short_name}. {prev?.chapter ? prev.chapter : 22}  </Text>
        </Pressable>
        <Pressable style={[styles.buttonFooter, { borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20), backgroundColor: `${adjustColor(book?.book_color || '#e2e2e2', -30)}`, padding: 10, paddingHorizontal: 18 }]} onPress={() => handleBtnFooterPress("bible")}>
          <Text style={[styles.buttonFooterText, { color: '#fff', fontSize: 18 }]}>Ny Baiboly Malagasy</Text>
        </Pressable>
        <Pressable style={[styles.buttonFooter, { borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20), backgroundColor: `${adjustColor(book?.book_color || '#e2e2e2', -30)}30`, gap: 2 }]} onPress={() => handleBtnFooterPress("next")}>
          <Text style={[styles.buttonFooterText, { color: '#fff', fontSize: 12 }]}>  {next?.chapter ? next?.bookName : books[0].short_name}. {next?.chapter ? next.chapter : 1} </Text>
          <Ionicons name="chevron-forward" size={16} color="#FFF" />
        </Pressable>
      </View>

      <AppModal visible={modalVisible} onClose={() => setModalVisible(false)} color={book?.book_color} position="bottom">
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={[styles.headerTitle, { color: "#fff", marginBottom: 10 }]}>{language.settingRead.title}</Text>

          <Text style={[styles.modalTitle, { color: '#ffffff' }]}>{language.settingRead.fontSize}</Text>
          <View style={[styles.flexRow, { justifyContent: "space-between", marginBottom: 8 }]}>
            {[14, 16, 18, 20, 22, 24, 26, 28].map((size) => (
              <Pressable
                key={size}
                onPress={() => editFontSize(size)}
                style={[{ borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20), backgroundColor: size === fontSize ? `${adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20)}` : `${adjustColor(book?.book_color || '#e2e2e2', !isDark ? -30 : 20)}30`, padding: size === fontSize ? 10 : 6, borderRadius: 20 }]}
              >
                <Text style={[{ color: adjustColor(book?.book_color || '#e2e2e2', isDark ? (size === fontSize ? 30 : -30) : (size === fontSize ? -20 : 20)) }]}>{size}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.modalTitle, { color: '#ffffff', marginTop: 15 }]}>{language.settingRead.textAlign}</Text>
          <View style={[styles.flexRow, { marginBottom: 8, gap: 10 }]}>
            {["left", "center", "justify"].map(p => {
              const isSelected = p === textAlign;
              return (
                <Pressable
                  key={p}
                  onPress={() => editTextAlign(p as "left")}
                  style={[{ borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20), backgroundColor: isSelected ? `${adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20)}` : `${book?.book_color}30`, padding: isSelected ? 10 : 6, borderRadius: 10 }]}
                >
                  <Feather name={`align-${p}` as "bold"} size={30} color={adjustColor(book?.book_color || '#e2e2e2', isDark ? (isSelected ? 30 : -30) : (isSelected ? -20 : 20))} />
                </Pressable>
              )
            })}
          </View>

          <Text style={[styles.modalTitle, { color: '#ffffff', marginTop: 15 }]}>{language.settingRead.header}</Text>
          <View style={[styles.flexRow, { marginBottom: 8, gap: 10 }]}>
            <Pressable
              onPress={() => editTiteFormat('row')}
              style={[{
                borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20),
                backgroundColor: titeFormat === 'row'
                  ? adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20)
                  : `${adjustColor(book?.book_color || '#e2e2e2', !isDark ? -30 : 20)}30`,
                padding: titeFormat === 'row' ? 10 : 6,
                borderRadius: 10,
              }]}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: titeFormat !== 'row'
                  ? 'transparent'
                  : adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20),
              }}>
                <Text style={{ color: "#fff" }}>{language.settingRead.bible.book}</Text>
                <View style={{
                  width: 2,
                  height: "100%",
                  backgroundColor: "#fff",
                  marginRight: 6,
                  marginLeft: 4,
                }} />
                <Text style={{ color: "#fff" }}>{language.settingRead.bible.chapter}</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => editTiteFormat('col')}
              style={[{
                borderColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20),
                backgroundColor: titeFormat === 'col'
                  ? adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20)
                  : `${adjustColor(book?.book_color || '#e2e2e2', !isDark ? -30 : 20)}30`,
                padding: titeFormat === 'col' ? 10 : 6,
                borderRadius: 10,
              }]}
            >
              <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 6,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}>
                <Text style={{ color: "#fff" }}>{language.settingRead.bible.book}</Text>
                <View style={{
                  width: "100%",
                  height: 2,
                  marginBottom: 6,
                  marginTop: 4,
                  backgroundColor: "#fff"
                }} />
                <Text style={{ color: "#fff" }}>{language.settingRead.bible.chapter}</Text>
              </View>
            </Pressable>
          </View>

          <Pressable onPress={() => { setModalVisible(false); handleUpdateSetting() }} style={[styles.showAllButton, { backgroundColor: adjustColor(book?.book_color || '#e2e2e2', isDark ? -30 : 20) + "65", borderColor: "#fff", marginBottom: 0 }]}>
            <Text style={[styles.showAllButtonText, { color: "#fff" }]}>{language.settingRead.buttonText}</Text>
          </Pressable>
        </View>
      </AppModal>
    </ThemedView>
  );
}
