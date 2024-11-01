import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'jquery';
import '@fontsource/metropolis';
import DateTimeInfo from "./wib";
import 'popper.js';
import WebFont from "webfontloader";
import logo from "../assets/img/DynoView.png";
import calendar from '../assets/img/calendar.png';
import acel from "../assets/img/acel.jpeg";
import wave from "../assets/img/wavedash.png";
import elemen from "../assets/img/elemen.png";
import '/src/assets/css/fonts.min.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/atlantis.min.css';
import '../assets/css/demo.css';
import './dashboard.css'
import AgeChart from "./agechart";
import GenderChart from "./genderchart";
import BloodTypeChart from "./bloodtype";
import OccupationChart from "./occupation";
import ToggleDarkMode from "./darkmodetoggle";
import Aggrid from './Aggrid';
import Maps from './googlemaps';


function Dashboard() {
  const navigate = useNavigate();
  const [isCalendarVisible, setCalendarVisible] = createSignal(false);
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [userName, setUserName] = createSignal<string>('');
  const [userId, setUserId] = createSignal<number | null>(null);
  const [userEmail, setUserEmail] = createSignal<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = createSignal<boolean>(false);
  const [isLoggedOut, setIsLoggedOut] = createSignal(false);

  const handleToggle = (newMode) => {
    setIsDarkMode(newMode);
  };
  
  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
        try {
            const userIdValue = userId(); 
            if (userIdValue) {
                await fetch(`http://127.0.0.1:8080/logout/${userIdValue}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setUserName('User'); 
                setUserId(null); 
                setUserEmail(null);
                setIsLoggedIn(false);
                setIsLoggedOut(true);

                navigate('/login');
            } else {
                console.error('User ID is not available');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
};

  const loginUser = async (email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.email_verified) {
          setUserEmail(email);
          setUserName(data.nama_lengkap); // Set the user's name from response
          setIsLoggedIn(true);
        } else {
          console.error('Email belum terverifikasi');
          navigate('/login');
        }
      } else {
        console.error('Login gagal');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error selama proses login:', error);
      navigate('/login');
    }
  };
  const fetchUserName = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8080/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);

            // Find the user by their email address and status
            const currentUser = data.find(user => user.status === "Online");

            if (currentUser && currentUser.nama_lengkap) {
                console.log(`Found Online User: ${currentUser.nama_lengkap}`);
                setUserName(currentUser.nama_lengkap);
                setUserId(currentUser.id);
                setIsLoggedIn(true);
            } else {
                console.log('No online user found');
                setUserName('User');
                setIsLoggedIn(false);
            }
        } else {
            console.log('Failed to fetch user data');
            setUserName('User');
            setIsLoggedIn(false);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName('User');
        setIsLoggedIn(false);
    }
};
  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible());
  };
  onMount(() => {
    fetchUserName(); 
    // Load and configure WebFont
    const script = document.createElement("script");
    script.onload = () => {
      WebFont.load({
        google: { families: ["Lato:300,400,700,900"] },
        custom: {
          families: [
            "Flaticon",
            "Font Awesome 5 Solid",
            "Font Awesome 5 Regular",
            "Font Awesome 5 Brands",
            "simple-line-icons",
          ],
        },
        active: function () {
          sessionStorage.fonts = true;
        },
      });
    };
    document.head.appendChild(script);

    // Import and configure other JavaScript libraries if needed
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    import('chart.js');
  });
  return (
      <div>
        <title>Atlantis Lite - Bootstrap 4 Admin Dashboard</title>
        <meta content="width=device-width, initial-scale=1.0, shrink-to-fit=no" name="viewport" />
        <link rel="icon" href="../assets/img/icon.ico" type="image/x-icon" />
        {/* Fonts and icons */}
        {/* CSS Files */}
        <link rel="stylesheet" href="../assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="../assets/css/atlantis.min.css" />
        {/* CSS Just for demo purpose, don't include it in your project */}
        <link rel="stylesheet" href="../assets/css/demo.css" />
        <div class="wrapper">
          <div class="main-header">
            {/* Logo Header */}
            <div class="logo-header" data-background-color="blue">
                <img src={logo} alt="navbar brand" class="navbar-brand" />
              <button class="navbar-toggler sidenav-toggler ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon">
                  <i class="icon-menu" />
                </span>
              </button>
              <button class="topbar-toggler more"><i class="icon-options-vertical" /></button>
              <div class="nav-toggle">
                <button class="btn btn-toggle toggle-sidebar">
                  <i class="icon-menu" />
                </button>
              </div>
            </div>
            {/* End Logo Header */}
            {/* Navbar Header */}
            <nav class="navbar navbar-header navbar-expand-lg" data-background-color="blue2">
              <div class="container-fluid">
                <div class ="username">
                  <h2>Hello, {userName()}!</h2>
                </div>
                <ul class="navbar-nav topbar-nav ml-md-auto align-items-center">
                  <li class="nav-item toggle-nav-search hidden-caret">
                    <a class="nav-link" data-toggle="collapse" href="#search-nav" role="button" aria-expanded="false" aria-controls="search-nav">
                      <i class="fa fa-search" />
                    </a>
                  </li>
                  <div class={isDarkMode() ? 'dark-mode' : ''}>
                    <ToggleDarkMode onToggle={handleToggle} />
                   </div>
                  <li class="nav-item dropdown hidden-caret">
                    <a class="nav-link dropdown-toggle" href="#" id="messageDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="fa fa-envelope" />
                    </a>
                    
                  </li>
                  <li class="nav-item dropdown hidden-caret">
                    <a class="nav-link dropdown-toggle" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="fa fa-bell" />
                    </a>
                  </li>
                  <li class="nav-item dropdown hidden-caret">
                    <a class="dropdown-toggle profile-pic" data-toggle="dropdown" href="#" aria-expanded="false">
                      <div class="avatar-sm">
                        <img src={acel} alt="..." class="avatar-img rounded-circle" />
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
            {/* End Navbar */}
          </div>
          {/* Sidebar */}
          <div class="sidebar sidebar-style-2">			
            <div class="sidebar-wrapper scrollbar scrollbar-inner">
              <div class="sidebar-content">
                <div class="user">
                  <div class="avatar-sm float-left mr-2">
                    <img src={acel} alt="..." class="avatar-img rounded-circle" />
                  </div>
                  <div class="info">
                    <a data-toggle="collapse" aria-expanded="true">
                      <span>
                        {userName()}
                        <span class="user-level">User</span>
                        <span class="caret" />
                      </span>
                    </a>
                    <div class="clearfix" />
                    <div class="collapse in" id="collapseExample">
                      <ul class="nav">
                        <li>
                          <a href="#profile">
                            <span class="link-collapse">My Profile</span>
                          </a>
                        </li>
                        <li>
                          <a href="#edit">
                            <span class="link-collapse">Edit Profile</span>
                          </a>
                        </li>
                        <li>
                          <a href="#settings">
                            <span class="link-collapse">Settings</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <ul class="nav nav-primary">
                  <li class="nav-item active">
                    <a data-toggle="collapse" href="" class="collapsed" aria-expanded="false">
                      <i class="fas fa-home" />
                      <p>Dashboard</p>
                    </a>
                  </li>
                  <li class="nav-section">
                    <span class="sidebar-mini-icon">
                      <i class="fa fa-ellipsis-h" />
                    </span>
                    <h4 class="text-section">Components</h4>
                  </li>
                  {/* <li class="nav-item">
                    <a data-toggle="collapse" href="/form">
                      <i class="fas fa-pen-square" />
                      <p>Forms</p>
                    </a>
                  </li> */}
                  <li class="nav-item">
                    <a data-toggle="collapse" href="/table">
                      <i class="fas fa-table" />
                      <p>Data User</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a data-toggle="collapse" href="/chart">
                      <i class="fas fa-chart-bar" />
                      <p>Chart</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a data-toggle="collapse" href="/maps">
                      <i class="fas fa-map-marker-alt" />
                      <p>Maps</p>
                    </a>
                  </li>
                  <li class="nav-item logout-item">
                    <a onclick={handleLogout}>
                      <i class="fas fa-sign-out-alt"></i>
                      <p>Logout</p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* End Sidebar */}
          <div class="main-panel">
            <div class="content">
              <div class="panel-header bg-primary">
                <div class="page-inner py-5">
                  <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                    <div>
                     <h2 class="text-white pb-2 fw-bold">Dashboard</h2>
                     <DateTimeInfo/>
                    </div>
                    <div class="calendar d-flex align-items-center p-3">
                      <img src={calendar} alt="Calendar Icon" width="24" height="24" class="me-2" />
                      <span class="text-dark fw-bold">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         <div class="content2">
            <div class="cardash">
              <h4>Selamat datang, dashboardmu siap digunakan!</h4>
              <p>Pantau data dan aktivitas terkini dengan dashboard ini. Akses ringkasan penting, kelola <br />informasi, dan optimalkan performa dengan alat monitoring yang disediakan.</p>
              <img src={wave} />
              <img src={elemen} class="elemen" />
            </div>
            <div class="amchart">
              <div class="age">
                <h4>Umur</h4>
                <AgeChart isDarkMode= {isDarkMode()}/>
              </div>
              <div class="gender">
                <h4>Jenis Kelamin</h4>
                <GenderChart isDarkMode={isDarkMode()}/>
              </div>
              <div class="bloodtype">
                <h4>Golongan Darah</h4>
                <BloodTypeChart isDarkMode={isDarkMode()}/>
              </div>
              {/* <div class="gender">
                <h4>Jenis Kelamin</h4>
                <GenderChart isDarkMode={isDarkMode()}/>
              </div> */}
              <div class="occupation">
                <h4>Pekerjaan</h4>
                <OccupationChart isDarkMode={isDarkMode()}/>
              </div>
            </div>
            <div class="aggrid">
              <Aggrid isDarkMode={isDarkMode()} />
            </div>
            <div class="maps">
              <Maps/>
            </div>
         </div>
         </div>
        </div>
      </div>
    );
}

export default Dashboard;