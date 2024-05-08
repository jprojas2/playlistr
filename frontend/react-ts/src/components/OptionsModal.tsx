import './OptionsModal.scss'
import CloseIcon from './Icons/CloseIcon'

type OptionsModal = {
    options: any[]
    closeModal: () => void
}

const OptionsModal: React.FC<OptionsModal> = ({ options, closeModal }) => {
    return (
        <div className="modal options-modal">
            <div className="modal-body">
                {options.map((option: any, index: number) => {
                    return (
                        <a href="#" key={index} className="btn btn-2 btn-primary" onClick={option.onClick}>
                            {option.name}
                        </a>
                    )
                })}
            </div>
            <div className="modal-footer">
                <div className="actions">
                    <button onClick={() => closeModal()} className="btn btn-3 cancel">
                        <div className="icon">
                            <CloseIcon />
                        </div>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OptionsModal
