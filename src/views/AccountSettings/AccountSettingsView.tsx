import { Container, Divider, Flex, Group, Paper, rem, Stack, Text } from "@mantine/core"
import { ReactElement, useState } from "react"
import { CgProfile, CgList } from "react-icons/cg";
import classes from "./AccountSettingsView.module.css"
import AnimeListsConfiguration from "@/components/AnimeLists/AnimeListsConfiguration";
import ProfileSettings from "@/components/ProfileSettings/ProfileSettings";

export const AccountSettingsView: React.FC = (): ReactElement => {
    
    const [active, setActive] = useState('Billing');
    const [selectedMenu, setSelectedMenu] = useState('');
    const linkData = [
    { label: 'Profile', icon: CgProfile },
    { label: 'Anime Lists', icon: CgList }, 
    ];

    const links = linkData.map((item) => (
        <a
          className={classes.link}
          data-active={item.label === active || undefined}
          key={item.label}
          href=''
          onClick={(event) => {
            event.preventDefault();
            setActive(item.label);
            setSelectedMenu(item.label);
          }}
        >
          <item.icon className={classes.linkIcon} />
          <div className={classes.linkText}>{item.label}</div>
        </a>
      ));

    const showSelectedMenu = (selectedLinkKey: string) =>
    {
        return (
            <>{selectedLinkKey == 'Anime Lists' ? <AnimeListsConfiguration/> :
               selectedLinkKey == 'Profile' ? <ProfileSettings/> :
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