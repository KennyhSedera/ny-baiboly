import * as noteDB from '@/api/notes.repository'
import DeleteConfirm from '@/components/delete-confirm'
import AppModal from '@/components/modal'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { getTranslation } from '@/constants/text'
import { useApp } from '@/contexts/app.context'
import { adjustColor } from '@/utils/color.util'
import { formatDateHeure } from '@/utils/date.utils'
import { extractPreviewText } from '@/utils/note-content.utils'
import { capitalizeText } from '@/utils/text.util'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { styles } from '.'

export default function MyNote() {
  const { color, langues, isDark } = useApp();
  const router = useRouter();

  const t = getTranslation(langues?.appLng || "mg");

  const [notes, setNotes] = useState<noteDB.Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<noteDB.Note | null>(null);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const fetchNotes = async () => {
    const data = await noteDB.getNotes();
    if (data) {
      const datas = data.filter(n => n.title !== "" || n.content !== "");
      const dataEmpty = data.filter(n => n.title === "" && n.content === "");
      if (dataEmpty.length > 0) {
        dataEmpty.map(n => noteDB.deleteNote(n.id || 0));
      }
      setNotes(datas);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, []),
  );

  const leftColumn = notes.filter((_, i) => i % 2 === 0);
  const rightColumn = notes.filter((_, i) => i % 2 === 1);

  function handleLongPress(params: noteDB.Note) {
    setSelectedNote(params);
    setOpenMenu(true);
  }

  function handleClose() {
    setOpen(false);
    setSelectedNote(null)
  }

  async function deleteNote(v: string) {
    if (v === 'cancel') return handleClose();
    if (!selectedNote) return handleClose();
    if (selectedNote) {
      const res = await noteDB.deleteNote(selectedNote.id || 0);
      if (res.success) {
        handleClose();
        fetchNotes();
        ToastAndroid.show("Note supprimer avec succès.", ToastAndroid.SHORT)
      }
    }
  }

  async function handleCloseMenu() {
    setOpenMenu(false);
    setSelectedNote(null);
  }

  const renderCard = (n: noteDB.Note, key: number) => (
    <TouchableOpacity
      key={key}
      onPress={() => router.push({ pathname: '/note-viewer', params: { id: n.id } })}
      onLongPress={() => handleLongPress(n)}
      style={[styles.bookCard, { width: "100%", borderWidth: 0, backgroundColor: `${color?.bg}${isDark ? 96 : 50}`, gap: 10 }]}
    >
      <Text numberOfLines={2} style={[styles.bookTitle, { color: color?.text, textAlign: 'left' }]}>{n.title || 'Pas de titre'}</Text>
      <ThemedText numberOfLines={4}>{extractPreviewText(n?.content || "")}</ThemedText>
      <Text style={{ color: adjustColor(color?.bg || "", isDark ? 30 : -20), fontSize: 12 }}>{capitalizeText(formatDateHeure(new Date(n.created_at || "")))}</Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={{ flex: 1, position: 'relative' }}>
      <View style={[styles.header, { backgroundColor: color?.bg }]}>
        <Text style={[styles.headerTitle, { textAlign: "left", color: color?.text, }]}>{t.noteText}</Text>
        <Ionicons onPress={() => router.push("/app-search-global")} name="search-circle" size={30} color={color?.text} />
      </View>

      <Pressable onPress={() => router.push('/note-input')} style={[styles.buttonFlotting, { backgroundColor: color?.text, bottom: 90, right: 10 }]}>
        <Ionicons name='add' size={32} color={color?.bg} />
      </Pressable>

      {notes.length > 0 && <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, gap: 10 }}>
            {leftColumn.map((n, i) => renderCard(n, i * 2))}
          </View>
          <View style={{ flex: 1, gap: 10 }}>
            {rightColumn.map((n, i) => renderCard(n, i * 2 + 1))}
          </View>
        </View>
      </ScrollView>}

      {notes.length === 0 && (
        <View style={[styles.flexCol, { marginTop: 40 }]}>
          <Ionicons name="document-text" size={60} color={color?.text} />
          <Text style={[styles.modalText, { color: color?.text, textAlign: "center" }]}>{t.noteEmptyText}</Text></View>
      )}

      <DeleteConfirm visible={open} deleteTitle={t.deleteNoteText} onClose={deleteNote} />

      <AppModal visible={openMenu} position='bottom' onClose={handleCloseMenu} color={color?.bg}>
        <TouchableOpacity
          onPress={() => {
            setOpenMenu(false);
            router.push({ pathname: '/note-input', params: { id: selectedNote?.id } });
          }}
          style={[styles.flexRow, { padding: 8, marginTop: 10 }]}
        >
          <MaterialIcons name='edit-document' size={20} color={'#fff'} />
          <Text style={[styles.bookTitle, { color: '#fff' }]}>{t.editNoteText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOpenMenu(false);
            setOpen(true);
          }}
          style={[styles.flexRow, { padding: 8, marginTop: 10 }]}
        >
          <Ionicons name='trash' size={20} color={'#ff0000'} />
          <Text style={[styles.bookTitle, { color: '#ff0000' }]}>{t.deleteNoteText}</Text>
        </TouchableOpacity>
      </AppModal>
    </ThemedView>
  )
}