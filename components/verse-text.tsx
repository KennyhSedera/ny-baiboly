import { useApp } from '@/contexts/app.context';
import { TextAlign } from '@/types/text.type';
import { Entypo, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ThemedText } from './themed-text';

type VerseSegment =
  | { type: 'section'; content: string }
  | { type: 'text'; content: string }
  | { type: 'note'; content: string };

interface VerseTextProps {
  text: string;
  size?: number;
  color?: string;
  fontSize?: number;
  highlight?: string;
  verseNumber: number;
  isSelected?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  textAlign?: TextAlign;
  onPress?: (verseNumber: number) => void;
  onLongPress?: (verseNumber: number) => void;
}

function parseVerseText(text: string): VerseSegment[] {
  const regex = /<n>\{(.*?)\}<\/n>/g;
  const segments: VerseSegment[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);

    if (match.index === 0 && lastIndex === 0) {
      segments.push({ type: 'section', content: match[1].trim() });
    } else {
      if (before) segments.push({ type: 'text', content: before });
      segments.push({ type: 'note', content: match[1].trim() });
    }

    lastIndex = regex.lastIndex;
  }

  const remaining = text.slice(lastIndex);
  if (remaining) segments.push({ type: 'text', content: remaining });

  return segments;
}

function renderHighlighted(content: string, highlight: string | undefined, key: string, color: string, fontSize: number, isSelected?: boolean, isFavorite?: boolean, isArchived?: boolean, isDark?: boolean) {
  if (!highlight?.trim()) {
    return <ThemedText key={key} style={[styles.verseText, { fontSize, lineHeight: fontSize + 4, }, isArchived && { color: isDark ? "#5db8f5" : "#1671b8" }, isFavorite && { color: isDark ? "#f55151" : "#9b0000" }, isFavorite && isArchived && { color: isDark ? "#c95a00" : "#ff7503" }, isSelected && { textDecorationLine: 'underline', color: isDark ? '#ffffff' : '#000000' }]}>{content}</ThemedText>;
  }

  const escaped = highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = content.split(regex);

  return (
    <ThemedText key={key} style={[styles.verseText, { fontSize, lineHeight: fontSize + 4, }, isArchived && { color: isDark ? "#5db8f5" : "#1671b8" }, isFavorite && { color: isDark ? "#f55151" : "#9b0000" }, isFavorite && isArchived && { color: isDark ? "#c95a00" : "#ff7503" }, isSelected && { textDecorationLine: 'underline', color: isDark ? '#ffffff' : '#000000' }]}>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.trim().toLowerCase() ? (
          <Text key={i} style={[styles.highlight, { backgroundColor: color, color: "#fff" }]}>{part}</Text>
        ) : (
          part
        )
      )}
    </ThemedText>
  );
}

export function VerseText({
  size,
  text,
  color = '',
  highlight,
  textAlign,
  isSelected,
  isFavorite,
  isArchived,
  verseNumber,
  onPress,
  onLongPress,
}: VerseTextProps) {
  const segments = parseVerseText(text);
  const { isDark } = useApp();
  const [fontSize, setFontSize] = React.useState(16);

  const section = segments.find((segment) => segment.type === 'section');
  const contentSegments = segments.filter((segment) => segment.type !== 'section');

  React.useEffect(() => {
    if (size) {
      setFontSize(size);
    }
  }, [size]);

  function handleLongPress(params: number) {
    onLongPress && onLongPress(params);
  }

  function handlePress(params: number) {
    onPress && onPress(params);
  }

  return (
    <Text
      onLongPress={() => handleLongPress(verseNumber)}
      onPress={() => handlePress(verseNumber)}
      style={[styles.verseContainer, { fontSize, textAlign }]}
    >
      {section && (
        <Text style={[styles.sectionTitle, { color, fontSize: fontSize - 2 }]}>
          {'\n'}{section.content}{'\n\n'}
        </Text>
      )}

      <Text style={[styles.verseText, { fontSize, lineHeight: fontSize + 4 }, isArchived && { color: isDark ? "#5db8f5" : "#1671b8" }, isFavorite && { color: isDark ? "#f55151" : "#9b0000" }, isSelected && { fontWeight: 'bold', color: color }]}>
        <Text style={[styles.verseNumber, { color: color }, isArchived && { color: isDark ? "#5db8f5" : "#1671b8" }, isFavorite && { color: isDark ? "#f55151" : "#9b0000" }, isFavorite && isArchived && { color: isDark ? "#c95a00" : "#ff7503" },]}>
          {' '}{verseNumber}{' '}
        </Text>
        {'  '}
        {contentSegments.map((segment, index) => {
          if (segment.type === 'note') {
            return (
              <Text key={index} style={[styles.inlineNote, { color, fontSize: fontSize - 4 }]}>
                {' '}{segment.content}{' '}
              </Text>
            );
          }

          return renderHighlighted(segment.content, highlight, String(index), color, fontSize, isSelected, isFavorite, isArchived, isDark);
        })}
        {'  '}
        {isArchived && <Entypo name="archive" size={size} color={isDark ? "#5db8f5" : "#1671b8"} style={{ marginLeft: 40 }} />}
        {isFavorite && isArchived && ' '}
        {isFavorite && <Ionicons name="heart" size={size} color={isDark ? "#f55151" : "#9b0000"} style={{ marginLeft: 40 }} />}
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  verseContainer: {
    marginBottom: 4,
    textAlign: 'left',
    fontSize: 30,
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#3ECF8E',
    marginBottom: 4,
  },

  verseText: {
    lineHeight: 34,
    fontSize: 30,
  },

  verseNumber: {
    fontWeight: 'bold',
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  inlineNote: {
    fontStyle: 'italic',
    color: '#eb0303',
  },

  highlight: {
    color: '#0A0C10',
    backgroundColor: '#3ECF8E',
    fontWeight: 'bold',
  },
});