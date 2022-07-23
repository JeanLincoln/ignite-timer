import { createContext, ReactNode, useReducer, useState } from 'react'

type Cycle = {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
}

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

type CyclesState = {
  cycles: Cycle[]
  activeCycleId: string | null
}

export const CyclesContext = createContext({} as CyclesContextType)

const initialState = {
  cycles: [],
  activeCycleId: null,
}

function reducer(state: CyclesState, action: any){
  switch (action.type){

    case 'ADD_NEW_CYCLE':
      return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
        };

    case 'INTERRUPT_CURRENT_CYCLE':
      return{
        ...state,
        cycles: state.cycles.map((cycle) => {
          console.log(state.cycles)
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, interruptDate: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      };

    case 'MARK_CURRENT_CYCLE_AS_FINISHED':
        return{
          ...state,
          cycles: state.cycles.map((cycle) => {
                    if( cycle.id === state.activeCycleId ){
                        return {...cycle,finishedDate: new Date() }
                    }
                 return cycle
                })
        }
  }
  return state
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycleState, dispatch] = useReducer(reducer,initialState)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cycleState

  const activeCycle = cycles.find(({ id }) => id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })

    // setCycles((state) =>
    //     state.map((cycle) => {
    //         if( cycle.id === activeCycleId ){
    //             return {...cycle,finishedDate: new Date() }
    //         }
    //      return cycle
    //     })
    // )
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })

    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
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
