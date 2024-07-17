import React, { useEffect } from 'react'

export const ModalContext = React.createContext<any>(null)

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modal, setModal] = React.useState<any>(null)
    const modalRef = React.useRef<any>(null)

    const openModal = (modal: any) => {
        setModal(modal)
        modalRef.current.classList.add('open')
        modalRef.current.classList.add('opening')
        setTimeout(() => {
            modalRef.current.classList.remove('opening')
            if (modalRef.current.querySelector('input')) modalRef.current.querySelector('input').focus()
            else (document.activeElement as HTMLElement)?.blur()
        }, 200)
    }

    const closeModal = (callback?: () => void | null) => {
        modalRef.current.classList.add('closing')
        setTimeout(() => {
            setModal(null)
            modalRef.current.classList.remove('closing')
            modalRef.current.classList.remove('open')
            if (callback) callback()
        }, 300)
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target === modalRef.current) {
                if (!modalRef.current.querySelector('.modal').classList.contains('prevent-click')) closeModal()
            }
        }

        modalRef.current.addEventListener('click', handleClick)

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (!modalRef.current.querySelector('.modal').classList.contains('prevent-esc')) closeModal()
            }
            if (e.key === 'Enter' && document.activeElement?.tagName === 'INPUT') {
                modalRef.current.querySelector('.modal-footer .commit')?.click()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            modalRef.current.removeEventListener('click', handleClick)
            document.removeEventListener('keydown', handleKeyDown)
        }
    })

    useEffect(() => {
        modalRef.current.querySelector('.modal')?.classList.add('opening')
        setTimeout(() => {
            modalRef.current.querySelector('.modal')?.classList.remove('opening')
        }, 200)
    }, [modal])

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            <>
                <div ref={modalRef} className={'modal-container'}>
                    {modal}
                </div>
                {children}
            </>
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = React.useContext(ModalContext)
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context
}

export default ModalProvider
