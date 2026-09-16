import { adjustColor } from "@/utils/color.util";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  Modal as RNModal,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function AppModal({
  visible,
  onClose,
  children,
  position = "bottom",
  closeOnBackdrop = true,
  color
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "bottom" | "center";
  closeOnBackdrop?: boolean;
  color?: string
}) {
  const insets = useSafeAreaInsets();
  const [internalVisible, setInternalVisible] = useState(visible);
  const theme = useColorScheme();
  const isDark = theme === "dark";

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        position === "bottom"
          ? Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          })
          : Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        position === "bottom"
          ? Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          })
          : Animated.timing(scale, {
            toValue: 0.9,
            duration: 150,
            useNativeDriver: true,
          }),
      ]).start(() => {
        setInternalVisible(false);
        // reset pour la prochaine ouverture
        translateY.setValue(SCREEN_HEIGHT);
        scale.setValue(0.9);
      });
    }
  }, [visible]);

  if (!internalVisible) return null;

  return (
    <RNModal
      visible={internalVisible}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeOnBackdrop ? onClose : undefined}
          />
        </Animated.View>

        {position === "bottom" ? (
          <Animated.View
            style={[
              styles.bottomSheet,
              color && { backgroundColor: color },
              !color && { backgroundColor: isDark ? "#111111" : "#e7e7e7" },
              {
                paddingBottom: insets.bottom + 12,
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: adjustColor(color ?? "#000", 20) }]} />
            {children}
          </Animated.View>
        ) : (
          <View style={styles.centerWrap} pointerEvents="box-none">
            <Animated.View
              style={[
                styles.centerModal,
                color && { backgroundColor: color },
                !color && { backgroundColor: isDark ? "#111111" : "#e7e7e7" },
                {
                  transform: [{ scale }],
                  opacity: backdropOpacity,
                },
              ]}
            >
              {children}
            </Animated.View>
          </View>
        )}
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#000000a4",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 20
  },
  handle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centerModal: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
  },
});
