import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router"; // Import useNavigate
import './register.css';
import eyeIcon from '../assets/img/eye.png';
import eyeOffIcon from '../assets/img/eye-off.png';
import elements from '../assets/img/DynoView (595 x 520 piksel).png'

const Register = () => {
  const [isClicked, setClicked] = createSignal(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
        navigate('/login'); // Ganti dengan path tujuan
    }, 1000); // Waktu yang sesuai dengan durasi animasi
};

  const [formData, setFormData] = createSignal({
    nama_lengkap: "",
    email: "",
    password: "",
    tanggal_lahir: "",
    umur: "",
    pekerjaan: "",
    golongan_darah: "",
    jenis_kelamin: "",
    pertanyaan: "",
    jawaban:"",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
  });
  const [filteredKabupaten, setFilteredKabupaten] = createSignal([]);
  const [filteredKecamatan, setFilteredKecamatan] = createSignal([]);
  const kecamatanOptions = {
    "Kota Administratif Jakarta Pusat": [
      "Gambir",
      "Menteng",
      "Senen",
      "Tanah Abang",
      "Kemayoran",
      "Johar Baru",
      "Cempaka Putih",
      "Sawah Besar"
    ],
    "Kota Administratif Jakarta Selatan": [
      "Pasar Minggu",
      "Tebet",
      "Jagakarsa",
      "Setiabudi",
      "Cilandak",
      "Pancoran",
      "Pesanggrahan"
    ],
    "Kota Administratif Jakarta Timur": [
      "Cakung",
      "Ciracas",
      "Duren Sawit",
      "Pasar Rebo",
      "Pulo Gadung",
      "Jatinegara"
    ],
    "Kabupaten Bandung": [
      "Kecamatan Lembang",
      "Kecamatan Parongpong",
      "Kecamatan Cisarua",
      "Kecamatan Cipeundeuy",
      "Kecamatan Ngamprah",
      "Kecamatan Ciapatat",
      "Kecamatan Padalarang"
    ],
    "Kabupaten Bekasi": [
      "Kecamatan Bantargebang",
      "Kecamatan Pondokgede",
      "Kecamatan Rawalumbu",
      "Kecamatan Jatiasih",
      "Kecamatan Medansatria"
    ],
    "Kabupaten Bogor": [
      "Kecamatan Bogor Barat",
      "Kecamatan Bogor Timur",
      "Kecamatan Bogor Utara",
      "Kecamatan Bogor Tengah",
      "Kecamatan Bogor Selatan",
      "Kecamatan Tanah Sereal",

    ],
    "Kabupaten Banyumas": [
      "Kecamatan Sokaraja",
      "Kecamatan Baturraden",
      "Kecamatan Rawalo",
      "Kecamatan Sumbang",
      "Kecamatan Kembaran",
    ],
    "Kabupaten Cilacap": [
      "Kecamatan Adipala",
      "Kecamatan Binangun",
      "Kecamatan Bantarsari",
      "Kecamatan Cimanggu",
      "Kecamatan Karangpucung",
    ],
    // Tambahkan data kecamatan sesuai kabupaten lainnya
  };
  const kabupatenOptions = {
    "DKI Jakarta": [
      "Kota Administratif Jakarta Pusat",
      "Kota Administratif Jakarta Selatan",
      "Kota Administratif Jakarta Timur"
    ],
    "Jawa Barat": [
      "Kabupaten Bandung", 
      "Kabupaten Bekasi", 
      "Kabupaten Bogor",   
    ],
    "Jawa Tengah": [
      "Kabupaten Banyumas",
      "Kabupaten Cilacap",
      "Kabupaten Purbalingga",
      "Kabupaten Semarang",
    ],
    "Jawa Timur": [
      "Kabupaten Surabaya", 
      "Kabupaten Malang",
      "Kabupaten Jember"
    ]
  };

  const [passwordVisible, setPasswordVisible] = createSignal(false);
  const navigate = useNavigate(); // Initialize navigate function
  const [showModal, setShowModal] = createSignal(false);
  const [passwordError, setPasswordError] = createSignal("");
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData(), [name]: value });

    if (name === "provinsi") {
      setFilteredKabupaten(kabupatenOptions[value] || []);
      setFormData({ ...formData(), kabupaten: "", kecamatan: "" });
    } else if (name === "kabupaten") {
      setFilteredKecamatan(kecamatanOptions[value] || []);
      setFormData({ ...formData(), kecamatan: "" });
    }
  };

  const validateForm = () => {
    const password = formData().password.trim();
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    // Validasi lainnya jika ada
    return password.length >= minLength && hasLetter && hasNumber && hasSymbol; // Misalnya, memastikan kata sandi memiliki minimal 8 karakter
  };


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible());
  };


  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (validateForm()) {
        try {
            const response = await fetch('http://127.0.0.1:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama_lengkap: formData().nama_lengkap,
                    email: formData().email,
                    password: formData().password, // Backend akan meng-hash ini
                    tanggal_lahir: formData().tanggal_lahir,
                    umur: parseInt(formData().umur), // Pastikan umur adalah integer
                    pekerjaan: formData().pekerjaan,
                    golongan_darah: formData().golongan_darah,
                    jenis_kelamin: formData().jenis_kelamin,
                    pertanyaan: formData().pertanyaan,
                    jawaban: formData().jawaban,
                    provinsi: formData().provinsi,
                    kabupaten: formData().kabupaten,
                    kecamatan: formData().kecamatan
                }),
            });

            if (response.ok) {
                alert('Registration successful! Please check your email for verification.');
                navigate('/verify');
            } else {
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.message}`);
            }
        } catch (error) {
            alert('Something went wrong during registration. Please try again later.');
        }
    } else {
        alert('Form validation failed. Please check your inputs.');
    }
};

  return (
    <div class="register-container">
        <div class="reg-container"> 
            <form onSubmit={handleSubmit} class="register-form">
              <div class="element-wrapper">
                <div class="elemen">
                  <img src={elements} class="elements" />
                    <h2>Halo, Selamat datang di <br />DynoView!</h2>
                    <p>Kelola dan pantau data Anda dengan DynoView. <br />Jika Anda sudah memiliki akun</p>
                    <button class={isClicked() ? 'active' : ''}
                      onClick={handleClick}>Masuk</button>
                </div>

              </div>
                 {/* <div class={`forms ${isClicked() ? 'hidden' : ''}`}>
                      <h4>Daftar dengan Akun Anda</h4>
                      <p>Isi formulir di bawah ini untuk membuat akun baru</p>
                  </div> */}
                <div class={`form-group-reg ${isClicked() ? 'hidden' : ''}`}>
                    <h1>Isi Formulir untuk Mendaftar</h1>
                    <div class="name-group">
                        <label for="nama_lengkap" class="label">Nama Lengkap:</label>
                        <input type="text" id="nama_lengkap" name="nama_lengkap" class="input" placeholder="Nama Lengkap" value={formData().nama_lengkap} onInput={handleChange} required />
                    </div>
                    <div class="reg-empass">
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
                    </div>
                    <div class="mp">
                      <div class="ttl">
                        <label for="tanggal_lahir" class="label">Tanggal Lahir:</label>
                        <input type="date" id="tanggal_lahir" name="tanggal_lahir" class="input" value={formData().tanggal_lahir} onInput={handleChange} required />
                      </div>
                        <div class="umur">
                            <label for="umur" class="label">Umur:</label>
                            <input type="number" id="umur" name="umur" class="input" placeholder="Masukkan Umur" value={formData().umur} onInput={handleChange} required />
                        </div>
                        <div class="pekerjaan">
                            <label for="pekerjaan" class="label">Pekerjaan:</label>
                            <select id="pekerjaan" name="pekerjaan" class="input" value={formData().pekerjaan} onInput={handleChange} required>
                                <option value="" disabled selected>Pilih Pekerjaan</option>
                                <option value="Pelajar">Pelajar</option>
                                <option value="Mahasiswa">Mahasiswa</option>
                                <option value="Pekerja">Pekerja</option>
                            </select>
                        </div>
    
                    </div>
                    <div class="goje">
                        <div class="golongandarah">
                        <label for="golongan_darah" class="label">Golongan Darah:</label>
                        <select id="golongan_darah" name="golongan_darah" class="input" value={formData().golongan_darah} onInput={handleChange} required>
                            <option value="">Pilih Golongan Darah</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="O">O</option>
                        </select>
                        </div>
                        <div class="jeniskelamin">
                            <label for="jenis_kelamin" class="label">Jenis Kelamin:</label>
                            <select id="jenis_kelamin" name="jenis_kelamin" class="input" value={formData().jenis_kelamin} onInput={handleChange} required>
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div class="pertanyaan">
                            <label for="securityQuestion">Pertanyaan Keamanan:</label>
                            <select id="securityQuestion" name="pertanyaan" class="input" value={formData().pertanyaan} onInput={handleChange} required>
                                <option value="" disabled selected>Pilih Pertanyaan Keamanan</option>
                                <option>Apa makanan kesukaan Anda?</option>
                                <option>Apa nama hewan peliharaan Anda?</option>
                                <option>Di kota mana Anda dilahirkan?</option>
                                <option>Siapa nama temanmu?</option>
                            </select>
                        </div>
                        <div class="jawaban">
                              <label for="securityAnswer">Jawaban:</label>
                              <input
                                  type="text"
                                  id="securityAnswer"
                                  name="jawaban"
                                  class="input"
                                  placeholder="Masukkan Jawaban Anda"
                                  value={formData().jawaban}
                                  onInput={handleChange}
                                  required
                              />
                        </div>
                        <div class="location">
                        <div class="provinsi">
                          <label for="provinsi" class="label">Provinsi:</label>
                          <select id="provinsi" name="provinsi" class="input" value={formData().provinsi} onInput={handleChange} required>
                            <option value="">Pilih Provinsi</option>
                            <option value="DKI Jakarta">DKI Jakarta</option>
                            <option value="Jawa Barat">Jawa Barat</option>
                            <option value="Jawa Tengah">Jawa Tengah</option>
                            <option value="Jawa Timur">Jawa Timur</option>
                          </select>
                        </div>
                        <div class="kabupaten">
                          <label for="kabupaten" class="label">Kabupaten:</label>
                          <select id="kabupaten" name="kabupaten" class="input" value={formData().kabupaten} onInput={handleChange} required>
                            <option value="">Pilih Kabupaten</option>
                            {filteredKabupaten().map((kabupaten) => (
                              <option value={kabupaten}>{kabupaten}</option>
                            ))}
                          </select>
                        </div>
                        <div class="kecamatan">
                          <label for="kecamatan" class="label">Kecamatan:</label>
                          <select
                            id="kecamatan"
                            name="kecamatan"
                            class="input"
                            value={formData().kecamatan}
                            onInput={handleChange}
                            required
                          >
                            <option value="" disabled>Pilih Kecamatan</option>
                            {filteredKecamatan().map(kecamatan => (
                              <option value={kecamatan}>{kecamatan}</option>
                            ))}
                          </select>
                        </div>
                    </div>
                  </div>
                </div>
                <div class={`btn-daftar-container ${isClicked() ? 'hidden' : ''}`}>
                    <button type="submit" class="btn-daftar">Daftar</button>
                </div>
            </form>
        </div>
        
    </div>
  );
};

export default Register;
