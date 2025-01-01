import { VStack, useToast, Input, Button, Box, Heading, Spinner, Text, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useItemStore } from '../store/item';
import { useSelector } from 'react-redux';
import { useRef } from 'react';

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
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
      <VStack spacing={5} bg="gray.900" p={8} borderRadius="md" boxShadow="lg" maxW="400px" w="100%">
        <Heading size="md" color="purple.600">ADD ITEM</Heading>
        <Input
          placeholder="Item Name"
          value={newItem.name}
          border="1px solid"
          borderColor="gray.600"
          focusBorderColor="gray.500"
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <Input
          placeholder="Categories (i.e. pants, top)"
          value={newItem.categories}
          border="1px solid"
          borderColor="gray.600"
          focusBorderColor="gray.500"
          onChange={(e) => setNewItem({ ...newItem, categories: e.target.value })}
        />
        <Input
          placeholder="Hues (i.e. green, earthy)"
          value={newItem.hues}
          border="1px solid"
          borderColor="gray.600"
          focusBorderColor="gray.500"
          onChange={(e) => setNewItem({ ...newItem, hues: e.target.value })}
        />
        <Input
          placeholder="Tags (i.e. business, dress)"
          value={newItem.tags}
          border="1px solid"
          borderColor="gray.600"
          focusBorderColor="gray.500"
          onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
        />
        <Input
          placeholder="Resale value (if applicable)"
          type="number"
          value={newItem.sellvalue}
          border="1px solid"
          borderColor="gray.600"
          focusBorderColor="gray.500"
          onChange={(e) => setNewItem({ ...newItem, sellvalue: e.target.value })}
        />
        <Input
          ref={fileInputRef}
          placeholder="Image File"
          type="file"
          accept="image/*"
          onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
        />
        <Button
          onClick={handleSubmit}
          isDisabled={isLoading}
          colorScheme="purple"
          width="100%"
          height="40px"
          _hover={{ bg: 'blue.600' }}>
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
  );
};
export default CreatePage;
