import { Tag, TagLabel, TagCloseButton, Wrap, Input, useColorModeValue, Box, VStack, Text } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { useItemStore } from '../store/item'; 

const TagInput = ({ value, onChange, placeholder, type }) => {
  const [tags, setTags] = useState(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : value.split(',').map(t => t.trim()).filter(Boolean);
  });
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  
  // Get relevant bank based on type prop (categories/hues/tags)
  const { categoryBank, hueBank, tagBank, fetchUserBanks } = useItemStore();
  const bank = type === 'categories' ? categoryBank : type === 'hues' ? hueBank : tagBank;

  const tagBg = useColorModeValue('blue.100', 'blue.900');
  const tagColor = useColorModeValue('blue.800', 'blue.100');
  const suggestionsBg = useColorModeValue('white', 'gray.700');
  const suggestionHoverBg = useColorModeValue('gray.100', 'gray.600');
  const fieldColor = useColorModeValue('white', '#f7fafaCC');
  const placeholderColor = useColorModeValue('gray.400','gray.500')

  useEffect(() => {
    fetchUserBanks();
  }, []);

  // Filter suggestions based on input
  const suggestions = bank.filter(item => 
    item.toLowerCase().includes(input.toLowerCase()) && 
    !tags.includes(item)
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      const newTags = [...tags, input];
      setTags(newTags);
      setInput('');
      onChange(newTags.join(', '));
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const newTags = [...tags, suggestion];
    setTags(newTags);
    setInput('');
    onChange(newTags.join(', '));
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Box position="relative" ref={wrapperRef} width='100%'>
      <Wrap spacing={2} width='100%'>
        {tags.map(tag => (
          <Tag
            key={tag}
            size="md"
            borderRadius="full"
            variant="solid"
            bg={tagBg}
            color={tagColor}>
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton
              onClick={() => {
                const newTags = tags.filter(t => t !== tag);
                setTags(newTags);
                onChange(newTags.join(', '));
              }}
            />
          </Tag>
        ))}
        <Input
          value={input}
          placeholder={placeholder}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          bg={fieldColor}
          _placeholder={{ color: placeholderColor }}
          border="1px solid"
          borderColor="gray.600"
          focusBorderColor="gray.500"
        />
      </Wrap>
      
      {/* Suggestions dropdown */}
      {showSuggestions && input && suggestions.length > 0 && (
        <VStack
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          bg={suggestionsBg}
          borderRadius="md"
          boxShadow="lg"
          zIndex={1000}
          maxH="200px"
          overflowY="auto"
          spacing={0}
        >
          {suggestions.map(suggestion => (
            <Box
              key={suggestion}
              w="100%"
              p={2}
              cursor="pointer"
              _hover={{ bg: suggestionHoverBg }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Text>{suggestion}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default TagInput;
