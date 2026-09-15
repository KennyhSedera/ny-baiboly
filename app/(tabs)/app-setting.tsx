import { ThemedView } from '@/components/themed-view';
import { getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { Theme } from '@/hooks/use-theme';
import { info } from '@/utils/bible.util';
import { adjustColor } from '@/utils/color.util';
import { images } from '@/utils/image.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '.';

export default function AppSetting() {
  const router = useRouter();
  const { color, updateColor, image, updateImages, isDark, setTheme, theme, appColors, langues, updateLangue } = useApp();
  const [all, setAll] = useState({
    color: false,
    image: false,
  });
  const [language, setLanguage] = useState(getTranslation(langues?.appLng || "mg"));

  const imageSelected = image;

  const selectedColor = color;

  const editColor = (index: number) => {
    if (!color) return;

    updateColor(
      {
        ...color,
        bg: selectedColor?.bg || '',
        text: selectedColor?.text || '',
        borderColor: adjustColor(selectedColor?.bg || '', isDark ? -20 : 20) || selectedColor?.borderColor || '',
        colorIndex: index + 1,
      },
      color.id,
    );
  };

  const editImage = (index: number) => {
    if (!image) return;

    updateImages(
      image.id,
      '',
      index + 1,
    );
  };

  const editLanguage = (value: string, lng: string) => {
    if (lng === "app") {
      updateLangue({ id: langues?.id || 1, bibleLng: langues?.bibleLng || 'mg', appLng: value as 'mg' })
      setLanguage(getTranslation(value as 'mg'));
      return;
    }
    updateLangue({ id: langues?.id || 1, bibleLng: value as 'mg', appLng: langues?.appLng || 'mg' });
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={[styles.header, { backgroundColor: color?.bg, justifyContent: 'flex-start', gap: 12 }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={color?.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: color?.text, fontSize: 24 }]}>{language.settingText}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.scrollContent]}>

        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.theme.title}</Text>
            <Ionicons name="sunny" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexRow, { justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: 10 }]}>
            {language.theme.data.map((i, index) => {
              const isSelected = theme === i.value;
              return (
                <Pressable key={index} style={[styles.bookCard, { backgroundColor: !isSelected ? `${color?.text}20` : color?.text, width: '30%', alignItems: 'center', borderWidth: 0 }]} onPress={() => setTheme(i.value as Theme)}>
                  <Ionicons name={i.icon as "moon"} size={24} color={!isSelected ? color?.text : color?.bg} />
                  <Text style={[styles.bookTitle, { color: !isSelected ? color?.text : color?.bg, fontSize: 12 }]}>{i.title}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.langue.title}</Text>
            <Ionicons name="language" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexRow, { justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: 10 }]}>
            {language.langue.data.map((i, index) => {
              const isSelected = langues?.bibleLng === i.value;
              return (
                <Pressable key={index} style={[styles.bookCard, { backgroundColor: !isSelected ? `${color?.text}20` : color?.text, width: '30%', alignItems: 'center', borderWidth: 0 }]} onPress={() => editLanguage(i.value, "bible")}>
                  <Text style={{ fontSize: 25 }}>{i.flag}</Text>
                  <Text style={[styles.bookTitle, { color: !isSelected ? color?.text : color?.bg, fontSize: 12 }]}>{i.title} </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.langue.titleApp}</Text>
            <Ionicons name="language" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexRow, { justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: 10 }]}>
            {language.langue.data.map((i, index) => {
              const isSelected = langues?.appLng === i.value;
              return (
                <Pressable key={index} style={[styles.bookCard, { backgroundColor: !isSelected ? `${color?.text}20` : color?.text, width: '30%', alignItems: 'center', borderWidth: 0 }]} onPress={() => editLanguage(i.value, "app")}>
                  <Text style={{ fontSize: 25 }}>{i.flag}</Text>
                  <Text style={[styles.bookTitle, { color: !isSelected ? color?.text : color?.bg, fontSize: 12 }]}>{i.title}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.color.title}</Text>
            <Ionicons name="color-palette" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }]}>
            {appColors.slice(0, all.color ? appColors.length : 4).map((c, index) => {
              const bg = c.bg;
              const text = c.text;
              const borderColor = color?.colorIndex === index ? "#3ECF8E" : c.borderColor;
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    editColor(index);
                  }}
                  style={{ backgroundColor: bg, width: '48%', height: 150, borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 10, borderWidth: 1, borderColor, position: 'relative' }}>
                  {color?.colorIndex === index && <Ionicons name="checkmark-circle" size={26} color={isDark ? '#3ECF8E' : text} style={{ position: 'absolute', top: 8, right: 8 }} />}
                  <Text style={{ color: text, fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{language.color.bold}</Text>
                  <Text style={{ color: text }}>{info.description}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.image}</Text>
            <Ionicons name="image" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }]}>
            {images.slice(0, all.image ? images.length : 4).map((c, index) => {
              const isSelected = (imageSelected?.image_index || 0) - 1 === index;
              return (
                <Pressable
                  key={index}
                  onPress={() => { editImage(index); }}
                  style={{ width: '48%', height: 150, borderRadius: 20, position: 'relative', borderWidth: 2, borderColor: isSelected ? '#3ECF8E' : `${color?.borderColor}96`, overflow: 'hidden' }}
                >
                  {isSelected && <Ionicons name="checkmark-circle" size={26} color={'#3ECF8E'} style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }} />}
                  <Image style={{ width: '100%', height: '100%' }} resizeMode="cover" source={c} />
                </Pressable>
              )
            })}
          </View>
        </View>

      </ScrollView>
    </ThemedView>
  );
}