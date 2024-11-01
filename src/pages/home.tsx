import { createSignal } from 'solid-js';
import './home.css'
import '@fontsource/metropolis';
import arrow from '../assets/img/arrowback.png';
import wave from '../assets/img/wave.png';
import wave2 from '../assets/img/wave2.png';
import square from '../assets/img/square.png';
import vscode from '../assets/img/vscode.png';

export default function Home() {
  function navigateToRegister() {
    window.location.href = '/register';
  }


  return (
    <div class="header-dashboard">
      <div class="navbar">
        <h4>DynoView</h4>
        <ul>
          <li>Home</li>
          <li>
            Dashboard
            <i class="fas fa-chevron-right arrow-icon"></i>
          </li>
          <li>
            Pages
            <i class="fas fa-chevron-right arrow-icon"></i>
          </li>
          <li>
            <button onclick={navigateToRegister}>
              Daftar
              <img src={arrow} alt="Arrow Back" class="arrow-icon" />
            </button>
          </li>
        </ul>
      </div>
      <div class="content-first">
        <h2>Memperkenalkan website dashboard monitoring <br /> modern dan canggih </h2>
        <p>DynoView adalah dashboard terbaru dengan desain modern dan mudah digunakan. DynoView membuat <br />pemantauan dan analisis data menjadi cepat dan efisien.</p>
        <button onclick={navigateToRegister}>Mulai Sekarang</button>
        <a href="/" class="button-click">
          <button class='learnmore'>Pelajari Lebih Lanjut</button>
        </a>
        <div class="laptop">
          <img src= {wave} alt="wave" class="wave"/>
        </div>
        <div class="pages">
          <img src={wave2} alt="wave2" class="wave2" />
        </div>
        <div class="app">
          <img src={square} alt="square" class="square"/>
          <h4>Teknologi Dashboard Kami</h4>
          <p>Membantu Anda memantau data rumit dengan cara <br /> yang mudah</p>
          <div class="cards">
            <div class="vscode">
              <img src={vscode} class="card-icon1"/>
              <h3 class="card-title">Visual Studio Code</h3>
              <p class="card-description">Deskripsi Card 1</p>
            </div>
            <div class="card">
              <img src="icon2.png" alt="Icon 2" class="card-icon"/>
              <h3 class="card-title">Card 2</h3>
              <p class="card-description">Deskripsi Card 2</p>
            </div>
            <div class="card">
              <img src="icon3.png" alt="Icon 3" class="card-icon"/>
              <h3 class="card-title">Card 3</h3>
              <p class="card-description">Deskripsi Card 3</p>
            </div>
            <div class="card">
              <img src="icon4.png" alt="Icon 4" class="card-icon"/>
              <h3 class="card-title">Card 4</h3>
              <p class="card-description">Deskripsi Card 4</p>
            </div>
            <div class="card">
              <img src="icon5.png" alt="Icon 5" class="card-icon"/>
              <h3 class="card-title">Card 5</h3>
              <p class="card-description">Deskripsi Card 5</p>
            </div>
            <div class="card">
              <img src="icon6.png" alt="Icon 6" class="card-icon"/>
              <h3 class="card-title">Card 6</h3>
              <p class="card-description">Deskripsi Card 6</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
