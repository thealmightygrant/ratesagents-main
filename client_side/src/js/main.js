(function($){
  $(function(){

    //init side nav
    $('.button-collapse').sideNav();

    //init tabs
    $('ul.tabs').tabs();

    //init selects
    $('select').material_select();

    //init collapsible
    //onOpen(el)  QUESTION: element or event?
    //onClose(el)
    $('.collapsible').collapsible();

    //init scrolling animation
    $('.scrollspy').scrollSpy();

    //$('input[type="number"]').on("input", function(e){
    //  var curVal = $(e.currentTarget).val();
    //  $(e.currentTarget).val(curVal.toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,"))
    //})

    var raSlider = (function() {
      if(window.noUiSlider){
        var sliders = document.getElementsByClassName('ra-slider');
        for(var i = 0; i < sliders.length; i++){
          console.log("creating slider i: ", i)
          var inputChild = $(sliders[i]).children("input")
          var sliderOpts = {
            step: +inputChild.attr("step"),
            start: +inputChild.attr("value"),
            //connect: true,
            range: {
              min: +inputChild.attr("min"),
              max: +inputChild.attr("max")
            },
            //pips: { // Show a scale with the slider
            //  mode: 'steps',
            //  stepped: true,
            //  density: 4
            //},
            format: window.wNumb({
              decimals: 0
            })
          }
          console.log(sliderOpts)
          window.noUiSlider.create(sliders[i], sliderOpts);

          sliders[i].noUiSlider.on('update', (function() {
            var thisInput = inputChild.get()[0];
            //one should be gross profit, the other min price
            var grossProfit = $("#gross_profit");
            console.log(thisInput)
            return function(values, handle){
              console.log(thisInput)
              console.log("updating value: ", values[handle])
	            thisInput.value = values[handle];
              grossProfit.html('$' + values[handle].replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,"))
              console.log("new val: ", thisInput.value)
            };
          })());
        }
      }
    })()

    var commissionCalculator = (function() {
      var grossProfit = $("#gross_profit");
      var netProfit = $("#net_profit");
      var commissions = $(".commission_type")
      var priceInput = $("#listing_price")

      if(!priceInput.length || !commissions.length)
        return

    })()

  }); // end of document ready
})(jQuery); // end of jQuery name space
