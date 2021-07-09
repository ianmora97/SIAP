  $( document ).ready(function() {
    $('#calendar').fullCalendar(
        {
        locale: 'es',
        themeSystem: 'bootstrap4',
        defaultView: 'agendaWeek', //agendaWeek, listWeek, month, dayGridWeek, timeGridDay
        height: 650,
        events: [
            
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
