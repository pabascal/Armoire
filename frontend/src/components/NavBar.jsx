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

  const avatarBg = useColorModeValue('#e4e0e1', '#908382CC');
  const avatarIcon = useColorModeValue('#493628', 'black');
  const avatarHover = useColorModeValue('#D6C0B3', '#cc976699');
  const buttonBg = useColorModeValue('#E4E0E1', '#90838266');
  const buttonIcon = useColorModeValue('gray.800', '#eae2e2');
  const buttonHover = useColorModeValue('#ad998c66', '#90838299');
  const tooltip = useColorModeValue('#96443899', '#96443899');

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
    <Container maxW={'1140px'} px={4} mb={{ base: 8, sm: 12 }}>
      <Flex w="100%" position="relative" flexWrap="wrap" justifyContent="center" gap={4}>
        {/* Navigation Items - Left Side */}
        <Flex
          order={{ base: 1, md: 1 }}
          w={{ base: '100%', md: 'auto' }}
          justifyContent={{ base: 'center', md: 'flex-start' }}
          flex="1">
          <Box display={{ base: 'none', sm: 'block' }} p={3}>
            <HStack spacing={2} alignItems={'center'}>
              {isAuthenticated ? (
                <>
                  <Link to={'/create'}>
                    <Tooltip label="Create New Item" placement="bottom">
                      <Button flexShrink={1} bg={buttonBg} _hover={{ bg: buttonHover}}>
                        <PlusSquareIcon fontSize={20} color={buttonIcon} />
                      </Button>
                    </Tooltip>
                  </Link>
                  <Link to={'/closet'}>
                    <Tooltip label="View Closet" placement="bottom">
                      <Button flexShrink={1} bg={buttonBg} _hover={{ bg: buttonHover}} color={buttonIcon} >
                        <FaShirt fontSize={20}  />
                      </Button>
                    </Tooltip>
                  </Link>
                  <Button flexShrink={1} onClick={handleLogout} bg={buttonBg} _hover={{ bg: buttonHover}} color={buttonIcon}>
                    Log Out
                  </Button>
                </>
              ) : (
                <Link to={'/'}>
                  <Button flexShrink={1}>Log In</Button>
                </Link>
              )}
            </HStack>
          </Box>
        </Flex>

        {/* Title - Center */}
        <Flex
          order={{ base: 2, md: 2 }}
          w={{ base: '100%', md: 'auto' }}
          justifyContent={{ base: 'space-between', md: 'center' }}
          flex={{ base: '100%', md: '0 1 auto' }}
          position="relative"
          alignItems="center">
          <Text
            fontFamily="Comfortaa"
            fontSize={{ base: '34px', md: '42px' }}
            fontWeight="800"
            letterSpacing="wider"
            textShadow="9px 15px #b37741"
            textTransform={'uppercase'}
            bg="#b3774133"
            bgClip={'text'}
            whiteSpace="nowrap"
            pl={{ base: 5, md: 2 }} // More left padding on mobile
            pb={4}>
            <Link to={'/'}>Armoire</Link>
          </Text>
          <Box display={{ base: 'block', sm: 'none' }}>
            <MobileNav
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              toggleColorMode={toggleColorMode}
              colorMode={colorMode}
              user={user}
            />
          </Box>
        </Flex>

        {/* Right Side Items */}
        <Flex
          order={{ base: 1, md: 3 }}
          w={{ base: '100%', md: 'auto' }}
          justifyContent={{ base: 'center', md: 'flex-end' }}
          flex="1">
          <Box display={{ base: 'none', sm: 'block' }} p={3}>
            <HStack spacing={2} alignItems={'center'}>
              <Button flexShrink={1} onClick={toggleColorMode} bg={buttonBg} color={buttonIcon} _hover={{ bg: buttonHover}}>
                {colorMode === 'light' ? <IoMoon color={buttonIcon} /> : <LuSun size="20" />}
              </Button>
              <Tooltip label={`${user?.name}`} placement="bottom">
                <Avatar
                  sx={{ '& div': { fontSize: '23px' } }}
                  w={'44px'}
                  h={'42px'}
                  name={user?.name}
                  bg={avatarBg}
                  color={avatarIcon}
                />
              </Tooltip>
            </HStack>
          </Box>
        </Flex>

        {/* Mobile Navigation */}
      </Flex>
    </Container>
  );
};
export default Navbar;
