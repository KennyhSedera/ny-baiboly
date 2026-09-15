import { groupSegmentsIntoLines, Line, parseContentToSegments, Segment } from '@/utils/note-content.utils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

const SIZE_STYLES: Record<NonNullable<Segment['size']>, object> = {
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  normal: { fontSize: 15, fontWeight: '400' },
};

function segmentToStyle(segment: Segment) {
  return [
    segment.size ? SIZE_STYLES[segment.size] : SIZE_STYLES.normal,
    segment.bold ? styles.bold : null,
    segment.italic ? styles.italic : null,
    segment.underline ? styles.underline : null,
  ];
}

function renderLine(line: Line, orderedIndex: number) {
  const content = (
    <ThemedText>
      {line.segments.map(seg => (
        <ThemedText key={seg.id} style={segmentToStyle(seg)}>
          {seg.text}
        </ThemedText>
      ))}
    </ThemedText>
  );

  if (!line.list) {
    return <View style={styles.paragraph}>{content}</View>;
  }

  const marker = line.list === 'bullet' ? '•' : `${orderedIndex}.`;

  return (
    <View style={styles.listItem}>
      <ThemedText style={styles.marker}>{marker}</ThemedText>
      <View style={styles.listItemContent}>{content}</View>
    </View>
  );
}

type SegmentsViewerProps = {
  content?: string;
  segments?: Segment[];
};

export function SegmentsViewer({ content, segments }: SegmentsViewerProps) {
  const data = segments ?? parseContentToSegments(content);
  const lines = groupSegmentsIntoLines(data);

  let orderedCounter = 0;
  let prevWasOrdered = false;

  return (
    <View>
      {lines.map((line, idx) => {
        if (line.list === 'ordered') {
          orderedCounter = prevWasOrdered ? orderedCounter + 1 : 1;
          prevWasOrdered = true;
        } else {
          prevWasOrdered = false;
        }
        return <React.Fragment key={idx}>{renderLine(line, orderedCounter)}</React.Fragment>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700' },
  italic: { fontStyle: 'italic' },
  underline: { textDecorationLine: 'underline' },
  paragraph: { marginBottom: 2 },
  listItem: { flexDirection: 'row', marginBottom: 2, paddingLeft: 4 },
  marker: { width: 20, fontSize: 15 },
  listItemContent: { flex: 1 },
});