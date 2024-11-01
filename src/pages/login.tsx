import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router"; // Import useNavigate
import './login.css';
import eyeIcon from '../assets/img/eye.png';
import eyeOffIcon from '../assets/img/eye-off.png';
import elements from '../assets/img/DynoView (595 x 520 piksel).png'

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const goToForgotPassword = () => {
    navigate('/forgotpassword');
  };
  const [formData, setFormData] = createSignal({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = createSignal(false);

  const handleChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData(), [name]: value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible());
  };

  const validateForm = () => {
    const password = formData().password.trim();
    return password.length >= 8; // Misalnya, memastikan kata sandi memiliki minimal 8 karakter
  };
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (validateForm()) {
        try {
            const response = await fetch('http://127.0.0.1:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData().email,
                    password: formData().password,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                
                if (result.email_verified) {
                    alert('Login successful!');
                    navigate('/dashboard'); // Redirect to dashboard
                } else {
                    alert('Email belum terverifikasi. Silakan cek email Anda untuk verifikasi.');
                }
            } else {
                const errorData = await response.json();
                alert(`Login failed: ${errorData.message}`);
            }
        } catch (error) {
            alert('Something went wrong during login. Please try again later.');
        }
    } else {
        alert('Form validation failed. Please check your inputs.');
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div class="login-container">
        <div class="log-container"> 
            <form onSubmit={handleSubmit} class="login-form">
              <div class="element-wrapper-log">
                <div class="elemen-login">
                  <img src={elements} class="elements-log" />
                    <h2>Halo, Selamat datang kembali!</h2>
                    <p>Kelola dan pantau data Anda dengan DynoView. <br />Jika Anda belum memiliki akun</p>
                    <button  onClick={handleRegisterClick}>Daftar</button>
                </div>

              </div>
                 {/* <div class={`forms ${isClicked() ? 'hidden' : ''}`}>
                      <h4>Daftar dengan Akun Anda</h4>
                      <p>Isi formulir di bawah ini untuk membuat akun baru</p>
                  </div> */}
                <div class="form-group-log">
                    <h1>Masuk dengan akun anda</h1>
                    <div class="log-empass">
                        <label for="email" class="label">Email:</label>
                        <input type="email" id="email" name="email" class="input" placeholder="Masukkan Email" value={formData().email} onInput={handleChange} required />
                        <label for="password" class="label">Kata Sandi:</label>
                        <div class="password-container-reg">

                          <input
                            type={passwordVisible() ? "text" : "password"}
                            id="password"
                            name="password"
                            class="input"
                            placeholder="Masukkan Kata Sandi"
                            value={formData().password}
                            onInput={handleChange}
                            required
                          />
                          <img
                            src={passwordVisible() ? eyeIcon : eyeOffIcon}
                            alt="toggle password visibility"
                            class="eye-icon-reg"
                            onClick={togglePasswordVisibility}
                          />

                        </div>
                      <button class="forgot-link" onClick={goToForgotPassword}>
                        Lupa password?
                      </button>
                  </div>
                </div>
                <div class="btn-daftar-container">
                  <button type="submit" class="btn-masuk">Masuk</button>
                </div>
              
            </form>
        </div>
    </div>
  );
};

export default Login;
