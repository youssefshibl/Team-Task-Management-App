import React, { useState, useMemo } from 'react';
import {
  Box,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  VStack,
  Text,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { User } from '../types';

interface SearchableMemberSelectProps {
  members: User[];
  selectedMemberId: string;
  onSelect: (memberId: string) => void;
  placeholder?: string;
}

export const SearchableMemberSelect: React.FC<SearchableMemberSelectProps> = ({
  members,
  selectedMemberId,
  onSelect,
  placeholder = 'All Members',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return members;
    }
    const query = searchQuery.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  const handleSelect = (memberId: string) => {
    onSelect(memberId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelect('');
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <Popover isOpen={isOpen} onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <Button
          variant="outline"
          minW="200px"
          justifyContent="space-between"
          textAlign="left"
          fontWeight="normal"
          _after={{
            content: '"▼"',
            fontSize: '10px',
            ml: 2,
            color: 'gray.500',
          }}
        >
          {selectedMember ? selectedMember.name : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent w="100%" maxW="400px">
        <PopoverBody p={0}>
          <Box p={3} borderBottom="1px solid" borderColor="gray.200">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </InputGroup>
          </Box>
          <VStack
            align="stretch"
            maxH="300px"
            overflowY="auto"
            spacing={0}
            divider={<Box borderColor="gray.200" />}
          >
            <Box
              px={4}
              py={2}
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
              onClick={handleClear}
              bg={!selectedMemberId ? 'blue.50' : 'transparent'}
            >
              <Text fontWeight={!selectedMemberId ? 'semibold' : 'normal'}>
                {placeholder}
              </Text>
            </Box>
            {filteredMembers.length === 0 ? (
              <Box px={4} py={3}>
                <Text color="gray.500" fontSize="sm">
                  No members found
                </Text>
              </Box>
            ) : (
              filteredMembers.map((member) => (
                <Box
                  key={member.id}
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: 'gray.50' }}
                  onClick={() => handleSelect(member.id)}
                  bg={selectedMemberId === member.id ? 'blue.50' : 'transparent'}
                >
                  <Text fontWeight={selectedMemberId === member.id ? 'semibold' : 'normal'}>
                    {member.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {member.email}
                  </Text>
                </Box>
              ))
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

