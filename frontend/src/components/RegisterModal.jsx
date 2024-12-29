import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser, login } from '../store/user';
import { useNavigate } from 'react-router-dom';

const RegisterModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const data = await registerUser(name, email, password);

      // If your backend returns a token upon registration
      if (data && data.user && data.token) {
        console.log('Registration successful:', data);
        dispatch(
          login({
            user: data.user,
            token: data.token,
          }),
        );
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast({
          title: 'Registration successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
        // Optionally redirect to dashboard/items page
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent py={6}>
        <ModalHeader>Enter credentials to begin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} mb={3} />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} mb={3} />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              mb={3}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleRegister}>
            Register!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
