import ParallaxScrollView from '@/components/parallax-scroll-view';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { verseRandom } from '@/types/bible';
import { getOneVerse, info } from '@/utils/bible.util';
import { images } from '@/utils/image.util';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { default as MaterialCommunityIcons, default as MaterialIcons } from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function BookIndex() {
  const { color, image, isDark, books, verses, langues } = useApp();
  const router = useRouter();
  const [verse, setVerse] = React.useState<verseRandom>();
  const [language, setLanguage] = useState(getTranslation(langues?.appLng || "mg"));

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
      <View style={[styles.booksContainer, { justifyContent: 'space-between' }]}>
        <Pressable onPress={() => router.push("/book")} style={[styles.bookCard, { borderColor: color?.borderColor, backgroundColor: `${color?.bg}96`, alignItems: "center", width: '48%' }]}>
          <FontAwesome5 name="bible" size={60} color={color?.text} />
          <Text style={[styles.bookTitle, { color: color?.text, marginTop: 8 }]}>
            {language.bibleText}
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push("/app-setting")} style={[styles.bookCard, { borderColor: color?.borderColor, backgroundColor: `${color?.bg}96`, alignItems: "center", width: '48%' }]}>
          <FontAwesome5 name="cog" size={60} color={color?.text} />
          <Text style={[styles.bookTitle, { color: color?.text, marginTop: 8 }]}>
            {language.settingText}
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push("/my-note")} style={[styles.bookCard, { borderColor: color?.borderColor, backgroundColor: `${color?.bg}96`, alignItems: "center", width: '48%' }]}>
          <MaterialCommunityIcons name="clipboard-edit-outline" size={60} color={color?.text} />
          <Text style={[styles.bookTitle, { color: color?.text, marginTop: 8 }]}>
            {language.noteText}
          </Text>
        </Pressable>
      </View>
    </ParallaxScrollView>
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
})