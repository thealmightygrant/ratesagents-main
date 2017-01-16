"use strict";

const HBars = require('handlebars')
,     merge = require('lodash.merge')

//TODO: look into html minifier hbar helper

module.exports = {
  getDateNumeral: getDateNumeral
  , ifEquals: ifEquals
  , capitalize: capitalize
  , str: str
  , or: or
  , and: and
  , switch: switcher
  , case: caser
  , default: defaulter

  , calcCommission: calcCommission
  , addCommas: addCommas
  , formatDate: formatDate
  , querystring: querystring
  , textField: textField
  , dateField: dateField
  , numberField: numberField

  , sliderBlock: sliderBlock
  , inlineRange: inlineRange
  , inlineCheckbox: inlineCheckbox

  , socialTags: socialTags

  , navLinks: navLinks
}

function getDateNumeral(){
  return '' + new Date().getTime();
}

function ifEquals(item1, item2, options){
  if(item1 === item2){
    return options.fn(this);
  }
  else {
    return options.inverse(this);
  }
}

function capitalize(str1){
  return str1.substring(0, 1).toUpperCase() + str1.substring(1);
}

function str(str1, str2){
  return str1 + str2;
}

function and(item1, item2){
  if(item1 && item2)
    return true;
  else
    return false;
}

function or(item1, item2){
  if(item1 || item2)
    return true;
  else
    return false;
}


//NOTE: implementation swiped from here: https://github.com/wycats/handlebars.js/issues/927
function switcher(value, options) {
  this._switch_value_ = value;
  this._switch_break_ = false;
  var html = options.fn(this);
  delete this._switch_break_;
  delete this._switch_value_;
  return html;
}

function caser() {
  var args = Array.prototype.slice.call(arguments);
  var options = args.pop();
  var caseValues = args;

  if (this._switch_break_ || caseValues.indexOf(this._switch_value_) === -1) {
    return '';
  }
  else {
    if (options.hash.break === true) {
      this._switch_break_ = true;
    }
    return options.fn(this);
  }
}

function defaulter(options) {
  if (!this._switch_break_) {
    return options.fn(this);
  }
}

function addCommas(value){
  if((typeof value !== "string") && (typeof value !== "number")){
    return "";
  }
  else {
    const commaThousands = value.toString().replace(/[0-9](?=(?:[0-9]{3})+(?![0-9]))/, "$&,");
    return new HBars.SafeString(commaThousands);
  }
}

function calcCommission(options){
  let price = options.hash.price;
  let priceChange = options.hash.priceChange;
  let commission = options.hash.commission;
  let flatFee = options.hash.flatFee;

  if(!flatFee || !commission || !price) {
    return "";
  }

  if((typeof flatFee !== "number") ||
     (typeof commission !== "number") ||
     (typeof price !== "number")){
    flatFee = parseFloat(flatFee)
    commission = parseFloat(commission)
    price = parseFloat(price)
    priceChange = parseFloat(priceChange);
  }

  if(isNaN(priceChange) || !priceChange){
    priceChange = 0;
  }

  if(isNaN(flatFee) ||
     isNaN(commission) ||
     isNaN(price)){
    return  "";
  }

  return ((price + (price * (priceChange / 100.0))) * (commission / 100.0) + flatFee).toFixed(0);
}

function formatDate(date){
  if(!date.getMonth)
    return "";
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateString = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
  return new HBars.SafeString(dateString);
}

function querystring() {
  let args = Array.from(arguments);
  const options = args[args.length - 1];

  let fillerType = options.hash.dashes ? "-" : "+";

  let qs = ""
  args.forEach((value) => {
    if(typeof value !== "string")
      return;

    const spaceToPlus = value.replace(/\s/g, fillerType).replace(/,/g, "");
    if(qs.length)
      qs += "+" + spaceToPlus;
    else
      qs += spaceToPlus;
  })
  return new HBars.SafeString(qs);
}

function validateInputClasses(inputClass, msg, defaultClass){
  if(msg){
    return (defaultClass || "") + " validate invalid"
  }
  else {
    return (defaultClass || "") + " validate"
  }
}

function dateField(options){
  var dateOptions = {
    input: {
      attrs: {
        type: "text"
        , name: options.hash.name
        , id: options.hash.name
        , class: validateInputClasses(options.hash.inputClass, options.hash.msg, "datepicker")
        , value: options.hash.data || options.hash.default
        , placeholder: options.hash.placeholder || "your date"
      }
    }
    , overwriteClass: (options.hash.overwriteClass === "true")
    , className: options.hash.className || ""
    , label: {
      attrs: {
        for: options.hash.name
        , "data-error": options.hash.msg
      }
      , first: (options.hash.labelFirst === "true")
      , value: options.hash.label || ""
    }
  }

  //QUESTION: remove merge to speed things up a bit?
  return inputField(dateOptions)
}

function textField(options){
  var textOptions = {
    input: {
      attrs: {
        type: "text"
        , name: options.hash.name
        , id: options.hash.name
        , placeholder: options.hash.placeholder
        , class: validateInputClasses(options.hash.inputClass, options.hash.msg)
        , value: options.hash.data || options.hash.default
      }
    }
    , overwriteClass: (options.hash.overwriteClass === "true")
    , className: options.hash.className || ""
    , label: {
      attrs: {
        for: options.hash.name
        , "data-error": options.hash.msg
      }
      , first: (options.hash.labelFirst === "true")
      , value: options.hash.label || ""
    }
  }

  //QUESTION: remove merge to speed things up a bit?
  return inputField(textOptions)
}

function numberField(options){
  var numberOptions = {
    input: {
      attrs: {
        type: "number"
        , min: options.hash.min || "0"
        , name: options.hash.name
        , id: options.hash.name
        , placeholder: options.hash.placeholder
        , class: validateInputClasses(options.hash.inputClass, options.hash.msg)
        , max: options.hash.max
        , step: options.hash.step || "100"
        , value: options.hash.data || options.hash.default
      }
    }
    , overwriteClass: (options.hash.overwriteClass === "true")
    , className: options.hash.className || ""
    , label: {
      attrs: {
        for: options.hash.name
        , "data-error": options.hash.msg
      }
      , first: (options.hash.labelFirst === "true")
      , value: options.hash.label || ""
    }
  }

  //QUESTION: remove merge to speed things up a bit?
  return inputField(numberOptions)
}

//NOTE: not very DRY, might be able to merge via
//      another intermediary fnc with other fields
function inlineCheckbox(options){
  var checkboxOptions = {
    input: {
      attrs: {
        type: "checkbox"
        , name: options.hash.name
        , id: options.hash.name
        , class: options.hash.inputClass
        , checked: options.hash.data
      }
    }
    , overwriteClass: (options.hash.overwriteClass === "true")
    , className: options.hash.className || ""
    , label: {
      attrs: {
        for: options.hash.name
        , "data-error": options.hash.msg
      }
      , first: (options.hash.labelFirst === "true")
      , value: options.hash.label || ""
    }
  }
  //QUESTION: remove merge to speed things up a bit?
  return inlineInput(checkboxOptions)
}

//NOTE: not very DRY, might be able to merge via
//      another intermediary fnc with numberField
function inlineRange(options){
  var rangeOptions = {
    input: {
      attrs: {
        type: "range"
        , min: options.hash.min || "0"
        , name: options.hash.name
        , id: options.hash.name
        , class: options.inputClass
        , max: options.hash.max || "10000000"
        , step: options.hash.step || "100"
        , value: options.hash.data || options.hash.default
      }
    }
    , overwriteClass: (options.hash.overwriteClass === "true")
    , className: options.hash.className || "range-field"
    , label: {
      attrs: {
        for: options.hash.name
        , "data-error": options.hash.msg
      }
      , first: (options.hash.labelFirst === "true")
      , value: options.hash.label || ""
    }
  }

  //QUESTION: remove merge to speed things up a bit?
  return inlineInput(rangeOptions)
}

function sliderBlock(options){
  var rangeOptions = {
    input: {
      attrs: {
        type: "hidden"
        , name: options.hash.name
        , max: options.hash.max || "1000000"
        , min: options.hash.min || "0"
        , class: options.inputClass
        , step: options.hash.step || "100"
        , id: options.hash.name
        , value: options.hash.data || options.hash.default
      }
    }
    , overwriteClass: (options.hash.overwriteClass === "true")
    , className: options.hash.className || "ra-slider"
    , label: { attrs: {} }
  }

  //QUESTION: remove merge to speed things up a bit?
  return inputField(rangeOptions)
}

function attrsTransformer(attrsObj){
  var strAttrs = ""
  Object.keys(attrsObj).forEach(function(attName){
    if(attrsObj[attName])
      strAttrs += " " + attName + '="' + attrsObj[attName] + '"'
  })
  return strAttrs;
}

function baseInput(options){
  var inputStrAttrs = attrsTransformer(options.input.attrs)
  ,   labelStrAttrs = attrsTransformer(options.label.attrs)
  ,   labelStr = '<label ' + labelStrAttrs + '>' + options.label.value + '</label>'
  ,   catClassName = options.overwriteClass ? "" : (options.baseClassName + ' ')

  var field = '<' + options.tagType + ' class="' + catClassName + options.className + '">' +
        ((labelStrAttrs && options.label.first) ? labelStr : "") +
        '<input ' + inputStrAttrs + '/>' +
        ((labelStrAttrs && !options.label.first) ? labelStr : "") +
        '</' + options.tagType + '>';
  return field;
}

function inputField(options){
  var fieldOptions = {
    tagType: "div",
    baseClassName: "input-field"
  }
  return new HBars.SafeString(baseInput(merge(options, fieldOptions)));
}


function inlineInput(options){
  var inlineOptions = {
    tagType: "p",
    baseClassName: "inline-input"
  }
  return new HBars.SafeString(baseInput(merge(options, inlineOptions)))
}

function socialTags(options) {
  var tags = options.hash.socialData ? options.hash.socialData : {};
  if(!tags.url) tags.url = "https://ratesandagents.com/" + tags.pageName;
  if(!tags.siteName) tags.siteName = "Rates and Agents";
  if(!tags.twitterSite) tags.twitterSite = "@ratesandagents";
  //if(!tags.fbAppId) tags.fbAppId = "";
  var socialTags = ''
  var tagMap = {
    url: "og:url"
    , twitterSite: "twitter:site"
    , fbAppId: "fb:app_id"
    , description: "og:description"
    , title: "og:title"
    , video: "og:video"
    , videoWidth: "og:video:width"
    , videoHeight: "og:video:height"
    , image: "og:image"
    , imageWidth: "og:image:width"
    , imageHeight: "og:image:height"
    , siteName: "og:site_name"
  };
  Object.keys(tags).forEach(function(k){
    socialTags = socialTags + (tagMap[k] ? '<meta property="' + tagMap[k] + '" name="' + tagMap[k] + '" content="' + tags[k] + '" />' : '');
  });
  return new HBars.SafeString(socialTags);
}

function sidenavBar(dataArr, options){
  var options = options ? options : {};
  return dataArr.reduce(function(prev, cur, ind, arr){
    var link = liLink(cur.href, cur.value, {anchorClassName: "indent"})
    if(prev.length === 0){
      return '<ul ' + (options.groupId ? 'id="' + options.groupId + '" ': '') + (options.groupClassName ? 'class="' + options.groupClassName + '" ': '') + '>' + link;
    }
    else if(ind === (arr.length - 1)){
      return prev + link + '</ul>'
    }
    else {
      return prev + link;
    }
  }, '')
}

function sidenavSubheader(title, content){
  return '<li><a class="subheader">' + title + '</a></li>' + content;
}

function liLink(href, value, options){
  if(!options) options = {};
  var anchorClassStr = options.anchorClassName ? ' class="' + options.anchorClassName + '"' : '';
  var listItemClassStr = options.liClassName ? ' class="' + options.liClassName + '"' : '';
  return '<li' + listItemClassStr + '><a href="' + href + '"' + anchorClassStr + '>' + value + '</a></li>';
}

function dropdownLink(dropdownName, href, value){
  return '<li><a class="dropdown-button" data-constrainwidth="false" ' + (href ? 'href="' + href + '" ' : '') + 'data-activates="' + dropdownName + '" data-hover="true" data-beloworigin="true">' + value + '</a></li>'
}

function tabLink(href, value, options){
  if(!options) options = {};
  options.liClassName = (typeof options.liClassName === 'string') ? options.liClassName + " tab" : "tab";
  return liLink(href, value, options)
}

function dropdownGroup(dataArr, options){
  var options = options ? options : {};
  return dataArr.reduce(function(prev, cur, ind, arr){
    var link = liLink(cur.href, cur.value, {anchorClassName: "indent"})
    if(prev.length === 0){
      return '<ul ' + (options.groupId ? 'id="' + options.groupId + '" ': '') + (options.groupClassName ? 'class="' + options.groupClassName + '" ': '') + '>' + link;
    }
    else if(ind === (arr.length - 1)){
      return prev + link + '</ul>'
    }
    else {
      return prev + link;
    }
  }, '')
}

function navLinks(options) {
  const navData = options.hash.navData || {}
  ,     tabData = options.hash.tabData || []
  ,     navType = options.hash.navType

  let navElements = ''
  ,   childElements = ''
  ,   navProcessor

  switch(navType){
  case 'main-nav':
    navProcessor = mainNavProcessor(navElements, childElements);
    navProcessor.addNavElements(navData);
    navElements = navElements + navProcessor.navElements() +
      navProcessor.childElements();
    break;
  case 'mobile-main-nav': {
    navProcessor = mobileTabProcessor(navElements, options)
    navProcessor.addNavTitle();
    tabData.forEach(navProcessor.fillTabNav)
    navProcessor.addBottomCTA(navData);
    navElements = navElements + navProcessor.navElements()
    break;
  }
  case 'tabs':
    navProcessor = tabProcessor(navElements, options);
    tabData.forEach(navProcessor.fillTabNav);
    navElements = navElements + navProcessor.navElements();
    break;
  }
  return new HBars.SafeString(navElements);
}

function mainNavProcessor(navElements, childElements){
  return {
    navElements: function(){
      return navElements;
    },
    childElements: function(){
      return childElements;
    },
    addNavElements: function(navData){
      Object.keys(navData).forEach(function(key){
        const curDatum = navData[key];
        if(curDatum.linkData && curDatum.linkData.length){
          navElements = navElements +
            dropdownLink(key + '-dropdown-link', curDatum.href, curDatum.value);
          childElements = childElements +
            dropdownGroup(curDatum.linkData, {
              groupId: (key + '-dropdown-link'),
              groupClassName: 'dropdown-content'
            })
        }
        else {
          let regularNavElement;
          if(curDatum.type){
            regularNavElement = liLink(curDatum.href, curDatum.value, {anchorClassName: curDatum.type});
          }
          else{
            regularNavElement = liLink(curDatum.href, curDatum.value);
          }
          navElements = navElements + regularNavElement;
        }
      })
    }
  }
}

function mobileTabProcessor(navElements){
  return {
    navElements: function(){
      return navElements;
    },
    addNavTitle: function(){
      navElements = navElements +
        '<li><a class="logo" href="/">Rates & Agents</a><a class="close" href="#!"><i class="material-icons">close</i></a></li>' +
        '<li><div class="divider"></div></li>';
    },
    addBottomCTA: function(navData){
      navElements = navElements +
        '<div class="bottom-cta">';
      Object.keys(navData).forEach(function(key){
        const curDatum = navData[key];
        navElements = navElements +
          liLink(curDatum.href, curDatum.value, {liClassName: 'bottom-link'})
      });
      navElements = navElements + '</div>';
    },
    fillTabNav: function(tab, index, tabData){
      if(tab.linkData && tab.linkData.length){
        navElements +=
          sidenavSubheader(tab.value, sidenavBar(tab.linkData))
      }
      else {
        navElements = navElements +
          liLink(tab.href, tab.value)
      }
      if(index < tabData.length)
        navElements = navElements + '<li><div class="divider"></div></li>'
    }
  }
}

function tabProcessor(navElements, options){
  return {
    navElements: function(){
      return navElements;
    },
    fillTabNav: function(tab, index){
      let tabOptions = {};

      if(options.hash.activeTab && (tab.href === ('#' + options.hash.activeTab))){
        tabOptions = {anchorClassName: "active"}
      }
      else if(!options.hash.activeTab && (index === 0)){
        tabOptions = {anchorClassName: "active"}
      }
      navElements = navElements +
        tabLink(tab.href, tab.value, tabOptions)
    }
  }
}
