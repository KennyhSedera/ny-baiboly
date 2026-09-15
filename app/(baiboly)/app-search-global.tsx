import { HighlightText } from '@/components/highlight-text';
import { ThemedView } from '@/components/themed-view';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { verseRandom } from '@/types/bible';
import { getSearch } from '@/utils/bible.util';
import { adjustColor } from '@/utils/color.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { styles } from '../(tabs)';

export default function AppSearchGlobal() {
  const [search, setSearch] = useState('');
  const { color, isDark, books, verses, langues } = useApp();
  const [verse, setVerse] = React.useState<verseRandom[]>();
  const router = useRouter();
  const text = getTranslation(langues?.appLng as 'mg')

  useEffect(() => {
    if (!search) return setVerse([]);

    if (search.length >= 2) {
      const data = getSearch(search, verses, books);
      setVerse(data as verseRandom[]);
      return;
    }
    return setVerse([]);
  }, [search]);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: color?.bg }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={color?.text} />
        </Pressable>
        <View style={[styles.flexRow, styles.searchInput, { justifyContent: "space-between", width: "80%", borderWidth: 1, borderColor: color?.borderColor, backgroundColor: `${color?.bg}96`, paddingVertical: 2, marginVertical: 8, borderRadius: 50 }]}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInputText, { color: color?.text, width: '90%', paddingHorizontal: 8, }]}
            placeholder={`${text.searchText} ...`}
            placeholderTextColor={adjustColor(color?.text ?? '', -20)}
          />
          <Ionicons onPress={() => setSearch("")} name={search ? "close-circle" : "search"} size={22} color={color?.text} />
        </View>
        <MaterialCommunityIcons name="filter-menu" size={24} color={color?.text} />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexDirection: "column", paddingVertical: 8, paddingHorizontal: 10, gap: 8 }}>
        {verse && verse?.length === 0 && search && (
          <View style={[styles.flexCol, { justifyContent: 'center', backgroundColor: `${color?.bg}90`, paddingVertical: 20, borderRadius: 20, borderWidth: 1, borderColor: color?.borderColor, marginTop: 20, paddingHorizontal: 10 }]}>
            <Ionicons name='search-outline' />
            <MaterialIcons name="content-paste-off" size={80} color={color?.text} />
            <Text style={{ color: color?.text, fontSize: 16 }}>{text.searchResult.noValue} "{search}"</Text>
          </View>
        )}
        {verse && verse?.length === 0 && !search && (
          <View style={[styles.flexCol, { justifyContent: 'center', backgroundColor: `${color?.bg}90`, paddingVertical: 20, borderRadius: 20, borderWidth: 1, borderColor: color?.borderColor, marginTop: 20 }]}>
            <Ionicons name='search-outline' size={80} color={color?.text} />
            <Text style={{ color: color?.text }}>{text.searchResult.empty}</Text>
          </View>
        )}
        {verse && verse?.length > 0 && verse?.map((verse, index) => (
          <Pressable
            key={index}
            style={[styles.flexCol, { borderWidth: 1, borderColor: color?.borderColor, alignItems: "flex-start", padding: 8, borderRadius: 8 }]}
            onPress={() => router.push({ pathname: '/book-reading', params: { bookId: verse.book_number, chapterId: verse.chapter, startVerse: verse.verse, } })}
          >
            <HighlightText
              text={`${verse.book} ${verse.chapter}:${verse.verse}`}
              highlight={search}
              textStyle={{ color: color?.text, fontSize: 16, fontWeight: "bold" }}
              match={{ color: color?.text, bg: color?.bg }}
            />
            <HighlightText
              text={verse.text}
              highlight={search}
              match={{ color: color?.text, bg: color?.bg }}
              textStyle={{ color: isDark ? '#fff' : '#000' }}
            />
          </Pressable>
        ))}

      </ScrollView>
    </ThemedView>
  )
}
