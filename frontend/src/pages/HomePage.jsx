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

  const boxColor = useColorModeValue('gray.50', 'gray.950');
  const vstackColor = useColorModeValue('#fff9f466', '#7d788066');
  const vstackTitle = useColorModeValue('black', '#f7fafaCC');
  const loginButton = useColorModeValue('#c3ba9799', '#90838299');
  const loginHover = useColorModeValue('#c3ba97', '#908382');
  const createButton = useColorModeValue('#b9a38699', '#6a5e5f99');
  const createHover = useColorModeValue('#b9a386', '#6a5e5f');
  const emailField = useColorModeValue('white', '#f7fafaCC');
  const passwordField = useColorModeValue('white', '#f7fafaCC');

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
    <Box display="flex" flexDirection="column" minH="30vh">
      <Box display="flex" justifyContent="center" alignItems="center" bg={boxColor} minH="35vh">
        <VStack spacing={5} bg={vstackColor} p={8} borderRadius="md" boxShadow="lg" color="black" maxW="400px" w="100%">
          <Heading size="md" color={vstackTitle}>
            Access Your Armoire
          </Heading>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            border="1px solid"
            bg={emailField}
            borderColor="gray.400"
            focusBorderColor="gray.600"
            _placeholder={{ color: 'gray.500' }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            border="1px solid"
            bg={passwordField}
            borderColor="gray.400"
            focusBorderColor="gray.600"
            _placeholder={{ color: 'gray.500' }}
          />
          <Button bg={loginButton} w="100%" fontSize="xl" _hover={{ bg: loginHover }} onClick={handleLogin}>
            Login
          </Button>
          <Button bg={createButton} fontSize="lg" _hover={{ bg: createHover }} onClick={openRegisterModal} w="100%">
            New here? Create an Armoire!
          </Button>
          {/* Modals */}
          <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
        </VStack>
      </Box>
    </Box>
  );
}

export default HomePage;
