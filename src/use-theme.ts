import { random } from "@fukumi/libraries"
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

  return {
    theme: theme ?? themeList[0],
    setTheme(sta) {
      const newTheme
        = sta instanceof Function|| typeof sta === "function"
          ? sta(theme ?? themeList[0])
          : theme ?? themeList[0]
      setTheme(newTheme)
    },
    setThemeRandomly() {
      setTheme(random.item(themeList))
    },
  }
}
