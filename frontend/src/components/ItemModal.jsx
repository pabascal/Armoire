import { useEffect, useState } from 'react';
import {
  VStack,
  useToast,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useItemStore } from '../store/item';
import { useSelector } from 'react-redux';

const ItemModal = ({ isOpen, onClose }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    categories: '',
    hues: '',
    tags: '',
    sellvalue: '',
    image: '',
  });
  const { createItem } = useItemStore();
  const toast = useToast();
  //const { user, isAuthenticated } = useSelector(state => state.user);
  const userState = useSelector((state) => state.user);
  const { user } = userState;

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

    const formData = new FormData();
    formData.append('user', user._id);
    formData.append('name', newItem.name);
    formData.append('categories', newItem.categories ? newItem.categories.split(',').map((c) => c.trim()) : []);
    formData.append('hues', newItem.hues ? newItem.hues.split(',').map((h) => h.trim()) : []);
    formData.append('tags', newItem.tags ? newItem.tags.split(',').map((t) => t.trim()) : []);
    formData.append('sellvalue', newItem.sellvalue);

    if (newItem.image) {
      formData.append('image', newItem.image);
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        toast({
          title: 'Item Created',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setNewItem({ name: '', categories: '', hues: '', tags: '', sellvalue: '', image: '' });
        onClose();
      } else {
        throw new Error(data.message || 'Failed to create item');
      }
    } catch (error) {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      ;
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Input
              placeholder="Item Name"
              name="name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Input
              placeholder="Category (i.e. pants, joggers)"
              name="categories"
              value={newItem.categories}
              onChange={(e) => setNewItem({ ...newItem, categories: e.target.value })}
            />
            <Input
              placeholder="Hue (i.e. green, earthy)"
              name="hues"
              value={newItem.hues}
              onChange={(e) => setNewItem({ ...newItem, hues: e.target.value })}
            />
            <Input
              placeholder="Tags (i.e. business, dress)"
              name="tags"
              value={newItem.tags}
              onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
            />
            <Input
              placeholder="Value"
              name="sellvalue"
              type="number"
              value={newItem.sellvalue}
              onChange={(e) => setNewItem({ ...newItem, sellvalue: e.target.value })}
            />
            <Input
              placeholder="Image File"
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            {' '}
            Cancel{' '}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemModal;
