import { getArchiveByChapter } from '@/api/archives.repository';
import { Note } from '@/api/notes.repository';
import AppModal from '@/components/modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VerseText } from '@/components/verse-text';
import { getInfo, getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { readingVersesBible } from '@/types/bible';
import { TextAlign } from '@/types/text.type';
import { getBookById, getPrevAndNextChapter, getVerseBetweenTwoVerseId, getVerseByChapterId } from '@/utils/bible.util';
import { convertVersesToArrayNumber } from '@/utils/text.util';
import { Entypo } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, ToastAndroid, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { styles } from '../(tabs)';

export default function BookReading() {
  const { bookId, chapterId, startVerse, endVerse, } = useLocalSearchParams();
  const { settingRead, isDark, books, verses, langues, color, notes, updateSettingRead, addNewArchive, addNewFavorite, addNewNoteVerse } = useApp();
  const language = getTranslation(langues?.appLng || "mg");
  const info = getInfo(langues?.bibleLng || "mg");
  const { prev, next } = getPrevAndNextChapter(Number(bookId), Number(chapterId), books, verses);
  const router = useRouter()
  const book = getBookById(Number(bookId), books);

  const inputRef = React.useRef<TextInput | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const versePositions = useRef<Record<number, number>>({});

  const [data, setData] = useState<readingVersesBible>();
  const [all, setAll] = useState(false);
  const [search, setSearch] = useState('');
  const [searchNote, setNoteSearch] = useState('');
  const [onSearch, setOnSearch] = useState(false);
  const [copied, setCopied] = useState(false);
  const [archived, setArchived] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [fontSize, setFontSize] = React.useState(settingRead?.fontSize || 16);
  const [textAlign, setTextAlign] = React.useState<TextAlign>(settingRead?.textAlign || 'left');
  const [modalVisible, setModalVisible] = useState(false);
  const [titeFormat, settiteFormat] = useState<"row" | "col">(settingRead?.titeFormat || 'row');
  const [selectedVerse, setSelectedVerse] = useState<number[]>([]);
  const [archives, setArchives] = useState<number[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);

  useEffect(() => {
    setAll((startVerse === undefined && endVerse === undefined) ? true : false)
  }, [endVerse, startVerse]);

  const filteredNotes = useMemo(() => {
    if (notes.length === 0) return [];
    if (searchNote.length === 0) return notes;
    if (searchNote.length > 0) {
      return notes.filter((note) => {
        const title = note?.title ?? '';
        return title.toLowerCase().includes(searchNote.toLowerCase());
      });
    }
    return notes;
  }, [notes, searchNote]);

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
    setTimeout(() => { setCopied(false); }, 3000);
    setTimeout(() => { setSelectedVerse([]); }, 4000);

  };

  const handleArchive = async () => {
    const data = { book_number: Number(bookId), chapter: Number(chapterId), verses: selectedVerse.toLocaleString() }
    addNewArchive(data);
    setArchived(true);
    setTimeout(() => { setArchived(false); }, 3000);
    setTimeout(() => { setSelectedVerse([]); }, 4000);

    fetchArchives();
  }

  async function handleFavorite() {
    const data = { book_number: Number(bookId), chapter: Number(chapterId), verse: selectedVerse.toLocaleString() }
    addNewFavorite(data);
    setFavorited(true);
    setTimeout(() => { setFavorited(false); }, 3000);
    setTimeout(() => { setSelectedVerse([]); }, 4000);
  }

  async function handleSelectNote(note: Note) {
    if (!selectedNotes.includes(note)) {
      setSelectedNotes([...selectedNotes, note]);
    } else {
      setSelectedNotes(selectedNotes.filter((item) => item.id !== note.id));
    }
  }

  const handleAddVerseNote = async () => {
    try {
      const start = convertVersesToArrayNumber(selectedVerse.toLocaleString())[0];
      const end = convertVersesToArrayNumber(selectedVerse.toLocaleString())[selectedVerse.length - 1];

      const data = selectedNotes.map((item) => ({
        note_id: item.id,
        book_number: Number(bookId),
        chapter: Number(chapterId),
        verse: start === end ? start.toLocaleString() : `${start}-${end}`,
      }));

      await Promise.all(data.map((item) => addNewNoteVerse(item)));

      setShowNote(false);
      setSelectedNotes([]);
      setSelectedVerse([]);
    } catch (err) {
      console.warn('[handleAddVerseNote] Échec de l\'ajout de note(s) sur le(s) verset(s) :', err);
      ToastAndroid.show('Une erreur est survenue lors de l\'ajout de note(s) sur le(s) verset(s).', ToastAndroid.LONG);
    }
  };
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: color?.bg, borderColor: color?.text }]}>
        {!onSearch && <View style={styles.flexRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={color?.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: color?.text }]}>
            {affichage}
          </Text>
        </View>}

        {onSearch &&
          <View style={[
            styles.flexRow,
            { width: onSearch ? '90%' : 'auto', borderColor: `${color?.text}80`, backgroundColor: `${color?.text}10`, marginVertical: 4, borderWidth: 1, borderRadius: 20, }
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
          {!onSearch && <Pressable
            onPress={() => setModalVisible(true)}
            style={[styles.flexRow, { width: 32, height: 32, justifyContent: 'center', }]}
          >
            <Ionicons name={"text"} size={22} color={color?.text} />
          </Pressable>}
          <Pressable
            onPress={() => { setOnSearch((prev) => !prev); onSearch && setSearch('') }}
            style={[styles.flexRow, { width: 32, height: 32, justifyContent: 'center', }]}
          >
            <Ionicons name={onSearch ? "close" : "search"} size={24} color={color?.text} />
          </Pressable>
        </View>
      </View>

      {selectedVerse.length > 0 && (
        <Animated.View
          entering={FadeInDown.duration(150)}
          exiting={FadeOutDown.duration(200).delay(250)}
          layout={LinearTransition.springify().damping(15)}
          style={[
            styles.buttonFlotting,
            styles.flexCol,
            { width: "auto", height: "auto", bottom: 90, right: 10, backgroundColor: `${color?.bg}ef`, padding: 10, paddingVertical: 15, gap: 12, overflow: "hidden", },
          ]}
        >
          <Animated.View
            entering={FadeInDown.delay(0).duration(200).springify().damping(15)}
            exiting={FadeOutUp.delay(200).duration(150)}
          >
            <Ionicons onPress={copyToClipboard} name={copied ? "checkmark" : "copy-outline"} size={22} color={color?.text} />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(50).duration(200).springify().damping(15)}
            exiting={FadeOutUp.delay(150).duration(150)}
          >
            <Ionicons onPress={handleFavorite} name={favorited ? "checkmark" : "heart"} size={26} color={color?.text} />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(100).duration(200).springify().damping(15)}
            exiting={FadeOutUp.delay(100).duration(150)}
          >
            {!archived ? (
              <Entypo onPress={handleArchive} name={"archive"} size={26} color={color?.text} />
            ) : (
              <Ionicons name={"checkmark"} size={26} color={color?.text} />
            )}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(200).springify().damping(15)}
            exiting={FadeOutUp.delay(50).duration(150)}
          >
            <Ionicons onPress={() => setShowNote(true)} name="document-text-outline" size={26} color={color?.text} />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(200).springify().damping(15)}
            exiting={FadeOutUp.delay(0).duration(150)}
          >
            <Ionicons name="close" size={26} color={color?.text} onPress={() => setSelectedVerse([])} />
          </Animated.View>
        </Animated.View>
      )}

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

      <View style={[styles.footer, { backgroundColor: color?.bg, borderColor: color?.text, borderWidth: 0, paddingVertical: 15 }]}>
        <Pressable style={[styles.buttonFooter, { borderColor: color?.text, backgroundColor: `${color?.bg}30`, }]} onPress={() => handleBtnFooterPress("prev")}>
          <Ionicons name="chevron-back" size={16} color={color?.text} />
          <Text style={[styles.buttonFooterText, { color: color?.text, fontSize: 12 }]}> {prev?.chapter ? prev?.bookName : books[books.length - 1].short_name}. {prev?.chapter ? prev.chapter : 22}  </Text>
        </Pressable>
        <Pressable style={[styles.buttonFooter, { borderColor: color?.text, backgroundColor: `${color?.text}`, padding: 14, paddingHorizontal: 18, borderStyle: 'solid' }]} onPress={() => handleBtnFooterPress("bible")}>
          <Text style={[styles.buttonFooterText, { color: color?.bg, fontSize: 16 }]}>{info.appName}</Text>
        </Pressable>
        <Pressable style={[styles.buttonFooter, { borderColor: color?.text, backgroundColor: `${color?.bg}30`, gap: 2 }]} onPress={() => handleBtnFooterPress("next")}>
          <Text style={[styles.buttonFooterText, { color: color?.text, fontSize: 12 }]}>  {next?.chapter ? next?.bookName : books[0].short_name}. {next?.chapter ? next.chapter : 1} </Text>
          <Ionicons name="chevron-forward" size={16} color={color?.text} />
        </Pressable>
      </View>

      <AppModal visible={modalVisible} onClose={() => setModalVisible(false)} color={color?.bg} position="bottom">
        <View style={{ paddingHorizontal: 8 }}>
          <Text style={[styles.headerTitle, { color: color?.text, marginBottom: 10 }]}>{language.settingRead.title}</Text>

          <Text style={[styles.modalTitle, { color: color?.text }]}>{language.settingRead.fontSize}</Text>
          <View style={[styles.flexRow, { justifyContent: "space-between", marginBottom: 8 }]}>
            {[14, 16, 18, 20, 22, 24, 26, 28].map((size) => {
              const isSelected = size === fontSize;
              return (
                <Pressable
                  key={size}
                  onPress={() => editFontSize(size)}
                  style={[{ borderColor: color?.text, backgroundColor: isSelected ? `${color?.text}` : `${color?.text}30`, padding: isSelected ? 10 : 6, paddingHorizontal: isSelected ? 12 : 8, borderRadius: 20 }]}
                >
                  <Text style={[{ color: isSelected ? color?.bg : color?.text }]}>{size}</Text>
                </Pressable>
              )
            })}
          </View>

          <Text style={[styles.modalTitle, { color: color?.text, marginTop: 15 }]}>{language.settingRead.textAlign}</Text>
          <View style={[styles.flexRow, { marginBottom: 8, gap: 10 }]}>
            {["left", "center", "justify"].map(p => {
              const isSelected = p === textAlign;
              return (
                <Pressable
                  key={p}
                  onPress={() => editTextAlign(p as "left")}
                  style={[{ borderColor: color?.text, backgroundColor: isSelected ? `${color?.text}` : `${color?.text}30`, padding: isSelected ? 10 : 6, borderRadius: 10 }]}
                >
                  <Feather name={`align-${p}` as "bold"} size={30} color={isSelected ? color?.bg : color?.text} />
                </Pressable>
              )
            })}
          </View>

          <Text style={[styles.modalTitle, { color: color?.text, marginTop: 15 }]}>{language.settingRead.header}</Text>
          <View style={[styles.flexRow, { marginBottom: 8, gap: 10 }]}>
            <Pressable
              onPress={() => editTiteFormat('row')}
              style={[{
                borderColor: color?.text,
                backgroundColor: titeFormat === 'row'
                  ? color?.text
                  : `${color?.text}30`,
                padding: 6,
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
                  : color?.text,
              }}>
                <Text style={{ color: titeFormat === 'row' ? color?.bg : color?.text }}>{language.settingRead.bible.book}</Text>
                <View style={{
                  width: 2,
                  height: "100%",
                  backgroundColor: titeFormat === 'row' ? color?.bg : color?.text,
                  marginRight: 6,
                  marginLeft: 4,
                }} />
                <Text style={{ color: titeFormat === 'row' ? color?.bg : color?.text }}>{language.settingRead.bible.chapter}</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => editTiteFormat('col')}
              style={[{
                borderColor: color?.text,
                backgroundColor: titeFormat === 'col'
                  ? color?.text : `${color?.text}30`,
                padding: 6,
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
                <Text style={{ color: titeFormat !== 'row' ? color?.bg : color?.text }}>{language.settingRead.bible.book}</Text>
                <View style={{
                  width: "100%",
                  height: 2,
                  marginBottom: 6,
                  marginTop: 4,
                  backgroundColor: titeFormat !== 'row' ? color?.bg : color?.text
                }} />
                <Text style={{ color: titeFormat !== 'row' ? color?.bg : color?.text }}>{language.settingRead.bible.chapter}</Text>
              </View>
            </Pressable>
          </View>

          <Pressable onPress={() => { setModalVisible(false); handleUpdateSetting() }} style={[styles.showAllButton, { backgroundColor: color?.text, borderColor: color?.text, borderStyle: "solid", marginBottom: 0, borderRadius: 50 }]}>
            <Text style={[styles.showAllButtonText, { color: color?.bg }]}>{language.settingRead.buttonText}</Text>
          </Pressable>
        </View>
      </AppModal>

      <AppModal visible={showNote} onClose={() => setShowNote(false)} closeOnBackdrop={true} position="center">
        <View>
          <Text style={[styles.modalTitle, { color: color?.text, fontSize: 18 }]}>{language.selectText} {language.notesText}</Text>

          <TextInput
            value={searchNote}
            placeholder={`${language.searchText} ...`}
            placeholderTextColor={`${color?.text}80`}
            onChangeText={(e) => setNoteSearch(e.trim())}
            style={[{ backgroundColor: color?.text + "30", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginBottom: 10, }]}
          />

          {filteredNotes.length > 0 && filteredNotes.map((n, i) => {
            const isSelected = selectedNotes.includes(n);
            return (
              <Pressable key={i} onPress={() => handleSelectNote(n)} style={[styles.item, { backgroundColor: color?.bg + "40", borderRadius: 10, justifyContent: "space-between" }]}>
                <ThemedText numberOfLines={1}>{n.title}</ThemedText>
                <Ionicons name={isSelected ? "radio-button-on" : "radio-button-off"} size={20} color={color?.text} />
              </Pressable>
            )
          })}

          {selectedNotes.length > 0 && (
            <Pressable onPress={() => handleAddVerseNote()} style={[styles.button, { backgroundColor: color?.bg, borderColor: color?.bg, justifyContent: "center" }]}>
              <Text style={[styles.showAllButtonText, { color: color?.text, }]}>{language.addText}</Text>
            </Pressable>
          )}

          {filteredNotes.length === 0 && searchNote.length > 0 && (
            <ThemedText style={[styles.item, { textAlign: "center" }]}>{language.noteTitleText}</ThemedText>
          )}

          {filteredNotes.length === 0 && searchNote.length === 0 && (
            <View style={[styles.flexRow, { gap: 10 }]}>
              <Pressable onPress={() => setShowNote(false)} style={[styles.item, { backgroundColor: color?.bg + "40", borderRadius: 10, justifyContent: "center" }]}>
                <ThemedText >{language.addNoteText}</ThemedText>
              </Pressable>
            </View>
          )}
        </View>
      </AppModal>
    </ThemedView>
  );
}
