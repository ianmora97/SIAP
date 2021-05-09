
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

function loaded(event){
  events(event);
}

function events(event){

}
function toogleMenu() {
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      //$('#sidebar-wrapper').css('position','relative');
      $("#wrapper").toggleClass("toggled");
      //$("#side-panel").css('margin-left','-12px');
      //$("#sidebar-wrapper").toggle("'slide', {direction: 'right' }, 1000");
      //$("#sidebar-wrapper").css({'transform': 'translate(-13rem, 0px)'});
      //$("#sidebar-wrapper").animate({left:'-200'},1000);
  });
}
$(function () {
  $('[data-toggle="popover"]').popover();
})

function revocarCasillero() {
  let bearer = 'Bearer '+g_token;
  $.ajax({
      type: "GET",
      url: "/admin/administrador/getTables",
      contentType: "appication/json",
      headers:{
          'Authorization':bearer
      }
    }).then((response) => {
        listTables(response);
    }, (error) => {
  });
}

function listTables(data) {
  let tables = filterByTable();
  let views = filterByView();

  tables.forEach(element => {
    showTableTree(element);
  });
  views.forEach(element => {
    showviewTree(element);
  });
}


document.addEventListener("DOMContentLoaded", loaded);
