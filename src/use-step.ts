import type { UseStepReturnFunc } from "./types"
import { useState } from "react"

export const useStep = (maxStep: number): [number, UseStepReturnFunc] => {
  const [currentStep, setCurrentStep] = useState(1)
  const nextStepIsAvailable: boolean = currentStep + 1 <= maxStep
  const prevStepIsAvailable: boolean = currentStep - 1 >= 1

  return [
    currentStep,
    {
      toNextStep() {
        if (nextStepIsAvailable) setCurrentStep((step) => step + 1)
      },
      toPrevStep() {
        if (prevStepIsAvailable) setCurrentStep((step) => step - 1)
      },
      nextStepIsAvailable,
      prevStepIsAvailable,
      setStep(value: React.SetStateAction<number>) {
        const newStep = typeof value === "function" ? value(currentStep) : value

        setCurrentStep(() => {
          const alphaStep = Math.min(Math.max(1, newStep), maxStep)

          if (
            (newStep < 1 || newStep > maxStep)
            && process.env.NODE_ENV === "development"
          )
            console.warn(
              `'useStep().setStep()' : invalid step : `,
              newStep,
              "currently using step : ",
              alphaStep
            )

          return alphaStep
        })
      },
      reset() {
        setCurrentStep(1)
      },
    },
  ]
}
