var talleresChart = document.getElementById("talleresChart").getContext("2d");
var gradienteColores = talleresChart.createLinearGradient(0, 0, 0, 600);

gradienteColores.addColorStop(0, "rgba(29.8%, 51.8%, 100%, 0.6)");
gradienteColores.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var tallerCh = new Chart(talleresChart, {
    type: "bar",
    data: {
        //labels: ["Iniciación", "Reforzamiento deportivo", "dandole duro"],
        datasets: [
            {
                backgroundColor: gradienteColores,
                borderColor: '#4c84ff',
                borderWidth: 2,
            },
        ],
    },
    options: {
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
        },
        showLines: false, // disable for all datasets
        scales: {
            xAxes: [
                {
                    gridLines: {
                        drawBorder: true,
                        display: false,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        suggestedMin: 0,
                        beginAtZero: true   // minimum value will be 0.
                    },
                    gridLines: {
                        drawBorder: true,
                        display: false,
                    },
                },
            ],
        },
        animation: {},
        tooltips: {
            mode: "nearest",
        },
        responsive: true,
        maintainAspectRatio: false,
    },
});

var usuariosChart = document.getElementById("usuariosChart").getContext("2d");
var gradienteColores_usuarios = usuariosChart.createLinearGradient(0, 0, 0, 600);

gradienteColores_usuarios.addColorStop(0, "rgba(75%, 255%, 75%, 0.6)");
gradienteColores_usuarios.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

usuariosChart.height = 600;
var usuarioCharVar = new Chart(usuariosChart, {
    type: "bar",
    data: {
        datasets: [
            {
                backgroundColor: gradienteColores_usuarios,
                borderColor: '#28a745 ',
                borderWidth: 2,
            },
        ],
    },
    options: {
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        drawBorder: true,
                        display: false,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        suggestedMin: 0,
                        beginAtZero: true   // minimum value will be 0.
                    },
                    gridLines: {
                        drawBorder: true,
                        display: false,
                    },
                },
            ],
        },
        responsive: true,
        maintainAspectRatio: false,
    },
});


var casillerosChart = document.getElementById("casillerosChart").getContext("2d");
var gradienteColores_casilleros = casillerosChart.createLinearGradient(0, 0, 0, 600);

gradienteColores_casilleros.addColorStop(0, "rgba(255%, 204%, 58%, 0.6)");
gradienteColores_casilleros.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

casillerosChart.height = 600;
var casillerosChartVar = new Chart(casillerosChart, {
    type: "bar",
    data: {
        datasets: [
            {
                backgroundColor: gradienteColores_casilleros,
                borderColor: '#ffc107',
                borderWidth: 2,
            },
        ],
    },
    options: {
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
        },
        showLines: false, // disable for all datasets
        scales: {
            xAxes: [
                {
                    gridLines: {
                        drawBorder: true,
                        display: false,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        suggestedMin: 0,
                        beginAtZero: true   // minimum value will be 0.
                    },
                    gridLines: {
                        drawBorder: true,
                        display: false,
                    },
                },
            ],
        },
        animation: {},
        tooltips: {
            mode: "nearest",
        },
        responsive: true,
        maintainAspectRatio: false,
    }


});




var pieDonutChart = document.getElementById("pieDonutChart").getContext("2d");
var pieDonutChartVar = new Chart(pieDonutChart, {
    type: "doughnut",
    data: {
        datasets: [
            {                
                borderWidth: [2],
                backgroundColor: [
                    '#28a745',
                    "#4c84ff",
                    '#ffc107',
                ],
                borderColor: [
                    "#28a745",
                    "#4c84ff",
                    "#ffc107",
                ],
                borderWidth: 1,
            },
        ],
    },
    options:{
        cutoutPercentage: 70,
        responsive: true,
        maintainAspectRatio: false,
    }
});
