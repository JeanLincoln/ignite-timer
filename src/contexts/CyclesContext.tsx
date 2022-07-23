import { createContext, ReactNode, useEffect, useReducer, useState } from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/Actions'
import { differenceInSeconds } from 'date-fns'

type CreateCycleData = {
  task: string
  minutesAmount: number
}

type CyclesContextType = {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

type CyclesContextProviderProps = {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

const initialState = {
  cycles: [],
  activeCycleId: null,
}

function getStoredData(){
  const storedStateAsJSON = localStorage.
    getItem('@ignite-timer:cycles-state-1.0.0')

  if(storedStateAsJSON){
    return JSON.parse(storedStateAsJSON)
  } 
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, initialState, getStoredData)

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find(({ id }) => id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(()=>{
    if(activeCycle){
     return differenceInSeconds(new Date(),new Date(activeCycle.startDate,))
    }
    return 0
  })

  useEffect(()=>{
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)

  },[cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
