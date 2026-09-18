import { ThemedView } from '@/components/themed-view';
import { getInfo, getTranslation } from '@/constants/text';
import { useApp } from '@/contexts/app.context';
import { Theme } from '@/hooks/use-theme';
import { Colors } from '@/types/colors.type';
import { images } from '@/utils/image.util';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '.';

export default function AppSetting() {
  const { color, updateColor, image, updateImages, isDark, setTheme, theme, appColors, langues, updateLangue } = useApp();
  const [language, setLanguage] = useState(getTranslation(langues?.appLng || "mg"));
  const info = getInfo(langues?.appLng || 'mg');
  const appName = getInfo(langues?.bibleLng || "mg").appName;
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
      <View style={[styles.header, { backgroundColor: color?.bg, justifyContent: 'space-between', gap: 12 }]}>
        <Text style={[styles.headerTitle, { color: color?.text, fontSize: 24 }]}>{language.settingText}</Text>
        <Ionicons onPress={() => router.push("/app-search-global")} name="search-circle" size={30} color={color?.text} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 50 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Theme */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.theme.title}</Text>
            <Ionicons name="sunny" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexCol, { width: '100%', gap: 2, backgroundColor: `${color?.text}20`, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 8 }]}>
            {language.theme.data.map((i, index) => {
              const isSelected = theme === i.value;
              return (
                <Pressable key={index} style={[styles.bookCard, { width: '100%', alignItems: 'center', borderWidth: 0, flexDirection: "row", paddingVertical: 6, marginBottom: 0, position: "relative" }]} onPress={() => setTheme(i.value as Theme)}>
                  <View style={{ backgroundColor: isSelected ? color?.text : `${color?.text}${isDark ? "30" : "1a"}`, width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                    <Ionicons name={i.icon as "moon"} size={22} color={!isSelected ? color?.text : color?.bg} />
                  </View>
                  <Text style={[styles.bookTitle, { color: color?.text }]}>{i.title}</Text>
                  <Ionicons name={isSelected ? "radio-button-on" : "radio-button-off"} size={20} color={color?.text} style={{ position: "absolute", right: 0 }} />
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Langue  */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <View style={[styles.flexRow, { justifyContent: 'space-between', width: "46%", }]}>
              <Text style={[styles.modalText, { color: color?.text }]}>{language.langue.titleApp}</Text>
              <Ionicons name="language" size={20} color={color?.text} />
            </View>
            <View style={[styles.flexRow, { justifyContent: 'space-between', width: "46%", }]}>
              <Text style={[styles.modalText, { color: color?.text }]}>{language.langue.title}</Text>
              <Ionicons name="text" size={20} color={color?.text} />
            </View>
          </View>

          <View style={[styles.flexRow, { width: '100%', gap: '2%' }]}>
            <View style={[styles.flexCol, { width: '48%', gap: 8, padding: 8, borderWidth: 2, borderColor: `${color?.borderColor}40`, backgroundColor: `${color?.text}20`, borderRadius: 14 }]}>
              {language.langue.data.map((i, index) => {
                const isSelected = langues?.appLng === i.value;
                return (
                  <Pressable
                    key={index}
                    onPress={() => editLanguage(i.value, "app")}
                    style={[
                      styles.flexRow,
                      {
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        borderRadius: 14,
                        backgroundColor: !isSelected ? `${color?.text}00` : color?.text,
                      },
                    ]}
                  >
                    <View style={[styles.flexRow, { alignItems: 'center', gap: 12 }]}>
                      <Text style={{ fontSize: 22 }}>{i.flag}</Text>
                      <Text style={[styles.bookTitle, { color: !isSelected ? color?.text : color?.bg, fontSize: 15 }]}>
                        {i.title}
                      </Text>
                    </View>
                    <Ionicons name={isSelected ? "radio-button-on" : "radio-button-off"} size={20} color={isSelected ? color?.bg : color?.text} />
                  </Pressable>
                );
              })}
            </View>
            <View style={[styles.flexCol, { width: '48%', gap: 8, padding: 8, borderWidth: 2, borderColor: `${color?.borderColor}40`, backgroundColor: `${color?.text}20`, borderRadius: 14 }]}>
              {language.langue.data.map((i, index) => {
                const isSelected = langues?.bibleLng === i.value;
                return (
                  <Pressable
                    key={index}
                    onPress={() => editLanguage(i.value, "bible")}
                    style={[
                      styles.flexRow,
                      {
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        borderRadius: 14,
                        backgroundColor: !isSelected ? `${color?.text}00` : color?.text,
                      },
                    ]}
                  >
                    <View style={[styles.flexRow, { alignItems: 'center', gap: 12 }]}>
                      <Text style={{ fontSize: 22 }}>{i.flag}</Text>
                      <Text style={[styles.bookTitle, { color: !isSelected ? color?.text : color?.bg, fontSize: 15 }]}>
                        {i.title}
                      </Text>
                    </View>
                    <Ionicons name={isSelected ? "radio-button-on" : "radio-button-off"} size={20} color={isSelected ? color?.bg : color?.text} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Color app */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{language.color.title}</Text>
            <Ionicons name="color-palette" size={26} color={color?.text} />
          </View>
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 0 }]}>
            {appColors.map((c, index) => {
              const bg = c.bg;
              const text = c.text;
              const isSelected = color?.colorIndex === index;
              return (
                <Pressable
                  key={index}
                  onPress={() => { editColor(c, index); }}
                  style={[styles.cardColor, { backgroundColor: bg, width: '24%', height: 90, gap: 4, alignItems: 'flex-start' }]}
                >
                  <Ionicons name={isSelected ? "radio-button-on" : "radio-button-off"} size={18} color={isSelected ? '#3ECF8E' : text} style={{ position: 'absolute', top: 4, right: 4 }} />
                  <Text style={{ backgroundColor: text, height: 6, borderRadius: 4, width: '60%', marginBottom: 6, marginLeft: "2%" }} />
                  <Text style={{ backgroundColor: text, height: 4, borderRadius: 20, width: '40%' }} />
                  <Text style={{ backgroundColor: text, height: 4, borderRadius: 20, width: '80%' }} />
                  <Text style={{ backgroundColor: text, height: 4, borderRadius: 20, width: '100%' }} />
                  <Text style={{ backgroundColor: text, height: 4, borderRadius: 20, width: '90%' }} />
                  <Text style={{ backgroundColor: text, height: 3, borderRadius: 4, width: '60%', marginTop: 6 }} />
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
          <View style={[styles.flexRow, { justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: "1%" }]}>
            {images.map((c, index) => {
              const isSelected = (imageSelected?.image_index || 0) - 1 === index;
              return (
                <Pressable
                  key={index}
                  onPress={() => { editImage(index); }}
                  style={{ width: '24%', height: 90, borderRadius: 15, position: 'relative', borderWidth: 2, overflow: 'hidden', borderColor: `${color?.borderColor}40` }}
                >
                  <Ionicons name={isSelected ? "radio-button-on" : "radio-button-off"} size={18} color={isSelected ? '#3ECF8E' : color?.text} style={{ position: 'absolute', top: 4, right: 4, zIndex: 1 }} />

                  <Image style={{ width: '100%', height: '100%' }} resizeMode="cover" source={c} />
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Contact */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.flexRow, { justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', paddingHorizontal: 10 }]}>
            <Text style={[styles.modalText, { color: color?.text }]}>{info.contactText}</Text>
            <Ionicons name="call" size={26} color={color?.text} style={{ transform: [{ rotate: '-90deg' }] }} />
          </View>
          <View style={[styles.flexRow, { paddingTop: 2, borderRadius: 10, width: "100%", justifyContent: 'space-between' }]}>
            {contacts.map((contact, index) => (
              <Pressable
                key={index}
                style={[styles.contact, { backgroundColor: contact.color || color?.bg }]}
                onPress={contact.onPress}
              >
                <Ionicons name={contact.icon as any} size={27} color={contact.bg || color?.text} />
                <Text numberOfLines={1} style={[styles.infoText, { color: contact.bg || color?.text, marginTop: 4 }]}>
                  {contact.value}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={[styles.flexCol, { marginBottom: 30 }]}>
          <View style={[styles.bookCard, styles.flexCol, { width: "100%", borderWidth: 0, padding: 20, gap: 2 }]}>
            <Image source={isDark ? require('@/assets/images/baiboly3.png') : require('@/assets/images/baiboly4.png')} resizeMode="cover" style={{ width: 100, height: 80, borderRadius: 10, backgroundColor: color?.bg }} />
            <Text style={[{ color: color?.text, marginBottom: 15, marginTop: 5 }]}>{info.version}: 1.0.0</Text>
            <Text style={[{ color: color?.text, fontSize: 22, fontWeight: 'bold', marginBottom: 15 }]}>{appName}</Text>
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