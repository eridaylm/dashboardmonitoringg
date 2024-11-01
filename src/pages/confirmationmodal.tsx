import './confirmationmodal.css';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDarkMode: boolean; // Tambahkan properti ini
}

const ConfirmationModal = (props: ConfirmationModalProps) => {
  return (
    <div class="confirmation-modal">
      <div class={`confirmation-modal-content ${props.isDarkMode ? 'dark' : ''}`}>
        <p class={props.isDarkMode ? 'dark' : ''}>{props.message}</p>
        <div class="confirmation-modal-actions">
          <button class="confirm-button" onClick={props.onConfirm}>Yes</button>
          <button class="cancel-button" onClick={props.onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
