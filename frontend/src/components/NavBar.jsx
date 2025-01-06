import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
  useToast,
  Avatar,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { IoMoon } from 'react-icons/io5';
import { LuSun } from 'react-icons/lu';
import { FaShirt } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/user.js';
import MobileNav from './MobileNav.jsx';


const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => ({
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user, // getting the nested user object
  }));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast({
      title: 'Logged Out',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <Container maxW={'1140px'} px={4}>
      <Flex
        h={16}
        alignItems={'center'}
        position="relative"
        flexDir={{
          base: 'column',
          sm: 'row',
        }}>
        <Box flex="1"/>

        <Text
          position='absolute'
          left='50%'
          transform='translateX(-50%)'
          fontFamily="Comfortaa"
          fontSize={{ base: '32', sm: '42' }}
          fontWeight="800"
          letterSpacing="wider"
          textShadow="9px 15px #b37741"
          textTransform={'uppercase'}
          textAlign={'center'}
          bg=" #b3774133"
          bgClip={'text'}>
          <Link to={'/'}>Armoire</Link>
        </Text>
        <Box display={{ base: 'none', sm: 'block' }} ml="auto">
        <HStack spacing={2} alignItems={'center'}>
          {isAuthenticated ? (
            <>
              <Link to={'/create'}>
                <Tooltip label="Create New Item" placement="bottom">
                  <Button>
                    <PlusSquareIcon fontSize={20} />
                  </Button>
                </Tooltip>
              </Link>
              <Link to={'/closet'}>
                <Tooltip label="View Closet" placement="bottom">
                  <Button>
                    <FaShirt fontSize={20} />
                  </Button>
                </Tooltip>
              </Link>
              <Button onClick={handleLogout}>Log Out</Button>
            </>
          ) : (
            <Link to={'/'}>
              <Button>Log In</Button>
            </Link>
          )}
          <Button onClick={toggleColorMode}>{colorMode === 'light' ? <IoMoon /> : <LuSun size="20" />}</Button>
          <Tooltip label={`${user?.name}`} placement="bottom">
            <Avatar
              sx={{ '& div': { fontSize: '23px' } }}
              w={'44px'}
              h={'38px'}
              name={user?.name}
              bg={useColorModeValue('gray.300', 'gray.700')}
              color={useColorModeValue('gray.700', 'gray.300')}
            />
          </Tooltip>
        </HStack>
        </Box>
      <Box display={{ base: 'block', sm: 'none' }} ml="auto">
        <MobileNav 
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          toggleColorMode={toggleColorMode}
          colorMode={colorMode}
          user={user}
        />
      </Box>
      </Flex>
    </Container>
  );
};
export default Navbar;
