import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders debug status and composer', async () => {
    render(<App />)
    // composer title input
    const title = await screen.findByPlaceholderText(/Title/i)
    expect(title).toBeDefined()
    // debug status should show (may be Notes loaded: 0 or more)
    const status = await screen.findByText(/Notes loaded:/i)
    expect(status).toBeDefined()
  })
})
