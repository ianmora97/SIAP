
function loaded(event){
    events(event);
}

function events(event){
    cargar_estudaniantes_conta();

}


var personas = [];
function cargar_estudaniantes_conta () {
    let ajaxTime = new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/admin/reportes/contabilidad/getUsuarios",
        contentType: "application/json"
    }).then((solicitudes) => {
        personas=solicitudes;
       // var estu = registro.filter( (x)=> x.tipo == 'Estudiante');
       // var admin = registro.filter( (x)=> x.tipo == 'Funcionario');
       //  var pensi = registro.filter( (x)=> x.tipo == 'Pensionado');
        $('#estudiantes_univer_can').html(personas.filter( (x)=> x.tipo == 'Estudiante').length);
        $('#personal_admin_can').html(personas.filter( (x)=> x.tipo == 'Funcionario').length);
        $('#pensionados_can').html(personas.filter( (x)=> x.tipo == 'Pensionado').length);

        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
    },
        (error) => {
            alert(error.status);
        }
    );
}




var totalesChart = document.getElementById("totalChart").getContext("2d");
var gradienteColores = totalesChart.createLinearGradient(0, 0, 0, 600);

gradienteColores.addColorStop(0, "rgba(29.8%, 51.8%, 100%, 0.6)");
gradienteColores.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var totalesCh = new Chart(totalesChart, {
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


var estUniverChart = document.getElementById("estUniChart").getContext("2d");
var gradienteColores_estUni = estUniverChart.createLinearGradient(0, 0, 0, 600);

gradienteColores_estUni.addColorStop(0, "rgba(75%, 255%, 75%, 0.6)");
gradienteColores_estUni.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

estUniverChart.height = 600;
var estUniverChartVar = new Chart(estUniverChart, {
    type: "bar",
    data: {
        datasets: [
            {
                backgroundColor: gradienteColores_estUni,
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



var personAdminChart = document.getElementById("perAdminChart").getContext("2d");
var gradienteColores_personAdmin = personAdminChart.createLinearGradient(0, 0, 0, 600);

gradienteColores_personAdmin.addColorStop(0, "rgba(255%, 204%, 58%, 0.6)");
gradienteColores_personAdmin.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

personAdminChart.height = 600;
var personAdminChartVar = new Chart(personAdminChart, {
    type: "bar",
    data: {
        datasets: [
            {
                backgroundColor: gradienteColores_personAdmin,
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


var pensionadosChart = document.getElementById("pensionadosChart").getContext("2d");
var gradienteColores_pensionados = pensionadosChart.createLinearGradient(0, 0, 0, 600);

gradienteColores_pensionados.addColorStop(0, "rgba(255%, 204%, 58%, 0.6)");
gradienteColores_pensionados.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

pensionadosChart.height = 600;
var pensionadosChartVar = new Chart(pensionadosChart, {
    type: "bar",
    data: {
        datasets: [
            {
                backgroundColor: gradienteColores_pensionados,
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









const animateCSS = (element, animation) =>
    
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    let prefix = 'animate__';
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});


document.addEventListener("DOMContentLoaded", loaded);