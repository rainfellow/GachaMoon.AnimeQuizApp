import { ChatsContextProvider } from "@/context/chats-context";
import { FooterContextProvider } from "@/context/footer-context";
import { MultiplayerGameContextProvider } from "@/context/multiplayer-game-context";
import MainLayout from "@/layout/MainLayout";

export function HomePage() {
  return (
    <FooterContextProvider>
    <MultiplayerGameContextProvider>
      <ChatsContextProvider>
        <MainLayout/>
      </ChatsContextProvider>
      </MultiplayerGameContextProvider>
    </FooterContextProvider>
  );
}
