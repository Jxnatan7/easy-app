import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useNavigation } from "expo-router";

export function usePreventGoBack(shouldBlock: boolean) {
  const navigation = useNavigation();

  useEffect(() => {
    if (!shouldBlock) return;

    navigation.setOptions({
      gestureEnabled: false,
      headerLeft: () => null,
      headerBackVisible: false,
    });

    const onBackPress = () => true;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [shouldBlock, navigation]);
}
