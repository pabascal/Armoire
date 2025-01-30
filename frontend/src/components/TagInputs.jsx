import { Tag, TagLabel, TagCloseButton, Wrap, Input, useColorModeValue, Box, VStack, Text } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { useItemStore } from '../store/item'; 

const TagInput = ({ value, onChange, placeholder, type }) => {
  const [tags, setTags] = useState(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : value.split(',').map(t => t.trim()).filter(Boolean);
  });

  useEffect(() => {
    // Update internal tags state when value prop changes
    if (value) {
      const newTags = Array.isArray(value) ? 
        value : 
        value.split(',').map(t => t.trim()).filter(Boolean);
      setTags(newTags);
    } else {
      setTags([]);
    }
  }, [value]); 

  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  
  // Get relevant bank based on type prop (categories/hues/tags)
  const { categoryBank, hueBank, tagBank, fetchUserBanks } = useItemStore();
  const bank = type === 'categories' ? categoryBank : type === 'hues' ? hueBank : tagBank;

  const tagBg = useColorModeValue('#ad998c99', '#3a3f49');
  const tagColor = useColorModeValue('#030204CC', 'gray.100');
  const suggestionsBg = useColorModeValue('white', 'gray.700');
  const suggestionHoverBg = useColorModeValue('gray.100', 'gray.600');
  const fieldColor = useColorModeValue('white', '#f7fafa');
  const txtColor = useColorModeValue('black', 'black');
  const borderColor = useColorModeValue('#E4E0E1','#E4E0E1')
  const focusBorderColor = useColorModeValue('#D8D2C2CC','#D8D2C2CC')
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
          color = {txtColor}
          _placeholder={{ color: placeholderColor }}
          border="1px solid"
          borderColor={borderColor}
          focusBorderColor={focusBorderColor}
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
