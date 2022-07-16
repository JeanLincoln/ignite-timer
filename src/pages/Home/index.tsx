import {Play} from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { 
    HomeContainer,
    FormContainer, 
    CountdownContainer,
    Separator, 
    StartCountdownButton, 
    TaskInput, 
    MinutesAmountInput
} from './styles'

export function Home(){
const { register, handleSubmit, watch } = useForm()

function handleCreateNewCycle(data:any){
    console.log(data)
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

                    <datalist id="taskSuggestions">
                        <option value="project 1"></option>
                        <option value="project 2"></option>
                        <option value="project 3"></option>
                        <option value="project 4"></option>
                        <option value="Banana"></option>
                    </datalist>

                <label htmlFor="minutesAmount">durante</label>
                <MinutesAmountInput 
                    type="number" 
                    id="minutesAmount"
                    {...register('minutesAmount')}
                    placeholder='00' 
                    step={5}
                    min={5}
                    max={60}/>

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