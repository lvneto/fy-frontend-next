import { useAdminProvider } from '@/hooks/ContextDashboardAdmin'
import { getUserToken } from '@/pages/api/providers/auth.provider'
import {
  findPlansTypes,
  IPlanType,
} from '@/pages/api/providers/plans-types.provider'
import { findUsers, IUserInterface } from '@/pages/api/providers/users.provider'
import { Box, Container, Stack } from '@chakra-ui/react'
import { ArrowArcLeft } from '@phosphor-icons/react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import HandleButton from '../Buttons/HandleButton'
import { Workouts } from './Workouts'
import UsersHeader from './UsersHeader'
import { UsersList } from './UsersList'
import Feedbacks from './Feedbacks'
import WorkoutsHeader from './Workouts/WorkoutsHeader'

export default function NavigationAdmin() {
  const router = useRouter()
  const [users, setUsers] = useState<IUserInterface[]>([])
  const [userTypeId, setUserTypeId] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [isDeleted, setIsDeleted] = useState<string>('')
  const [planTypes, setPlanTypes] = useState<IPlanType[]>([])
  const {
    userId,
    isShowingUsers,
    isShowingWorkouts,
    isShowingAnamnesis,
    isShowingFeedbacks,
    setuserId,
    setIsShowingUsers,
    setIsShowingWorkouts,
    setIsShowingFeedbacks,
    setIsShowingAnamnesis,
  } = useAdminProvider()

  const fetchUsersData = useCallback(async () => {
    try {
      const token = getUserToken()

      if (!token) {
        // Implementar mensagem personalizada
        return router.push('/login')
      }

      const response = await findUsers(token, {
        userTypeId,
        search,
        isDeleted,
      })
      setUsers(response)
    } catch (error) {
      console.error(error)
      router.push('/login')
    }
  }, [router, userTypeId, search, isDeleted])

  const fetchPlanTypeData = useCallback(async () => {
    try {
      const token = getUserToken()

      if (!token) {
        // Implementar mensagem personalizada
        router.push('/login')
        return
      }

      const response = await findPlansTypes(token)

      setPlanTypes(response)
    } catch (error) {
      console.error(error)
      router.push('/login')
    }
  }, [router, setPlanTypes])

  useEffect(() => {
    fetchUsersData()
    fetchPlanTypeData()
  }, [fetchUsersData, fetchPlanTypeData])

  const handleWithHideWorkouts = () => {
    setIsShowingWorkouts(!isShowingWorkouts)
    setIsShowingUsers(!isShowingUsers)
    setuserId('')
  }

  const handleWithHideFeedbacks = () => {
    setIsShowingFeedbacks(!isShowingFeedbacks)
    setIsShowingUsers(!isShowingUsers)
    setuserId('')
  }

  const handleWithHideAnamnesis = () => {
    setIsShowingAnamnesis(!isShowingAnamnesis)
    setIsShowingUsers(!isShowingUsers)
    setuserId('')
  }

  useEffect(() => {
    return () => {
      setIsShowingUsers(true)
      setIsShowingWorkouts(false)
      setIsShowingFeedbacks(false)
    }
  }, [setIsShowingWorkouts, setIsShowingFeedbacks, setIsShowingUsers])

  return (
    <>
      {isShowingUsers && (
        <>
          <Box ml={{ base: 0, md: 60 }} minH={'100vh'}>
            <Container maxW="7xl" p={{ base: 5, md: 10 }}>
              <UsersHeader
                fetchUsersData={fetchUsersData}
                planTypes={planTypes}
                search={search}
                setUserTypeId={setUserTypeId}
                setSearch={setSearch}
                setIsDeleted={setIsDeleted}
              />

              <UsersList
                fetchUsersData={fetchUsersData}
                users={users}
                planTypes={planTypes}
              />
            </Container>
          </Box>
        </>
      )}

      {isShowingWorkouts && (
        <>
          <Box ml={{ base: 0, md: 60 }} minH={'100vh'}>
            <Container maxW="7xl" p={{ base: 5, md: 10 }}>
              <Stack
                direction={'column'}
                align={'start'}
                alignSelf={'center'}
                position={'relative'}
                mb={6}
              >
                <HandleButton
                  text={'Voltar'}
                  leftIcon={<ArrowArcLeft size={28} weight="bold" />}
                  onClick={handleWithHideWorkouts}
                />
              </Stack>
              <Container maxW="7xl" p={{ base: 3, md: 1 }}>
                <Stack maxW={'auto'}>
                  <WorkoutsHeader userId={userId} />
                  <Workouts />
                </Stack>
              </Container>
            </Container>
          </Box>
        </>
      )}

      {isShowingAnamnesis && (
        <>
          <Box ml={{ base: 0, md: 60 }} minH={'100vh'}>
            <Container maxW="7xl" p={{ base: 5, md: 10 }}>
              <Stack
                direction={'column'}
                align={'start'}
                alignSelf={'center'}
                position={'relative'}
                mt={3}
                ml={3}
              >
                <HandleButton
                  text={'Voltar'}
                  leftIcon={<ArrowArcLeft size={28} weight="bold" />}
                  onClick={handleWithHideAnamnesis}
                />
              </Stack>
              <Container maxW="7xl" p={{ base: 5, md: 10 }}>
                <>
                  <h1>Anamnesis</h1>
                </>
              </Container>
            </Container>
          </Box>
        </>
      )}

      {isShowingFeedbacks && (
        <>
          <Box ml={{ base: 0, md: 60 }} minH={'100vh'}>
            <Container maxW="7xl" p={{ base: 5, md: 10 }}>
              <Stack
                direction={'column'}
                align={'start'}
                alignSelf={'center'}
                position={'relative'}
                mt={3}
                ml={3}
              >
                <HandleButton
                  text={'Voltar'}
                  leftIcon={<ArrowArcLeft size={28} weight="bold" />}
                  onClick={handleWithHideFeedbacks}
                />
              </Stack>
              <Container maxW="7xl" p={{ base: 5, md: 10 }}>
                <Feedbacks />
              </Container>
            </Container>
          </Box>
        </>
      )}
    </>
  )
}
