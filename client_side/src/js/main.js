(function($){
  $(function(){

    //init side nav
    $('.button-collapse').sideNav({
      //TODO: update breakpoint for sidenav should be at small, not medium...
      edge: 'right',
      menuWidth: 350,
      closeOnClick: true
    });

    //init tabs
    $('ul.tabs').tabs({
      onShow: function(tab){
        if(tab.selector === "#all-listings")
          $("nav.secondary").hide()
        else if(tab.selector === "#current-listing")
          $("nav.secondary").show()
      }
    });

    //init selects
    $('select').material_select();

    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      min: true,   //today
      formatSubmit: 'mm/dd/yyyy',
      format: 'mmm d, yyyy',
      selectYears: 4 // Creates a dropdown of 15 years to control year
    });

    //init collapsible
    //onOpen(el)  QUESTION: element or event?
    //onClose(el)
    $('.collapsible').collapsible();

    //init scrolling animation
    $('.scrollspy').scrollSpy();

    //TODO: refactor pleeeeeeeease
    //TODO: -- calculate diff between avg % commission in Dallas and
    //         %commission on display, times by listing price
    //      -- throw out other fees?
    if(window.Chart) {
      var commissionCalculator = (function() {
        var listingPriceNode = $("#price")
        var buyPriceNode = $("#buyPrice")
        var tradCommissionNode = $("#tier0Commission")
        var flatFeeNode = $("#flatFee")
        var donutChart = document.getElementById("commissionDonutChart");
        var lineChart = document.getElementById("commissionLineChart")
        var regDonutChart = document.getElementById("regCommissionDonutChart");

        function calculatedCommission(listingPrice, tradCommission, flatFee){
          //TODO: validate all inputs?
          if(typeof flatFee !== 'number')
            flatFee = +flatFee;
          return ((tradCommission / 100.0) * listingPrice) + flatFee;
        }

        function defaultCommission(listingPrice){
          return 0.06 * listingPrice;
        }

        function getMiscFee(listingPrice){
          return 0.02 * listingPrice;
        }

        function getHomeownerProfit(listingPrice, buyPrice, realtorFee, miscFee){
          return (listingPrice - buyPrice) - realtorFee - miscFee
        }

        function genSalesPrices(listingPrice, minSalePrice){
          var minChartPrice = 1.0 * minSalePrice;  //inclusive of min chart price
          var maxChartPrice = 1.1 * listingPrice;  //won't quite reach max chart price
          var numPrices = 10.0;
          var stepSize = ( maxChartPrice - minChartPrice ) / numPrices;

          var price, i;
          var prices = new Array(numPrices);
          for(i = 0, price = minChartPrice; i < numPrices; price += stepSize, i+=1){
            prices[i] = price.toFixed(0)
          }
          return prices;
        }

        function genGrossProfits(salesPrices, buyPrice){
          return salesPrices.map(function(listPrice){
            return (listPrice - buyPrice).toFixed(0);
          })
        }

        function genRealtorFees(salesPrices, tradCommission, flatFee){
          return salesPrices.map(function(listPrice){
            return calculatedCommission(listPrice, tradCommission, flatFee);
          })
        }

        function genHomeownerProfits(salesPrices, buyPrice, realtorFee, miscFee){
          return salesPrices.map(function(listPrice){
            return getHomeownerProfit(listPrice, buyPrice, realtorFee, miscFee);
          })
        }

        var calculatedRealtorFee = calculatedCommission(listingPriceNode.val(),
                                                        tradCommissionNode.val(),
                                                        flatFeeNode.val())
        ,   defaultRealtorFee = defaultCommission(listingPriceNode.val())
        ,   calculatedMiscFee = getMiscFee(listingPriceNode.val())
        ,   calculatedNetProfit = getHomeownerProfit(listingPriceNode.val(),
                                                     buyPriceNode.val(),
                                                     calculatedRealtorFee,
                                                     calculatedMiscFee)
        ,   defaultNetProfit = getHomeownerProfit(listingPriceNode.val(),
                                                  buyPriceNode.val(),
                                                  defaultRealtorFee,
                                                  calculatedMiscFee)
        ,   displayedSalesPrices = genSalesPrices(listingPriceNode.val(),
                                                  0.9 * listingPriceNode.val())
        ,   displayedHomeownerProfits = genHomeownerProfits(displayedSalesPrices,
                                                            buyPriceNode.val(),
                                                            calculatedRealtorFee,
                                                            calculatedMiscFee)
        ,   displayedRealtorFees = genRealtorFees(displayedSalesPrices,
                                                   tradCommissionNode.val(),
                                                  flatFeeNode.val())
        ,   displayedGrossProfits = genGrossProfits(displayedSalesPrices,
                                                   buyPriceNode.val())

        $("#commission-form").change(function(){
          calculatedRealtorFee = calculatedCommission(listingPriceNode.val(),
                                                      tradCommissionNode.val(),
                                                      flatFeeNode.val())
          defaultRealtorFee = defaultCommission(listingPriceNode.val())
          calculatedMiscFee = getMiscFee(listingPriceNode.val());
          calculatedNetProfit = getHomeownerProfit(listingPriceNode.val(),
                                                   buyPriceNode.val(),
                                                   calculatedRealtorFee, calculatedMiscFee);
          defaultNetProfit = getHomeownerProfit(listingPriceNode.val(),
                                                buyPriceNode.val(),
                                                defaultRealtorFee, calculatedMiscFee);
          displayedSalesPrices = genSalesPrices(listingPriceNode.val(),
                                                0.9 * listingPriceNode.val())
          displayedHomeownerProfits = genHomeownerProfits(displayedSalesPrices,
                                                          buyPriceNode.val(),
                                                          calculatedRealtorFee,
                                                          calculatedMiscFee)
          displayedRealtorFees = genRealtorFees(displayedSalesPrices,
                                                tradCommissionNode.val(),
                                                flatFeeNode.val())
          displayedGrossProfits = genGrossProfits(displayedSalesPrices,
                                                  buyPriceNode.val())

          myCommissionLineChart.labels = displayedSalesPrices
          myCommissionLineChart.data.datasets[0].data = displayedRealtorFees
          myCommissionLineChart.data.datasets[1].data = displayedHomeownerProfits
          myCommissionLineChart.data.datasets[2].data = displayedGrossProfits
          myCommissionLineChart.update()

          regDonutChart.data.datasets[0].data = [defaultNetProfit.toFixed(2), defaultRealtorFee.toFixed(2), calculatedMiscFee.toFixed(2)];
          regDonutChart.update();

          myDonutChart.data.datasets[0].data = [calculatedNetProfit.toFixed(2), calculatedRealtorFee.toFixed(2), calculatedMiscFee.toFixed(2)];
          myDonutChart.update();
        })

        function donutChartData(inputData){
          //sanitize data
          var sanData = inputData.map(function(datum){
            return datum.toFixed(2);
          })

          return {
            labels: [
              "Your Profit",
              "Realtor Compensation",
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
                ctx = chart.chart.ctx,
                legendHeight = chart.legend.height

            ctx.restore();
            var fontSize = (height / 134).toFixed(0);
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "middle";

            var text;
            //TODO: better conversion for home profit
            if(chart.chart.canvas.id.indexOf("reg_commission_donut") !== -1)
              text = "$" + defaultNetProfit.toFixed(0).toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,");
            else if(chart.chart.canvas.id.indexOf("commission_donut") !== -1)
              text = "$" + calculatedNetProfit.toFixed(0).toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,");
            if(!text)
              return
            var textX = Math.round((width - ctx.measureText(text).width) / 2)
            //assumes 14px font size
            var textY = Math.round((height + legendHeight - (fontSize * 15)) / 2);

            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        });

        //QUESTION: make tooltips fixed to corner of chart?
        var myCommissionLineChart = new Chart(lineChart, {
          type: 'line',
          options: {
            scales: {
              yAxes: [{
                stacked: true
              }]
            },
            hover: {
              intersect: false,
              mode: 'index'
            },
            legend: {
              display: false
            },
            tooltips: {
              callbacks: {
                title: function(ttis){
                  return "Sale Price: $" + ttis[0].xLabel.replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,")
                },
                label: function(tti, data){
                  return data.datasets[tti.datasetIndex].label + ": $" + tti.yLabel.toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,")
                }
              },
              intersect: false,
              mode: 'index',
              position: 'nearest',
              xPadding: 15,
              yPadding: 12
            }
          },
          data: {
            labels: displayedSalesPrices,
            datasets: [{
              data: displayedRealtorFees,
              borderColor: "#36A2EB",
              //backgroundColor: "rgba(0, 0, 200, 0.5)",
              label: "Realtor Compensation"
            },{
              data: displayedHomeownerProfits,
              borderColor: "#FF6384",
              //backgroundColor: "#FF6384",
              label: "Your Profits"
            },{
              data: displayedGrossProfits,
              borderColor: "#FFCE56",
              //backgroundColor: "#FFCE56",
              label: "Total Profit from Sale"
            }]
          }
        })

        var myDonutChart = new Chart(donutChart, {
          type: 'doughnut',
          data: donutChartData([calculatedNetProfit, calculatedRealtorFee, calculatedMiscFee]),
          options: {
            animation:{
              animateScale: true
            },
            cutoutPercentage: 70,
            title: {
              text: "Homeowner Profit on Sale with Desired Commission*",
              position: "bottom",
              display: true
            },
            tooltips: {
              callbacks: {
                label: function(tti, data){
                  return data.labels[tti.index] + ": $" + data.datasets[tti.datasetIndex].data[tti.index].toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,")
                }
              },
              xPadding: 15,
              yPadding: 12
            }
          }
        });

        var regDonutChart = new Chart(regDonutChart, {
          type: 'doughnut',
          data: donutChartData([defaultNetProfit, defaultRealtorFee, calculatedMiscFee]),
          options: {
            animation:{
              animateScale: true
            },
            cutoutPercentage: 70,
            title: {
              text: "Homeowner Profit on Sale with Standard 6% Commission*",
              position: "bottom",
              display: true
            },
            tooltips: {
              callbacks: {
                label: function(tti, data){
                  return data.labels[tti.index] + ": $" + data.datasets[tti.datasetIndex].data[tti.index].toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,")
                }
              },
              xPadding: 15,
              yPadding: 12
            }
          }
        });
      })()
    }

  }); // end of document ready
})(jQuery); // end of jQuery name space
