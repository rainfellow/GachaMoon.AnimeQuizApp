import { Container, Divider, Flex, Group, Paper, Stack } from "@mantine/core"
import { ReactElement, useState } from "react"
import { CgProfile, CgList } from "react-icons/cg";
import { BsPeople } from "react-icons/bs";
import classes from "./AccountSettingsView.module.css"
import AnimeListsConfiguration from "@/components/AnimeLists/AnimeListsConfiguration";
import ProfileSettings from "@/components/ProfileSettings/ProfileSettings";
import { useTranslation } from "react-i18next";
import FriendsSettings from "@/components/FriendsSettings/FriendsSettings";

export const AccountSettingsView: React.FC = (): ReactElement => {
    const { t } = useTranslation('settings');
    
    const [active, setActive] = useState('Profile');
    const [selectedMenu, setSelectedMenu] = useState('');
    const linkData = [
    { label: "ProfileMenuButton", value: 'Profile', icon: CgProfile },
    { label: "AnimeListsMenuMutton", value: 'Anime Lists', icon: CgList }, 
    { label: "FriendsMenuButton", value: 'Friends', icon: BsPeople }, 
    ];

    const links = linkData.map((item) => (
        <a
          className={classes.link}
          data-active={item.value === active || undefined}
          key={item.value}
          href=''
          onClick={(event) => {
            event.preventDefault();
            setActive(item.value);
            setSelectedMenu(item.value);
          }}
        >
          <item.icon className={classes.linkIcon} />
          <div className={classes.linkText}>{t(item.label)}</div>
        </a>
      ));

    const showSelectedMenu = (selectedLinkKey: string) =>
    {
        return (
            <>{selectedLinkKey == 'Anime Lists' ? <AnimeListsConfiguration/> :
               selectedLinkKey == 'Profile' ? <ProfileSettings/> :
               selectedLinkKey == 'Friends' ? <FriendsSettings/> :
               <></>}</>
        )
    }

    return (
        <Paper>
          <Container fluid className={classes.wrapper}>
            <Group wrap="nowrap">
                <Stack py="md" className={classes.navbarMain}>
                    {links}
                </Stack>
                <Divider size="sm" orientation="vertical"/>
                <Flex>
                    {showSelectedMenu(selectedMenu)}
                </Flex>
            </Group>
            </Container>
        </Paper>
    )
}