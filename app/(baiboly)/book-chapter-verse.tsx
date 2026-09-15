import { ThemedView } from '@/components/themed-view';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { getBookById, getVerseNumberByChapterId, } from '@/utils/bible.util';
import { adjustColor } from '@/utils/color.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View, } from 'react-native';
import { styles } from '../(tabs)';

interface Selected {
  start: number | undefined;
  end: number | undefined;
}

const BookChapterVerse = () => {
  const { bookId, chapterId } = useLocalSearchParams();
  const router = useRouter();
  const { isDark, books, verses, langues } = useApp();

  const langText = getTranslation(langues?.bibleLng as 'mg')

  const [selected, setSelected] = useState<Selected>({
    start: undefined,
    end: undefined,
  });

  const book = getBookById(Number(bookId), books);

  const verseNumbers = getVerseNumberByChapterId(
    Number(bookId),
    Number(chapterId),
    books,
    verses
  );

  const handlePress = (verse: number) => {
    setSelected((prev) => {
      if (prev.start === undefined) {
        return { start: verse, end: undefined };
      }

      if (prev.end === undefined) {
        if (verse === prev.start) {
          return { start: undefined, end: undefined };
        }
        return {
          start: Math.min(prev.start, verse),
          end: Math.max(prev.start, verse),
        };
      }

      if (verse === prev.start || verse === prev.end) {
        return { start: verse, end: undefined };
      }

      if (verse < prev.start) { return { start: verse, end: prev.end }; }
      if (verse > prev.end) { return { start: prev.start, end: verse }; }

      return { start: prev.start, end: verse };
    });
  };

  const isSelected = (verse: number) => {
    if (selected.start === undefined) { return false; }
    if (selected.end === undefined) { return verse === selected.start; }
    return (verse >= selected.start && verse <= selected.end);
  };

  const hanleRead = () => {
    router.push({ pathname: '/book-reading', params: { bookId, chapterId, startVerse: selected.start, endVerse: selected.end } })
  }

  const textTitle = selected.start !== undefined ? `${book?.short_name}. ${chapterId} : ${selected.start} ${selected.end ? `- ${selected.end}` : ''}` : `${book?.long_name} ${chapterId}`

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: book?.book_color, borderColor: adjustColor(book?.book_color || "#FFF", -30) },]} >
        <View style={styles.flexRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: '#FFF', },]} >
            {book?.long_name} {chapterId}
          </Text>
        </View>
      </View>

      <Pressable onPress={() => hanleRead()} style={[styles.button, { backgroundColor: `${book?.book_color}30`, borderColor: book?.book_color, marginHorizontal: 10 }]}>
        <Text style={[styles.headerTitle, { color: book?.book_color, fontWeight: '600', fontSize: 16, }]}>
          {textTitle}
        </Text>
        <Text style={[styles.headerTitle, { color: book?.book_color, fontWeight: '500', fontSize: 14 }]}> {langText.buttonRead} </Text>
      </Pressable>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.booksContainer, styles.scrollContent,]}
      >
        {verseNumbers?.map((verse) => {
          const selectedVerse = isSelected(verse);

          return (
            <Pressable
              key={verse}
              onPress={() => handlePress(verse)}
              style={[
                styles.bookCard,
                { width: '19%', backgroundColor: selectedVerse ? `${book?.book_color}40` : 'transparent', },
                selectedVerse && { borderColor: book?.book_color },
              ]}
            >
              <Text
                style={[
                  styles.bookTitle,
                  { color: selectedVerse ? book?.book_color : isDark ? "#fff" : "#000", },
                ]}
              >
                {verse}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
};

export default BookChapterVerse;