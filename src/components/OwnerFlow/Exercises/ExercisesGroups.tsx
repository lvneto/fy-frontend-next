import { CloseButtonComponent } from '@/components/Buttons/CloseButtonComponent'
import HandleButton from '@/components/Buttons/HandleButton'
import UploadVideosStep from '@/components/VideosUpload/UploadVideosStep'
import { VideosView } from '@/components/VideosView'
import { getUserToken } from '@/pages/api/providers/auth.provider'
import {
  IExercise,
  createExercise,
  deleteExercise,
  findExerciseByMuscleGroup,
  findMuscleGroup,
  updateExercise,
} from '@/pages/api/providers/exercises.provider'
import { useVideosStore } from '@/stores/VideoStore'
import {
  Box,
  Flex,
  FormControl,
  Input,
  useToast,
  WrapItem,
  Wrap,
  Button,
  Text,
} from '@chakra-ui/react'
import { PenIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { MuscleGroupUpdate } from './MuscleGroupUpdate'

export default function ExercisesGroups() {
  const router = useRouter()
  const toast = useToast()
  const [muscleGroups, setMuscleGroups] = useState<IExercise[]>([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('')
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [exercises, setExercises] = useState<IExercise[]>([])
  const { finalVideo, reset: resetFinalVideo } = useVideosStore()
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [isSendingForm, setIsSendingForm] = useState<boolean>(false)
  const [exerciseId, setExerciseId] = useState<string>('')
  const [exerciseVideo, setExerciseVideo] = useState<string>('')
  const [isUpdatingExerciseName, setIsUpdatingExerciseName] =
    useState<boolean>(false)
  const [videoExercise, setVideoExercise] = useState()

  const { handleSubmit, reset } = useForm()

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const token = getUserToken()

        if (!token) {
          toast({
            title: 'Sua sessão expirou.',
            description: 'Por favor, faça login novamente.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          router.push('/login')
          return
        }

        const response = await findMuscleGroup(token)
        setMuscleGroups(response)
      } catch (error) {
        console.error(error)
        toast({
          title: 'Erro ao buscar grupos musculares.',
          description: 'Por favor, tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
    fetchMuscleGroups()
  }, [toast, router, isFetching, selectedMuscleGroup])

  useEffect(() => {
    if (!selectedMuscleGroup) return
    const fetchExerciseByMuscleGroup = async () => {
      try {
        const token = getUserToken()

        if (!token) {
          toast({
            title: 'Sua sessão expirou.',
            description: 'Por favor, faça login novamente.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          router.push('/login')
          return
        }

        const response = await findExerciseByMuscleGroup(
          token,
          selectedMuscleGroup,
          exerciseVideo,
        )

        setExercises(response.exercises)
        setVideoExercise(response.video)
      } catch (error) {
        console.error(error)
        toast({
          title: 'Erro ao buscar exercícios.',
          description: 'Por favor, tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
    fetchExerciseByMuscleGroup()
  }, [selectedMuscleGroup, toast, router, isFetching, exerciseVideo])

  const onSubmit = async () => {
    try {
      const token = getUserToken()

      if (!token) {
        toast({
          title: 'Sua sessão expirou.',
          description: 'Por favor, faça login novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })

        router.push('/login')
        return
      }

      setIsSendingForm(true)

      const formData = new FormData()
      formData.append('name', selectedExercise)
      formData.append('muscleGroup', selectedMuscleGroup)

      if (finalVideo.length > 0) {
        const files = Object.entries(finalVideo)

        for (const file of files) {
          formData.append('videos', file[1].file)
        }
      }

      if (isUpdatingExerciseName) {
        await updateExercise(token, exerciseId, formData as IExercise)
        toast({
          title: 'Exercício Atualizado.',
          description: 'Exercício Atualizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      if (!isUpdatingExerciseName) {
        await createExercise(token, formData as IExercise)
        toast({
          title: 'Exercício Criado.',
          description: 'Exercício criado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error(error)

      toast({
        title: 'Exercício já cadastrado.',
        description: 'Erro ao criar Exercício.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      reset()
      setIsFetching(!isFetching)
      setIsSendingForm(false)
      resetFinalVideo()
      setIsUpdatingExerciseName(false)
    }
  }

  const handleWithDeleteExerciseName = async (id: string) => {
    try {
      const token = getUserToken()

      if (!token) {
        toast({
          title: 'Sua sessão expirou.',
          description: 'Por favor, faça login novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })

        router.push('/login')
        return
      }

      await deleteExercise(token, id)

      toast({
        title: 'Exercício excluído.',
        description: 'Exercício excluído com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error(error)

      toast({
        title: 'Erro ao excluir Exercício.',
        description: 'Por favor, tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsFetching(!isFetching)
    }
  }

  const handleWithSelecteMuscleGroup = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup)
    setSelectedExercise('')
    setExerciseId('')
  }

  const handleWithSelecteExerciseName = (exerciseName: string) => {
    setSelectedExercise(exerciseName)
  }

  const handleWithUpdatingExerciseName = (id: string, exerciseName: string) => {
    setExerciseId(id)
    setSelectedExercise(exerciseName)
    setIsUpdatingExerciseName(true)
  }

  const handleWithFindExerciseVideo = (id: string) => {
    setExerciseVideo(id)
  }

  console.log(videoExercise)

  return (
    <>
      <Box>
        <Box
          mt={3}
          backdropBlur={'1rem'}
          backdropFilter="blur(5px)"
          rounded={'lg'}
          border={'1px'}
          bgColor={'whiteAlpha.50'}
          borderColor={'whiteAlpha.100'}
          p={1}
        >
          <Wrap mb={3}>
            {muscleGroups.map((muscleGroup) => (
              <WrapItem key={muscleGroup.id}>
                <HandleButton
                  text={muscleGroup.muscleGroup}
                  onClick={() =>
                    handleWithSelecteMuscleGroup(muscleGroup.muscleGroup!)
                  }
                />
              </WrapItem>
            ))}
            <MuscleGroupUpdate oldName={selectedMuscleGroup} />
          </Wrap>
        </Box>

        <Box
          mt={3}
          backdropBlur={'1rem'}
          backdropFilter="blur(5px)"
          rounded={'lg'}
          border={'1px'}
          bgColor={'whiteAlpha.50'}
          borderColor={'whiteAlpha.100'}
          p={1}
        >
          <Wrap spacing={3}>
            {exercises.map((exercise) => (
              <WrapItem key={exercise.id}>
                <Flex
                  backdropBlur={'1rem'}
                  backdropFilter="blur(5px)"
                  rounded={'lg'}
                  border={'1px'}
                  bgColor={'whiteAlpha.50'}
                  borderColor={'whiteAlpha.100'}
                  boxShadow={'lg'}
                  p={1}
                  align="center"
                >
                  <Text mr={3}>{exercise.name}</Text>

                  {exercise.hasVideo && (
                    <VideosView
                      videos={videoExercise}
                      handleWithFindVideos={() =>
                        handleWithFindExerciseVideo(exercise.id!)
                      }
                    />
                  )}

                  <Button
                    onClick={() =>
                      handleWithUpdatingExerciseName(
                        exercise.id!,
                        exercise.name!,
                      )
                    }
                    ml={3}
                    _hover={{
                      bgGradient: 'linear(to-r, red.500, red.600)',
                      transition: '0.8s',
                    }}
                    size="xs"
                    border={'1px'}
                    borderColor={'whiteAlpha.300'}
                  >
                    <PenIcon size={14} />
                  </Button>

                  <CloseButtonComponent
                    ml={3}
                    onClick={() => handleWithDeleteExerciseName(exercise.id!)}
                  />
                </Flex>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mt={4} isRequired>
            <Input
              defaultValue={selectedMuscleGroup}
              onChange={(e) => handleWithSelecteMuscleGroup(e.target.value)}
              placeholder="Grupo Muscular"
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <Input
              defaultValue={selectedExercise}
              onChange={(e) => handleWithSelecteExerciseName(e.target.value)}
              placeholder="Exercício"
            />
          </FormControl>

          <FormControl gridColumn="span 2" mt={3} mb={3}>
            <UploadVideosStep
              textButtonSubmit="Criar ou Atualizar"
              isSendingForm={isSendingForm}
            />
          </FormControl>
        </form>
      </Box>
    </>
  )
}