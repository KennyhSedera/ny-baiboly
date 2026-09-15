import { ThemedView } from '@/components/themed-view';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { bookBible } from '@/types/bible';
import { info } from '@/utils/bible.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '.';

const ScreenBooks = () => {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = React.useState<'last' | 'new'>('last');
  const { color, oldTestament, newTestament, langues } = useApp();
  const language = getTranslation(langues?.bibleLng || "mg");

  const handlePress = (bookId: number) => {
    router.push({ pathname: '/book-chapter', params: { bookId } });
  }

  const renderItem = (book: bookBible) => {
    return (
      <Pressable
        key={book.book_number}
        onPress={() => handlePress(book.book_number)}
        style={[styles.bookCard, { borderColor: book.book_color, backgroundColor: `${book.book_color}30` }]}
      >
        <Text style={[styles.bookTitle, { color: book.book_color }]}>{book.long_name}</Text>
      </Pressable>
    )
  }
  return (
    <ThemedView style={styles.container}>

      <View style={[styles.header, { flexDirection: "column", backgroundColor: color?.bg, paddingBottom: 16 },]}>
        <View style={[styles.flexRow, { justifyContent: "space-between", width: "100%", paddingVertical: 8, marginBottom: 8 }]}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color={color?.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { textAlign: "left", color: color?.text, }]}>{info.description}</Text>
          <Ionicons name="information-circle" size={24} color={color?.text} />
        </View>
        <View style={styles.flexRow}>
          <Pressable
            onPress={() => setSelectedBook('last')}
            style={[styles.flexRow, {
              justifyContent: "center", width: "48%", paddingVertical: 8,
              backgroundColor: selectedBook === 'last'
                ? (color?.text)
                : `${color?.text}31`,
              borderRadius: 8
            }]}
          >
            <Text style={[styles.bookTitle, { color: selectedBook === 'last' ? (color?.bg) : (color?.text) }]}>{language.oldTest}</Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedBook('new')}
            style={[styles.flexRow, {
              justifyContent: "center", width: "48%", paddingVertical: 8,
              backgroundColor: selectedBook !== 'last'
                ? (color?.text)
                : `${color?.text}31`, borderRadius: 8
            }]}
          >
            <Text style={[styles.bookTitle, { color: selectedBook !== 'last' ? (color?.bg) : (color?.text) }]}>{language.newTest}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedBook === 'last' ?
          <View style={styles.booksContainer}>
            {oldTestament.map((book) => (
              renderItem(book)
            ))}
          </View> :
          <View style={styles.booksContainer}>
            {newTestament.map((book) => (
              renderItem(book)
            ))}
          </View>
        }
      </ScrollView>
    </ThemedView>
  )
}

export default ScreenBooks