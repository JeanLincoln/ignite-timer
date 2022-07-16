import {Play} from 'phosphor-react'
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
    return (
        <HomeContainer>
            <form action="">
            <FormContainer>
               <label htmlFor="task">Vou trabalhar em</label>
                <TaskInput 
                    id="text" 
                    placeholder='Give a name for your project' />

                <label htmlFor="minutesAmount">durante</label>
                <MinutesAmountInput 
                    type="number" 
                    id="minutesAmount" 
                    placeholder='00' />

                <span>minutos</span>
                </FormContainer>

                <CountdownContainer>
                 <span>0</span>
                 <span>0</span>
                 <Separator>:</Separator>
                 <span>0</span>
                 <span>0</span>
                </CountdownContainer>

                <StartCountdownButton disabled type="submit">
                    <Play size={24}/>
                    Begin
                </StartCountdownButton> 
            </form>
            </HomeContainer>
    )
}