import ParallaxScrollView from '@/components/parallax-scroll-view';
import { getInfo, getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { verseRandom } from '@/types/bible';
import { getBookById, getOneVerse, info } from '@/utils/bible.util';
import { images } from '@/utils/image.util';
import { parseVerse } from '@/utils/text.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import { default as MaterialIcons } from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookIndex() {
  const { color, image, isDark, books, verses, langues, lastReads, removeLastRead, newTestament, oldTestament } = useApp();
  const router = useRouter();
  const [verse, setVerse] = React.useState<verseRandom>();
  const [language, setLanguage] = useState(getTranslation(langues?.appLng || "mg"));

  const l = getTranslation(langues?.bibleLng || "mg");
  const infoText = getInfo(langues?.appLng || "mg");

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

  const renderHeader = () => {
    return (
      <View style={{ width: "100%", height: "100%", position: "relative" }}>
        <View style={[styles.flexCol, styles.headerParallax, {}]}>
          <View style={[styles.flexRow, { justifyContent: "space-between", width: "100%" }]}>
            <Text style={[styles.headerTitle, { color: !isDark ? color?.bg : color?.text, fontSize: 24 }]}>{info.description}</Text>
            <View style={styles.flexRow}>
              <Pressable onPress={() => router.push("/app-setting")}>
                <MaterialIcons name="cog" size={26} color={!isDark ? color?.bg : color?.text} />
              </Pressable>
              <Pressable>
                <Ionicons name="information-circle" size={26} color={!isDark ? color?.bg : color?.text} />
              </Pressable>
            </View>
          </View>

          <Pressable onPress={() => router.push("/app-search-global")} style={[styles.flexRow, styles.searchInput, { justifyContent: "space-between", width: "100%", borderWidth: 1, borderColor: !isDark ? color?.bg : color?.borderColor, backgroundColor: `${!isDark ? color?.text : color?.bg}96`, paddingVertical: 10 }]}>
            <Text style={[styles.searchInputText, { color: !isDark ? color?.bg : color?.text }]}>{language.searchText} ....</Text>
            <Ionicons name="search" size={22} color={!isDark ? color?.bg : color?.text} />
          </Pressable>

          <Text numberOfLines={4} style={[styles.headerTitle, { color: "#fff", fontSize: 14, marginVertical: 0, marginTop: 8 }]}>"{verse?.text}"</Text>
          <Text style={[styles.headerTitle, { color: !isDark ? color?.bg : color?.text, fontSize: 16, marginVertical: 0 }]}> ( {verse?.book}. {verse?.chapter}:{verse?.verse} )</Text>
        </View>
        <Image style={{ width: "100%", height: "100%" }} resizeMode="cover" source={images[(image?.image_index || 0) - 1]} />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: "#004455", light: "#00ccff" }}
      headerImage={renderHeader()}
      bg={color?.bg}
    >
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

      <View style={[styles.flexCol, { alignItems: 'flex-start', marginBottom: 30 }]}>
        <View style={[styles.flexRow, { justifyContent: "space-between", width: "100%" }]}>
          <Text style={[styles.modalText, { color: color?.text }]}>{infoText.lastReadText}</Text>
          <Ionicons name='reader-outline' size={22} color={color?.text} />
        </View>
        <View style={[styles.flexRow, { flexWrap: "wrap" }]}>
          {lastReads.slice(0, 8).map((last, i) => {
            const book = getBookById(last.book_number, books)?.short_name;
            const text = last.verse ? `${book}. ${last.chapter} : ${last.verse}` : `${book}. ${last.chapter}`
            const start = parseVerse(last.verse as string)[0];
            const end = parseVerse(last.verse as string)[1];

            const params = { bookId: last.book_number, chapterId: last.chapter, startVerse: start, endVerse: end }

            return (
              <TouchableOpacity
                key={i}
                onPress={() => router.push({ pathname: '/(baiboly)/book-reading', params })}
                onLongPress={() => removeLastRead(last.id as number)}
                style={[{ backgroundColor: `${color?.bg}${isDark ? '90' : "40"}`, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 }]}
              >
                <Text style={[styles.bookTitle, { color: color?.text, }]}>
                  {text}
                </Text>
              </TouchableOpacity>
            )
          })}
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
})