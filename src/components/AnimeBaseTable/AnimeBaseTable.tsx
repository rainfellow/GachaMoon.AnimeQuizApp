import { useContext, useEffect, useState } from 'react';
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  LoadingOverlay,
} from '@mantine/core';
import { LuSearch, LuChevronUp, LuChevronDown, LuChevronsUpDown } from 'react-icons/lu';
import classes from './AnimeBaseTable.module.css';
import { AnimeContext } from '@/context/anime-context';

interface RowData {
    animeId: number,
    malId: number,
    animeName: string
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? LuChevronUp : LuChevronDown) : LuChevronsUpDown;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }}/>
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toString().toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
)
{
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
        let value1 = a[sortBy]
        let value2 = b[sortBy]
        if (typeof(value1) == 'number' && typeof(value2) == 'number')
        {
          if (payload.reversed) {
              return value2 - value1;
            }
          return value1 - value2;
        }
        else
        {
          if (payload.reversed) {
              return value2.toLocaleString().localeCompare(value1.toLocaleString());
            }
          return value1.toLocaleString().localeCompare(value2.toLocaleString());
        }
      })
    ,
    payload.search
  );
}

export function AnimeBaseTable() {
  const { animes, loadAnimes, animeLoaded } = useContext(AnimeContext);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<RowData[]>([]);
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const tableKeys = { animeId: 0, malId: 0, animeName: ""}

  const setSorting = (field: keyof RowData) => {
      const reversed = field === sortBy ? !reverseSortDirection : false;
      setReverseSortDirection(reversed);
      setSortBy(field);
      setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      setSearch(value);
      setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.animeId}>
      <Table.Td>{row.animeId}</Table.Td>
      <Table.Td>{row.animeName}</Table.Td>
      <Table.Td>{row.malId}</Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    if (!animeLoaded)
    {
        loadAnimes();
    }
    else if (animes != undefined)
    {
        let res = animes.map((value) => ({ animeId: value.animeId, malId: value.malId, animeName: value.animeName }));
        setData(res)
        setSortedData(res);
    }
    else
    {
        console.log('error')
    }
  }, [animeLoaded])

  return (
    <>
      <LoadingOverlay visible={!animeLoaded} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={<LuSearch style={{ width: rem(16), height: rem(16) }} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Tbody>
            <Table.Tr>
              <Th
                sorted={sortBy === 'animeId'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('animeId')}
              >
                Anime Base Id
              </Th>
              <Th
                sorted={sortBy === 'animeName'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('animeName')}
              >
                Anime Title
              </Th>
              <Th
                sorted={sortBy === 'malId'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('malId')}
              >
                MyAnimeList Anime Id
              </Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={Object.keys(tableKeys).length}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}