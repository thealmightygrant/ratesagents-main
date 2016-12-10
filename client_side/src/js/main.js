(function($){
  $(function(){

    //init side nav
    $('.button-collapse').sideNav();

    //init tabs
    $('ul.tabs').tabs();

    //init selects
    $('select').material_select();

    //init collapsible
    $('.collapsible').collapsible();

    //init scrolling animation
    $('.scrollspy').scrollSpy();

    //$('input[type="number"]').on("input", function(e){
    //  var curVal = $(e.currentTarget).val();
    //  $(e.currentTarget).val(curVal.toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,"))
    //})

    var commissionCalculator = (function() {
      var grossProfit = $("#gross_profit");
      var netProfit = $("#net_profit");
      var commissions = $(".commission_type")
      var priceInput = $("#listing_price")

      //priceInput.on("change", function(e){
      //  grossProfit.html(e.val())
      //})

    })()

  }); // end of document ready
})(jQuery); // end of jQuery name space
