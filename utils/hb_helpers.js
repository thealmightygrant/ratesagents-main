var HBars = require('handlebars')
,   merge = require('lodash.merge')

module.exports = {
  getDateNumeral: getDateNumeral
  , ifEquals: ifEquals
  , str: str  //Where the fuck is this used?? and why does it exist?

  , numberField: numberField

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

function str(str1, str2){
  return str1 + str2;
}

function numberField(options){
  var numberOptions = {
    input: {
      attrs: {
        type: "number"
        , min: options.hash.min || "0"
        , name: options.hash.name
        , id: options.hash.name
        , max: options.hash.max
        , step: options.hash.step || "100"
        , value: options.hash.data || options.hash.default
      }
    }
    , className: options.hash.className || ""
    , label: {
      attrs: {
        for: options.hash.name
        , "data-error": options.hash.msg
      }
      , value: options.hash.label || ""
    }
  }

  //QUESTION: remove merge to speed things up a bit?
  return inputField(merge(options, numberOptions))
}

//NOTE: not very DRY, might be able to merge via
//      another intermediary fnc with numberField
function inlineCheckbox(options){
  var checkboxOptions = {
    input: {
      attrs: {
        type: "checkbox"
        , name: options.hash.name
        , id: options.hash.name
        , checked: options.hash.data
      }
    }
    , className: options.hash.className || ""
    , label: {
      attrs: {
        for: options.hash.name
        , "data-error": options.hash.msg
      }
      , value: options.hash.label || ""
    }
  }

  console.log(checkboxOptions)

  //QUESTION: remove merge to speed things up a bit?
  return inlineInput(merge(options, checkboxOptions))
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
        , max: options.hash.max || "10000000"
        , step: options.hash.step || "100"
        , value: options.hash.data || options.hash.default
      }
    }
    , className: options.hash.className || "range-field"
    , label: {
      attrs: {
        for: options.hash.name
        , "data-error": options.hash.msg
      }
      , value: options.hash.label || ""
    }
  }

  //QUESTION: remove merge to speed things up a bit?
  return inlineInput(merge(options, rangeOptions))
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
  ,   field = '<' + options.tagType + ' class="' + options.baseClassName + ' ' + options.className + '">' +
        '<input ' + inputStrAttrs + '/>' +
        '<label ' + labelStrAttrs + '>' + options.label.value + '</label>' +
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


//TODO: as Linus says, everything below here doesn't have a good flavor, reafactor it please
function createClassedLink(href, value, options){
  if(!options) options = {};
  var anchorClassStr = options.anchorClassName ? ' class="' + options.anchorClassName + '"' : '';
  var listItemClassStr = options.liClassName ? ' class="' + options.liClassName + '"' : '';
  return '<li' + listItemClassStr + '><a href="' + href + '"' + anchorClassStr + '>' + value + '</a></li>';
}

function createHtmlLinks(dataArr, options){
  var options = options ? options : {};
  return dataArr.reduce(function(prev, cur, ind, arr){
    var link = createClassedLink(cur.href, cur.value, cur.options)
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

function createDropdownLink(dropdownName, href, value){
  return '<li><a class="dropdown-button" data-constrainwidth="false" ' + (href ? 'href="' + href + '" ' : '') + 'data-activates="' + dropdownName + '" data-hover="true" data-beloworigin="true">' + value + '</a></li>'
}

function slideoutLink(title, content){
  return '<li><a class="subheader">' + title + '</a></li>' + content;
}

function tabLink(href, value, options){
  if(!options) options = {};
  options.liClassName = "tab"
  return createClassedLink(href, value, options)
}

function navLinks(options) {
  var navData = options.hash.navData || {}
  ,   tabData = options.hash.tabData || []
  ,   navType = options.hash.navType
  ,   navElements = ''
  ,   childElements = ''

  switch(navType){
  case 'main-nav':
    Object.keys(navData).forEach(function(key){
      if(navData[key].linkData && navData[key].linkData.length){
        navElements = navElements +
          createDropdownLink(key + '-dropdown-link', navData[key].href, navData[key].value);
        childElements = childElements +
          createHtmlLinks(navData[key].linkData, {
            groupId: (key + '-dropdown-link'),
            groupClassName: 'dropdown-content'
          })
      }
      else {
        navElements = navElements +
          createClassedLink(navData[key].href, navData[key].value);
      }
    })
    break;
  case 'mobile-main-nav':
    navElements = navElements +
      '<li><a href="/">Rates and Agents</a></li>' +
      '<li><div class="divider"></div></li>';
    Object.keys(navData).forEach(function(key, index){
      if(navData[key].linkData && navData[key].linkData.length){
        navElements +=
          slideoutLink(navData[key].value, createHtmlLinks(navData[key].linkData))
      }
      else {
        navElements = navElements +
          createClassedLink(navData[key].href, navData[key].value)
      }
      if(index < navData.length)
        navElements = navElements + '<li><div class="divider"></div></li>'
    })
    break;
  case 'tabs':
    tabData.forEach(function(tab, index){
      navElements = navElements +
        tabLink(tab.href, tab.value, (index === 0 ? {anchorClassStr: "active"} : {}))
    })
    break;
  }
  return new HBars.SafeString(navElements + childElements);
}
