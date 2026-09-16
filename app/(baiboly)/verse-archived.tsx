import { ThemedView } from '@/components/themed-view';
import { VerseText } from '@/components/verse-text';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { getBookById, getVerseByChapterId } from '@/utils/bible.util';
import { formatDateHeure } from '@/utils/date.utils';
import { capitalizeText, convertVersesToArrayNumber } from '@/utils/text.util';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { styles } from '../(tabs)';

export default function VerseArchived() {
  const router = useRouter();
  const { langues, color, isDark, books, verses, archives: data, removeArchive } = useApp();
  const lang = getTranslation(langues?.appLng || 'mg');

  function getText(bookId: number, chapter: number, verseNumbers: number[]) {
    const book = getVerseByChapterId(bookId, chapter, books, verses);
    return book.verses.filter((v) => verseNumbers.includes(v.verse)).map((v) => v);
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: color?.bg, alignItems: "center" }]}>
        <View style={styles.flexRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={color?.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: color?.text }]}>{lang.archivesText}</Text>
        </View>
        <Entypo name="archive" size={24} color={color?.text} />
      </View>

      {data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(_, item) => 'archive_' + item}
          contentContainerStyle={{ padding: 5, paddingBottom: 30, paddingTop: 10 }}
          renderItem={({ item }) => {
            const verses = getText(item.book_number, item.chapter, convertVersesToArrayNumber(item.verses as string));

            return (
              <View style={[styles.bookCard, { backgroundColor: `${color?.bg}${isDark ? '90' : "40"}`, borderColor: `${color?.borderColor}20`, width: "100%", alignItems: "flex-start", position: "relative", padding: 15 }]}
              >
                <Text style={[styles.bookTitle, { color: color?.text, fontSize: 18, marginBottom: 8 }]}>{getBookById(item.book_number, books)?.long_name} {item.chapter} </Text>
                <Text style={[styles.modalText, { color: color?.text }]}>{
                  verses
                    .map((v) => (
                      <VerseText text={v.text} verseNumber={v.verse} color={color?.text} key={v.verse} textAlign="auto" size={14} />
                    ))
                }</Text>
                <Text style={[styles.date, { color: color?.text, marginTop: 12, textAlign: "right", fontSize: 12, width: "100%" }]}>{capitalizeText(formatDateHeure(new Date(item.created_at as string)))}</Text>

                <Ionicons onPress={() => removeArchive(item.id as number)} name="trash-outline" size={20} color={"#cc0000"} style={{ position: "absolute", top: 10, right: 10, zIndex: 1, padding: 6, backgroundColor: isDark ? "#000" : "#fff", borderRadius: 20 }} />
              </View>
            )
          }}
        />)}

      {data.length === 0 && (
        <View style={[styles.flexCol, { marginTop: 40 }]}>
          <Entypo name="archive" size={60} color={color?.text} />
          <Text style={[styles.modalText, { color: color?.text, textAlign: "center" }]}>{lang.noArchiveText}</Text>
        </View>
      )}
    </ThemedView>
  )
}