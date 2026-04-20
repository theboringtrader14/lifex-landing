import { useTheme, ThemeToggle as SharedThemeToggle } from '@lifex/shared-ui'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return <SharedThemeToggle theme={theme} onToggle={toggle} />
}
