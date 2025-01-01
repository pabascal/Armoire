import { Box, Button, VStack, Input, Heading, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '../components/RegisterModal';
import { loginUser, login } from '../store/user';

function HomePage() {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('User is logged in');
      dispatch(login({ token })); // Store the token in Redux
    } else {
      console.log('User is not logged in');
    }
  }, [dispatch]);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      if (data && data.user && data.token) {

        dispatch(
        login({
          user: {
            _id: data.user._id,
            name: data.user.name,
            email: data.user.email,
          },
          token: data.token,
        }),
        );

        //localStorage.setItem('token', data.token);
        navigate('/closet');
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } 
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={useColorModeValue('gray.200', 'gray.800')}>
      <VStack spacing={5} mt="-30vh" bg="white" p={8} borderRadius="md" boxShadow="lg" color="black" maxW="400px" w="100%">
        <Heading size="md">Access Your Armoire</Heading>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          border="1px solid"
          borderColor="gray.400"
          focusBorderColor="teal.500"
          _placeholder={{ color: 'gray.400' }}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          border="1px solid"
          borderColor="gray.400"
          focusBorderColor="teal.500"
          _placeholder={{ color: 'gray.400' }}
        />
        <Button colorScheme="teal" w="100%" onClick={handleLogin}>
          Login
        </Button>
        <Button colorScheme="blue" onClick={openRegisterModal} w="100%">
          New here? Create an Armoire!
        </Button>
        {/* Modals */}
        <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      </VStack>
    </Box>
  );
}

export default HomePage;
