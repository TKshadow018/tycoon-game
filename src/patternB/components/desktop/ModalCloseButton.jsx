import { X } from 'lucide-react'

function ModalCloseButton({ onClose }) {
  return (
    <button className="pc-modal-close pb-modal-close" onClick={onClose} aria-label="Close modal">
      <X size={14} />
    </button>
  )
}

export default ModalCloseButton
