const ctx = document.getElementById('myChart');

let dataArray = [];

let labelArray = Array.from({ length: 180 }, (x, i) => i + 5);

let cycles = 0;

let index = 0;

function updateGraph() {
  const dataValue = document.getElementById('graph_data').innerText;
  dataArray.push(dataValue.slice(0, 2));
  if (dataArray.length > 180) {
    dataArray.shift();
  }
  cycles++;
  if (cycles > 180) {
    updateLabel();
  }
}

function updateLabel() {
  if (cycles > 180) {
    labelArray.push(Number(labelArray[index]).toString());
    if (index > 180) {
      index = 0;
    }
    index++;
    labelArray.shift();
  }
}

setInterval(updateGraph, 5000);

const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labelArray,
    datasets: [
      {
        label: 'Voltage over 5 Second Intervals',
        data: dataArray,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Faraday Cup 6 (FC6) Current, per 5 Second Intervals',
        font: {
          size: 25
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 25
          },
          callback: function (val, index) {
            // Hide every 2nd tick label
            return index % 2 === 0 ? this.getLabelForValue(val) : '';
          }
        },
        title: {
          display: true,
          text: 'Intervals (5s)',
          font: {
            size: 25
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 25
          }
        },
        title: {
          display: true,
          text: 'Amps',
          font: {
            size: 25
          }
        }
      }
    }
  }
});

function updateChart(chart) {
  chart.update();
}

setInterval(updateChart, 5000, myChart);
