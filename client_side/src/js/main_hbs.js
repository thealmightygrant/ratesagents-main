import 'babel-polyfill';
import $ from 'jquery';
import 'materialize-css';

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
