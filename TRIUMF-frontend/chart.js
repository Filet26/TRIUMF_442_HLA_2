const ctx = document.getElementById('myChart');

let dataArray = [];

function updateGraph() {
  const dataValue = document.getElementById('graph_data').innerText;
  dataArray.push(dataValue);
  if (dataArray.length > 13) {
    dataArray.shift();
  }
}

setInterval(updateGraph, 5000);

const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12'
    ],

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
        text: 'Dr.Chales Fav Variable, IOS:FC6:SCALECUR',
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
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
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
