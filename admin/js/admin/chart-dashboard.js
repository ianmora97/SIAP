// Chart.defaults.global.legend.display = false;
var talleresChart = document.getElementById("talleresChart").getContext("2d");
var gradienteColores = talleresChart.createLinearGradient(0, 0, 0, 600);

gradienteColores.addColorStop(0, "#4659E4");
gradienteColores.addColorStop(0.7, "#4659E4");
gradienteColores.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var tallerCh = new Chart(talleresChart, {
    type: "bar",
    data: {
        //labels: ["Iniciación", "Reforzamiento deportivo", "dandole duro"],
        datasets: [
            {
                backgroundColor: gradienteColores,
                borderColor: '#4659E4',
                borderWidth: 3,
                tension: 0.5
            },
        ],
    },
    options: {
        plugins: {
            legend: false,
            title: {
                display: true,
                text: 'Custom Chart Title',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
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
            x: [
                {
                    gridLines: {
                        drawBorder: true,
                        display: false,
                    },
                },
            ],
            y: {
                beginAtZero: true,
                ticks: {
                    
                    stepSize: 1,
                    suggestedMin: 0,
                    beginAtZero: true   // minimum value will be 0.
                },
            },
        },
        tooltips: {
            mode: "nearest",
        },
        responsive: true,
        maintainAspectRatio: false,
    },
});

var usuariosChart = document.getElementById("usuariosChart").getContext("2d");
var usuariocanva =  document.getElementById("usuariosChart");


var gradienteColores_usuarios = usuariosChart.createLinearGradient(0,0, 0, 600);

gradienteColores_usuarios.addColorStop(0, "#4659E4"); //B81616
gradienteColores_usuarios.addColorStop(0.7, "#4659E4"); //B81616
gradienteColores_usuarios.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");


usuariosChart.height = 600;
var usuarioCharVar = new Chart(usuariosChart, {
    type: "line",
    data: {
        datasets: [
            {
                fill: true,
                backgroundColor: gradienteColores_usuarios,
                borderColor: '#4659E4 ',
                borderWidth: 3,
                tension: 0.5
            },
        ],
    },
    options: {
        plugins: {
            legend: false,
            title: {
                display: true,
                text: 'Custom Chart Title',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
        },
        scales: {
            x: [
                {
                    gridLines: {
                        drawBorder: true,
                        display: false,
                    },
                },
            ],
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 2,
                    suggestedMin: 0,
                    beginAtZero: true   // minimum value will be 0.
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    },
});


var casillerosChart = document.getElementById("casillerosChart").getContext("2d");
var gradienteColores_casilleros = casillerosChart.createLinearGradient(0, 0, 0, 600);

gradienteColores_casilleros.addColorStop(0, "#2bbbff");
gradienteColores_casilleros.addColorStop(1, "#a35eff");

// casillerosChart.height = 600;
var casillerosChartVar = new Chart(casillerosChart, {
    type: "doughnut",
    data: {
        datasets: [
            {
                backgroundColor: [
                    "#fff",
                    gradienteColores_casilleros
                ],
                borderColor: [
                    "#fff",
                    gradienteColores_casilleros
                ],
                borderWidth: 1,
                borderRadius: 50,
            },
        ],
    },
    options:{
        events: ['click'],
        plugins: {
            legend: false,
            title: {
                display: true,
                text: 'Custom Chart Title',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        aspectRatio: 1.3,
        cutout: 65,
        responsive: true,
    }
});

var morosidadChart = document.getElementById("morosidadChart").getContext("2d");
var gradienteColores_morosidadChart = morosidadChart.createLinearGradient(0, 0, 0, 600);

gradienteColores_morosidadChart.addColorStop(0, "#ffcc16");
gradienteColores_morosidadChart.addColorStop(1, "#ff7316");

// morosidadChart.height = 600;
var morosidadChartVar = new Chart(morosidadChart, {
    type: "doughnut",
    data: {
        datasets: [
            {                
                borderWidth: [2],
                backgroundColor: [
                    gradienteColores_morosidadChart,
                    "#ffffff"
                ],
                borderColor: [
                    gradienteColores_morosidadChart,
                    "#ffffff"
                ],
                borderWidth: 1,
                borderRadius: 50,
            },
        ],
    },
    options:{
        plugins: {
            legend: false
        },
        aspectRatio: 1.3,
        cutout: 65,
        responsive: true,
    }
});

var cuposDisponiblesChart = document.getElementById("cuposDisponiblesChart").getContext("2d");
var gradienteColores_cuposDisponiblesChart = cuposDisponiblesChart.createLinearGradient(0, 0, 0, 600);

gradienteColores_cuposDisponiblesChart.addColorStop(0, "#a2ff56");
gradienteColores_cuposDisponiblesChart.addColorStop(1, "#30e8a1");

// cuposDisponiblesChart.height = 600;
var cuposDisponiblesChartVar = new Chart(cuposDisponiblesChart, {
    type: "doughnut",
    data: {
        datasets: [
            {                
                borderWidth: [2],
                backgroundColor: [
                    gradienteColores_cuposDisponiblesChart,
                    "#ffffff"
                ],
                borderColor: [
                    gradienteColores_cuposDisponiblesChart,
                    "#ffffff"
                ],
                borderWidth: 1,
                borderRadius: 50,
            },
        ],
    },
    options:{
        plugins: {
            legend: false
        },
        aspectRatio: 1.3,
        cutout: 65,
        responsive: true,
    }
});

var reposicionesChart = document.getElementById("reposicionesChart").getContext("2d");
var gradienteColores_reposicionesChart = reposicionesChart.createLinearGradient(0, 0, 0, 600);

gradienteColores_reposicionesChart.addColorStop(0, "#ff4916");
gradienteColores_reposicionesChart.addColorStop(0.5, "#ff1668");

// reposicionesChart.height = 600;
var reposicionesChartVar = new Chart(reposicionesChart, {
    type: "doughnut",
    data: {
        datasets: [
            {                
                
                backgroundColor: [
                    gradienteColores_reposicionesChart,
                    "#ffffff"
                ],
                borderColor: [
                    gradienteColores_reposicionesChart,
                    "#ffffff"
                ],
                borderWidth: 1,
                borderRadius: 50,
            },
        ],
    },
    options:{
        plugins: {
            legend: false
        },
        aspectRatio: 1.3,
        cutout: 65,
        responsive: true,
    }
});

var pieDonutChart = document.getElementById("pieDonutChart").getContext("2d");

var grad1 = pieDonutChart.createLinearGradient(0, 0, 0, 600);
var grad2 = pieDonutChart.createLinearGradient(0, 0, 0, 600);
var grad3 = pieDonutChart.createLinearGradient(0, 0, 0, 600);

grad1.addColorStop(0, "#02CA80");
grad1.addColorStop(1, "#02CA80");

grad2.addColorStop(0, "#dc3545");
grad2.addColorStop(1, "#dc3545");

grad3.addColorStop(0, "#4659E4");
grad3.addColorStop(1, "#4659E4");

var pieDonutChartVar = new Chart(pieDonutChart, {
    type: "doughnut",
    data: {
        datasets: [
            {                
                backgroundColor: [
                    grad1,
                    grad2,
                    grad3,
                ],
                borderColor: [
                    "#fff",
                    "#fff",
                    "#fff",
                ],
                borderWidth: 2,
                hoverOffset: 5,
            },
        ],
        
    },
    options:{
        plugins: {
            legend: {
                position: "right",
                align: "end"
            },
          },
        cutoutPercentage: 70,
        responsive: true,
        maintainAspectRatio: false,
    }
});
