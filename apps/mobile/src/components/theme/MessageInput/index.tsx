import React, { useState, useEffect } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
} from "react-native";
import {
  Box,
  RestyleTextInputProps,
  RestyleTouchableOpacity,
} from "@/components/restyle";
import { TextInput } from "../TextInput";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import theme from "@/theme";
import { useKeyboard } from "@/contexts/KeyboardContext";

import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export type MessageInputProps = RestyleTextInputProps & {
  onSend: (content: string) => Promise<void>;
};

export const MessageInput = ({ onSend, ...props }: MessageInputProps) => {
  const [value, setValue] = useState("");
  const { setChatMode } = useKeyboard();

  const translateY = useSharedValue(0);

  useEffect(() => {
    setChatMode(true);
    return () => {
      setChatMode(false);
    };
  }, [setChatMode]);

  const handleSend = async () => {
    const text = value.trim();
    if (!text) return;
    try {
      onSend(text).then(() => {
        setValue("");
      });
    } catch (err) {
      console.error("send failed", err);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const panGesture = Gesture.Pan()
    .activeOffsetY(5)
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 40 || event.velocityY > 500) {
        runOnJS(dismissKeyboard)();
        translateY.value = withTiming(0, { duration: 200 });
      } else {
        translateY.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      style={{ width: Dimensions.get("window").width }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={rStyle}>
          <Box
            width="100%"
            minHeight={90}
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="center"
            backgroundColor="backgroundLight"
            borderTopColor="borderGray"
            borderTopWidth={1}
            px="xl"
            py="m"
          >
            <TextInput
              multiline={true}
              textAlignVertical="top"
              blurOnSubmit={false}
              value={value}
              onChange={(e) => setValue(e.nativeEvent.text)}
              placeholder="Digite uma mensagem..."
              minHeight={40}
              maxHeight={120}
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
              }}
              {...props}
            />
            <RestyleTouchableOpacity
              width={40}
              height={40}
              variant="transparent"
              justifyContent="center"
              alignItems="center"
              marginLeft="s"
              marginBottom="xs"
              activeOpacity={0.7}
              disabled={!props.editable}
              onPress={handleSend}
            >
              <FontAwesome
                name="send"
                size={20}
                color={theme.colors.textBlue}
              />
            </RestyleTouchableOpacity>
          </Box>
        </Animated.View>
      </GestureDetector>
    </KeyboardAvoidingView>
  );
};
