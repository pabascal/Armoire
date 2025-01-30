import {
  Box,
  Button,
  VStack,
  Input,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  SimpleGrid,
  Container,
  Image,
  Flex,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
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

  const boxColor = useColorModeValue('#E4E0E1', 'gray.950'); //unused because of overlays
  const vstackColor = useColorModeValue('#E4E0E1', '#7d788066');
  const vstackTitle = useColorModeValue('black', '#f7fafaCC');
  const loginButton = useColorModeValue('#D8D2C2', '#908382CC');
  const buttonText = useColorModeValue('black', 'black');
  const loginHover = useColorModeValue('#c3ba97', '#908382');
  const createButton = useColorModeValue('#D8D2C2', '#908382CC');
  const createHover = useColorModeValue('#c3ba97', '#908382');
  const emailField = useColorModeValue('white', '#f7fafa');
  const passwordField = useColorModeValue('white', '#f7fafa');
  const borderColor = useColorModeValue('#E4E0E1', '#E4E0E1');
  const focusBorderColor = useColorModeValue('#D8D2C2CC', '#D8D2C2CC');
  const heroTextColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const featureBg = useColorModeValue('gray.50', 'gray.900');

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
    <Container maxW="container.xl" p={0}>
      {/* Hero Section */}
      <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between" py={8} px={4} gap={8}>
        {/* Marketing Content */}
        <Box flex={1}>
          <Heading as="h1" size="2xl" color={heroTextColor} mb={6}>
            Manage Your Wardrobe
          </Heading>
          <Text fontSize="xl" color={heroTextColor} mb={6}>
            Keep track of your closet, plan your outfits, and rediscover your style with Armoire
          </Text>
        </Box>

        <Box flex={1} maxW="400px" w="100%" pr={0}>
          <VStack spacing={5} bg={vstackColor} p={8} borderRadius="md" boxShadow="lg" color="black">
            <Heading size="md" color={vstackTitle}>
              Access Your Armoire
            </Heading>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              border="1px solid"
              bg={emailField}
              borderColor={borderColor}
              focusBorderColor={focusBorderColor}
              _placeholder={{ color: 'gray.500' }}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              border="1px solid"
              bg={passwordField}
              borderColor={borderColor}
              focusBorderColor={focusBorderColor}
              _placeholder={{ color: 'gray.500' }}
            />
            <Button
              bg={loginButton}
              color={buttonText}
              w="100%"
              fontSize="xl"
              _hover={{ bg: loginHover }}
              onClick={handleLogin}>
              Login
            </Button>
            <Button
              bg={createButton}
              color={buttonText}
              fontSize={{ base: 'md', sm: 'lg' }}
              _hover={{ bg: createHover }}
              onClick={() => setIsRegisterModalOpen(true)}
              w="100%">
              New here? Create an Armoire!
            </Button>
          </VStack>
        </Box>
      </Flex>

      {/* Features Section */}
      <Box bg={featureBg} position="relative" py={16} px={4}>
        {/* First feature with text - remains the same */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          maxW="container.xl"
          mx="auto"
          gap={8}
          mb={8}>
          <Box flex={1}>
            <Image
              src={features[0].image}
              alt={features[0].title}
              borderRadius="xl"
              w="100%"
              h={{ base: '300px', md: '500px' }}
              objectFit="cover"
              boxShadow="xl"
            />
          </Box>
          <Box flex={1}>
            <Heading size="xl" mb={6} color={heroTextColor}>
              {features[0].title}
            </Heading>
            <Text fontSize="xl" color={heroTextColor} lineHeight="tall">
              {features[0].description}
            </Text>
          </Box>
        </Flex>

        {/* Staggered images container */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={8}
          mt={20} // Moves the images up to overlap with space below text
          maxW="container.xl"
          mx="auto"
          justify="space-between">
          <Box flex={1}>
            <Image
              src={features[1].image}
              alt="Feature 2"
              borderRadius="xl"
              w="100%"
              h={{ base: '300px', md: '500px' }}
              objectFit="cover"
              boxShadow="xl"
            />
          </Box>
          <Box flex={1} mt={{ base: 0, md: -40 }}>
            {' '}
            {/* Pushes second image down */}
            <Image
              src={features[2].image}
              alt="Feature 3"
              borderRadius="xl"
              w="100%"
              h={{ base: '300px', md: '500px' }}
              objectFit="cover"
              boxShadow="xl"
            />
          </Box>
        </Flex>
      </Box>

      {/* Register Modal */}
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </Container>
  );
}

const features = [
  {
    title: 'Digital Closet Organization',
    description:
      'Catalog your clothing items with detailed categories, tags, and photos for easy access and outfit planning.',
    image: 'https://res.cloudinary.com/drv8xepdy/image/upload/v1738206128/home1_wzns4k.png',
  },
  {
    title: '',
    description: '',
    image: 'https://res.cloudinary.com/drv8xepdy/image/upload/v1738206159/home2_nmzsjb.png',
  },
  {
    title: '',
    description: '',
    image: 'https://res.cloudinary.com/drv8xepdy/image/upload/v1738206168/home4_rcu16k.png',
  },
];

export default HomePage;


//Cloudinary image names: home1_wzns4k   home2_nmzsjb    home3_ptt5uh    home4_rcu16k

