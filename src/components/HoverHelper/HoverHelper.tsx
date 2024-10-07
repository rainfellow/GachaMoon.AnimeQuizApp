import { Group, HoverCard, Text, Badge } from '@mantine/core';

export function HoverHelper(props: { displayedText: string }) {

  return (
      <HoverCard width={250} shadow="md" withArrow openDelay={200} closeDelay={200} position='right-start'>
        <HoverCard.Target>
          <Badge size="xs" circle>
            ?
          </Badge>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Group>
            <Text size="sm">
              {props.displayedText}
            </Text>
          </Group>
        </HoverCard.Dropdown>
      </HoverCard>
  );
}