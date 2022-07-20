import { createContext, ReactNode, useState } from "react";

type Cycle = {
    id:string
    task:string
    minutesAmount:number
    startDate: Date
    interruptDate?:Date
    finishedDate?:Date
}

type CreateCycleData = {
    task:string
    minutesAmount: number
}

type CyclesContextType = {
    cycles:Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle : (data:CreateCycleData) => void
    interruptCurrentCycle: () => void
}

type CyclesContextProviderProps = {
    children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({children}:CyclesContextProviderProps){
    const [cycles,  setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const activeCycle = cycles.find(({id})=> id === activeCycleId) 

    function setSecondsPassed(seconds:number){
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished(){
        setCycles((state) =>
            state.map((cycle) => {    
                if( cycle.id === activeCycleId ){
                    return {...cycle,finishedDate: new Date() }
                }
             return cycle
            })
        )
    }

    function createNewCycle(data:CreateCycleData){
        const id = String(new Date().getTime())

     const newCycle:Cycle = {
        id,
        task:data.task,
        minutesAmount:data.minutesAmount,
        startDate: new Date()
     }
      setCycles(state => [...state,newCycle])
      setActiveCycleId(id)
      setAmountSecondsPassed(0)
    //   reset()
    }

    function interruptCurrentCycle(){
        setCycles(cycles.map(cycle =>{
            if(cycle.id === activeCycleId){
                return{...cycle, interruptDate: new Date()}
            }
            return cycle
        })),
        setActiveCycleId(null)
    }

    return(
        <CyclesContext.Provider 
            value={{ 
                cycles,
                activeCycle, 
                activeCycleId, 
                amountSecondsPassed,
                markCurrentCycleAsFinished, 
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}>
            {children}
    </CyclesContext.Provider>
    )
}