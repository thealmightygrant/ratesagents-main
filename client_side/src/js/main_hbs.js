import 'babel-polyfill';
import $ from 'jquery';
import 'materialize-css';

//NOTE: look into how to IIFE this shit
$.ready(function(){

  //init side nav
  $('.button-collapse').sideNav();

  //init all popovers for now
  $('[data-toggle="popover"]').popover()

  //init selects
  $('select').material_select();

  //init scrolling animation
  $('.scrollspy').scrollSpy();

})
