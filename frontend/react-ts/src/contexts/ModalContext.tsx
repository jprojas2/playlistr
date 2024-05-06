import React from 'react'

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
        }, 1)
    }

    const closeModal = () => {
        modalRef.current.classList.add('closing')
        setTimeout(() => {
            setModal(null)
            modalRef.current.classList.remove('closing')
            modalRef.current.classList.remove('open')
        }, 300)
    }

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
