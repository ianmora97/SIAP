  $( document ).ready(function() {
    $('#calendar').fullCalendar({
        locale: 'es',
        themeSystem: 'bootstrap4',
        defaultView: 'month',
        height: '400px',
        header: {
            left: 'title'
        },
        events: [
            {
                title: 'Cumpleaños de Ian',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu pellentesque nibh. In nisl nulla, convallis ac nulla eget, pellentesque pellentesque magna.',
                start: '2020-10-03',
                end: '2020-10-03',
                className: 'fc-bg-default',
                icon : "circle",
                allDay:'true'
            }
        ],
        eventRender: function(event, element) {
            if(event.icon){
                element.find(".fc-title").prepend("<i class='fa fa-"+event.icon+"'></i>");
            }
        },
        dayClick: function() {
            $('#modal-view-event-add').modal();
        },
        eventClick: function(event, jsEvent, view) {
                $('.event-icon').html("<i class='fa fa-"+event.icon+"'></i>");
                $('.event-title').html(event.title);
                $('.event-body').html(event.description);
                $('.eventUrl').attr('href',event.url);
                $('#modal-view-event').modal();
        },
    });
});
