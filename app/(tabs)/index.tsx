import { Archive } from '@/api/archives.repository';
import { Favorite } from '@/api/favories.repository';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { VerseText } from '@/components/verse-text';
import { getInfo, getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { verseBible, verseRandom } from '@/types/bible';
import { getBookById, getOneVerse, getVerseByChapterId } from '@/utils/bible.util';
import { formatDateHeure } from '@/utils/date.utils';
import { images } from '@/utils/image.util';
import { capitalizeText, convertVersesToArrayNumber, parseVerse } from '@/utils/text.util';
import { Entypo, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RelativePathString, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookIndex() {
  const { color, image, isDark, books, verses, langues, lastReads, newTestament, oldTestament, notes, archives, favorites, prayer, removeLastRead, updateLastRead } = useApp();
  const router = useRouter();
  const [verse, setVerse] = React.useState<verseRandom>();
  const [language, setLanguage] = useState(getTranslation(langues?.appLng || "mg"));
  const [archive, setArchive] = useState<verseBible[] | undefined>(undefined);
  const [favorite, setFavorite] = useState<verseBible[] | undefined>(undefined);
  const [archiveItem, setArchiveItem] = useState<Archive | undefined>(undefined);
  const [favoriteItem, setFavoriteItem] = useState<Favorite | undefined>(undefined);

  const l = getTranslation(langues?.bibleLng || "mg");
  const infoText = getInfo(langues?.appLng || "mg");
  const appName = getInfo(langues?.bibleLng || "mg").appName;

  const get = useCallback(
    () => {
      if (langues) {
        const verse = getOneVerse(verses, books);
        setVerse(verse);
        setLanguage(getTranslation(langues.appLng || "mg"))
      }
    },
    [langues, verses, books],
  )

  useEffect(() => {
    get();
  }, [langues, verses, books]);

  const old = `( ${getBookById(oldTestament[0]?.book_number, oldTestament)?.long_name} - ${getBookById(oldTestament[oldTestament.length - 1]?.book_number, oldTestament)?.long_name} )`;
  const newt = `( ${getBookById(newTestament[0]?.book_number, newTestament)?.long_name} - ${getBookById(newTestament[newTestament.length - 1]?.book_number, newTestament)?.long_name} )`;

  const stats = [
    {
      value: archives.length > 99 ? '99+' : archives.length,
      label: language.archivesText,
      icon: "archive",
      lightBg: "#e6f4ff",
      darkBg: "#173247",
      lightText: "#1671b8",
      darkText: "#5db8f5",
      lightLabel: "#315a73",
      darkLabel: "#b5ddf5",
      route: 'verse-archived'
    },
    {
      value: favorites.length > 99 ? '99+' : favorites.length,
      label: language.favoritesText,
      icon: "heart",
      lightBg: "#ffd6d6",
      darkBg: "#3d1818",
      lightText: "#9b0000",
      darkText: "#f55151",
      lightLabel: "#6b1818",
      darkLabel: "#f0a0a0",
      route: 'verse-favoris'
    },
    {
      value: notes.length > 99 ? '99+' : notes.length,
      label: language.noteText,
      icon: "document-text",
      lightBg: "#e9f8ed",
      darkBg: "#183a24",
      lightText: "#258a45",
      darkText: "#62d98a",
      lightLabel: "#396548",
      darkLabel: "#b9e8c8",
      route: 'my-note'
    },
  ];

  const renderHeader = () => {
    return (
      <View style={{ width: "100%", height: "100%", position: "relative" }}>
        <View style={[styles.flexCol, styles.headerParallax, { justifyContent: 'center', paddingVertical: 0 }]}>
          <View style={[styles.flexRow, { justifyContent: "space-between", width: "100%" }]}>
            <Text style={[styles.headerTitle, { color: !isDark ? color?.bg : color?.text, fontSize: 24 }]}>{appName}</Text>
            <View style={styles.flexRow}>
              <Pressable>
                <Ionicons name="information-circle" size={26} color={!isDark ? color?.bg : color?.text} />
              </Pressable>
            </View>
          </View>

          <Pressable onPress={() => router.push("/app-search-global")} style={[styles.flexRow, styles.searchInput, { justifyContent: "space-between", width: "100%", borderWidth: 1, borderColor: !isDark ? color?.bg : color?.borderColor, backgroundColor: `${!isDark ? color?.text : color?.bg}60`, paddingVertical: 10 }]}>
            <Text style={[styles.searchInputText, { color: !isDark ? color?.bg : color?.text }]}>{language.searchText} ....</Text>
            <Ionicons name="search" size={22} color={!isDark ? color?.bg : color?.text} />
          </Pressable>

          <Text
            numberOfLines={4}
            style={[styles.headerTitle, { color: "#fff", fontSize: 16, marginVertical: 0, marginTop: 8 }]}
          >
            {verse?.text && `"${capitalizeText(verse?.text || "")}"`}
          </Text>
          {verse?.book && <Text
            onPress={() => router.push({ pathname: '/(baiboly)/book-reading', params: { bookId: verse?.book_number, chapterId: verse?.chapter, startVerse: verse?.verse } })}
            style={[styles.headerTitle, { color: isDark ? color?.bg : color?.text, backgroundColor: `${isDark ? color?.text : color?.bg}`, fontSize: 12, marginVertical: 0, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }]}
          >
            {`${verse?.book}. ${verse?.chapter} : ${verse?.verse}`}
          </Text>}
        </View>
        <Image style={{ width: "100%", height: "100%" }} resizeMode="cover" source={images[(image?.image_index || 0) - 1]} />
      </View>
    );
  }

  function getText(bookId: number, chapter: number, verseNumbers: number[]) {
    const book = getVerseByChapterId(bookId, chapter, books, verses);
    return book.verses.filter((v) => verseNumbers.includes(v.verse)).map((v) => v);
  }

  useEffect(() => {
    if (!archives || archives.length === 0) return;
    if (!books?.length || !verses?.length) return;

    const archiveItem = archives[0];
    const archive = archiveItem
      ? getText(archiveItem.book_number, archiveItem.chapter, convertVersesToArrayNumber(archiveItem.verses as string))
      : [];

    setArchive(archive as verseBible[]);
    setArchiveItem(archiveItem as Archive);
  }, [archives, books, verses]);

  useEffect(() => {
    if (!favorites || favorites.length === 0) return;
    if (!books?.length || !verses?.length) return;

    const favoriteItem = favorites[0];
    const favorite = favoriteItem
      ? getText(favoriteItem.book_number, favoriteItem.chapter, convertVersesToArrayNumber(favoriteItem.verse as string))
      : [];

    setFavorite(favorite as verseBible[]);
    setFavoriteItem(favoriteItem as Favorite);
  }, [favorites, books, verses]);

  return (
    <ParallaxScrollView
      headerBg={{ dark: "#000", light: "#fff" }}
      headerImage={renderHeader()}
      bg={color?.bg}
    >
      {/* Bible */}
      <View style={[styles.flexRow, { justifyContent: 'center', width: '100%' }]}>
        <Pressable
          style={[styles.bookCard, {
            backgroundColor: isDark ? "#3d3418" : "#fff4d6",
            borderColor: 'transparent',
            alignItems: "flex-start",
            gap: 3,
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 20
          }]}
        >
          <Text style={[styles.bookTitle, { color: isDark ? "#f5c451" : "#8a5a00", fontSize: 40 }]}>
            {oldTestament.length}
            <Text style={{ fontSize: 16, fontWeight: '400', color: isDark ? "#d9b876" : "#a67c2e" }}>{"  "}{l.bookText}</Text>
          </Text>
          <Text style={[styles.bookTitle, { color: isDark ? "#f0d9a0" : "#6b5218" }]}>{l.oldTest}</Text>
          <Text style={[styles.bookTitle, { color: isDark ? "#b8a476" : "#a8925f", fontSize: 12 }]}>{old}</Text>
        </Pressable>

        <Pressable
          style={[styles.bookCard, {
            backgroundColor: isDark ? "#2a1a3d" : "#f2e6fa",
            borderColor: 'transparent',
            alignItems: "flex-start",
            gap: 3,
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 20
          }]}
        >
          <Text style={[styles.bookTitle, { color: isDark ? "#c084fc" : "#7c3aed", fontSize: 40 }]}>
            {newTestament.length}
            <Text style={{ fontSize: 16, fontWeight: '400', color: isDark ? "#d8b4fe" : "#9061c7" }}>{"  "}{l.bookText}</Text>
          </Text>
          <Text style={[styles.bookTitle, { color: isDark ? "#e9d5ff" : "#5b21b6" }]}>{l.newTest}</Text>
          <Text style={[styles.bookTitle, { color: isDark ? "#a78bbf" : "#a78bbf", fontSize: 12 }]}>{newt}</Text>
        </Pressable>
      </View>

      {/* STATS */}
      <View style={[styles.flexRow, { justifyContent: "center", width: "100%", gap: "2%" }]}>
        {stats.map((item, index) => (
          <Pressable
            onPress={() => router.push(item.route as RelativePathString)}
            key={index}
            style={[styles.bookCard, styles.statCard, { backgroundColor: isDark ? item.darkBg : item.lightBg, },]}
          >
            <Text style={[styles.bookTitle, { color: isDark ? item.darkText : item.lightText, fontSize: 30, textAlign: "center", },]} >
              {item.value}
            </Text>

            <Text style={[styles.bookTitle, { color: isDark ? item.darkLabel : item.lightLabel, textAlign: "left", fontSize: 12, },]} >
              {item.label}
            </Text>

            {item.icon !== 'archive' ? <Ionicons
              name={item.icon as any}
              size={20}
              color={isDark ? item.darkText : item.lightText}
              style={{ position: "absolute", top: '25%', right: 10 }}
            /> : <Entypo
              name={item.icon as any}
              size={20}
              color={isDark ? item.darkText : item.lightText}
              style={{ position: "absolute", top: '25%', right: 10 }}
            />}
          </Pressable>
        ))}
      </View>

      {/* PRAYER */}
      <View style={[styles.flexCol, { alignItems: 'flex-start', marginBottom: 10 }]}>
        <View style={{ borderRadius: 20, backgroundColor: isDark ? '#ffffff0f' : '#0000000f', paddingVertical: 12, paddingHorizontal: 18, position: "relative", overflow: "hidden" }}>
          <MaterialCommunityIcons name="hands-pray" size={30} color={`${color?.text}a0`} style={{ position: "absolute", bottom: 10, right: 10 }} />
          <MaterialCommunityIcons name="hands-pray" size={30} color={`${color?.text}a0`} style={{ position: "absolute", bottom: 10, left: 10 }} />
          <View style={[styles.flexCol,]}>
            <Text style={[styles.bookTitle, { color: color?.text, fontSize: 20, textAlign: "center" }]}>{prayer?.title}</Text>
            <ThemedText style={[styles.text, { textAlign: "center" }]}>"{prayer?.text}"</ThemedText>
            <Text style={[styles.modalText, { color: `${color?.text}df`, fontWeight: "400", marginTop: 10 }]}>{getInfo(langues?.bibleLng || 'mg').prayerText}</Text>
          </View>
        </View>

      </View>

      {/* Cards */}
      <View style={[styles.flexRow, { justifyContent: "space-between", alignItems: "flex-start", width: "100%", gap: "2%" }]}>

        {archive && archive.length > 0 && archiveItem && (
          <Pressable onPress={() => router.push(`/verse-archived`)} style={[styles.bookCard, { backgroundColor: `${isDark ? stats[0].darkBg : stats[0].lightBg}${isDark ? '90' : "40"}`, borderColor: `${isDark ? stats[0].darkText : stats[0].lightText}40`, alignItems: "flex-start", position: "relative", padding: 8, }]}
          >
            <Text style={[styles.bookTitle, { color: isDark ? stats[0].darkText : stats[0].lightText, fontSize: 16, marginBottom: 8 }]}>{getBookById(archiveItem.book_number, books)?.long_name} {archiveItem.chapter} </Text>
            <Text style={[styles.modalText, { color: color?.text }]} numberOfLines={10}>{
              archive
                .map((v) => (
                  <VerseText onPress={() => router.push(`/verse-archived`)} text={v.text as string} verseNumber={v.verse} color={isDark ? stats[0].darkText : stats[0].lightText} key={v.verse} textAlign="auto" size={12} />
                ))
            }</Text>
            <Text style={[styles.date, { color: isDark ? stats[0].darkText : stats[0].lightText, marginTop: 12, textAlign: "left", fontSize: 10, width: "100%" }]}>{capitalizeText(formatDateHeure(new Date(archiveItem.created_at as string)))}</Text>

            <Entypo name="archive" size={20} color={isDark ? stats[0].darkText : stats[0].lightText} style={{ position: "absolute", top: 0, right: 0, zIndex: 1, padding: 6, borderRadius: 20 }} />
          </Pressable>
        )}

        {favorite && favorite.length > 0 && favoriteItem && (
          <Pressable onPress={() => router.push(`/verse-favoris`)} style={[styles.bookCard, { backgroundColor: `${isDark ? stats[1].darkBg : stats[1].lightBg}${isDark ? '90' : "40"}`, borderColor: `${isDark ? stats[1].darkText : stats[1].lightText}40`, alignItems: "flex-start", position: "relative", padding: 8 }]}
          >
            <Text style={[styles.bookTitle, { color: isDark ? stats[1].darkText : stats[1].lightText, fontSize: 16, marginBottom: 8 }]}>{getBookById(favoriteItem.book_number, books)?.long_name} {favoriteItem.chapter} </Text>
            <Text style={[styles.modalText, { color: isDark ? stats[1].darkText : stats[1].lightText }]} numberOfLines={10}>{
              favorite
                .map((v) => (
                  <VerseText onPress={() => router.push(`/verse-favoris`)} text={v.text as string} verseNumber={v.verse} color={isDark ? stats[1].darkText : stats[1].lightText} key={v.verse} textAlign="auto" size={12} />
                ))
            }</Text>
            <Text style={[styles.date, { color: isDark ? stats[1].darkText : stats[1].lightText, marginTop: 12, textAlign: "left", fontSize: 10, width: "100%" }]}>{capitalizeText(formatDateHeure(new Date(favoriteItem.created_at as string)))}</Text>

            <Ionicons name="heart" size={20} color={isDark ? stats[1].darkText : stats[1].lightText} style={{ position: "absolute", top: 0, right: 0, zIndex: 1, padding: 6, borderRadius: 20 }} />
          </Pressable>
        )}

      </View>

      {/* LAST READ */}
      <View style={[styles.flexCol, { alignItems: 'flex-start', marginBottom: 10 }]}>
        <View style={[styles.flexRow, { justifyContent: "space-between", width: "100%" }]}>
          <Text style={[styles.modalText, { color: color?.text }]}>{infoText.lastReadText}</Text>
          <FontAwesome6 name="book-open-reader" size={22} color={color?.text} />
        </View>
        <View style={[styles.flexRow, { flexWrap: "wrap" }]}>
          {lastReads.length > 0 && lastReads.slice(0, 8).map((last, i) => {
            const book = getBookById(last.book_number, books)?.long_name;
            const text = last.verse ? `${book}. ${last.chapter} : ${last.verse}` : `${book}. ${last.chapter}`
            const start = parseVerse(last.verse as string)[0];
            const end = parseVerse(last.verse as string)[1];
            const params = { bookId: last.book_number, chapterId: last.chapter, startVerse: start, endVerse: end }

            return (
              <TouchableOpacity
                key={i}
                onPress={() => { router.push({ pathname: '/(baiboly)/book-reading', params }); updateLastRead(last.id as number); }}
                onLongPress={() => removeLastRead(last.id as number)}
                style={[{ backgroundColor: `${color?.bg}${isDark ? '90' : "40"}`, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 }]}
              >
                <Text style={[styles.bookTitle, { color: color?.text, }]}>
                  {text}
                </Text>
              </TouchableOpacity>
            )
          })}

          {lastReads.length === 0 && (
            <ThemedText style={[styles.text, { textAlign: "center", marginVertical: 10, width: "100%" }]}>
              {infoText.noLastReadText}
            </ThemedText>
          )}
        </View>
      </View>

    </ParallaxScrollView >
  )
}

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingVertical: 16, paddingHorizontal: 10, paddingBottom: 100 },

  header: { paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: (StatusBar.currentHeight || 0) + 4, overflow: 'hidden' },
  headerTitle: { fontWeight: 'bold', marginVertical: 8, color: "red", textAlign: "center", fontSize: 22 },
  headerParallax: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 1, overflow: "hidden", width: "100%", height: "100%", alignItems: "center", justifyContent: "flex-start", backgroundColor: "#00000071", paddingTop: (StatusBar.currentHeight || 0) + 14, paddingHorizontal: 16 },

  booksContainer: { flexDirection: 'row', flexWrap: 'wrap', width: "100%", gap: 4 },
  bookCard: { marginBottom: 8, padding: 8, borderWidth: 1, borderRadius: 8, borderColor: '#ccc', width: "49.45%" },
  bookTitle: { fontWeight: 'bold', fontSize: 16, textAlign: "center" },

  button: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, padding: 8,
    paddingHorizontal: 16, borderWidth: 1, borderRadius: 8, borderColor: '#ccc', marginVertical: 8
  },
  buttonTitle: { fontWeight: 'bold', fontSize: 16, },
  showAllButton: { alignItems: 'center', marginVertical: 16, borderWidth: 1, borderRadius: 4, borderColor: '#3ECF8E', padding: 12, backgroundColor: "#ffffff98", borderStyle: "dashed" },
  showAllButtonText: { fontWeight: 'bold', fontSize: 16, color: "#3ECF8E" },
  buttonFlotting: { width: 65, height: 65, borderRadius: 50, alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 1, bottom: 60, right: 30 },

  searchInput: { borderRadius: 20, padding: 8, paddingHorizontal: 16, },
  searchInputText: { fontWeight: "bold", fontSize: 16 },

  flexRow: { flexDirection: "row", alignItems: "center", gap: 8, },
  totalMatchesView: { padding: 8, borderWidth: 1, borderColor: "#3ECF8E", borderRadius: 4, marginBottom: 8, alignItems: "center", justifyContent: "center", margin: 8 },
  flexCol: { flexDirection: "column", alignItems: "center", gap: 8 },
  totalMatchesText: { fontWeight: "bold", color: "#3ECF8E" },

  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 8, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  modalTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8, marginTop: 8 },
  modalContent: { padding: 8, paddingHorizontal: 16 },
  modalText: { fontWeight: "bold", fontSize: 16 },
  modalFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 8, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: "#ccc" },
  modalFooterButton: { flexDirection: "row", alignItems: "center", gap: 8, padding: 8, borderWidth: 1, borderRadius: 8, borderColor: '#ccc', marginVertical: 2 },
  modalFooterButtonText: { fontWeight: 'bold', fontSize: 16, },

  footer: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 2, padding: 8,
    paddingHorizontal: 16, borderRadius: 4, paddingBottom: 18, borderWidth: 1, borderTopRightRadius: 20, borderTopLeftRadius: 20, borderBottomWidth: 0
  },
  buttonFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 2, padding: 8, borderRadius: 8, borderColor: '#ccc', marginVertical: 2, borderWidth: 1, borderStyle: "dashed" },
  buttonFooterText: { fontWeight: 'bold', fontSize: 16, },
  cardColor: { width: '48%', height: 150, borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 10, position: 'relative' },

  contact: { alignItems: "center", justifyContent: "center", width: "32%", borderRadius: 10, padding: 10 },

  infoTitle: { fontSize: 16, fontWeight: "700", marginBottom: 5 },
  infoText: { fontSize: 10, lineHeight: 20 },
  version: { textAlign: "center", marginTop: 35, lineHeight: 20 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch", },
  infoLabel: { fontSize: 15, fontWeight: "600", },
  infoImage: { width: 52, height: 52, borderRadius: 15, objectFit: "cover" },
  infoApp: { fontSize: 15, fontWeight: "700", textAlign: "center", marginTop: 10, textTransform: "uppercase" },
  infoAuthor: { fontSize: 13, textAlign: "center", },
  infoCopyright: { fontSize: 12, textAlign: "center", },
  infoSlogan: { fontSize: 13, textAlign: "center", marginTop: 4, fontStyle: "italic", },

  date: { fontWeight: '400', fontSize: 14, },

  statCard: { borderColor: "transparent", alignItems: "flex-start", gap: 3, padding: 10, borderRadius: 15, width: "32%", position: 'relative' },

  text: { fontWeight: 'normal', fontSize: 16, lineHeight: 24, },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, paddingHorizontal: 16, marginBottom: 8, },
})