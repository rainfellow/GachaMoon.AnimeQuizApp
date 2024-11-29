import { ChatsContext } from "@/context/chats-context";
import { ActionIcon, AppShell, Grid, Group, rem, ScrollArea, Stack, Tabs, Textarea, UnstyledButton, Text, useCombobox, Combobox, InputBase, Input, Space, Modal, Avatar, TextInput, Fieldset, NumberInput, Button, LoadingOverlay } from "@mantine/core"
import { useContext, useEffect, useRef, useState } from "react";
import { BsArrowBarLeft, BsArrowBarRight, BsChat, BsBell, BsArrowDown, BsArrowUp, BsBarChart, BsFillSendFill, BsPeople } from "react-icons/bs";
import classes from "./MainAppAside.module.css"
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { useDisclosure, useElementSize, useViewportSize } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { Chat, ChatType, GameConfiguration, GameState, PlayerInfo } from "@/models/GameConfiguration";
import { GameConfigurationContext } from "@/context/game-configuration-context";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { v4 as uuidv4 } from 'uuid';
import { CiTimer, CiCircleQuestion, CiMusicNote1, CiImageOn, CiCalendarDate, CiStar } from "react-icons/ci"
import { HiOutlineRefresh } from "react-icons/hi";
import { AuthContext } from "@/context/auth-context";
import { useAxios } from "@/hooks/use-axios";


export const MainAppAside = (props: {opened: boolean, setOpened: (value: boolean) => void}) => {

    const [previewOpened, setPreviewOpened] = useState(false);
    const { friends, setFriends, friendsCount, account, accountInfo } = useContext(AuthContext);
    const { chats, cachedPlayers, totalMessageCount, addCachedPlayers } = useContext(ChatsContext);
    const { gameConfiguration } = useContext(GameConfigurationContext);
    const { gameName, gameState } = useContext(MultiplayerGameContext);
    const combobox = useCombobox();
    const [gameConfigurationPreviewComponent, setGameConfigurationPreviewComponent] = useState<JSX.Element>(<></>);

    const axios = useAxios();

    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    const [friendsElements, setFriendsElements] = useState<JSX.Element[]>([]);

    const [isFriendsScreen, setIsFriendsScreen] = useState(true);

    const [newFriendId, setNewFriendId] = useState<string | number>('');
    const [sendingFriendRequest, setSendingFriendRequest] = useState(false);

    const [selectedChat, setSelectedChat] = useState<Chat>();

    const [creatingChat, setCreatingChat] = useState(false);


    const [selectedChatValue, setSelectedChatValue] = useState<string>("");

    const { sendChatMessage, startNewChat } = useMultiplayerGame()
    const [chatMessageElements, setChatMessageElements] = useState<JSX.Element[]>();

    const [newMessage, setNewMessage] = useState("");
    const { width, height } = useViewportSize();
    const { t } = useTranslation('game');

    const [chatNames, setChatNames] = useState<string[]>([]);

    const chatInputRef = useRef(null)

    const handleSendMessageButton = (message: string) => {
        if (selectedChat != undefined)
        {
            sendChatMessage(selectedChat.name, message);
            setNewMessage("");
        }
    }

    const handleFriendRequestButtonClicked = (friendId: number | string) => {
        if (typeof(friendId) == 'number')
        {
            setSendingFriendRequest(true);
            axios.post(`Account/friends/add?friendId=${friendId}`).then(() => {
                setSendingFriendRequest(false); 
                closeModal();
            });
        }
    }

    const handleOpenGameChatButtonClicked = (gameName: string) => {
        let chat = chats.get(gameName)
        if (chat != undefined)
        {
            setSelectedChat(chat);
            setSelectedChatValue(chat.name);
            setIsFriendsScreen(false);
        }
        else
        {
            console.log('game chat not found!');
        }
    }

    const openPrivateChat = (friend: PlayerInfo) => {
        let chat = [...chats.values()].find(chat => chat.members.findIndex(memberId => memberId == friend.accountId) != -1);
        if (chat != undefined)
        {
            setSelectedChat(chat);
            setSelectedChatValue(chat.name);
        }
        else
        {
            setCreatingChat(true);
            startNewChat(friend.accountId).then((newChat) => { 
                console.log(`got chat ${newChat.name}`);
                setSelectedChat(newChat); 
                setCreatingChat(false); 
                setSelectedChatValue(newChat.name); });
        }
        setIsFriendsScreen(false);
    }

    const refreshFriendsList = () => {
        axios.get("Account/friends/list").then((res) => {
            addCachedPlayers(res.data.friends);
            setFriends(res.data.friends);
          });
    }

    const accountIdToName = (accountId: number) => {
        if (accountId == 0)
        {
            return t('GameChatSystemMessage');
        }
        else if (accountId == account?.accountId)
        {
            return accountInfo?.accountName;
        }
        else
        {
            return cachedPlayers.find(x => x.accountId == accountId)!.accountName;
        }
    }
    const updateChatMessages = (selectedChat: Chat | undefined) => { 
        setChatMessageElements(selectedChat == undefined ? [] : selectedChat.messages.map((m) => 
        <Text key={uuidv4()}>
            {accountIdToName(m.accountId) + ": " + m.message} 
        </Text>
          ));
    }
    const options = chatNames.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ));

    useEffect(() => {
        updateChatMessages(selectedChat);
    }, [totalMessageCount, selectedChat]);

    useEffect(() => {
        if (friends != null && friends.length > 0)
        {
            let content = friends.map((friend) => 
                <UnstyledButton className={classes.user} onClick={() => openPrivateChat(friend)} key={friend.accountId}>
                    <Group>
                    <Avatar
                        src=""
                        radius="xl"
                    />
                    <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                        {friend.accountName}#{friend.accountId}
                        </Text>
                        <Text c="dimmed" size="xs">
                        </Text>
                    </div>
                    </Group>
                </UnstyledButton>);
            setFriendsElements(content);
        }
        else
        {
            setFriendsElements([<Text c='dimmed'>{t('NoFriendsPlaceholder')}</Text>])
        }
    }, [friendsCount])

    useEffect(() => {
        setGameConfigurationPreviewComponent(
            <Stack align="flex-start">
                <Group justify="flex-start">
                    <CiTimer/><Text>{gameConfiguration.questionTimeout} + {gameConfiguration.questionBonusTime}</Text>
                </Group>
                <Group justify="space-between">
                    <Group justify="flex-start">
                        <CiCircleQuestion/><Text>{gameConfiguration.numberOfQuestions}</Text>
                    </Group>
                    <Group justify="flex-start">
                        <CiMusicNote1/><Text>{gameConfiguration.songQuestions}</Text>
                    </Group>
                    <Group justify="flex-start">
                        <CiImageOn/><Text>{gameConfiguration.imageQuestions}</Text>
                    </Group>
                </Group>
                <Group justify="flex-start">
                    <CiCalendarDate/><Text>{gameConfiguration.minReleaseYear} - {gameConfiguration.maxReleaseYear}</Text>
                </Group>
                <Group justify="flex-start">
                    <CiStar/><Text>{gameConfiguration.minRating} - {gameConfiguration.maxRating}</Text>
                </Group>
                <Group justify="flex-start">
                    <BsBarChart/><Text>{gameConfiguration.minUserScore} - {gameConfiguration.maxUserScore}</Text>
                </Group>
            </Stack>
        );
    }, [JSON.stringify(gameConfiguration)])

    return (
        <>
        <Modal
            opened={modalOpened}
            onClose={closeModal}
            title={t('AddFriendModalTitle')}
        >
            <LoadingOverlay visible={sendingFriendRequest} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Fieldset legend="">
                <Stack align='space-around'>
                    <Group justify='space-between'>
                        <NumberInput 
                            label={t('EnterFriendIdTitle')} 
                            value={newFriendId} 
                            onChange={(value) => {
                                setNewFriendId(value);
                              }}/>
                        <Button onClick={() => handleFriendRequestButtonClicked(newFriendId)}>
                            <Text>{t('SendFriendRequestButtonLabel')}</Text>
                        </Button>
                    </Group>
                </Stack>
            </Fieldset>
        </Modal>
        <AppShell.Aside w={props.opened ? 300 : 40} withBorder={props.opened}>
            { props.opened &&
            <>
            <LoadingOverlay visible={creatingChat} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <AppShell.Section>
                <Group justify="flex-end">
                </Group>
            </AppShell.Section>
            { previewOpened && 
            <AppShell.Section h={Math.max(200, height / 3.5)} component={ScrollArea}>
                {gameConfigurationPreviewComponent}
            </AppShell.Section>}
            { gameState == GameState.Lobby &&
            <AppShell.Section h={20} className={classes.border}>
                <Group justify={"center"}>
                    <UnstyledButton onClick={() => setPreviewOpened((opened) => !opened)}>
                        <Group justify={"center"} align="flex-end">
                            { !previewOpened 
                            ? <><Text size={'xs'}>{t('ShowGameConfigurationPreviewLabel')}</Text><BsArrowDown size={16} /></> 
                            : <><Text size={'xs'}>{t('HideGameConfigurationPreviewLabel')}</Text><BsArrowUp size={16} /></> }
                        </Group>
                    </UnstyledButton>
                </Group>
            </AppShell.Section>}
            <AppShell.Section grow my="md" component={ScrollArea}>
                {isFriendsScreen ? friendsElements : chatMessageElements}
            </AppShell.Section>
            { gameState != GameState.None && gameState != GameState.Connected && (isFriendsScreen || selectedChat == null || selectedChat.chatType != ChatType.Game) &&
                <AppShell.Section h={20} className={classes.border}>
                    <Group justify={"center"}>
                        <UnstyledButton onClick={() => handleOpenGameChatButtonClicked(gameName)}>
                            <Group justify={"center"} align="flex-end">
                                <Text size={'xs'}>{t('OpenGameChatLabel')}</Text>
                            </Group>
                        </UnstyledButton>
                    </Group>
                </AppShell.Section> }
            <AppShell.Section>
                <div hidden={isFriendsScreen}>
                <Textarea
                    disabled={selectedChat == null || selectedChat.isArchived}
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
                </div>
                <Space h={5}/>
                <Group justify='space-between'>
                    <Group>
                        <ActionIcon size='xs' onClick={() => props.setOpened(!props.opened)}>
                            <BsArrowBarRight/>
                        </ActionIcon>
                        {isFriendsScreen 
                            ?
                            <ActionIcon size='xs' onClick={() => refreshFriendsList()}>
                                <HiOutlineRefresh/>
                            </ActionIcon> 
                            : 
                            <ActionIcon size='xs' onClick={() => setIsFriendsScreen(true)}>
                                <BsPeople/>
                            </ActionIcon>}
                        <ActionIcon size='xs' onClick={openModal}>
                            <Text size={'xs'}>+</Text>
                        </ActionIcon>
                    </Group>
                    <div hidden={isFriendsScreen}>
                        <ActionIcon disabled={selectedChat == null || selectedChat.isArchived} size='xs' onClick={() => handleSendMessageButton(newMessage)}>
                            <BsFillSendFill/>
                        </ActionIcon>
                    </div>
                </Group>
                <Space h={5}/>
            </AppShell.Section>
            </>
            }
            {
                !props.opened && 
                <Stack style={{flex: 1}} justify="center">
                    <ActionIcon onClick={() => props.setOpened(!props.opened)}>
                        <BsArrowBarLeft style={{ width: rem(24), height: rem(24) }}/>
                    </ActionIcon>
                </Stack>
            }
        </AppShell.Aside>
        </>
    );
}