import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Animated,
  Keyboard,
  KeyboardEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type KeyboardContextValue = {
  keyboardShown: boolean;
  keyboardHeight: number;
  hideKeyboard: () => void;
  setChatMode: (enabled: boolean) => void;
};

const KeyboardContext = createContext<KeyboardContextValue | null>(null);

export const useKeyboard = (): KeyboardContextValue => {
  const ctx = useContext(KeyboardContext);
  if (!ctx) throw new Error("useKeyboard must be used inside KeyboardProvider");
  return ctx;
};

type KeyboardProviderProps = {
  children: React.ReactNode;
  closeButtonSize?: number;
  closeButtonContainerStyle?: ViewStyle;
};

export function KeyboardProvider({
  children,
  closeButtonSize = 50,
  closeButtonContainerStyle,
}: KeyboardProviderProps) {
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isChatMode, setIsChatMode] = useState(false);

  const anim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      const h = e.endCoordinates ? e.endCoordinates.height : 0;
      const duration = e.duration && e.duration > 0 ? e.duration : 250;

      setKeyboardHeight(h);
      setKeyboardShown(true);

      Animated.timing(anim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    };

    const onHide = (e?: KeyboardEvent) => {
      const duration = e && e.duration && e.duration > 0 ? e.duration : 250;
      Animated.timing(anim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start(() => {
        setKeyboardHeight(0);
        setKeyboardShown(false);
      });
    };

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [anim]);

  const hideKeyboard = () => Keyboard.dismiss();

  const windowHeight = Dimensions.get("window").height;
  const maxShift = Math.min(keyboardHeight, windowHeight * 0.1);

  const contentTranslateY = isChatMode
    ? 0
    : anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -maxShift],
      });

  const value = useMemo(
    () => ({
      keyboardShown,
      keyboardHeight,
      hideKeyboard,
      setChatMode: setIsChatMode,
    }),
    [keyboardShown, keyboardHeight]
  );

  const deviceWidth = Dimensions.get("window").width;

  const bottomSpacing = useMemo(() => {
    if (deviceWidth > 400) {
      return keyboardHeight - 25;
    }
    if (deviceWidth < 400) {
      return keyboardHeight + 5;
    }

    return keyboardHeight - 25;
  }, [deviceWidth, keyboardHeight]);

  return (
    <KeyboardContext.Provider value={value}>
      <Animated.View
        style={{ flex: 1, transform: [{ translateY: contentTranslateY }] }}
      >
        {children}
      </Animated.View>

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {keyboardShown && !isChatMode && (
          <Animated.View
            pointerEvents="box-none"
            style={[styles.accessoryWrapper, { bottom: bottomSpacing }]}
          >
            <SafeAreaView pointerEvents="box-none">
              <View
                style={[styles.rightButtonContainer, closeButtonContainerStyle]}
              >
                <Pressable
                  accessibilityLabel="Fechar teclado"
                  onPress={hideKeyboard}
                  style={({ pressed }) => [
                    styles.closeButton,
                    {
                      width: closeButtonSize,
                      height: closeButtonSize,
                      opacity: pressed ? 0.6 : 1,
                    },
                  ]}
                >
                  <MaterialIcons name="keyboard-hide" size={24} color="#FFF" />
                </Pressable>
              </View>
            </SafeAreaView>
          </Animated.View>
        )}
      </View>
    </KeyboardContext.Provider>
  );
}

const styles = StyleSheet.create({
  accessoryWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "flex-end",
    paddingHorizontal: 12,
    zIndex: 9999,
    elevation: 9999,
  },
  rightButtonContainer: {
    alignItems: "flex-end",
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default KeyboardProvider;
