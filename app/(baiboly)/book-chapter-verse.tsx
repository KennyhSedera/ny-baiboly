import { ThemedView } from '@/components/themed-view';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { getBookById, getVerseNumberByChapterId, } from '@/utils/bible.util';
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
  const { isDark, books, verses, langues, color, addNewLastRead } = useApp();

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
    router.push({ pathname: '/book-reading', params: { bookId, chapterId, startVerse: selected.start, endVerse: selected.end } });
    addNewLastRead({ book_number: Number(bookId), chapter: Number(chapterId), verse: selected.end ? `${selected.start} - ${selected.end}` : selected.start ? `${selected.start}` : "" });
  }

  const textTitle = selected.start !== undefined ? `${book?.short_name}. ${chapterId} : ${selected.start} ${selected.end ? `- ${selected.end}` : ''}` : `${book?.long_name} ${chapterId}`

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: color?.bg, borderColor: color?.text },]} >
        <View style={styles.flexRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={color?.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: color?.text, },]} >
            {book?.long_name} {chapterId}
          </Text>
        </View>
      </View>

      <Pressable onPress={() => hanleRead()} style={[styles.button, { backgroundColor: `${color?.bg}30`, borderColor: color?.bg, marginHorizontal: 10 }]}>
        <Text style={[styles.headerTitle, { color: color?.text, fontWeight: '600', fontSize: 16, }]}>
          {textTitle}
        </Text>
        <Text style={[styles.headerTitle, { color: color?.text, fontWeight: '500', fontSize: 14 }]}> {langText.buttonRead} </Text>
      </Pressable>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.booksContainer, styles.scrollContent,]}
        showsVerticalScrollIndicator={false}
      >
        {verseNumbers?.map((verse) => {
          const selectedVerse = isSelected(verse);

          return (
            <Pressable
              key={verse}
              onPress={() => handlePress(verse)}
              style={[
                styles.bookCard,
                { width: '19%', backgroundColor: selectedVerse ? `${book?.book_color}` : `${book?.book_color}30`, },
                { borderColor: selectedVerse ? book?.book_color : `${book?.book_color}30` },
              ]}
            >
              <Text
                style={[
                  styles.bookTitle,
                  { color: selectedVerse ? '#fff' : `${book?.book_color}`, },
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