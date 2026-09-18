import { HighlightText } from '@/components/highlight-text';
import { ThemedView } from '@/components/themed-view';
import { getInfo, getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { verseRandom } from '@/types/bible';
import { getSearch } from '@/utils/bible.util';
import { adjustColor } from '@/utils/color.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../(tabs)';

export default function AppSearchGlobal() {
  const [search, setSearch] = useState('');
  const { color, books, verses, langues, lastSearchs, isDark, addNewLastRead, addNewLastSearch, removeLastSearch, updateLastSearch } = useApp();
  const [verse, setVerse] = React.useState<verseRandom[]>();
  const router = useRouter();
  const text = getTranslation(langues?.appLng as 'mg')
  const infoText = getInfo(langues?.appLng || "mg");

  useEffect(() => {
    if (!search) return setVerse([]);

    if (search.length >= 2) {
      const data = getSearch(search, verses, books);
      setVerse(data as verseRandom[]);
      return;
    }
    return setVerse([]);
  }, [search]);

  function handlePress(verse: verseRandom) {
    router.push({ pathname: '/book-reading', params: { bookId: verse.book_number, chapterId: verse.chapter, startVerse: verse.verse, } })
    addNewLastRead({ book_number: verse.book_number, chapter: verse.chapter, verse: `${verse.verse}`, });
    const existing = lastSearchs.filter(l => l.book_number === verse.book_number && l.chapter === verse.chapter && l.verse === verse.verse)[0]
    existing ? updateLastSearch(existing.id as number) : addNewLastSearch({ book_number: verse.book_number, chapter: verse.chapter, verse: verse.verse, text: verse.text });

    setSearch("");
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: color?.bg }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={color?.text} />
        </Pressable>
        <View style={[styles.flexRow, styles.searchInput, { justifyContent: "space-between", width: "80%", borderWidth: 1, borderColor: color?.borderColor, backgroundColor: `${color?.bg}96`, paddingVertical: 0, marginVertical: 8, borderRadius: 50 }]}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInputText, { color: color?.text, width: '90%', paddingHorizontal: 8, }]}
            placeholder={`${text.searchText} ...`}
            placeholderTextColor={adjustColor(color?.text ?? '', -20)}
          />
          {search && <Ionicons onPress={() => setSearch("")} name="close" size={22} color={color?.text} />}
        </View>
        <Ionicons name="search" size={24} color={color?.text} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4, gap: 8, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {verse && verse?.length === 0 && search.length > 2 && (
          <View style={[styles.flexCol, { justifyContent: 'center', marginTop: 20, }]}>
            <Ionicons name='search-outline' />
            <MaterialIcons name="content-paste-off" size={80} color={color?.text} />
            <Text style={{ color: color?.text, fontSize: 16 }}>{text.searchResult.noValue} "{search}"</Text>
          </View>
        )}

        {verse && verse?.length === 0 && !search && lastSearchs.length === 0 && (
          <View style={[styles.flexCol, { justifyContent: 'center', marginTop: 20 }]}>
            <Ionicons name='search-outline' size={60} color={color?.text} />
            <Text style={{ color: color?.text }}>{text.searchResult.empty}</Text>
          </View>
        )}

        {verse && verse?.length > 0 && verse?.map((verse, index) => (
          <Pressable
            key={index}
            style={[styles.flexCol, { backgroundColor: `${color?.bg}${isDark ? '90' : "40"}`, alignItems: "flex-start", padding: 8, paddingHorizontal: 12, borderRadius: 10 }]}
            onPress={() => handlePress(verse)}
          >
            <Text style={{ color: color?.text, fontSize: 18, fontWeight: "bold" }}>
              {`${verse.book} ${verse.chapter} : ${verse.verse}`}
            </Text>
            <HighlightText
              text={verse.text}
              highlight={search}
              match={{ color: "#cc0000", bg: color?.bg }}
              textStyle={{ color: color?.text }}
            />
          </Pressable>
        ))}

        {lastSearchs && lastSearchs?.length > 0 && search.length === 0 && (
          <View>
            <View style={[styles.flexRow, { justifyContent: "space-between", width: "100%", marginBottom: 15 }]}>
              <Text style={[styles.modalText, { color: color?.text }]}>{infoText.lastSearchText}</Text>
              <Ionicons name='search' size={22} color={color?.text} />
            </View>
            {
              lastSearchs?.map((last, index) => {
                const bookName = books?.find(b => b.book_number === last.book_number)?.long_name || '';
                return (
                  <View key={index} style={[styles.flexRow, { padding: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: `${color?.bg}${isDark ? '90' : "40"}`, width: '100%', marginBottom: 4 }]}>
                    <Pressable
                      style={[styles.flexCol, { alignItems: "flex-start", width: "92%" }]}
                      onPress={() => handlePress({ ...(last as any), book: bookName })}
                      onLongPress={() => removeLastSearch(last.id as number)}
                    >
                      <Text style={{ color: color?.text, fontSize: 18, fontWeight: "bold" }}>
                        {`${bookName} ${last.chapter} : ${last.verse}`}
                      </Text>
                      {last.text && <Text numberOfLines={2} style={{ color: color?.text }}>
                        {last.text}
                      </Text>}
                    </Pressable>
                    <TouchableOpacity onPress={() => removeLastSearch(last.id as number)}>
                      <Ionicons name='trash-outline' size={22} color={'#cc0000'} />
                    </TouchableOpacity>
                  </View>
                )
              })}
          </View>
        )}

      </ScrollView>
    </ThemedView>
  )
}
