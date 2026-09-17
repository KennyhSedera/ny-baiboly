import { styles } from '@/app/(tabs)';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { Pressable, Text, View } from 'react-native';
import AppModal from './modal';
import { ThemedText } from './themed-text';

export default function DeleteConfirm({ visible, deleteTitle, onClose }: { visible: boolean, deleteTitle?: string, onClose: (v: string) => void }) {
  const { langues, color } = useApp();
  const lang = getTranslation(langues?.appLng || 'mg');

  function handleClose(v?: string) {
    onClose(v || '');
  }

  return (
    <AppModal visible={visible} onClose={handleClose} closeOnBackdrop={false} position="center">
      <View>
        <Text style={[styles.bookTitle, { fontSize: 24, color: color?.text }]}>{deleteTitle || lang.deleteText}</Text>
        <ThemedText style={{ fontSize: 14, textAlign: "center", marginVertical: 20 }}>
          {lang.confirmDeleteText}
        </ThemedText>
        <View style={[styles.flexRow, { justifyContent: "flex-end", gap: 20, padding: 0 }]}>
          <Pressable onPress={() => handleClose('cancel')} style={[styles.button, { borderWidth: 0, marginVertical: 0 }]}>
            <ThemedText style={[styles.buttonTitle]}>{lang.cancelText}</ThemedText>
          </Pressable>
          <Pressable onPress={() => handleClose('delete')} style={[styles.button, { backgroundColor: "red", borderWidth: 0, marginVertical: 0 }]}>
            <Text style={[styles.buttonTitle, { color: "white" }]}>{lang.deleteText}</Text>
          </Pressable>
        </View>
      </View>
    </AppModal>
  )
}