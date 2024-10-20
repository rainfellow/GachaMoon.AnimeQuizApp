import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { ChatMessage } from "@/models/GameConfiguration";
import { Button, Container, Group, Paper, ScrollArea, Space, Stack, Text, Textarea, UnstyledButton } from "@mantine/core";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import classes from "./MultiplayerGameChat.module.css"
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { useTranslation } from "react-i18next";
import { useElementSize } from "@mantine/hooks";

export const MultiplayerGameChat: React.FC = (): ReactElement => {
    const { chatLog, chatLogLength, currentGamePlayers } = useContext(MultiplayerGameContext);
    const { sendChatMessage, accountIdToName } = useMultiplayerGame()
    const [chatMessageElements, setChatMessageElements] = useState<JSX.Element[]>();
    const [newMessage, setNewMessage] = useState("");
    const { ref, width, height } = useElementSize();
    const { t } = useTranslation('game');

    const chatInputRef = useRef(null)

    const handleSendMessageButton = (message: string) => {
        sendChatMessage(message);
        setNewMessage("");
    }

    const createChatElements = (chatLog: ChatMessage[]) => {
        const data = chatLog.map((m) => 
        <Text key={m.message}>
            {accountIdToName(m.accountId) + ": " + m.message} 
        </Text>
          )
          setChatMessageElements(data);
      } 

    useEffect(() => {
        createChatElements(chatLog);
    }, [chatLogLength]);

    useEffect
      
    return (
        <Paper shadow="sm" radius="md" withBorder p="xl" className={classes.wrapper}>
            <Stack justify="space-between">
                <Stack justify="flex-start" className={classes.chatMessages} ref={ref}>
                    <ScrollArea.Autosize w={300} mah={height} scrollbars="y" type="auto">
                            {chatMessageElements}
                    </ScrollArea.Autosize>
                </Stack>
                <Stack justify="flex-end">  
                    <Textarea
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessageButton(newMessage);
                            }
                        }}
                        ref={chatInputRef}
                        size="md"
                        radius="md"
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.currentTarget.value)}
                    />
                    <Group justify='flex-end'>
                        <UnstyledButton size='xs' 
                            onClick={() => handleSendMessageButton(newMessage)}>
                            {t('GameChatSendMessageButton')}
                        </UnstyledButton>
                    </Group>
                </Stack>
            </Stack>
        </Paper>
    )
}