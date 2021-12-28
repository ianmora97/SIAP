var diasLabelsData = [];
var reporteHoraDiaCh;
var reportesHoraDiaChart = document.getElementById("reportesHoraDiaChart").getContext("2d");

var azulGradiente = reportesHoraDiaChart.createLinearGradient(0, 0, 0, 600); //azul
azulGradiente.addColorStop(0, "rgba(29.8%, 51.8%, 100%, 0.8)"); //007bff
azulGradiente.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var rojoGradiente = reportesHoraDiaChart.createLinearGradient(0, 0, 0, 600); //rojo
rojoGradiente.addColorStop(0, "rgba(184%, 22%, 22%, 0.8)"); //B81616
rojoGradiente.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var verdeGradiente = reportesHoraDiaChart.createLinearGradient(0, 0, 0, 600); //verde
verdeGradiente.addColorStop(0, "rgba(5%, 212%, 53%, 0.8)"); //05d435
verdeGradiente.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var naranjaGradiente = reportesHoraDiaChart.createLinearGradient(0, 0, 0, 600); //naranja
naranjaGradiente.addColorStop(0, "rgb(253%, 126%, 20%)"); //fd7e14
naranjaGradiente.addColorStop(1, "rgba(253%, 126%, 20%, 0.4)");

var moradoGradiente = reportesHoraDiaChart.createLinearGradient(0, 0, 0, 600); //morado
moradoGradiente.addColorStop(0, "rgba(102%, 16%, 242%, 1)"); //6610f2
moradoGradiente.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var altInstagram = reportesHoraDiaChart.createLinearGradient(0, 0, 0, 1000); //morado
altInstagram.addColorStop(0, "rgba(98%,69%,5%,1)"); //6610f2 rgba(131,58,180,1), 
altInstagram.addColorStop(1, "rgba(100%, 100%, 100% ,0.5)"); //rgba(252,176,69,1)



var reportesChart = document.getElementById("reportesChart").getContext("2d");
var reportesGradiente = reportesChart.createLinearGradient(0, 0, 0, 600);

reportesGradiente.addColorStop(0, "rgba(29.8%, 51.8%, 100%, 0.8)");
reportesGradiente.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var reporteCh = new Chart(reportesChart, {
    type: "radar",
    data: {
        datasets: [
            {
                backgroundColor: reportesGradiente,
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
        animation: {},
        tooltips: {
            mode: "nearest",
        },
        responsive: true,
        maintainAspectRatio: false,
    },
});

var reportesHoraChart = document.getElementById("reportesHoraChart").getContext("2d");
var gradienteHoraColores = reportesHoraChart.createLinearGradient(0, 0, 0, 600);

gradienteHoraColores.addColorStop(0, "rgba(184%, 22%, 22%, 0.8)");
gradienteHoraColores.addColorStop(1, "rgba(100%, 100%, 100%, 0.4)");

var reporteHoraCh = new Chart(reportesHoraChart, {
    type: "bar",
    data: {
        datasets: [
            {
                backgroundColor: gradienteHoraColores,
                borderColor: '#B81616',
                borderWidth: 2,
            },
        ],
    },
    options: {
        legend: {
            display: false
        },
        scales:{
            yAxes:[{
                min: 0,
                ticks: {
                    stepSize: 1,
                }
            }]
        },
        showLines: false,
        tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
        },
        animation: {},
        tooltips: {
            mode: "nearest",
        },
        responsive: true,
        maintainAspectRatio: false,
    },
    
});

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
                backgroundColor: altInstagram,
                borderColor: '#fd7e14',
                borderWidth: 2,
            },
        ],
    },
    options: {
        legend: {
            display: false
        },
        scales:{
            yAxes:[{
                min: 0,
                ticks: {
                    stepSize: 1,
                }
            }]
        },
        tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
        },
        showLines: false, // disable for all datasets
        // scales: {
        //     xAxes: [
        //         {
        //             gridLines: {
        //                 drawBorder: true,
        //                 display: false,
        //             },
        //         },
        //     ],
        //     yAxes: [
        //         {
        //             ticks: {
        //                 suggestedMin: 0,
        //                 beginAtZero: true   // minimum value will be 0.
        //             },
        //             gridLines: {
        //                 drawBorder: true,
        //                 display: false,
        //             },
        //         },
        //     ],
        // },
        animation: {},
        tooltips: {
            mode: "nearest",
        },
        responsive: true,
        maintainAspectRatio: false,
    },
});


function loaded(event){
    loadFromDb();
    cambiarDiasHorasDropdown();
}

  $(function () {
    $('[data-toggle="popover"]').popover();
  })
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
var g_MapMatriculados = new Map();
var g_VecMatriculados = [];
var g_gruposExistentes = {};
function loadFromDb() {
    let ajaxTime = new Date().getTime();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/reportes/uso/getMatriculadosPorGrupo",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        let totalTime = new Date().getTime() - ajaxTime;
        let a = Math.ceil(totalTime / 1000);
        let t = a == 1 ? a + ' segundo' : a + ' segundos';
        $('#infoTiming').text(t);
        $('#matriculas_stats').html(response.length);
        g_VecMatriculados = response;
        cargarMatriculados(response);
        cargarHorayDia(response);
    }, (error) => {

    });
    $.ajax({
        type: "GET",
        url: "/admin/estudiante/listaEstudiantes",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        $('#estudiantes_stats').html(response.length);
    }, (error) => {

    });
    $.ajax({
        type: "GET",
        url: "/admin/ajax/stats/getTalleres",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        $('#talleres_stats').html(response.length);
        let grupos = response.grupos;
        g_gruposExistentes = grupos;
        for (var [key, value] of Object.entries(grupos)) {
            addData(tallerCh,key, value);
        }
        $('#talleres_stats').html(Object.entries(g_gruposExistentes).length);
        closeProgressBarLoader();
    },(error) => {
    }); 
}

function cargarMatriculados(data) {
    let cnt_lunes = 0;
    let cnt_martes = 0;
    let cnt_miercoles = 0;
    let cnt_jueves = 0;
    let cnt_viernes = 0;
    let cnt_sabado = 0;
    let cnt_domingo = 0;
    data.forEach(e=>{
        if(e.dia == 'LUNES') cnt_lunes++;
        if(e.dia == 'MARTES') cnt_martes++;
        if(e.dia == 'MIERCOLES') cnt_miercoles++;
        if(e.dia == 'JUEVES') cnt_jueves++;
        if(e.dia == 'VIERNES') cnt_viernes++;
        if(e.dia == 'SABADO') cnt_sabado++;
        if(e.dia == 'DOMINGO') cnt_domingo++;
    })
    addData(reporteCh,'Lunes',cnt_lunes);
    addData(reporteCh,'Martes',cnt_martes);
    addData(reporteCh,'Miercoles',cnt_miercoles);
    addData(reporteCh,'Jueves',cnt_jueves);
    addData(reporteCh,'Viernes',cnt_viernes);
    addData(reporteCh,'Sabado',cnt_sabado);
    addData(reporteCh,'Domingo',cnt_domingo);

    let cnt_5 = data.filter(e => convertTime12to24(e.hora) == 5).length;
    let cnt_6 = data.filter(e => convertTime12to24(e.hora) == 6).length;
    let cnt_7 = data.filter(e => convertTime12to24(e.hora) == 7).length;
    let cnt_8 = data.filter(e => convertTime12to24(e.hora) == 8).length;
    let cnt_9 = data.filter(e => convertTime12to24(e.hora) == 9).length;
    let cnt_10 = data.filter(e => convertTime12to24(e.hora) == 10).length;
    let cnt_11 = data.filter(e => convertTime12to24(e.hora) == 11).length;
    let cnt_12 = data.filter(e => convertTime12to24(e.hora) == 12).length;
    let cnt_13 = data.filter(e => convertTime12to24(e.hora) == 13).length;
    let cnt_14 = data.filter(e => convertTime12to24(e.hora) == 14).length;
    let cnt_15 = data.filter(e => convertTime12to24(e.hora) == 15).length;
    let cnt_16 = data.filter(e => convertTime12to24(e.hora) == 16).length;
    let cnt_17 = data.filter(e => convertTime12to24(e.hora) == 17).length;
    let cnt_18 = data.filter(e => convertTime12to24(e.hora) == 18).length;
    let cnt_19 = data.filter(e => convertTime12to24(e.hora) == 19).length;
    let cnt_20 = data.filter(e => convertTime12to24(e.hora) == 20).length;
    let cnt_21 = data.filter(e => convertTime12to24(e.hora) == 21).length;

    addData(reporteHoraCh,'5 am',cnt_5);
    addData(reporteHoraCh,'6 am',cnt_6);
    addData(reporteHoraCh,'7 am',cnt_7);
    addData(reporteHoraCh,'8 am',cnt_8);
    addData(reporteHoraCh,'9 am',cnt_9);
    addData(reporteHoraCh,'10 am',cnt_10);
    addData(reporteHoraCh,'11 am',cnt_11);
    addData(reporteHoraCh,'12 am',cnt_12);
    addData(reporteHoraCh,'1 pm',cnt_13);
    addData(reporteHoraCh,'2 pm',cnt_14);
    addData(reporteHoraCh,'3 pm',cnt_15);
    addData(reporteHoraCh,'4 pm',cnt_16);
    addData(reporteHoraCh,'5 pm',cnt_17);
    addData(reporteHoraCh,'6 pm',cnt_18);
    addData(reporteHoraCh,'7 pm',cnt_19);
    addData(reporteHoraCh,'8 pm',cnt_20);
    addData(reporteHoraCh,'9 pm',cnt_21);
}
const convertTime12to24 = (time12h) => {
    const [time, modifier] = [time12h.substr(0,time12h.indexOf(':')+3),time12h.substr(time12h.indexOf(':')+3,2)];
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'pm') hours = parseInt(hours, 10) + 12;
    return hours;
}
function cambiarDiasHorasDropdown() {
    
    $('#diasReportes').on('change', function(e) {
        let val = $('#diasReportes').val();
        switch (val) {
            case 'Lunes':
                addDataAlt(reporteHoraDiaCh,diasLabelsData[0].labels, diasLabelsData[0].data,'Lunes',verdeGradiente,'#05d435')
                break;
            case 'Martes':
                addDataAlt(reporteHoraDiaCh,diasLabelsData[1].labels, diasLabelsData[1].data,'Martes',rojoGradiente,'#B81616')
                break;
            case 'Miercoles':
                addDataAlt(reporteHoraDiaCh,diasLabelsData[2].labels, diasLabelsData[2].data,'Miercoles',azulGradiente,'#007bff')
                break;
            case 'Jueves':
                addDataAlt(reporteHoraDiaCh,diasLabelsData[3].labels, diasLabelsData[3].data,'Jueves',naranjaGradiente,'#fd7e14')
                break;
            case 'Viernes':
                addDataAlt(reporteHoraDiaCh,diasLabelsData[4].labels, diasLabelsData[4].data,'Viernes',moradoGradiente,'#6610f2')
                break;
            case 'Sabado':
                addDataAlt(reporteHoraDiaCh,diasLabelsData[5].labels, diasLabelsData[5].data,'Sabado',rojoGradiente,'#B81616')
                break;
            case 'Domingo':
                addDataAlt(reporteHoraDiaCh,diasLabelsData[6].labels, diasLabelsData[6].data,'Domingo',naranjaGradiente,'#fd7e14')
                break;
             
        }
    });
}
function cargarHorayDia(data) {
    // ! ------------------------ lunes -------------------------
    let lunes = []; //todas las horas de los lunes 
    data.filter(e => e.dia == 'LUNES').forEach(e =>{
        lunes.push(convertTime12to24(e.hora));
    })
    let i_lunes = new Array(24); // contar los cantidad de horas al dia
    i_lunes.fill(0);
    for (let i = 0; i < i_lunes.length; i++) {
        for (let j = 0; j < lunes.length; j++) {
            if (i == convertTime12to24(lunes[j])) {
                i_lunes[i] = i_lunes[i] + 1;
            }
        }
    }
    
    let set_lunes = new Set(lunes); //un set para eliminar los repetidos del vector original
    let label_lunes = []; // crear el vector resultante

    console.log('set_lunes',set_lunes);


    [...set_lunes].forEach(e => {
        label_lunes.push(i_lunes[e]);
    })

    let labels_lunes = [];
    let todos_lunes = [...set_lunes];
    todos_lunes.sort(function(a, b) {
        return a - b;
    });
    todos_lunes.forEach(e => {
        labels_lunes.push(`${e} ${e > 11 ?'pm':'am'}`);
    })
    console.log({labels: labels_lunes, data: label_lunes})
    diasLabelsData.push({labels: labels_lunes, data: label_lunes})
    // ! ------------------------ martes -------------------------
    let martes = [];
    data.filter(e => e.dia == 'MARTES').forEach(e =>{
        martes.push(convertTime12to24(e.hora));
    })
    let i_martes = new Array(24); // contar los cantidad de horas al dia
    i_martes.fill(0);
    for (let i = 0; i < i_martes.length; i++) {
        for (let j = 0; j < martes.length; j++) {
            if (i == convertTime12to24(martes[j])) {
            i_martes[i] = i_martes[i] + 1;
            }
        }
    }
    let set_martes = new Set(martes); //un set para eliminar los repetidos del vector original
    let label_martes = []; // crear el vector resultante
    [...set_martes].forEach(e => {
        label_martes.push(i_martes[e]);
    })

    let labels_martes = [];
    let todos_martes = [...set_martes];
    todos_martes.sort(function(a, b) {
        return a - b;
    });
    todos_martes.forEach(e => {
        labels_martes.push(`${e} ${e > 11 ?'pm':'am'}`);
    })
    diasLabelsData.push({labels: labels_martes, data: label_martes})
    // ! ------------------------ miercoles -------------------------
    let miercoles = [];
    data.filter(e => e.dia == 'MIERCOLES').forEach(e =>{
        miercoles.push(convertTime12to24(e.hora));
    })
    let i_miercoles = new Array(24); // contar los cantidad de horas al dia
    i_miercoles.fill(0);
    for (let i = 0; i < i_miercoles.length; i++) {
        for (let j = 0; j < miercoles.length; j++) {
            if (i == convertTime12to24(miercoles[j])) {
            i_miercoles[i] = i_miercoles[i] + 1;
            }
        }
    }
    let set_miercoles = new Set(miercoles); //un set para eliminar los repetidos del vector original
    let label_miercoles = []; // crear el vector resultante
    [...set_miercoles].forEach(e => {
        label_miercoles.push(i_miercoles[e]);
    })

    let labels_miercoles = [];
    let todos_miercoles = [...set_miercoles];
    todos_miercoles.sort(function(a, b) {
        return a - b;
    });
    todos_miercoles.forEach(e => {
        labels_miercoles.push(`${e} ${e > 11 ?'pm':'am'}`);
    })
    diasLabelsData.push({labels: labels_miercoles, data: label_miercoles})

    // ! ------------------------ jueves -------------------------
    let jueves = [];
    data.filter(e => e.dia == 'JUEVES').forEach(e =>{
        jueves.push(convertTime12to24(e.hora));
    })
    let i_jueves = new Array(24); // contar los cantidad de horas al dia
    i_jueves.fill(0);
    for (let i = 0; i < i_jueves.length; i++) {
        for (let j = 0; j < jueves.length; j++) {
            if (i == convertTime12to24(jueves[j])) {
            i_jueves[i] = i_jueves[i] + 1;
            }
        }
    }
    let set_jueves = new Set(jueves); //un set para eliminar los repetidos del vector original
    let label_jueves = []; // crear el vector resultante
    [...set_jueves].forEach(e => {
        label_jueves.push(i_jueves[e]);
    })

    let labels_jueves = [];
    let todos_jueves = [...set_jueves];
    todos_jueves.sort(function(a, b) {
        return a - b;
    });
    todos_jueves.forEach(e => {
        labels_jueves.push(`${e} ${e > 11 ?'pm':'am'}`);
    })
    diasLabelsData.push({labels: labels_jueves, data: label_jueves})
    // ! ------------------------ viernes -------------------------
    let viernes = [];
    data.filter(e => e.dia == 'VIERNES').forEach(e =>{
        viernes.push(convertTime12to24(e.hora));
    })
    let i_viernes = new Array(24); // contar los cantidad de horas al dia
    i_viernes.fill(0);
    for (let i = 0; i < i_viernes.length; i++) {
        for (let j = 0; j < viernes.length; j++) {
            if (i == convertTime12to24(viernes[j])) {
            i_viernes[i] = i_viernes[i] + 1;
            }
        }
    }
    let set_viernes = new Set(viernes); //un set para eliminar los repetidos del vector original
    let label_viernes = []; // crear el vector resultante
    [...set_viernes].forEach(e => {
        label_viernes.push(i_viernes[e]);
    })

    let labels_viernes = [];
    let todos_viernes = [...set_viernes];
    todos_viernes.sort(function(a, b) {
        return a - b;
    });
    todos_viernes.forEach(e => {
        labels_viernes.push(`${e} ${e > 11 ?'pm':'am'}`);
    })
    diasLabelsData.push({labels: labels_viernes, data: label_viernes})
    // ! ------------------------ sabado -------------------------
    let sabado = [];
    data.filter(e => e.dia == 'SABADO').forEach(e =>{
        sabado.push(convertTime12to24(e.hora));
    })
    let i_sabado = new Array(24); // contar los cantidad de horas al dia
    i_sabado.fill(0);
    for (let i = 0; i < i_sabado.length; i++) {
        for (let j = 0; j < sabado.length; j++) {
            if (i == convertTime12to24(sabado[j])) {
            i_sabado[i] = i_sabado[i] + 1;
            }
        }
    }
    let set_sabado = new Set(sabado); //un set para eliminar los repetidos del vector original
    let label_sabado = []; // crear el vector resultante
    [...set_sabado].forEach(e => {
        label_sabado.push(i_sabado[e]);
    })

    let labels_sabado = [];
    let todos_sabado = [...set_sabado];
    todos_sabado.sort(function(a, b) {
        return a - b;
    });
    todos_sabado.forEach(e => {
        labels_sabado.push(`${e} ${e > 11 ?'pm':'am'}`);
    })
    diasLabelsData.push({labels: labels_sabado, data: label_sabado})
    // ! ------------------------ domingo -------------------------
    let domingo = [];
    data.filter(e => e.dia == 'DOMINGO').forEach(e =>{
        domingo.push(convertTime12to24(e.hora));
    })
    let i_domingo = new Array(24); // contar los cantidad de horas al dia
    i_domingo.fill(0);
    for (let i = 0; i < i_domingo.length; i++) {
        for (let j = 0; j < domingo.length; j++) {
            if (i == convertTime12to24(domingo[j])) {
            i_domingo[i] = i_domingo[i] + 1;
            }
        }
    }
    let set_domingo = new Set(domingo); //un set para eliminar los repetidos del vector original
    let label_domingo = []; // crear el vector resultante
    [...set_domingo].forEach(e => {
        label_domingo.push(i_domingo[e]);
    })

    let labels_domingo = [];
    let todos_domingo = [...set_domingo];
    todos_domingo.sort(function(a, b) {
        return a - b;
    });
    todos_domingo.forEach(e => {
        labels_domingo.push(`${e} ${e > 11 ?'pm':'am'}`);
    })
    diasLabelsData.push({labels: labels_domingo, data: label_domingo})

    // ! ------------------------ gradientes -------------------------

    reporteHoraDiaCh = new Chart(reportesHoraDiaChart, {
        type: 'line',
        data: {
            labels: labels_lunes,
            datasets: [{
                label: "Lunes",
                borderColor: "#05d435",
                backgroundColor: verdeGradiente,
                data: label_lunes,
                fill: true
            }
        ]},
        options: {
            legend: { display: true },
            scales: {
                xAxes: [{ 
                    gridLines: { 
                        drawBorder: false
                    },
                }],
                yAxes: [{
                    ticks: { suggestedMin: 0, suggestedMax: 8, beginAtZero: true, stepSize: 1 }, gridLines: {drawBorder: false,},},],
            },
            tooltips: {
                callbacks: {
                   label: function(tooltipItem) {
                          return tooltipItem.yLabel;
                   }
                }
            },
            tooltips: {mode: "nearest",},
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

function addDataAlt(chart, label, data, nombre, background, border) {
    chart.data.labels = label;
    chart.data.datasets[0].label = nombre;
    chart.data.datasets[0].backgroundColor = background;
    chart.data.datasets[0].borderColor = border;
    chart.data.datasets[0].data = data;
    chart.update();
}
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
function updateChart(chart,data) {
    chart.data.datasets[0].data = data;
    chart.update();
}

document.addEventListener("DOMContentLoaded", loaded);