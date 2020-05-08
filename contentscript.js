function debug(param) {
  if (globalDebugMode) {
    console.log(param)
  }
}

function hasContentscripts() {
  var extension = chrome.runtime.id
  var script = document.querySelectorAll("script[src*='" + extension + "']")
  //debug(script)
  return script.length > 0
}

// function rmContentscripts() {
//   var extension = chrome.runtime.id
//   var script = document.querySelector("script[src*='" + extension + "']")
//   var pdata = document.querySelector("p#opt_data")
//   script.remove()
//   pdata.remove()
// }

function injectScripts() {

  var extensionOrigin = 'chrome-extension://' + chrome.runtime.id

  if (!location.ancestorOrigins.contains(extensionOrigin)) {

    ctrlElement = document.createElement('p')
    ctrlElement.id = 'opt_data'
    ctrlElement.textContent = settings
    ctrlElement.style.display = "none"
    document.getElementsByTagName('body')[0].appendChild(ctrlElement)


    var s = document.createElement('script')
    s.src = chrome.runtime.getURL('catchHomework.js')
    document.getElementsByTagName('body')[0].appendChild(s)

    chrome.runtime.sendMessage("done", function (response) {

      debug("[Send][contentscripts->background] Ready for work.")
      debug(response)

    })

  }

}

function updateContentVar(message, sender, sendResponse) {

    if ('update' == message.cmd) {

      settings = message.info
  
      sendResponse(sender, "[Recv][contentscripts->background] I'm updated.")
      
      injectScripts()
    }

}

function reqBgUpdate(params) {
  chrome.runtime.sendMessage("wakeup", function (response) {
    debug("[Send][contentscript->background] Wake up!")
    //debug(response)
  })
}


var settings
var globalDebugMode = true


if (hasContentscripts()) {

  debug("[Info] Already run, please refresh.")

} else {

  reqBgUpdate()
  chrome.runtime.onMessage.addListener(updateContentVar)

}





