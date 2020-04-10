var extensionOrigin = 'chrome-extension://' + chrome.runtime.id

if (!location.ancestorOrigins.contains(extensionOrigin) ) {

  var s = document.createElement('script');
  
  s.src = chrome.runtime.getURL('catchHomework.js');
  document.getElementsByTagName('body')[0].appendChild(s);

  chrome.runtime.sendMessage("done", function(response){

    console.log("[Send][contentscripts->background] Ready for work.")
    console.log(response)

  })  

}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if ('update' == message.cmd){

    sendResponse(sender,"[Recv][contentscripts->background] I'm updated.")
  }

})

chrome.runtime.sendMessage("wakeup", function(response){
  console.log("[Send][contentscript->background] Wake up!")
  console.log(response)
})
