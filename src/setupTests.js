import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock i18next to prevent errors
vi.mock('./i18n', () => ({
  default: {
    language: 'en',
    changeLanguage: vi.fn(),
    t: vi.fn((key) => key),
  },
}))

global.mockI18n = {
  language: 'en',
  changeLanguage: vi.fn(),
  t: vi.fn((key) => key),
}
