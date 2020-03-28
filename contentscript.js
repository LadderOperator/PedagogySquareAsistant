var extensionOrigin = 'chrome-extension://' + chrome.runtime.id
if (!location.ancestorOrigins.contains(extensionOrigin)) {

  var s = document.createElement('script');
  // TODO: add "script.js" to web_accessible_resources in manifest.json
  s.src = chrome.runtime.getURL('catchHomework.js');
  
  document.getElementsByTagName('body')[0].appendChild(s);

}
