const ctx = document.getElementById('myChart');

// Main data array, stores graph data points
let dataArray = [];

let labelArray = Array.from({ length: 180 }, (x, i) => i + 5);

let cycles = 0;

let index = 0;

// takes in a string of a number represented in scientific notation, returns the notation
function round(num) {
  let eIndex = num.indexOf('e');
  if (eIndex == -1) {
    ('');
  } else {
    let notation = num.substring(eIndex);
    return notation;
  }
}

function updateGraph() {
  const dataValue = document.getElementById('graph_data').innerText;
  dataArray.push(dataValue.slice(0, 5));

  // updates charts units eg. Current(A) e-10
  myChart.options.scales.y.title.text = 'Current (A) ' + round(dataValue);

  // Shift elements in graph automatically
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
        fill: true,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        // borderColor: [
        //   "rgba(255, 99, 132, 1)",
        //   "rgba(54, 162, 235, 1)",
        //   "rgba(255, 206, 86, 1)",
        //   "rgba(75, 192, 192, 1)",
        //   "rgba(153, 102, 255, 1)",
        //   "rgba(255, 159, 64, 1)",
        // ],
        borderColor: '#e8364',
        borderWidth: 1
      }
    ]
  },
  options: {
    elements: {
      line: {
        tension: 0.1, // smooth lines
      },
      point: {
        radius: 0,
      },
    },
    responsive: true,
    elements: {
      point: {
        radius: 0
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Faraday Cup 6 (FC6) Current vs 5 Second Intervals',
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
            size: 15
          },
          callback: function (val, index) {
            // Hide every 2nd tick label
            return index % 2 === 0 ? this.getLabelForValue(val) : '';
          }
        },
        title: {
          display: true,
          text: 'Intervals (5s) over 180 Cycles (15 Min)',
          font: {
            size: 15
          }
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          font: {
            size: 15
          }
        },
        title: {
          display: true,
          text: 'Current (A)',
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

// Updates chart every 5 seconds
setInterval(updateChart, 5000, myChart);
