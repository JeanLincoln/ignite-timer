import {Play} from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { 
    HomeContainer,
    FormContainer, 
    CountdownContainer,
    Separator, 
    StartCountdownButton, 
    TaskInput, 
    MinutesAmountInput
} from './styles'

const newCycleFormValidationSchema = zod.object({
	task:zod.string().min(1, 'Inform a task'),
	minutesAmount:zod
		.number()
		.min(5, 'The cycle needs to be at least 5 minutes.')
		.max(60, 'The cycle needs to be at max 60 minutes.')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){
    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task:'',
            minutesAmount:0,
        }
    })

function handleCreateNewCycle(data:NewCycleFormData){
    console.log(data)
    reset()
}

const task = watch('task')
const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            <FormContainer>
               <label htmlFor="task">Vou trabalhar em</label>
                <TaskInput 
                    id="text"
                    {...register('task')}
                    placeholder='Give a name for your project' 
                    list="taskSuggestions"/>

                <label htmlFor="minutesAmount">durante</label>
                <MinutesAmountInput 
                    type="number" 
                    id="minutesAmount"
                    {...register('minutesAmount')}
                    placeholder='00' 
                    step={5}
                    min={5}
                    max={60}
                    />

                <span>minutos</span>
                </FormContainer>

                <CountdownContainer>
                 <span>0</span>
                 <span>0</span>
                 <Separator>:</Separator>
                 <span>0</span>
                 <span>0</span>
                </CountdownContainer>

                <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24}/>
                    Begin
                </StartCountdownButton> 
            </form>
            </HomeContainer>
    )
}