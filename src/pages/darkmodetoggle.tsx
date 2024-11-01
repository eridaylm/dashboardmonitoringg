import { createSignal } from "solid-js";
import toggleOnIcon from '../assets/img/toggle-on.png';
import toggleOffIcon from '../assets/img/toggle-off.png';
import './darkmodetoggle.css';

function ToggleDarkMode(props) {
  const [isDarkMode, setDarkMode] = createSignal(false);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode();
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark-mode', newMode);
    props.onToggle(newMode); // Pass the new mode state to the parent component
  };

  return (
    <button onClick={toggleDarkMode} class="toggle-dark-mode-btn">
      <img
        src={isDarkMode() ? toggleOnIcon : toggleOffIcon}
        alt={isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      />
    </button>
  );
}

export default ToggleDarkMode;
