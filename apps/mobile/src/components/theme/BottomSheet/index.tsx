import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  backgroundColor?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export function BottomSheet({
  isVisible,
  onClose,
  children,
  height = "50%",
  backgroundColor = "white",
}: BottomSheetProps) {
  const numericHeight =
    typeof height === "string"
      ? (parseFloat(height) / 100) * SCREEN_HEIGHT
      : height;

  const { gesture, rBottomSheetStyle, rBackdropStyle } =
    useBottomSheetAnimation({
      isVisible,
      onClose,
      height: numericHeight,
    });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, rBackdropStyle]} />
        </TouchableWithoutFeedback>

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.sheetContainer,
              { height: numericHeight, backgroundColor },
              rBottomSheetStyle,
            ]}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            <View style={styles.content}>{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  handleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 2.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
