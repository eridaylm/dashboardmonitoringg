import { createSignal, onCleanup } from "solid-js";

const DateTimeInfo = () => {
  const [time, setTime] = createSignal(new Date());

  const updateTime = () => {
    setTime(new Date());
  };

  // Update waktu setiap detik
  const interval = setInterval(updateTime, 1000);

  onCleanup(() => clearInterval(interval));

  const formatTime = (date: Date) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Menyesuaikan waktu lokal ke WIB (UTC+7)
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();

    const wibHours = String((utcHours + 7) % 24).padStart(2, '0');
    const minutes = String(utcMinutes).padStart(2, '0');

    return (
      <>
        <span style={{ color: "#007bff" }}>{dayName}</span> • &nbsp;
        <span style={{ color: "#6c757d" }}>{day} {month} {year} • {wibHours}:{minutes} WIB</span>
      </>
    );
  };

  return (
    <div class="date-time-info">
      <p class="date-time-text">
        {formatTime(time())}
      </p>
    </div>
  );
};

export default DateTimeInfo;
