import DashboardMenuUser from '@/components/Dashboards/DashboardMenuUser'
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { findCurrentUser, getUserToken } from './api/providers/auth.provider'
import DashboardMenuOwner from '@/components/Dashboards/DashboardMenuOwner'

export default function Dashboard() {
  const router = useRouter()
  const {
    user,
    setUser,
    signOut,
    isFetchingCurrentUser,
    setIsLoadingLogin,
    isLoadingLogin,
  } = useAuthStore()

  useEffect(() => {
    const token = getUserToken()
    if (token) {
      const fetchCurrentUserData = async (token: string) => {
        try {
          setIsLoadingLogin(true)
          const currentUserData = await findCurrentUser(token)

          if (!currentUserData) {
            // Implementar mensagem personalizada
            router.push('/login')
            return
          }

          setUser(currentUserData)
        } catch (error) {
          console.error(error)
          router.push('/login')
        }
      }

      fetchCurrentUserData(token)
    } else {
      router.replace('/login')
    }
  }, [router, signOut, setUser, isFetchingCurrentUser])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoadingLogin(false)
    }, 1000)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {isLoadingLogin ? (
        <h1>Carregando...</h1>
      ) : (
        <>
          {user?.userType?.name === 'Admin' && <DashboardMenuOwner />}
          {user?.userType?.name === 'Owner' && <DashboardMenuOwner />}
          {user?.userType?.name === 'User' && <DashboardMenuUser />}
        </>
      )}
    </>
  )
}
