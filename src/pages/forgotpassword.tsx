import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import eyeIcon from '../assets/img/eye.png';
import eyeOffIcon from '../assets/img/eye-off.png';
import './forgotpassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = createSignal('');
  const [securityQuestion, setSecurityQuestion] = createSignal('');
  const [securityAnswer, setSecurityAnswer] = createSignal('');
  const [newPassword, setNewPassword] = createSignal('');
  const [newPasswordConfirm, setNewPasswordConfirm] = createSignal('');
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = createSignal(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible());
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8080/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email(),
          pertanyaan: securityQuestion(),
          jawaban: securityAnswer(),
          new_password: newPassword(),
        }),
      });

      if (response.ok) {
        console.log('Password berhasil diubah');
        navigate('/login'); // Navigasi ke halaman login setelah berhasil
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <div class="forgot-password-container">
      <form onSubmit={handleSubmit}>
        <p class='reset'>Reset Password</p>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            required
            placeholder="Masukkan email Anda"
          />
        </div>
        <div class="form-group">
          <label for="security-question">Pertanyaan Keamanan</label>
          <select
            id="security-question"
            value={securityQuestion()}
            onChange={(e) => setSecurityQuestion(e.currentTarget.value)}
            required
          >
            <option value="" disabled>Pilih Pertanyaan Keamanan</option>
            <option value="Apa makanan kesukaan Anda?">Apa makanan kesukaan Anda?</option>
            <option value="Apa nama hewan peliharaan Anda?">Apa nama hewan peliharaan Anda?</option>
            <option value="Di kota mana Anda dilahirkan?">Di kota mana Anda dilahirkan?</option>
            <option value="Siapa nama temanmu?">Siapa nama temanmu?</option>
          </select>
        </div>
        <div class="form-group">
          <label for="security-answer">Jawaban Pertanyaan Keamanan</label>
          <input
            type="text"
            id="security-answer"
            value={securityAnswer()}
            onInput={(e) => setSecurityAnswer(e.currentTarget.value)}
            required
            placeholder="Jawaban Anda"
          />
        </div>
        <div class="form-group">
          <label for="newPassword">Password Baru</label>
          <input type={passwordVisible() ? "text" : "password"} id="newPassword" name="newPassword" class="input" placeholder="Masukkan Kata Sandi" value={newPassword()} onInput={(e) => setNewPassword(e.currentTarget.value)} required />
            <img 
              src={passwordVisible() ? eyeIcon : eyeOffIcon} 
              alt="toggle password visibility" 
              class="eye-icon-log" 
              onClick={togglePasswordVisibility}
            />
        </div>
        <div class="form-group">
          {/* <label for="new-password">Konfirmasi Password Baru</label> */}
          {/* <input
            type="password"
            id="new-password"
            value={newPasswordConfirm()}
            onInput={(e) => setNewPasswordConfirm(e.currentTarget.value)}
            required
            placeholder="Konfirmasi password baru"
          /> */}
        </div>
        <button type="submit" class="btn-submit">Ubah Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
