import { ThemedView } from '@/components/themed-view';
import { getInfo, getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { Theme } from '@/hooks/use-theme';
import { Colors } from '@/types/colors.type';
import { adjustColor } from '@/utils/color.util';
import { images } from '@/utils/image.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '.';

export default function AppSetting() {
  const router = useRouter();
  const { color, updateColor, image, updateImages, isDark, setTheme, theme, appColors, langues, updateLangue } = useApp();
  const [language, setLanguage] = useState(getTranslation(langues?.appLng || "mg"));
  const info = getInfo(langues?.appLng || 'mg');
  const imageSelected = image;

  const editColor = (selectedColor: Colors, index: number) => {
    if (!color) return;

    updateColor(
      {
        id: 1,
        bg: !isDark ? selectedColor.text : selectedColor?.bg || '',
        text: !isDark ? selectedColor.bg : selectedColor?.text || '',
        borderColor: !isDark ? selectedColor.bg : selectedColor?.text || '',
        colorIndex: index,
      },
      color.id,
    );
  };

  const contacts = [
    {
      icon: "logo-whatsapp",
      title: "Tel",
      value: "+261 34 92 870 65",
      color: "green",
      bg: "#fff",
      onPress: () => Linking.openURL("https://wa.me/261349287065"),
    },
    {
      icon: "logo-facebook",
      title: "Facebook",
      value: "Kennyh Sedera",
      color: "#3374ff",
      bg: "#fff",
      onPress: () => Linking.openURL("https://facebook.com/profile.php?id=100006716355270"),
    },
    {
      icon: "mail-outline",
      title: "Email",
      color: "",
      bg: "",
      value: "kennyhsedera@gmail.com",
      onPress: () => Linking.openURL("mailto:kennyhsedera@gmail.com"),
    },
  ];

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
        <Text style={[styles.headerTitle, { color: color?.text, fontSize: 24 }]}>{language.settingText}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.scrollContent, { paddingBottom: 50 }]} showsVerticalScrollIndicator={false}>

        {/* Theme */}
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

        {/* Langue bible */}
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

        {/* Langue app */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.langue.titleApp}</Text>
            <Ionicons name="text" size={26} color={color?.text} />
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

        {/* Color app */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.color.title}</Text>
            <Ionicons name="color-palette" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }]}>
            {appColors.map((c, index) => {
              const bg = c.bg;
              const text = c.text;
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    editColor(c, index);
                  }}
                  style={[styles.cardColor, { backgroundColor: bg, }]}>
                  {color?.colorIndex === index && <Ionicons name="checkmark-circle" size={26} color={isDark ? '#3ECF8E' : text} style={{ position: 'absolute', top: 8, right: 8 }} />}
                  <Text style={{ color: text, fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{language.color.bold}</Text>
                  <Text style={{ color: text, textAlign: 'center' }}>{info.description}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Header image */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.image}</Text>
            <Ionicons name="image" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }]}>
            {images.map((c, index) => {
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

        {/* Contact */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{info.contactText}</Text>
            <Ionicons name="call" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexRow, { padding: 10, borderRadius: 10, width: "100%", justifyContent: 'space-between' }]}>
            {contacts.map((contact, index) => (
              <Pressable
                key={index}
                style={[styles.contact, { backgroundColor: contact.color || color?.bg }]}
                onPress={contact.onPress}
              >
                <Ionicons name={contact.icon as any} size={27} color={contact.bg || color?.text} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoTitle, { color: contact.bg || color?.text }]}>
                    {contact.title}
                  </Text>
                </View>
                <Text numberOfLines={1} style={[styles.infoText, { color: contact.bg || adjustColor(color?.text as string, 20) }]}>
                  {contact.value}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{info.title}</Text>
            <Ionicons name="information-circle-sharp" size={26} color={color?.text} />
          </View>
          <View style={[styles.bookCard, styles.flexCol, { width: "100%", borderWidth: 0, backgroundColor: `${color?.text}10`, padding: 20, gap: 2 }]}>
            <Image source={require('@/assets/images/baiboly2.png')} style={{ width: 60, height: 60, borderRadius: 10 }} />
            <Text style={[{ color: color?.text, marginBottom: 15 }]}>{info.version}: 1.0.0</Text>
            <Text style={[{ color: color?.text, fontSize: 18, }]}>{info.appName}</Text>
            <Text style={[{ color: color?.text }]}>{info.description}</Text>
            <Text style={[{ color: color?.text }]}>{info.developer}: Kennyh Sedera</Text>
            <Text style={[{ color: color?.text, marginTop: 15 }]}>{info.copyright}</Text>
            <Text style={[{ color: color?.text }]}>© 2026</Text>
          </View>
        </View>

      </ScrollView>
    </ThemedView>
  );
}