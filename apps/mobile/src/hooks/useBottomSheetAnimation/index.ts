import { useEffect } from "react";
import { Dimensions } from "react-native";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
  WithSpringConfig,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SPRING_CONFIG: WithSpringConfig = {
  damping: 50,
  stiffness: 300,
  mass: 1,
  overshootClamping: true,
};

interface UseBottomSheetAnimationProps {
  isVisible: boolean;
  onClose: () => void;
  height?: number;
}

export function useBottomSheetAnimation({
  isVisible,
  onClose,
  height,
}: UseBottomSheetAnimationProps) {
  const activeHeight = height || SCREEN_HEIGHT * 0.5;
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, SPRING_CONFIG);
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
    }
  }, [isVisible, activeHeight]);

  const gesture = Gesture.Pan()
    .onChange((event) => {
      const delta = event.translationY;
      if (delta < 0) {
        translateY.value = delta / 3.5;
      } else {
        translateY.value = delta;
      }
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationY > activeHeight * 0.25 || event.velocityY > 1000;

      if (shouldClose) {
        translateY.value = withSpring(
          SCREEN_HEIGHT,
          {
            ...SPRING_CONFIG,
            velocity: event.velocityY,
          },
          (finished) => {
            if (finished) runOnJS(onClose)();
          }
        );
      } else {
        translateY.value = withSpring(0, {
          ...SPRING_CONFIG,
          velocity: event.velocityY,
        });
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, activeHeight],
      [0.5, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacity,
    };
  });

  return {
    gesture,
    rBottomSheetStyle,
    rBackdropStyle,
  };
}
