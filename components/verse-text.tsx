import { TextAlign } from '@/types/text.type';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ThemedText } from './themed-text';

type VerseSegment =
  | { type: 'section'; content: string }
  | { type: 'text'; content: string }
  | { type: 'note'; content: string };

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

function renderHighlighted(content: string, highlight: string | undefined, key: string, color: string, fontSize: number, isSelected?: boolean) {
  if (!highlight?.trim()) {
    return <ThemedText key={key} style={[styles.verseText, { fontSize, lineHeight: fontSize + 4, }, isSelected && { textDecorationLine: 'underline' }]}>{content}</ThemedText>;
  }

  const escaped = highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = content.split(regex);

  return (
    <ThemedText key={key} style={[styles.verseText, { fontSize, lineHeight: fontSize + 4, }, isSelected && { textDecorationLine: 'underline' }]}>
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
  text,
  verseNumber,
  color = 'red',
  highlight,
  size,
  textAlign,
  isSelected,
  onLongPress,
  onPress,
}: {
  text: string;
  verseNumber: number;
  color?: string;
  highlight?: string;
  size?: number;
  textAlign: TextAlign;
  isSelected?: boolean;
  onLongPress?: (verse: number) => void;
  onPress?: (verse: number) => void;
}) {
  const segments = parseVerseText(text);
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

      <Text style={[styles.verseText, { fontSize, lineHeight: fontSize + 4 }, isSelected && { fontWeight: 'bold', color: color }]}>
        <Text style={[styles.verseNumber, { color }, isSelected && { color: color }]}>
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

          return renderHighlighted(segment.content, highlight, String(index), color, fontSize, isSelected);
        })}
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