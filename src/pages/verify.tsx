import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import styles from './verify.module.css';

function VerifyOtp({ onSubmit }) {
  const [otp, setOtp] = createSignal(Array(6).fill(''));
  const navigate = useNavigate();

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {  // Ensure the value is a digit or empty
      const newOtp = [...otp()];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpInput = otp().join('');

    try {
      const response = await fetch('http://127.0.0.1:8080/verify_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otpInput }),
      });

      const responseText = await response.text();
      console.log('Response Text:', responseText);

      if (response.ok) {
        const result = JSON.parse(responseText);
        if (result.message === 'Email verified successfully') {
          alert('Berhasil terverifikasi');
          navigate('/login');
        } else {
          alert('OTP tidak valid atau sudah kadaluarsa. Silakan coba lagi.');
        }
      } else {
        alert('Terjadi kesalahan saat memverifikasi OTP. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Terjadi kesalahan saat memverifikasi OTP. Silakan coba lagi.');
    }
  };

  return (
    <div class={styles['otp-container']}>
      <form class={styles['otp-form']} onSubmit={handleSubmit}>
        <label for="otp">Masukkan kode verifikasi:</label>
        <div class={styles['otp-inputs']}>
          {otp().map((_, index) => (
            <input
              type="text"
              id={`otp-${index}`}
              name="otp"
              class={styles['otp-input']}
              value={otp()[index]}
              onInput={(e) => handleInputChange(e, index)}
              maxLength="1"
            />
          ))}
        </div>
        <button type="submit" class={styles['otp-button']}>
          Verifikasi OTP
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;
