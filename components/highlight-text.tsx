import React from 'react';
import { Text, TextStyle } from 'react-native';
import { ThemedText } from './themed-text';

interface HighlightTextProps {
  text: string;
  highlight: string;
  textStyle?: TextStyle;
  match?: { color?: string, bg?: string }
}

export function HighlightText({ text, highlight, textStyle, match }: HighlightTextProps) {
  if (!highlight?.trim()) {
    return <Text style={textStyle}>{text}</Text>;
  }

  const escaped = highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <ThemedText style={textStyle}>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.trim().toLowerCase() ? (
          <Text key={i} style={[styles.match, match && { color: match.color, backgroundColor: match.bg }]}>{part}</Text>
        ) : (
          <Text key={i}>{part}</Text>
        )
      )}
    </ThemedText>
  );
}

const styles = {
  match: {
    color: '#0A0C10',
    backgroundColor: '#3ECF8E',
    fontWeight: 'bold' as const,
    borderRadius: 3,
  },
};