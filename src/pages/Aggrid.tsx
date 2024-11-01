import { createSignal, createEffect, onMount } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import ConfirmationModal from './confirmationmodal';
import '@fontsource/metropolis';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Aggrid.css'; // Ensure this CSS file is imported

interface User {
  id: number;
  nama_lengkap: string;
  email: string;
  password: string;
  tanggal_lahir: string;
  umur: number;
  pekerjaan: string;
  golongan_darah: string;
  jenis_kelamin: string;
  pertanyaan: string;
  jawaban?: string; // Add jawaban as an optional 
  provinsi: string;
  kabupaten:  string;
  kecamatan: string;
}

const Aggrid = (props: {isDarkMode: boolean}) =>{
  const [isEditing, setIsEditing] = createSignal(false);
  const [rowData, setRowData] = createSignal<User[]>([]);
  const [isDarkMode, setIsDarkMode] = createSignal(false); 
  const [selectedUser, setSelectedUser] = createSignal<User | null>(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isAddModalOpen, setIsAddModalOpen] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = createSignal(false);
  const [userToDelete, setUserToDelete] = createSignal<User | null>(null);
  let gridElement: HTMLDivElement | undefined;

  createEffect(() => {
    fetch('http://localhost:8080/users')
      .then(response => response.json())
      .then(data => {
        setRowData(data.map((user: User) => ({
          ...user,
          provinsi: user.provinsi || '',
          kabupaten: user.kabupaten || '',
          kecamatan: user.kecamatan || ''
        })));
      })
      .catch(error => console.error('Error fetching data:', error));
  
    if (gridElement) {
      if (props.isDarkMode) {
        gridElement.classList.add('ag-theme-alpine-dark');
        gridElement.classList.remove('ag-theme-alpine');
      } else {
        gridElement.classList.add('ag-theme-alpine');
        gridElement.classList.remove('ag-theme-alpine-dark');
      }
    }
  });
  
  

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true); // Open modal
  };

  const handleUpdate = (user: User) => {
    if (user.id) {
      return fetch('http://localhost:8080/users/${user.id}', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
        .then(response => response.json())
        .then(() => {
          setRowData(prev => prev.map(u => u.id === user.id ? user : u));
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error('Error updating data:', error);
          alert('Error saving data');
        });
    } else {
      alert('User ID not found.');
    }
  };
  

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    const user = userToDelete();
    if (user) {
      fetch('http://localhost:8080/users/${user.id}', {
        method: 'DELETE'
      })
        .then(() => {
          setRowData(prev => prev.filter(u => u.email !== user.email));
          setIsConfirmationModalOpen(false);
        })
        .catch(error => console.error('Error deleting data:', error));
    }
  };

  const cancelDelete = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleInputChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    
    // Update selectedUser state based on input change
    setSelectedUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
    
    // Handle dependent select boxes
    if (name === "provinsi") {
      setFilteredKabupaten(kabupatenOptions[value] || []);
      setSelectedUser(prevUser => ({
        ...prevUser,
        kabupaten: "",
        kecamatan: ""
      }));
    } else if (name === "kabupaten") {
      setFilteredKecamatan(kecamatanOptions[value] || []);
      setSelectedUser(prevUser => ({
        ...prevUser,
        kecamatan: ""
      }));
    }
  };
  
  const handleSave = () => {
    if (selectedUser()) {
      // Endpoint URL
      const endpoint = 'http://127.0.0.1:8080/register';
  
      // Data to be sent
      const userData = selectedUser()!;
  
      // Send POST request
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      .then(response => response.json())
      .then(data => {
        // Handle success
        alert('Data successfully saved');
        setIsModalOpen(false); // Close modal
      })
      .catch(error => {
        console.error('Error saving data:', error);
        alert('Error saving data');
      });
    }
  };
  
  

  const handleAddUser = () => {
    setSelectedUser({
      id: Date.now(), // Or another method to generate a unique ID
      nama_lengkap: '',
      email: '',
      password: '',
      tanggal_lahir: '',
      umur: 0,
      pekerjaan: '',
      golongan_darah: '',
      jenis_kelamin: '',
      pertanyaan: '',
      jawaban: '', // Add jawaban here
      provinsi: '',
      kabupaten: '',
      kecamatan:'',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };
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

  const columnDefs = [
    { headerName: 'Nama Lengkap', field: 'nama_lengkap' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Password', field: 'password' },
    { headerName: 'Tanggal Lahir', width: 120, field: 'tanggal_lahir' },
    { headerName: 'Umur', width: 75, field: 'umur' },
    { headerName: 'Pekerjaan', width: 100, field: 'pekerjaan' },
    { headerName: 'Golongan Darah', width: 138, field: 'golongan_darah' },
    { headerName: 'Jenis Kelamin', width: 120, field: 'jenis_kelamin' },
    { headerName: 'Pertanyaan', width: 240, field: 'pertanyaan' },
    { headerName: 'Provinsi', width: 130, field: 'provinsi' },
    { headerName: 'Kabupaten', width: 250, field: 'kabupaten' },
    { headerName: 'Kecamatan', width: 200, field: 'kecamatan' },
    {
      headerName: 'Actions',
      width: 240,
      cellRenderer: (params) => {
        const container = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.classList.add('action-button', 'edit-button');
        editButton.addEventListener('click', () => handleEdit(params.data));

        const updateButton = document.createElement('button');
        updateButton.innerText = 'Update';
        updateButton.classList.add('action-button', 'update-button');
        updateButton.addEventListener('click', () => handleUpdate(params.data));

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('action-button', 'delete-button');
        deleteButton.addEventListener('click', () => handleDelete(params.data));

        container.appendChild(editButton);
        container.appendChild(updateButton);
        container.appendChild(deleteButton);

        return container;
      },
    },
  ];

  return (
    <div>
      <div class="ml-md-auto py-2 py-md-0">
        <button class="btn btn-white btn-border btn-round mr-2">Manage</button>
        <button class="btn btn-secondary btn-round" onClick={handleAddUser}>Add User</button>
      </div>

      <div ref={el => gridElement = el} class="ag-theme-alpine" style={{"margin-top": "7px", "margin-left": "0px", height: '350px', width: '1060px' }}>
        <AgGridSolid
          rowData={rowData()}
          columnDefs={columnDefs}
          rowSelection="single"
        />

        {message() && (
          <div class="message">{message()}</div>
        )}

        {isModalOpen() && (
          <>
            <div class="modal-overlay" onClick={() => setIsModalOpen(false)}></div>
            <div class="modal">
              <h2>Form</h2>
              <input
                type="text"
                name="nama_lengkap"
                value={selectedUser()?.nama_lengkap || ''}
                onInput={handleInputChange}
                placeholder="Nama Lengkap"
              />
              <input
                type="email"
                name="email"
                value={selectedUser()?.email || ''}
                onInput={handleInputChange}
                placeholder="Email"
                disabled={isEditing()}
              />
              <input
                type="password"
                name="password"
                value={selectedUser()?.password || ''}
                onInput={handleInputChange}
                placeholder="Password"
                disabled={isEditing()}
              />
              <input
                type="date"
                name="tanggal_lahir"
                value={selectedUser()?.tanggal_lahir || ''}
                onInput={handleInputChange}
                placeholder="Tanggal Lahir"
              />
              <input
                type="number"
                name="umur"
                value={selectedUser()?.umur || ''}
                onInput={handleInputChange}
                placeholder="Umur"
              />
              <select
                name="pekerjaan"
                value={selectedUser()?.pekerjaan || ''}
                onInput={handleInputChange}
              >
                <option value="" disabled>Pilih Pekerjaan</option>
                <option value="Pelajar">Pelajar</option>
                <option value="Mahasiswa">Mahasiswa</option>
                <option value="Pekerja">Pekerja</option>
              </select>

              <select
                name="golongan_darah"
                value={selectedUser()?.golongan_darah || ''}
                onInput={handleInputChange}
              >
                <option value="" disabled>Pilih Golongan Darah</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>

              <select
                name="jenis_kelamin"
                value={selectedUser()?.jenis_kelamin || ''}
                onInput={handleInputChange}
              >
                <option value="" disabled>Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>

              <select 
                name="pertanyaan" 
                value={selectedUser().pertanyaan || ''} 
                onInput={handleInputChange}
              >
                <option value="" disabled selected>Pilih Pertanyaan Keamanan</option>
                <option>Apa makanan kesukaan Anda?</option>
                <option>Apa nama hewan peliharaan Anda?</option>
                <option>Di kota mana Anda dilahirkan?</option>
                <option>Siapa nama temanmu?</option>
              </select>
              <input
                type="text"
                name="jawaban"
                value={selectedUser()?.jawaban || ''}
                onInput={handleInputChange}
                placeholder="Jawaban"
              />

              <select
                  name="provinsi"
                  value={selectedUser()?.provinsi || ''}
                  onInput={handleInputChange}
                >
                  <option value="" disabled>Pilih Provinsi</option>
                  {Object.keys(kabupatenOptions).map(provinsi => (
                    <option value={provinsi}>{provinsi}</option>
                  ))}
              </select>
              <select
                name="kabupaten"
                value={selectedUser()?.kabupaten || ''}
                onInput={handleInputChange}
              >
                <option value="" disabled>Pilih Kabupaten</option>
                {filteredKabupaten().map(kabupaten => (
                  <option value={kabupaten}>{kabupaten}</option>
                ))}
              </select>
              <select
                name="kecamatan"
                value={selectedUser()?.kecamatan || ''}
                onInput={handleInputChange}
                disabled={!selectedUser()?.kabupaten}
              >
                <option value="" disabled>Pilih Kecamatan</option>
                {filteredKecamatan().map(kecamatan => (
                  <option value={kecamatan}>{kecamatan}</option>
                ))}
              </select>

              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </>
        )}

        {isConfirmationModalOpen() && (
          <ConfirmationModal
            message="Are you sure you want to delete this user?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            isDarkMode
          />
        )}
      </div>
    </div>
  );
};

export default Aggrid;