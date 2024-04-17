/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SearchInput from '../../components/SearchInput'

test('renders search input', () => {
    render(<SearchInput placeholder="placeholderTest" />)
    const input = screen.getByPlaceholderText(/placeholderTest/i)
    expect(input).toBeInTheDocument()
})

test('renders search input with value', () => {
    render(<SearchInput value="valueTest" onChange={() => {}} />)
    const input = screen.getByDisplayValue(/valueTest/i)
    expect(input).toBeInTheDocument()
})

test('renders clear icon invisible if value is empty', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    const clearIcon = screen.queryByTitle('Close Icon')
    expect(clearIcon?.parentElement?.parentElement?.classList).not.toContain('show')
})

test('renders clear icon visible if value is not empty', () => {
    render(<SearchInput value="test" onChange={() => {}} />)
    const clearIcon = screen.queryByTitle('Close Icon')
    expect(clearIcon?.parentElement?.parentElement?.classList).toContain('show')
})

test('clear icon click should call onChange with empty value', async () => {
    const onChange = jest.fn()
    render(<SearchInput value="test" onChange={onChange} />)
    const clearIcon = screen.getByTitle('Close Icon')
    fireEvent.click(clearIcon)
    await waitFor(() => expect(onChange).toBeCalledWith({ target: { value: '' } }))
})
