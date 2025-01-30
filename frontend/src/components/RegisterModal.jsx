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
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser, login } from '../store/user';
import { useNavigate } from 'react-router-dom';

const RegisterModal = ({ isOpen, onClose }) => {
  const modalBg = useColorModeValue('#E4E0E1', '#131b27');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');
  const txtColor = useColorModeValue('black', 'black');
  const fieldBg = useColorModeValue('white', '#f7fafa');
  const borderColor = useColorModeValue('#E4E0E1', '#E4E0E1');
  const focusBorderColor = useColorModeValue('#D8D2C2CC', '#D8D2C2CC');
  const registerButton = useColorModeValue('#ad998c99', '#ad998cCC');
  const buttonHover = useColorModeValue('#ad998c', '#ad998c');

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
      <ModalContent py={6} bg={modalBg}>
        <ModalHeader>Enter credentials to begin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <Input
              bg={fieldBg}
              placeholder="Name"
              _placeholder={{ color: placeholderColor }}
              value={name}
              borderColor = {borderColor}
              focusBorderColor = {focusBorderColor}
              color = {txtColor}
              onChange={(e) => setName(e.target.value)}
              mb={3}
            />
            <Input
              bg={fieldBg}
              placeholder="Email"
              _placeholder={{ color: placeholderColor }}
              value={email}
              borderColor = {borderColor}
              focusBorderColor = {focusBorderColor}
              color = {txtColor}
              onChange={(e) => setEmail(e.target.value)}
              mb={3}
            />
            <Input
              bg={fieldBg}
              type="password"
              placeholder="Password"
              _placeholder={{ color: placeholderColor }}
              value={password}
              borderColor = {borderColor}
              focusBorderColor = {focusBorderColor}
              color = {txtColor}
              onChange={(e) => setPassword(e.target.value)}
              mb={3}
            />
          </VStack>
        </ModalBody>
        <ModalFooter pr={10}>
          <Button bg={registerButton} color='black' _hover={{ bg: buttonHover }} onClick={handleRegister} >
            Register!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
