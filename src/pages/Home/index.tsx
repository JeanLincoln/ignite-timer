import { useEffect, useState } from 'react'
import {Play} from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'
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
import { date } from 'zod'

const newCycleFormValidationSchema = zod.object({
	task:zod.string().min(1, 'Inform a task'),
	minutesAmount:zod
		.number()
		.min(5, 'The cycle needs to be at least 5 minutes.')
		.max(60, 'The cycle needs to be at max 60 minutes.')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

type Cycle = {
    id:string
    task:string
    minutesAmount:number
    startDate: Date
}

export function Home(){
    const [cycles,  setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task:'',
            minutesAmount:0,
        }
    })

    const activeCycle = cycles.find(({id})=> id === activeCycleId)

    useEffect(()=>{
        if(activeCycle){
            setInterval(()=>{
                setAmountSecondsPassed(
                    differenceInSeconds(new Date(), activeCycle.startDate),
                )
            },1000)
        }
    }, [activeCycle])

    function handleCreateNewCycle(data:NewCycleFormData){
        const id = String(new Date().getTime())

     const newCycle:Cycle = {
        id,
        task:data.task,
        minutesAmount:data.minutesAmount,
        startDate: new Date()
     }
      setCycles(state => [...state,newCycle])
      setActiveCycleId(id)
      reset()
    }

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds/60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    const task = watch('task')
    const isSubmitDisabled = !task

        return (
            <HomeContainer>
                <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                <label htmlFor="task">I will work on</label>
                    <TaskInput 
                        id="text"
                        {...register('task')}
                        placeholder='Give a name for your project' 
                        list="taskSuggestions"/>

                    <label htmlFor="minutesAmount">over</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount"
                        {...register('minutesAmount', {
                            valueAsNumber:true
                        })}
                        placeholder='00' 
                        step={5}
                        min={5}
                        max={60}
                        />

                    <span>minutes</span>
                    </FormContainer>

                    <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                    </CountdownContainer>

                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24}/>
                        Begin
                    </StartCountdownButton> 
                </form>
                </HomeContainer>
        )
}