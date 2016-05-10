// trim string to so that first 140 chars of the summary end on a clean line or word
function trimString(body)
{
  var trim;
  var maxLength = 141;

  if (body.length < maxLength) {
    return body;
  }
  else {
    trim = body.substring(0, maxLength);
    trim = trim.substring(0, Math.min(trim.length, trim.lastIndexOf(" ")));
    trim = trim + "...";
    return trim;
  }
}

// provide sensible read output of date/time stamps
function printLastUpdated (createdAt) {
  var updatedMsg = "";
  var dateDiff;

  // get difference in created UTC time to time right now
  dateDiff = Date.now() - Date.parse(createdAt);

  var hours = Math.floor(dateDiff / 36e5);
  var minutes = Math.floor(dateDiff % 36e5 / 60000);
  var seconds = Math.floor(dateDiff % 60000 / 1000);
  var days = Math.floor(hours / 24);

  if (days == 0) {
    if (hours == 0) {
      if (minutes == 0) {
        updatedMsg += seconds + "s ago";
      }
      else {
        updatedMsg += minutes + "m ago";
      }
    }
    else if (hours >= 1 && hours < 2) {
      updatedMsg += "an hour ago";
    }
    else {
      updatedMsg += hours + " hours ago";
    }
  }
  else if (days >=1 && days < 2) {
    updatedMsg += "yesterday";
  }
  else {
    updatedMsg += days + " days ago";
  }

  return updatedMsg;
}

// To help prevent XSS vulnerabilities when using dangerouslySetInnerHTML
function htmlEncode (value) {
  return $('<div/>').text(value).html();
}
// To help prevent XSS vulnerabilities when using dangerouslySetInnerHTML
function htmlDecode (value) {
  return $('<div/>').html(value).text();
}

// Get RGB colour value from hexString
function hexToRGB (hexString) {
  var rgbValue = new Array();
  var bigint = parseInt(hexString, 16);

  rgbValue[0] = (bigint >> 16) & 255;
  rgbValue[1] = (bigint >> 8) & 255;
  rgbValue[2] = bigint & 255;

  return rgbValue;
}

// Get text colour for a given background colour so that readibility is optimized through contrast
function getTextColour (labelColour) {
  var textColour = "";
  var rgbValue = new Array ();
  var brightness;

  // For logic details: http://www.w3.org/TR/AERT#color-contrast
  rgbValue = hexToRGB(labelColour);
  var brightness = Math.round(((rgbValue[0] * 299) + (rgbValue[1] * 587) + (rgbValue[2] * 114)) /1000);

  if(brightness > 125) {
    textColour += "black";
  }
  else {
    textColour += "white";
  }
  // console.log(textColour);

  return textColour;
}

// Parses the labels array and returns html to print issue labels
function printLabels (labels, largeSize) {
  labelMsg = "";
  if (largeSize) {
    for (var i = 0; i < labels.length; i++) {
      labelMsg += "<span class='label-tag-lg' style='color:" + htmlEncode(getTextColour(labels[i].color)) + "; background-color: #" + htmlEncode(labels[i].color) + "'>" + htmlEncode(labels[i].name) + "</span>"
      labelMsg +="<span class='label-spacer'>&nbsp;</span>";
    }
  }
  else {
    for (var i = 0; i < labels.length; i++) {
      labelMsg += "<span class='label-tag' style='color:" + htmlEncode(getTextColour(labels[i].color)) + "; background-color: #" + htmlEncode(labels[i].color) + "'>" + htmlEncode(labels[i].name) + "</span>"
      labelMsg +="&nbsp;";
    }
  }
  return {__html: labelMsg};
}

// Uses regex text manipulations to clean up output format issue details and comments
function prettifyTextBody (text) {
  //#todo: 1. add code snippet formatting (code-prettify) - low priority

  var updatedText = "<span>";
  var htmlLink =  '$1<a href="https://github.com/$2">@$2</a>'
  var newLine = '<p></p>'
  var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

  // check for return carriage and new lines
  updatedText += text.replace(/[\r\n]/g, newLine);
  // check for hyperlinks and make them linkable
  updatedText = updatedText.replace(urlRegex, function(url) {
          return '<a href="' + url + '">' + url + '</a>';
      })
  // check for github profile names and make them linkable
  updatedText = updatedText.replace(/(^|\s|>)@([a-zA-Z0-9-]{2,})/g, htmlLink);

  // check for code snippets and format them accordingly
  /* a terrible quick hack - do not try this at home
  var codeTagOpen = '<code>'
  var codeTagClose = '</code>'
  var codeHack = 0; //#todo: find a better way - temporary hack
  */

  updatedText += "</span>";

 return {__html: updatedText};
}
