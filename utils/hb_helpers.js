var HBars = require('handlebars');

exports.getDateNumeral = function getDateNumeral(){
  return '' + new Date().getTime();
}

exports.ifEquals = function ifEquals(item1, item2, options){
  if(item1 === item2){
    return options.fn(this);
  }
  else {
    return options.inverse(this);
  }
}

exports.inputField = function inputField(options){
  var name = options.hash.name || ""
  ,   labelVal = options.hash.labelVal || ""
  ,   msg = options.hash.msg || ""
  ,   data = options.hash.data || ""
  ,   type = options.hash.type || ""
  ,   field;

  field = '<div class="input-field">' +
    '<label for="' + name + '" data-error="' + msg + '">' + labelVal + '</label>' +
    '<input type="' + type + '" id="' + name + '" value="' + data + '" />' +
    '</div>';

  return new HBars.SafeString(field);
}

exports.inlineInput = function inlineInput(options){
  var name = options.hash.name || ""
  ,   labelVal = options.hash.labelVal || ""
  ,   msg = options.hash.msg || ""
  ,   data = options.hash.data || ""
  ,   type = options.hash.type || ""
  ,   field;

  field = '<p class="inline-input">' +
    '<input type="' + type + '" id="' + name + '" value="' + data + '" />' +
    '<label for="' + name + '" data-error="' + msg + '">' + labelVal + '</label>' +
    '</p>';

  return new HBars.SafeString(field);
}

exports.socialTags = function socialTags(options) {
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

//TODO: fuck this function, this should be removed eventually
exports.str = function str(str1, str2){
  return str1 + str2;
}

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
  console.log("value: ", value)
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

exports.navLinks = function navLinks(options) {
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
