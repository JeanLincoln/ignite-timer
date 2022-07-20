import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export function NewCycleForm() {
    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()

    return(
        <FormContainer>
            <label htmlFor="task">I will work on</label>
            <TaskInput 
                id="text"
                {...register('task')}
                placeholder='Give a name for your project' 
                list="taskSuggestions"
                disabled={!!activeCycle}
            />
            <label 
                htmlFor="minutesAmount">over
            </label>
            <MinutesAmountInput 
                type="number" 
                id="minutesAmount"
                {...register('minutesAmount', {
                    valueAsNumber:true
                })}
                placeholder='00' 
                step={5}
                min={1}
                max={60}
                disabled={!!activeCycle}
            />
            <span>minutes</span>
        </FormContainer>
    )
}