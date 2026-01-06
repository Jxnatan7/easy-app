import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Text } from "@/components/restyle";
import { Container } from "@/components/theme/Container";
import LottieView from "lottie-react-native";
import useCommunicationAccepted from "@/hooks/useCommunicationAccepted";
import { useCommunicationRequestStore } from "@/stores/communicationRequestStore";
import { useRouter } from "expo-router";
import { useAppStore } from "@/stores/appStore";
import { StyleSheet } from "react-native";

import loadingAnimation from "@/assets/animations/loading.json";
import approveAnimation from "@/assets/animations/approve.json";
import errorAnimation from "@/assets/animations/error.json";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AwaitingValidation() {
  const token = useCommunicationRequestStore((s) => s.visitorToken);
  const store = useCommunicationRequestStore.getState();

  const { replace } = useRouter();
  const [accepted, setAccepted] = useState<boolean | null>();
  const animationRef = useRef<LottieView>(null);

  const animation = useMemo(() => {
    if (accepted === true) {
      return approveAnimation;
    }
    if (accepted === false) {
      return errorAnimation;
    } else {
      return loadingAnimation;
    }
  }, [accepted]);

  const backButtonFallback = () => {
    store.clearAppData();
    replace("/init");
  };

  useEffect(() => {
    if (animationRef.current) {
      if (accepted === true) {
        animationRef.current.reset();
        animationRef.current.play();
        wait(3300).then(() => {
          replace({
            pathname: "/chat",
            params: {
              chatId: useAppStore.getState().chatId,
              blockBack: "true",
            },
          });
        });
      } else if (accepted === false) {
        animationRef.current.reset();
        animationRef.current.play();
        wait(3300).then(() => {
          replace({
            pathname: "/",
            params: {
              chatId: useAppStore.getState().chatId,
              blockBack: "true",
            },
          });
        });
      } else {
        animationRef.current.reset();
        animationRef.current.play();
      }
    }
  }, [accepted]);

  useCommunicationAccepted({
    token: token,
    onAccepted: ({ communicationRequestId, chatId }) => {
      setAccepted(true);
      store.setIsAwaitingResponse(false);
    },
  });

  return (
    <Container variant="screen" containerHeaderProps={{ backButtonFallback }}>
      <Text variant="header" px="xl" mb="m" mt="xxxl">
        {accepted === true
          ? "Comunicação aceita!"
          : accepted === false
            ? "A comunicação foi recusada"
            : "Aguardando validação"}
      </Text>

      <Box>
        <LottieView
          ref={animationRef}
          source={animation}
          loop={!accepted}
          autoPlay
          speed={0.5}
          style={styles.animationView}
          onAnimationFinish={(isCancelled) => {
            if (accepted && !isCancelled) {
            }
          }}
        />
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({
  animationView: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});
