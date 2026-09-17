import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/contexts/app.context';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 280;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBg?: { dark: string; light: string };
  bg?: string;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBg,
  bg
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const { color, isDark } = useApp()
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const headerFixed = useAnimatedStyle(() => {
    const i = interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [1, 0, 1])
    const h = i <= 1 ? i * 32 : 32

    return {
      opacity: interpolate(scrollOffset.value, [0, 32], [0, 1]),
      height: h
    }
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[{ backgroundColor: isDark ? headerBg?.dark : headerBg?.light || bg }, headerFixed]} />
      <Animated.ScrollView
        ref={scrollRef}
        style={{ backgroundColor, flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        scrollEventThrottle={16}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: color?.bg },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  header: { height: HEADER_HEIGHT, overflow: 'hidden', },
  content: { flex: 1, paddingVertical: 32, paddingHorizontal: 10, gap: 16, overflow: 'hidden', },
});
