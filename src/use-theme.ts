import type { UseThemeReturn } from "./types"
import { useLocalStorage } from "./use-storage"

export const useTheme = <T extends string>(
  themeKey: string,
  themeList: T[]
): UseThemeReturn<T> => {
  const { value: theme, setValue: setTheme } = useLocalStorage(
    themeKey,
    themeList[0]
  )

  return { theme, setTheme }
}
