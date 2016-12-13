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



    var commissionCalculator = (function() {
      var listingPrice = $("#listing_price")
      var buyPrice = $("#buy_price")
      var tradCommission = $("#trad_commission")
      var flatFee = $("#flat_fee")
      var donutChart = document.getElementById("commission_donut_chart");
      var lineChart = document.getElementById("commission_line_chart")
      var regDonutChart = document.getElementById("reg_commission_donut_chart");

      function calculatedCommission(){
        //TODO: validate?
        return ((tradCommission.val() / 100.0) * listingPrice.val()) - flatFee.val();
      }

      function defaultCommission(){
        return 0.06 * listingPrice.val();
      }

      function getMiscFee(){
        return 0.02 * listingPrice.val();
      }

      function getHomeownerProfit(realtorFee, miscFee){
        return (listingPrice.val() - buyPrice.val()) - realtorFee - miscFee
      }

      function tieredCommission(){
        //switch statement?
      }

      var calculatedRealtorFee = calculatedCommission()
      ,   defaultRealtorFee = defaultCommission()
      ,   miscFee = getMiscFee()
      ,   calculatedNetProfit = getHomeownerProfit(calculatedRealtorFee, miscFee)
      ,   defaultNetProfit = getHomeownerProfit(defaultRealtorFee, miscFee)

      $("#commission-form").change(function(){
        calculatedRealtorFee = calculatedCommission();
        defaultRealtorFee = defaultCommission();
        miscFee = getMiscFee();
        calculatedNetProfit = getHomeownerProfit(calculatedRealtorFee, miscFee);
        defaultNetProfit = getHomeownerProfit(defaultRealtorFee, miscFee);

        regDonutChart.data.datasets[0].data = [defaultNetProfit.toFixed(2), defaultRealtorFee.toFixed(2), miscFee.toFixed(2)];
        regDonutChart.update();

        myDonutChart.data.datasets[0].data = [calculatedNetProfit.toFixed(2), calculatedRealtorFee.toFixed(2), miscFee.toFixed(2)];
        myDonutChart.update();
      })

      function donutChartData(inputData){
        //sanitize data
        var sanData = inputData.map(function(datum){
          return datum.toFixed(2);
        })

        return {
          labels: [
            "Homeowner",
            "Realtor",
            "Other Fees"
          ],
          datasets: [{
            data: sanData,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ]
          }]
        };
      }

      Chart.pluginService.register({
        beforeDraw: function(chart) {
          var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;

          ctx.restore();
          var fontSize = (height / 134).toFixed(0);
          ctx.font = fontSize + "em sans-serif";
          console.log("font size: ", fontSize);
          ctx.textBaseline = "middle";

          var text;
          //TODO: better conversion for home profit
          if(chart.chart.canvas.id.indexOf("reg_commission_donut") !== -1)
            text = "$" + getHomeownerProfit(defaultRealtorFee, miscFee).toFixed(0).toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,");
          else if(chart.chart.canvas.id.indexOf("commission_donut") !== -1)
            text = "$" + getHomeownerProfit(calculatedRealtorFee, miscFee).toFixed(0).toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,");
          if(!text)
            return
          var textX = Math.round((width - ctx.measureText(text).width) / 2)
          //assumes 14px font size
          var textY = Math.round((height + (fontSize * 12) / 2) / 2);

          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      });

      var myCommissionLineChart = new Chart(lineChart, {
        type: 'line',
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [{
            data: [65, 59, 80, 81, 56, 55, 40]
          }]
        }
      })

      var myDonutChart = new Chart(donutChart, {
        type: 'doughnut',
        data: donutChartData([calculatedNetProfit, calculatedRealtorFee, miscFee]),
        options: {
          animation:{
            animateScale: true
          },
          cutoutPercentage: 70,
          title: {
            text: "Profit on Sale with Desired Commission*",
            position: "bottom",
            display: true
          }
        }
      });

      var regDonutChart = new Chart(regDonutChart, {
        type: 'doughnut',
        data: donutChartData([defaultNetProfit, defaultRealtorFee, miscFee]),
        options: {
          animation:{
            animateScale: true
          },
          cutoutPercentage: 70,
          title: {
            text: "Profit on Sale with 6% Commission*",
            position: "bottom",
            display: true
          }
        }
      });
    })()

  }); // end of document ready
})(jQuery); // end of jQuery name space
