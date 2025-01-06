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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useItemStore } from '../store/item';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import TagInput from '../components/TagInputs';

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

  const boxColor = useColorModeValue('gray.50', 'gray.950');
  const vstackColor = useColorModeValue('#fff9f466', '#7d788066');
  const vstackTitle = useColorModeValue('black', '#f7fafaCC');
  const createButton = useColorModeValue('#b9a38699', '#544b4a');
  const createButtonText = useColorModeValue('black', '#f7fafaCC');
  const createHover = useColorModeValue('#b9a386', '#513c3499');
  const fieldColor = useColorModeValue('white', '#f7fafaCC');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');
  const chooseFile = useColorModeValue('gray.400', 'gray.200');
  const nofileChosen = useColorModeValue('gray.400', 'gray.200');

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
    <Box minH='30vh' display='flex' flexDirection='column'>
    <Box flex='1' display="flex" justifyContent="center" alignItems="center" p={4} minH='50vh'>
      <VStack spacing={5} p={8} borderRadius="md" boxShadow="lg" maxW="400px" w="100%" bg={vstackColor}>
        <Heading fontSize="27px" color={vstackTitle}>
          ADD ITEM
        </Heading>
        <Input
          placeholder="Item Name"
          value={newItem.name}
          border="1px solid"
          bg={fieldColor}
          _placeholder={{ color: placeholderColor }}
          borderColor="gray.600"
          focusBorderColor="gray.500"
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <TagInput
          placeholder="Categories (i.e. pants, top)"
          value={newItem.categories}
          onChange={(value) => setNewItem({ ...newItem, categories: value })}
          type="categories"
        />
        <TagInput
          placeholder="Hues (i.e. green, earthy)"
          value={newItem.hues}
          onChange={(value) => setNewItem({ ...newItem, hues: value })}
          type="hues"
        />
        <TagInput
          placeholder="Tags (i.e. business, dress)"
          value={newItem.tags}
          onChange={(value) => setNewItem({ ...newItem, tags: value })}
          type="tags"
        />
        <Input
          placeholder="Resale value (if applicable)"
          type="number"
          value={newItem.sellvalue}
          border="1px solid"
          bg={fieldColor}
          _placeholder={{ color: placeholderColor }}
          borderColor="gray.600"
          focusBorderColor="gray.500"
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
    </Box>
    </Box>
  );
};
export default CreatePage;
