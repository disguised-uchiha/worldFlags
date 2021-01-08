import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Stack, Box, Input, Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react';
import { useStore } from '../store/store';
import { useHistory } from 'react-router-dom';
import { Actions } from '../types/Actions';

export const SearchMenu: React.FC = () => {
  const {
    state: { region, searchInputValue },
    dispatch,
  } = useStore();

  let history = useHistory();

  const onMenuHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const region = (e.target as any).firstChild.data;
    dispatch({ type: 'setRegion', payload: region });
    history.push(region);
  };
  const searchResult = (res: any) => {
    if (!res.status) {
      dispatch({ type: Actions.setCountries, payload: [...res] });
    } else {
      dispatch({ type: Actions.setCountries, payload: [] });
    }
  };
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchInputValue) {
        const res = await fetch(
          `https://restcountries.eu/rest/v2/name/${searchInputValue.toLowerCase()}`
        )
          .then((res) => res.json())
          .then((data) => data);
        searchResult(res);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInputValue]);
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  return (
    <div>
      <Stack
        direction={['column', 'row']}
        justify='space-between'
        py={5}
        spacing='1rem'
        mx={{ base: '5%' }}
      >
        <Box width={{ md: '50%' }}>
          <Input
            variant='outline'
            value={searchInputValue}
            placeholder='Search for a country...'
            onChange={(event) => {
              const value = event.target.value;
              dispatch({ type: Actions.setSearchInputValue, payload: value });
            }}
          />
        </Box>
        <Box>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {region}
            </MenuButton>
            <MenuList onClick={onMenuHandler}>
              {regions.map((region) => (
                <MenuItem key={region}>{region}</MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Stack>
    </div>
  );
};
