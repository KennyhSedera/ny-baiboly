import * as noteDB from '@/api/notes.repository'
import AppModal from '@/components/modal'
import { SegmentsViewer } from '@/components/segments-viewer'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { getTranslation } from '@/constants/text'
import { useApp } from '@/contexts/app.context'
import { formatDateHeure } from '@/utils/date.utils'
import { capitalizeText } from '@/utils/text.util'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, ToastAndroid, View } from 'react-native'
import { styles } from '../(tabs)'
import { Note } from './../../api/notes.repository'

const NoteViewer = () => {
  const { color, langues } = useApp();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const t = getTranslation(langues?.appLng || "mg");

  const [data, setData] = useState<Note | null>(null);
  const [open, setOpen] = useState(false);

  async function fetchNote() {
    if (id) {
      const note = await noteDB.getNoteById(Number(id));
      if (note) {
        setData(note);
      }
      return;
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchNote();
    }, []),
  );

  function handleClose() {
    setOpen(false);
  }

  async function deleteNote() {
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

  return (
    <ThemedView style={[styles.container, { position: 'relative' }]}>
      <View
        style={[styles.header, { backgroundColor: color?.bg, justifyContent: 'flex-start', gap: 12 }]}
      >
        <Ionicons onPress={() => router.back()} name="chevron-back" size={26} color={color?.text} />
        <Text style={[styles.headerTitle, { textAlign: "left", color: color?.text, fontWeight: '400', fontSize: 16 }]}>
          {capitalizeText(formatDateHeure(data?.created_at || new Date()))}
        </Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, {}]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.bookTitle, { color: color?.text, marginBottom: 20, fontSize: 24, textAlign: 'left' }]}>{data?.title || 'Pas de titre'}</Text>
        <SegmentsViewer content={data?.content as string} />

      </ScrollView>
      <Pressable onPress={() => router.push({ pathname: '/note-input', params: { id: data?.id } })} style={[styles.buttonFlotting, { backgroundColor: color?.bg, bottom: 120, right: 30, width: 50, height: 50 }]}>
        <MaterialIcons name='edit-document' size={22} color={color?.text} />
      </Pressable>
      <Pressable onPress={() => setOpen(true)} style={[styles.buttonFlotting, { backgroundColor: color?.bg, bottom: 60, right: 30, width: 50, height: 50 }]}>
        <Ionicons name='trash-outline' size={22} color={'red'} />
      </Pressable>

      <AppModal visible={open} position='center' onClose={handleClose} closeOnBackdrop={false} color={color?.bg}>
        <View>
          <Text style={[styles.bookTitle, { fontSize: 24, color: color?.text }]}>{t.deleteNoteText}</Text>
          <ThemedText style={{ fontSize: 14, textAlign: "center", marginVertical: 20 }}>
            {t.confirmDeleteText}
          </ThemedText>
          <View style={[styles.flexRow, { justifyContent: "flex-end", gap: 20 }]}>
            <Pressable onPress={handleClose} style={[styles.button, { borderWidth: 0 }]}>
              <ThemedText style={[styles.buttonTitle]}>{t.cancelText}</ThemedText>
            </Pressable>
            <Pressable onPress={deleteNote} style={[styles.button, { backgroundColor: "red", borderWidth: 0 }]}>
              <Text style={[styles.buttonTitle, { color: "white" }]}>{t.deleteText}</Text>
            </Pressable>
          </View>
        </View>
      </AppModal>
    </ThemedView>
  );
}

export default NoteViewer;