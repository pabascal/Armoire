import {
  VStack,
  useToast,
  Input,
  Button,
  Box,
  Heading,
  Spinner,
  Text,
  HStack,
  useColorModeValue,
  Icon,
  useDisclosure,
  Collapse,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useItemStore } from '../store/item';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import TagInput from '../components/TagInputs';
import TagBankDisplay from '../components/TagBankDisplay';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const CreatePage = () => {
  const toast = useToast();
  const userState = useSelector((state) => state.user);
  const { user } = userState;
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [newItem, setNewItem] = useState({
    name: '',
    categories: '',
    hues: '',
    tags: '',
    sellvalue: '',
    image: null,
  });
  const { categoryBank, hueBank, tagBank, fetchUserBanks } = useItemStore();
  const { isOpen, onToggle } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  useEffect(() => {
    fetchUserBanks();
  }, []);

  const boxColor = useColorModeValue('gray.50', 'gray.950');
  const vstackColor = useColorModeValue('#E4E0E1', '#7d788066');
  const vstackTitle = useColorModeValue('black', '#f7fafaCC');
  const createButton = useColorModeValue('#D8D2C2', '#908382CC');
  const createButtonText = useColorModeValue('black', 'black');
  const createHover = useColorModeValue('#c3ba97', '#908382');
  const fieldColor = useColorModeValue('white', '#f7fafa');
  const txtColor = useColorModeValue('black', 'black');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');
  const chooseFile = useColorModeValue('gray.700', 'gray.200');
  const nofileChosen = useColorModeValue('gray.700', 'gray.200');
  const borderColor = useColorModeValue('#E4E0E1','#E4E0E1')
  const focusBorderColor = useColorModeValue('#D8D2C2CC','#D8D2C2CC')

  const handleSubmit = async () => {
    if (!user || !user._id) {
      console.error('No user found in Redux state:', user);
      toast({
        title: 'Error',
        description: 'Please log in again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    console.log('Categories before FormData:', newItem.categories);

    const formData = new FormData();
    formData.append('user', user._id);
    formData.append('name', newItem.name);
    formData.append('categories', newItem.categories ? newItem.categories.split(',').map((c) => c.trim()) : []);
    formData.append('hues', newItem.hues ? newItem.hues.split(',').map((h) => h.trim()) : []);
    formData.append('tags', newItem.tags ? newItem.tags.split(',').map((t) => t.trim()) : []);
    formData.append('sellvalue', newItem.sellvalue);

    if (newItem.image) {
      formData.append('image', newItem.image, newItem.image.name); // Add filename as third parameter
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      setIsLoading(false);

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Item Created',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setNewItem({ name: '', categories: '', hues: '', tags: '', sellvalue: '', image: '' });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(data.message || 'Failed to create item');
      }
    } catch (error) {
      setIsLoading(false);

      console.error('Error creating item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="30vh" display="flex" flexDirection="column" bg="transparent">
      <Box
        flex="1"
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }} // Stack on mobile, row on desktop
        gap={6}
        justifyContent="center"
        alignItems={{ base: 'center', lg: 'flex-start' }}
        p={4}
        pt={{ base: 2, sm: 4 }}>
        <VStack spacing={0} maxW="400px" w="100%">
          {/* Header - Always Visible */}
          <Box
            w="100%"
            bg={vstackColor}
            p={4}
            boxShadow={isDesktop ? 'none' : 'lg'}
            cursor={isDesktop ? 'default' : 'pointer'}
            onClick={() => {
              if (!isDesktop) {
                onToggle();
              }
            }}
            display="flex"
            justifyContent={{ base: 'space-between', lg: 'center' }} 
            alignItems="center"
            transition="all 0.4s ease"
            position="relative"
            _before={{
              content: isDesktop ? 'none' : '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: isOpen || isDesktop ? 'md md 0 0' : 'md',
              bg: useColorModeValue('#E4E0E1', '#7d788088'),
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
            _hover={{
              '&::before': {
                opacity: { base: 0.5, lg: 0 },
              },
              transform: { base: 'translateY(-1px)', lg: 'none' },
              boxShadow: {
                base: isOpen ? 'lg' : '2xl',
                lg: 'lg',
              },
            }}>
            <Heading fontSize={{ base: '22px', sm: '27px' }} color={vstackTitle} position="relative" zIndex={1} pl={3}>
              ADD ITEM
            </Heading>
            <Icon
              as={isOpen ? ChevronUpIcon : ChevronDownIcon}
              display={{ base: 'block', lg: 'none' }}
              transition="transform 0.2s"
              transform={isOpen ? 'rotate(0deg)' : 'rotate(0deg)'}
              w={9}
              h={6}
            />
          </Box>

          {/* Collapsible Content */}
          <Collapse in={isOpen || isDesktop} style={{ width: '100%' }}>
            <VStack spacing={5} p={8} pt={6} bg={vstackColor} borderRadius="0 0 md md" boxShadow="lg" w="100%">
              <Input
                placeholder="Item Name"
                value={newItem.name}
                bg={fieldColor}
                _placeholder={{ color: placeholderColor }}
                border="1px solid"
                color = {txtColor}
                borderColor={borderColor}
                focusBorderColor={focusBorderColor}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              <TagInput
                placeholder="Category(s)"
                value={newItem.categories}
                onChange={(value) => setNewItem({ ...newItem, categories: value })}
                type="categories"
              />
              <TagInput
                placeholder="Hue(s)"
                value={newItem.hues}
                onChange={(value) => setNewItem({ ...newItem, hues: value })}
                type="hues"
              />
              <TagInput
                placeholder="Tags (i.e. business, outdoor)"
                value={newItem.tags}
                onChange={(value) => setNewItem({ ...newItem, tags: value })}
                type="tags"
              />
              <Input
                placeholder="Resale value (#)"
                type="number"
                value={newItem.sellvalue}
                bg={fieldColor}
                color = {txtColor}
                _placeholder={{ color: placeholderColor }}
                border="1px solid"
                borderColor={borderColor}
                focusBorderColor={focusBorderColor}
                onChange={(e) => setNewItem({ ...newItem, sellvalue: e.target.value })}
              />
              <Input
                ref={fileInputRef}
                type="file"
                sx={{
                  '&::file-selector-button': { color: chooseFile },
                  color: nofileChosen,
                }}
                accept="image/*"
                onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
              />
              <Button
                onClick={handleSubmit}
                isDisabled={isLoading}
                bg={createButton}
                color={createButtonText}
                width="100%"
                height="40px"
                _hover={{ bg: createHover }}>
                {isLoading ? (
                  <HStack spacing={2} justify="center">
                    <Spinner size="sm" color="white" />
                    <Text>Creating...</Text>
                  </HStack>
                ) : (
                  'Create Item'
                )}
              </Button>
            </VStack>
          </Collapse>
        </VStack>
        <VStack
          spacing={4}
          display={{ base: 'flex', lg: 'flex' }} // Always show, just reposition
          position={{ base: 'static', lg: 'sticky' }} // Only sticky on desktop
          top={4}
          w={{ base: '100%', lg: 'auto' }} // Full width on mobile
          alignItems={{ base: 'center', lg: 'stretch' }}>
          <TagBankDisplay
            title="Categories"
            items={categoryBank}
            type="categories"
            fetchUserBanks={fetchUserBanks}
            onTagClick={(category) => {
              const currentCategories = newItem.categories ? newItem.categories.split(',').map((c) => c.trim()) : [];
              if (!currentCategories.includes(category)) {
                setNewItem({
                  ...newItem,
                  categories: [...currentCategories, category].join(', '),
                });
              }
            }}
          />
          <TagBankDisplay
            title="Hues"
            items={hueBank}
            type="hues"
            fetchUserBanks={fetchUserBanks}
            onTagClick={(hue) => {
              const currentHues = newItem.hues ? newItem.hues.split(',').map((h) => h.trim()) : [];
              if (!currentHues.includes(hue)) {
                setNewItem({
                  ...newItem,
                  hues: [...currentHues, hue].join(', '),
                });
              }
            }}
          />
          <TagBankDisplay
            title="Tags"
            items={tagBank}
            type="tags"
            fetchUserBanks={fetchUserBanks}
            onTagClick={(tag) => {
              const currentTags = newItem.tags ? newItem.tags.split(',').map((t) => t.trim()) : [];
              if (!currentTags.includes(tag)) {
                setNewItem({
                  ...newItem,
                  tags: [...currentTags, tag].join(', '),
                });
              }
            }}
          />
        </VStack>
      </Box>
    </Box>
  );
};
export default CreatePage;
