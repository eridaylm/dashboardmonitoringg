import { createSignal, onCleanup, onMount } from "solid-js";
import Chart from "chart.js/auto";

function ChartComponent(props) {
  let chartCanvas: HTMLCanvasElement | undefined;
  const [data, setData] = createSignal({ male: 0, female: 0 });

  async function fetchData() {
    try {
      const response = await fetch('http://127.0.0.1:8080/gender/{provinsi}');
      const result = await response.json();

      // Count male and female
      const maleCount = result.filter(user => user.jenis_kelamin === 'Laki-laki').length;
      const femaleCount = result.filter(user => user.jenis_kelamin === 'Perempuan').length;

      setData({ male: maleCount, female: femaleCount });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  onMount(() => {
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      if (ctx) {
        fetchData().then(() => {
          new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ['Laki-laki', 'Perempuan'],
              datasets: [{
                data: [data().male, data().female],
                backgroundColor: ['#36A2EB', '#FF6384'],
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const dataset = tooltipItem.dataset;
                      const total = dataset.data.reduce((acc, value) => acc + value, 0);
                      const currentValue = dataset.data[tooltipItem.dataIndex];
                      const percentage = ((currentValue / total) * 100).toFixed(2);
                      return `${currentValue} (${percentage}%)`;
                    }
                  }
                }
              }
            }
          });
        });
      }
    }
  });

  return (
    <div style={{ width: '300px', height: '200px' }}>
      <canvas ref={chartCanvas} />
    </div>
  );
}

export default ChartComponent;
