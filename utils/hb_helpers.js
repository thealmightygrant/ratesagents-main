var HBars = require('handlebars');

exports.getDateNumeral = function getDateNumeral(){
  return '' + new Date().getTime();
}

exports.socialTags = function socialTags(options) {
  var tags = options.hash.socialData ? options.hash.socialData : {};
  if(!tags.url) tags.url = "https://ratesandagents.com/" + tags.page_name;
  if(!tags.site_name) tags.site_name = "Rates and Agents";
  if(!tags.twitter_site) tags.twitter_site = "@ratesandagents";
  //if(!tags.fb_app_id) tags.fb_app_id = "";
  var social_tags = ''
  var tag_map = {
    url: "og:url"
    , twitter_site: "twitter:site"
    , fb_app_id: "fb:app_id"
    , description: "og:description"
    , title: "og:title"
    , video: "og:video"
    , video_width: "og:video:width"
    , video_height: "og:video:height"
    , image: "og:image"
    , image_width: "og:image:width"
    , image_height: "og:image:height"
    , site_name: "og:site_name"
  };
  Object.keys(tags).forEach(function(k){
    social_tags = social_tags + (tag_map[k] ? '<meta property="' + tag_map[k] + '" name="' + tag_map[k] + '" content="' + tags[k] + '" />' : '');
  });
  return new HBars.SafeString(social_tags);
}

//TODO: fuck this function, this should be removed eventually
exports.str = function str(str1, str2){
  return str1 + str2;
}

function createHtmlLinks(dataArr, options){
  var options = options ? options : {};
  return dataArr.reduce(function(prev, cur, ind, arr){
    var link = '<li><a href="' + cur.href + '">' + cur.value + '</a></li>'
    if(prev.length === 0){
      return '<ul ' + (options.groupid ? 'id="' + options.groupid + '" ': '') + (options.groupclass ? 'class="' + options.groupclass + '" ': '') + '>' + link;
    }
    else if(ind === (arr.length - 1)){
      return prev + link + '</ul>'
    }
    else {
      return prev + link;
    }
  }, '')
}

function createDropdownLink(dropdownName, title){
  return '<li><a class="dropdown-button" data-constrainwidth="false" data-activates="' + dropdownName + '" data-hover="true" data-beloworigin="true">' + title + '</a></li>'
}

function slideoutLink(title, content){
  return '<li><a class="subheader">' + title + '</a></li>' + content;
}

exports.navLinks = function navLinks(options) {
  var navData = options.hash.navData
  ,   navType = options.hash.type
  ,   navElements = ''
  ,   dropdownElements = ''

  if(navType === 'main-sales'){
    Object.keys(navData).forEach(function(key){
      navElements = navElements +
        createDropdownLink(key + '-dropdown-link', navData[key].title);
      dropdownElements = dropdownElements +
        createHtmlLinks(navData[key].linkData, {
          groupid: (key + '-dropdown-link'),
          groupclass: 'dropdown-content'
        })
    })
  }
  else if(navType === 'mobile-main-sales'){
    navElements = navElements +
      '<li><a href="/">Rates and Agents</a></li>' +
      '<li><div class="divider"></div></li>';
    Object.keys(navData).forEach(function(key, index, arr){
      navElements = navElements +
        slideoutLink(navData[key].title, createHtmlLinks(navData[key].linkData))
      if(index < arr.length)
        navElements = navElements + '<li><div class="divider"></div></li>'
    })
  }
  return new HBars.SafeString(navElements + dropdownElements);
}
