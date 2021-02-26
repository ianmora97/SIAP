var talleresChart = document.getElementById("talleresChart").getContext("2d");
var gradienteColores = talleresChart.createLinearGradient(0, 0, 0, 600);

gradienteColores.addColorStop(0, "rgba(29.8%, 51.8%, 100%, 0.6)");
gradienteColores.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var tallerCh = new Chart(talleresChart, {
    type: "bar",
    data: {
        labels: ["Principiante", "Intermedio", "Avanzado"],
        datasets: [
            {
                label: ["Cantidad de personas matriculadas por taller"],
                // backgroundColor: "#4c84ff",
                backgroundColor: gradienteColores,
                borderColor: '#4c84ff',
                borderWidth: 2,
            },
        ],
    },
    options: {
        showLines: false, // disable for all datasets
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: false,
                        drawTicks: false,
                        drawBorder: true,
                    },
                },
            ],
            yAxes: [
                {
                    gridLines: {
                        // display:false,
                        drawTicks: false,
                        drawBorder: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        // stepSize: 5,
                        // max: 50,
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

gradienteColores_usuarios.addColorStop(0, "rgba(255%, 75%, 75%, 0.6)");
gradienteColores_usuarios.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

usuariosChart.height = 600;
var usuarioCharVar = new Chart(usuariosChart, {
    type: "bar",
    data: {
        labels: ["Principiante", "Intermedio-Avanzado"],
        datasets: [
            {
                label: "Principiante",
                data: [12],
                backgroundColor: gradienteColores,
                borderColor: '#4c84ff',
                borderWidth: 2,
            },
            {
                label: "Intermedio-Avanzado",
                data: [19],
                backgroundColor: gradienteColores_usuarios,
                borderColor: '#FFB6C1',
                borderWidth: 2,
            },
        ],
    },
    options: {
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
var matriculaChart = document.getElementById("matriculaChart").getContext("2d");
matriculaChart.height = 600;
var matriculaChartVar = new Chart(matriculaChart, {
    type: "bar",
    data: {
        labels: [
            "Profesores",
            "Estudiantes",
            "Activos",
            "Morosos",
            "Desmatriculados",
        ],
        datasets: [
            {
                label: "Cantidad de Usuarios",
                data: [12, 19, 3, 5, 6],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    },
    options: {
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
var pieDonutChart = document.getElementById("pieDonutChart").getContext("2d");
var pieDonutChartVar = new Chart(pieDonutChart, {
    type: "pie",
    data: {
        labels: [
            "Agregados",
            "Eliminados",
            "Actualizados"
        ],
        datasets: [
            {
                label: "Reportes",
                data: [12, 19, 3],
                borderWidth: [2],
                backgroundColor: [
                    "#4c84ff",
                    "#28a745",
                    "#ffc107",
                ],
                borderColor: [
                    "#fff",
                    "#fff",
                    "#fff",
                ],
                borderWidth: 1,
            },
        ],
    },
    options:{
        responsive: true,
        maintainAspectRatio: false,
    }
});
