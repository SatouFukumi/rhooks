import type RHook from "./types"
import { useLocalStorage } from "./use-storage"

export function useTheme<T extends string>(
  themeKey: string,
  themeList: T[]
): RHook.UseThemeReturn<T> {
  const { value: theme, setValue: setTheme } = useLocalStorage(
    themeKey,
    themeList[0]
  )

  return { theme, setTheme }
}
