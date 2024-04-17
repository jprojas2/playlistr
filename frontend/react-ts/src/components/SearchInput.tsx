import React from 'react'
import './SearchInput.scss'
import SearchIcon from './Icons/SearchIcon'
import CloseIcon from './Icons/CloseIcon'

interface SearchInputProps {
    placeholder?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    value?: string
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
    const clearBtnRef = React.useRef<HTMLInputElement>(null)
    React.useEffect(() => {
        if (clearBtnRef.current && props.value?.length === 0) clearBtnRef.current.className = 'clear-icon'
    }, [])
    return (
        <div className="search-input">
            <div className="search-icon">
                <SearchIcon />
            </div>
            <input type="text" role="searchbox" placeholder={props.placeholder || 'Search...'} value={props.value} onChange={props.onChange} />
            {
                <div
                    ref={clearBtnRef}
                    role="button"
                    className={`clear-icon ${(props.value?.length ?? 0) > 0 ? 'show' : 'hide'}`}
                    onClick={() => props.onChange && props.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                >
                    <CloseIcon />
                </div>
            }
        </div>
    )
}

export default SearchInput
