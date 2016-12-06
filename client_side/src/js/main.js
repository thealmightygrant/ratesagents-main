(function($){
  $(function(){

    //init side nav
    $('.button-collapse').sideNav();

    $(document).ready(function(){
      $('ul.tabs').tabs();
    });

    //init selects
    $('select').material_select();

    //init collapsible
    $('.collapsible').collapsible();

    //init scrolling animation
    $('.scrollspy').scrollSpy();

  }); // end of document ready
})(jQuery); // end of jQuery name space
