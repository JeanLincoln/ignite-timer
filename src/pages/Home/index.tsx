import { HomeContainer,StartCountdownButton,StopCountdownButton} from './styles'
import { useContext } from 'react'
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'
import {HandPalm, Play} from 'phosphor-react'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { CyclesContext } from '../../contexts/CyclesContext'

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

const newCycleFormValidationSchema = zod.object({
	task:zod.string().min(1, 'Inform a task'),
	minutesAmount:zod
		.number()
		.min(1, 'The cycle needs to be at least 5 minutes.')
		.max(60, 'The cycle needs to be at max 60 minutes.')
})

export function Home(){
    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)
    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task:'',
            minutesAmount:0,
        }
    })

    const {handleSubmit,watch, reset} = newCycleForm
    const task = watch('task')
    const isSubmitDisabled = !task

        return (
            <HomeContainer>
                <form 
                    onSubmit={handleSubmit(createNewCycle)} 
                    action="">

                    <FormProvider {...newCycleForm}>
                        <NewCycleForm/>
                    </FormProvider>
                    <Countdown/>
                   
                    {activeCycle
                        ?(
                        <StopCountdownButton 
                            onClick={interruptCurrentCycle} 
                            type="button">
                            <HandPalm size={24}/>
                            Interrupt
                        </StopCountdownButton> 
                        )
                        :(
                        <StartCountdownButton 
                            disabled={isSubmitDisabled} 
                            type="submit">
                            <Play size={24}/>
                            Begin
                        </StartCountdownButton> 
                        )
                    }
                </form>
            </HomeContainer>
        )
}