"use client"

import * as React from "react"

const TOAST_LIMIT = 1

// Define the type for the input props to the toast function (without 'id')
type ToastInput = {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number // Duration is now optional here
}

// Define the type for a toast item in the state (includes 'id' and ensures duration)
type ToastItem = ToastInput & { id: string; duration: number }

type State = {
  toasts: ToastItem[]
}

// The toast function now accepts ToastInput, and generates its own ID
// This function needs to be exported
export const toast = (props: ToastInput) => {
  // <-- Added 'export' here
  const id = Math.random().toString(36).substring(2, 9) // Generate a unique ID
  // Set a default duration if not provided by the caller
  const newToast: ToastItem = { id, duration: props.duration ?? 5000, ...props }
  dispatch({ type: "ADD_TOAST", toast: newToast })
}

type Action =
  | {
    type: "ADD_TOAST"
    toast: ToastItem
  }
  | {
    type: "REMOVE_TOAST"
    id?: string
  }
  | {
    type: "UPDATE_TOAST"
    toast: Partial<ToastItem> // Update can take a partial ToastItem
  }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((toast) => (toast.id === action.toast.id ? { ...toast, ...action.toast } : toast)),
      }
    default:
      return state
  }
}

const listeners: ((state: State) => void)[] = []
let state: State = { toasts: [] }

function dispatch(action: Action) {
  state = reducer(state, action)
  listeners.forEach((listener) => listener(state))
}

export function useToast() {
  const [toasts, setToasts] = React.useState(state.toasts)

  React.useEffect(() => {
    const listener = (newState: State) => {
      setToasts(newState.toasts)
    }
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toasts,
    toast, // Also return it from the hook for consistency, though direct import is preferred
    dismiss: (id?: string) => dispatch({ type: "REMOVE_TOAST", id }),
    update: (props: Partial<ToastItem>) => dispatch({ type: "UPDATE_TOAST", toast: props }),
  }
}