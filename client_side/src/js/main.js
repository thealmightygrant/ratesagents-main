(function($){
  $(function(){

    //init side nav
    $('.button-collapse').sideNav();

    //init all popovers for now
    $('[data-toggle="popover"]').popover()

    //init selects
    $('select').material_select();

    //init scrolling animation
    $('.scrollspy').scrollSpy();

  }); // end of document ready
})(jQuery); // end of jQuery name space
