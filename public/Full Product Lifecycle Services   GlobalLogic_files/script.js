function bindWaypoints(){
  $(this).waypoint('destroy');
  
  //$('.ui-page-active .has_bkg').each(function(index){
  $('.has_bkg').each(function(index){

    $(this).waypoint(function(event, direction) {
      
      //$('.sidenav li a').removeClass("active");
      if(direction=='down'){
        $("body").data('backstretch').show(index);
        
        //$('.sidenav li:nth-child('+index+') a').toggleClass("active");
      }
      else{
        $("body").data('backstretch').show(index-1);
      }
      
    },{offset:'50%',continuous:false,onlyOnScroll:false});
  });
  $.waypoints.settings.scrollThrottle = 500;
}
function set_backgrounds(){
  var $backstretch = $("body").data('backstretch');
  var bkgs = [];
  //$('.ui-page-active .has_bkg').each(function(){
  $('.has_bkg').each(function(){
    bkgs.push($(this).attr('data-background'));
  });
  if(bkgs.length !== 0){
    if(!!$backstretch){
      $backstretch.images = bkgs;
      $backstretch.show(0);
    }
    else{
      $.backstretch( bkgs , {fade: 500});
      $("body").data('backstretch').pause();
    }
  }
  else{
    if($backstretch){
      $backstretch.destroy();
    }
  }
  $('.backstretch').append('<div class="bkg-overlay"></div>'); 

}
$('document').ready(function(){
  $('.touch .main-nav .menu > .menu-item').click( function(){
    $(this).parent().addClass('expanded');
  });
  $('.touch .main-nav .menu-hover').click( function(){
    $(this).parent().removeClass('expanded');
  });
  $('.contact-button').click(function(){
    $(this).parent().toggleClass('expanded');
  });
});