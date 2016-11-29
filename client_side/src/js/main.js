(function($){
  $(function(){

    //init side nav
    $('.button-collapse').sideNav();

    //init all popovers
    //$('[data-toggle="popover"]').popover()

    $(document).ready(function(){
      $('ul.tabs').tabs();
    });

    //init selects
    $('select').material_select();

    //init scrolling animation
    $('.scrollspy').scrollSpy();

  }); // end of document ready
})(jQuery); // end of jQuery name space
