import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/contexts/app.context';
import { bookBible } from '@/types/bible';
import { getBookById, getChapterByBookId } from '@/utils/bible.util';
import { adjustColor } from '@/utils/color.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '../(tabs)';

const ScreenBookChapter = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [chapters, setChapters] = React.useState<number[]>([]);
  const [book, setBook] = React.useState<bookBible>();
  const { books, verses } = useApp();

  const bookId = Number(params.bookId);

  useEffect(() => {
    if (!bookId) return;
    const chapters = getChapterByBookId(bookId, verses);
    const book = getBookById(bookId, books);

    setChapters(chapters);
    setBook(book);
  }, [bookId, books, verses]);

  const handlePress = (chapter: number) => {
    router.push({
      pathname: '/book-chapter-verse',
      params: { bookId, chapterId: chapter }
    });
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: book?.book_color, borderColor: adjustColor(book?.book_color || "#FFF", -30) }]}>
        <View style={styles.flexRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: "#FFF" }]}>{book?.long_name}</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.booksContainer, styles.scrollContent]} showsVerticalScrollIndicator={false} >
        {chapters?.map((chapter) => (
          <Pressable
            key={chapter}
            onPress={() => handlePress(chapter)}
            style={[styles.bookCard, { width: "19%", borderColor: book?.book_color }]}
          >
            <Text style={[styles.bookTitle, { color: book?.book_color }]}>{chapter}</Text>
          </Pressable>
        ))}
      </ScrollView>

    </ThemedView>
  )
}

export default ScreenBookChapter
