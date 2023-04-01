import { Box, chakra, Flex, Stack } from '@chakra-ui/react'
import FormPlanilha from '../FormPlanilha'
import Progression from '../Progression'
import AboutSpecialist from '../AboutSpecialist'
import Navbar from '../Navbar'
import ScrollDown from '../ScrollDown'

export default function Header() {
  return (
    <>
      <Box pb={8}>
        <Stack
          bgImage={
            'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
          }
          pos={'relative'}
          bgPosition={'center'}
          bgRepeat={'no-repeat'}
          bgSize={'cover'}
          opacity={'0.8'}
          height={'35rem'}
          bgPos={'center'}
        >
          <Box bgGradient={'linear(to-tl, orange.500, blackAlpha.500)'}>
            <Navbar />
            <Box
              maxW="6xl"
              p={4}
              isolation="isolate"
              zIndex={3}
              mt="5rem"
              marginInline="auto"
            >
              <Box
                boxShadow={'lg'}
                bgColor={'whiteAlpha.200'}
                backdropBlur={'1rem'}
                backdropFilter="blur(10px)"
                border={'1px'}
                borderColor={'whiteAlpha.200'}
                rounded="2xl"
                p={{ base: 4, sm: 8 }}
              >
                <Stack
                  pos="relative"
                  direction={{ base: 'column', md: 'row' }}
                  zIndex={1}
                  spacing={5}
                  textAlign="center"
                >
                  <Flex flex={1} p={8} align="center" justify="center">
                    <Stack
                      pos="relative"
                      direction={'column'}
                      zIndex={1}
                      spacing={5}
                      textAlign="left"
                    >
                      <chakra.h1
                        fontSize={['2xl', '4xl']}
                        lineHeight={1.2}
                        fontWeight="bold"
                        color={'whiteAlpha.900'}
                      >
                        Tem dificuldade em acompanhar sua performance nos
                        treinos?
                      </chakra.h1>
                      <chakra.h2
                        color="whiteAlpha.800"
                        fontSize={['lg', 'xl']}
                        lineHeight={1.2}
                      >
                        Acompanhe de perto o desempenho da sua saúde com nosso
                        sistema de monitoramento de performance.
                      </chakra.h2>
                    </Stack>
                  </Flex>
                  <Flex flex={1}>
                    <FormPlanilha />
                  </Flex>
                </Stack>
              </Box>
              <ScrollDown />
              <Progression />
              <AboutSpecialist />
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  )
}
