import { Chat, ChatMessage, ChatType, PlayerInfo } from "@/models/GameConfiguration";
import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";

export interface IChatsContext {
    chats: Map<string, Chat>;
    addChat: (name: string, chat: Chat) => void;
    removeChat: (name: string) => void;
    addMessage: (name: string, message: ChatMessage) => void;
    cachedPlayers: PlayerInfo[];
    addCachedPlayers: (players: PlayerInfo[]) => void;
    totalMessageCount: number;
}

export const ChatsContext = createContext<IChatsContext>({
    chats: new Map<string, Chat>(),
    addChat: () => { console.log("adding chat") },
    removeChat: () => { console.log("deleting chat") },
    addMessage: () =>  { console.log("adding chat msg") },
    cachedPlayers: [],
    addCachedPlayers: () => { },
    totalMessageCount: 0
});

interface ChatsContextProviderProps {
    children: React.ReactNode;
}

export const ChatsContextProvider: React.FC<ChatsContextProviderProps> = ({
    children
}: ChatsContextProviderProps): ReactElement => {
    const [chats, setChats] = useState<Map<string, Chat>>(new Map<string, Chat>());
    const [cachedPlayers, setCachedPlayers] = useState<PlayerInfo[]>([]);
    const [totalMessageCount, setTotalMessageCount] = useState<number>(0);

    const contextValue = {
        chats,
        addChat: useCallback((name: string, chat: Chat) => {
            setChats(chats => { 
                chats.set(name, chat);
                return chats; 
            });
        }, []),
        removeChat: useCallback((name: string) => {
            setChats(chats => { 
                chats.delete(name);
                return chats; 
            });
        }, []),
        addMessage: useCallback((name: string, message: ChatMessage) => {
            setChats(chats => { 
                let chat = chats.get(name);
                if (chat != undefined)
                {
                    chat.messages.push(message);
                    chat.messageCount = chat.messages.length;
                    chats.set(name, chat); 
                }
                else
                {
                    console.log('error, writing to nonexistent chat');
                    //chats.set(name, { chatType: ChatType.Game, messages: [message], messageCount: 1});
                }
                setTotalMessageCount((count) => count + 1);
                return chats; 
            });
        }, []),
        cachedPlayers,
        addCachedPlayers: useCallback((new_players: PlayerInfo[]) => {
            setCachedPlayers(players => { 
                let res = players.concat(new_players).filter(function (v, i, self) {
                    return i == self.indexOf(v);
                });
                return res; 
            });
        }, []),
        totalMessageCount
    };

    return (
        <ChatsContext.Provider value={contextValue}>
            {children}
        </ChatsContext.Provider>
    );
};
