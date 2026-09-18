import * as noteDB from '@/api/notes.repository'
import { ThemedView } from '@/components/themed-view'
import { getTranslation } from '@/constants/text'
import { useApp } from '@/contexts/app.context'
import { formatDateLong } from '@/utils/date.utils'
import useKeyboardVisible from '@/utils/keyboard.util'
import { capitalizeText } from '@/utils/text.util'
import { RichText, useBridgeState, useEditorBridge } from '@10play/tentap-editor'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../(tabs)'

const SAVE_DELAY = 1000;
const TOOLBAR_HEIGHT = 44;

export default function NoteInput() {
  const { color, isDark, langues } = useApp();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const t = getTranslation(langues?.appLng || "mg");

  const [title, setTitle] = useState("");
  const [currentId, setCurrentId] = useState<number>(Number(id) || 0);
  const [charCount, setCharCount] = useState(0);
  const [focused, setFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState(50);

  const [pendingContent, setPendingContent] = useState<string | null>(null);
  const contentInjectedRef = useRef(false);

  const titleRef = useRef(title);
  const currentIdRef = useRef(currentId);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { titleRef.current = title; }, [title]);
  useEffect(() => { currentIdRef.current = currentId; }, [currentId]);

  const scheduleSave = (html: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (!currentIdRef.current) return;
      await noteDB.updateNote(currentIdRef.current, {
        title: titleRef.current,
        content: html,
      });
    }, SAVE_DELAY);
  };

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: '',

    onChange: async () => {
      if (!contentInjectedRef.current) return;
      const html = await editor.getHTML();
      const text = await editor.getText();
      setCharCount(text.length);
      scheduleSave(html);
    },
  });

  const editorState = useBridgeState(editor);

  useEffect(() => {
    if (editorState.isReady) {
      editor.updateScrollThresholdAndMargin(TOOLBAR_HEIGHT + 2000);
    }
  }, [editorState.isReady]);

  useEffect(() => {
    if (!editorState.isReady) return;
    const css = `
      body {
        color: ${isDark ? '#ffffff' : '#000000'} !important;
      }
      p, h1, h2, h3, h4, h5, h6, li, span, div {
        color: ${isDark ? '#ffffff' : '#000000'} !important;
      }
      .ProseMirror p.is-editor-empty:first-child::before {
        color: ${isDark ? '#5f5f5f' : '#3b3b3b'} !important;
      }
    `;
    editor.injectCSS(css, 'app-theme');
  }, [editorState.isReady, isDark]);

  async function fetchNote() {
    if (currentId) {
      const note = await noteDB.getNoteById(currentId);
      if (note) {
        setTitle(note?.title || "");
        setPendingContent(note?.content || "");
        setCharCount((note?.content || "").replace(/<[^>]*>/g, '').length);
      }
      return;
    }

    const newNote = await noteDB.createNote({ title: "", content: "" });
    setCurrentId(newNote);
    contentInjectedRef.current = true;
  }

  useEffect(() => {
    fetchNote();
  }, [currentId]);

  useEffect(() => {
    if (editorState.isReady && pendingContent !== null && !contentInjectedRef.current) {
      editor.setContent(pendingContent);
      contentInjectedRef.current = true;
      setPendingContent(null);
    }
  }, [editorState.isReady, pendingContent]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChangeTitle = (text: string) => {
    setTitle(text);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (!currentIdRef.current) return;
      const html = await editor.getHTML();
      await noteDB.updateNote(currentIdRef.current, { title: text, content: html });
    }, SAVE_DELAY);
  };

  const StyleButton = ({ label, isActive, onPress }: { label: string; isActive?: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: isActive ? color?.text : `${color?.bg}60`,
        borderRadius: 6,
      }}
    >
      <MaterialIcons name={label as 'title'} size={20} style={{ color: isActive ? color?.bg : color?.text, fontWeight: 'bold' }} />
    </TouchableOpacity>
  );

  const wordUnitLabel =
    langues?.appLng === 'en' ? 'words' : langues?.appLng === 'fr' ? 'caractères' : 'litera';

  return (
    <ThemedView style={[styles.container, {}]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View
          style={[styles.header, { backgroundColor: color?.bg, justifyContent: 'flex-start', gap: 12 }]}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color={color?.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { textAlign: "left", color: color?.text }]}>
            {id ? t.editNoteText : t.addNoteText}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>

          <TextInput
            placeholder={t.noteTitleText}
            value={title}
            onChangeText={handleChangeTitle}
            placeholderTextColor={`${color?.text}96`}
            style={[{
              backgroundColor: `${color?.bg}60`,
              paddingHorizontal: 12,
              paddingVertical: 12,
              minHeight: 50,
              height: Math.max(50, inputHeight),
              borderRadius: 10,
              fontSize: 20,
              color: color?.text,
              borderWidth: 1,
              borderColor: `${color?.text}50`,
              fontWeight: 'bold',
            }]}
            multiline
            onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <Text style={{ paddingHorizontal: 15, color: isDark ? '#5f5f5f' : '#3b3b3b', marginTop: 10 }}>
            {capitalizeText(formatDateLong(new Date()))}
            {"       "}
            {charCount > 0 && `${charCount} ${wordUnitLabel}`}
          </Text>
        </View>

        <View style={{ marginHorizontal: 14, flex: 1, borderWidth: 1, borderColor: `${color?.borderColor}50`, padding: 10, borderRadius: 10, backgroundColor: `${color?.bg}05`, marginBottom: 20, }}>
          <RichText style={{ backgroundColor: "transparent", padding: 20, height: "auto" }} editor={editor} />
        </View>

        {(useKeyboardVisible() && !focused) && (
          <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 15, marginBottom: 20, flexWrap: "wrap" }}>
            <StyleButton
              label="title"
              isActive={editorState.headingLevel === 1}
              onPress={() => editor.toggleHeading(1)}
            />
            <StyleButton
              label="subtitles"
              isActive={editorState.headingLevel === 2}
              onPress={() => editor.toggleHeading(2)}
            />
            <StyleButton
              label="format-bold"
              isActive={editorState.isBoldActive}
              onPress={() => editor.toggleBold()}
            />
            <StyleButton
              label="format-italic"
              isActive={editorState.isItalicActive}
              onPress={() => editor.toggleItalic()}
            />
            <StyleButton
              label="format-list-numbered"
              isActive={editorState.isOrderedListActive}
              onPress={() => editor.toggleOrderedList()}
            />
            <StyleButton
              label="format-list-bulleted"
              isActive={editorState.isBulletListActive}
              onPress={() => editor.toggleBulletList()}
            />
            <StyleButton
              label="format-underline"
              isActive={editorState.isUnderlineActive}
              onPress={() => editor.toggleUnderline()}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </ThemedView>
  )
}