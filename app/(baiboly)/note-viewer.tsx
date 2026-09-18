import * as noteDB from '@/api/notes.repository'
import DeleteConfirm from '@/components/delete-confirm'
import { SegmentsViewer } from '@/components/segments-viewer'
import { ThemedView } from '@/components/themed-view'
import { getTranslation } from '@/constants/text'
import { useApp } from '@/contexts/app.context'
import { verseBible } from '@/types/bible'
import { formatDateHeure } from '@/utils/date.utils'
import { capitalizeText, convertVersesToArrayNumber } from '@/utils/text.util'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, ToastAndroid, View } from 'react-native'
import { styles } from '../(tabs)'
import { Note } from './../../api/notes.repository'

const NoteViewer = () => {
  const { color, langues, noteVerses, books, getNoteVerses, removeNoteVerse } = useApp();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const t = getTranslation(langues?.appLng || "mg");

  const [data, setData] = useState<Note | null>(null);
  const [open, setOpen] = useState(false);
  const [verseText, setVerseText] = useState<verseBible[]>([]);

  async function fetchNote() {
    if (id) {
      const note = await noteDB.getNoteById(Number(id));
      if (note) {
        setData(note);
      }
      return;
    }
  }

  useFocusEffect(useCallback(() => { fetchNote(); }, []),);

  async function getVerseNote() { if (id) return getNoteVerses(Number(id)); }

  useEffect(() => { getVerseNote(); }, [id]);

  function fetchVerseNote() {
    if (noteVerses) {
      const text = noteVerses
        .map((noteVerse) => ({
          id: noteVerse.id,
          book_number: noteVerse.book_number || 0,
          chapter: noteVerse.chapter || 0,
          verse: convertVersesToArrayNumber(noteVerse.verse || '')[0],
          text: noteVerse.verse || '',
        }));

      setVerseText(text);
    } else {
      setVerseText([]);
    }
  }

  useEffect(() => { fetchVerseNote() }, [noteVerses]);

  function handleClose() { setOpen(false); }

  async function deleteNote(reason: string) {
    if (reason === 'cancel') return handleClose();
    if (!data) return handleClose();
    if (data.id) {
      const res = await noteDB.deleteNote(data.id);
      if (res.success) {
        handleClose();
        router.back();
        ToastAndroid.show("Note supprimer avec succès.", ToastAndroid.SHORT)
      }
    }
  }

  function handleReading(v: verseBible) {
    const array = convertVersesToArrayNumber(v.text);
    if (verseText.length > 0) {
      router.push({ pathname: `/book-reading`, params: { bookId: v.book_number, chapterId: v.chapter, startVerse: array[0], endVerse: array[array.length - 1] } });
    }
  }

  return (
    <ThemedView style={[styles.container, { position: 'relative' }]}>
      <View style={[styles.header, { backgroundColor: color?.bg, justifyContent: 'flex-start', alignItems: 'center', gap: 12, paddingTop: 35 }]} >
        <Ionicons onPress={() => router.back()} name="chevron-back" size={26} color={color?.text} />
        <View style={[styles.flexCol, { alignItems: 'flex-start', width: '80%', gap: 1 }]}>
          <Text numberOfLines={1} style={[styles.headerTitle, { textAlign: "left", color: color?.text, fontWeight: '400', fontSize: 18, width: '100%', marginVertical: 0 }]}>
            {data?.title || t.noteTitleText}
          </Text>
          <Text style={{ color: `${color?.text}af`, fontSize: 10 }}>{capitalizeText(formatDateHeure(data?.created_at || new Date()))}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, {}]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.bookTitle, { color: color?.text, marginBottom: 20, fontSize: 22, textAlign: 'left' }]}>{data?.title || 'Pas de titre'}</Text>

        <View style={[styles.flexRow, { marginBottom: 20, gap: 4, flexWrap: 'wrap' }]}>
          {verseText.map((verse, index) => {
            const verseT = convertVersesToArrayNumber(verse.text);
            const bookName = books?.find((book) => book.book_number === verse.book_number)?.short_name
            return (
              <Text
                key={index}
                onPress={() => handleReading(verse)}
                onLongPress={() => { removeNoteVerse(verse.id as number); getVerseNote(); }}
                style={{ padding: 4, paddingHorizontal: 10, borderRadius: 20, backgroundColor: color?.text + '30', color: color?.text, fontSize: 12 }}
              >
                {bookName}. {verse.chapter} : {verseT[0]}{verseT.length > 1 && ` - ${verseT[verseT.length - 1]}`}
              </Text>
            )
          })}
        </View>

        <SegmentsViewer content={data?.content as string} />
      </ScrollView>

      <Pressable onPress={() => router.push({ pathname: '/note-input', params: { id: data?.id } })} style={[styles.buttonFlotting, { backgroundColor: color?.bg, bottom: 120, right: 30, width: 50, height: 50 }]}>
        <MaterialIcons name='edit-document' size={22} color={color?.text} />
      </Pressable>

      <Pressable onPress={() => setOpen(true)} style={[styles.buttonFlotting, { backgroundColor: color?.bg, bottom: 60, right: 30, width: 50, height: 50 }]}>
        <Ionicons name='trash-outline' size={22} color={'red'} />
      </Pressable>

      <DeleteConfirm visible={open} deleteTitle={t.deleteNoteText} onClose={deleteNote} />
    </ThemedView>
  );
}

export default NoteViewer;