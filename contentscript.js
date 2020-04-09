var extensionOrigin = 'chrome-extension://' + chrome.runtime.id

if (!location.ancestorOrigins.contains(extensionOrigin) ) {

  var s = document.createElement('script');
  
  s.src = chrome.runtime.getURL('catchHomework.js');
  document.getElementsByTagName('body')[0].appendChild(s);
  chrome.runtime.sendMessage("Done", function(response){
    console.log("ContentScript:OK!")
    console.log(response)
  })  

}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if ('update' == message.cmd){
    sendResponse(sender,"ContentScript:Got it!")
  }

})

chrome.runtime.sendMessage("wakeup", function(response){
  console.log("Send wakeup")
  console.log(response)
})
