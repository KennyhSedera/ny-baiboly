import { ThemedView } from '@/components/themed-view';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { bookBible } from '@/types/bible';
import { info } from '@/utils/bible.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, PanResponder, Pressable, Text, View } from 'react-native';
import { styles } from '.';

const ScreenBooks = () => {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = React.useState<'last' | 'new'>('last');
  const { color, oldTestament, newTestament, langues } = useApp();
  const language = getTranslation(langues?.bibleLng || "mg");

  const handlePress = (bookId: number) => {
    router.push({ pathname: '/book-chapter', params: { bookId } });
  }

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          setSelectedBook('new');
        } else if (gestureState.dx > 50) {
          setSelectedBook('last');
        }
      },
    })
  ).current;

  const renderItemFlatlist = ({ item }: { item: bookBible }) => (
    <Pressable
      onPress={() => handlePress(item.book_number)}
      style={[styles.bookCard, { borderColor: item.book_color, backgroundColor: `${item.book_color}30`, margin: "1%", width: "48%", paddingVertical: 10 }]}
    >
      <Text style={[styles.bookTitle, { color: item.book_color }]}>{item.long_name}</Text>
    </Pressable>
  );
  return (
    <ThemedView style={styles.container}>

      <View style={[styles.header, { flexDirection: "column", backgroundColor: color?.bg, paddingBottom: 16 },]}>
        <View style={[styles.flexRow, { justifyContent: "space-between", width: "100%", paddingVertical: 8, marginBottom: 8 }]}>

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

      <FlatList
        {...panResponder.panHandlers}
        data={selectedBook === 'last' ? oldTestament : newTestament}
        renderItem={renderItemFlatlist}
        keyExtractor={(item) => item.book_number.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingBottom: 90,
          paddingTop: 4,
        }}
      />
    </ThemedView>
  )
}

export default ScreenBooks