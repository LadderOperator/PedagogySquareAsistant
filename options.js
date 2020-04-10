

function form_update() {

  var defApply = document.getElementById("default_apply")
  var preImg = document.getElementById("preview_image")
  var rotImg = document.getElementById("rotate_image")
  var movRate = document.getElementById("move_ratebutton")
  var useRBox = document.getElementById("use_ratebox")
  var addSign = document.getElementById("add_signature")
  var sText = document.getElementById("signature")
  var dlLesson = document.getElementById("download_lesson")

  sText.disabled = !addSign.checked

  console.log("[Info][options] Update form.")

}


function save_options() {
  
  var storage = {}

  storage.totalControl = document.getElementById('default_apply').checked
  storage.enableImagePreview = document.getElementById('preview_image').checked
  storage.enableImageRotation = document.getElementById('rotate_image').checked
  storage.enableMoveRate = document.getElementById('move_ratebutton').checked
  storage.enableRateBox = document.getElementById('use_ratebox').checked
  storage.enableSignature = document.getElementById('add_signature').checked
  storage.signatureText = document.getElementById('signature').value
  storage.enableDownload = document.getElementById('download_lesson').checked

  console.log(storage)
  console.log(JSON.stringify(storage))

  chrome.storage.sync.set({
    "settings": JSON.stringify(storage)
  }
  ,function () {
    var status = document.getElementById('info')
    status.textContent = '当前状态：已保存。请刷新教学立方网页以生效。'
  })

  console.log("[Info][options] Save settings.")

}
  

function reset_options() {

  document.getElementById('default_apply').checked = false
  document.getElementById('preview_image').checked = true
  document.getElementById('rotate_image').checked = true
  document.getElementById('move_ratebutton').checked = true
  document.getElementById('use_ratebox').checked = false
  document.getElementById('add_signature').checked = false
  document.getElementById('signature').value = "（张三 批改）"
  document.getElementById('download_lesson').checked = true

  var status = document.getElementById('info')
  status.textContent = '当前状态：未保存。'
  console.log("[Info][options] Reset settings.")

  form_update()

}

function load_options() {

  chrome.storage.sync.get("settings",function (items) {

    var globalStorage = {}

    if ('{}' === JSON.stringify(items)){
            
      /* 第一次运行设置 */
      console.log("[Info][options] First run.")

      document.getElementById('title').textContent = "欢迎使用！第一次使用请设置："
      document.getElementById('default_apply').checked = false
      document.getElementById('preview_image').checked = true
      document.getElementById('rotate_image').checked = true
      document.getElementById('move_ratebutton').checked = true
      document.getElementById('use_ratebox').checked = false
      document.getElementById('add_signature').checked = false
      document.getElementById('signature').value = "（张三 批改）"
      document.getElementById('download_lesson').checked = true

      save_options()//强制保存一次默认设置

      form_update()//异步加载，必须要分别加上
  
    }else{

      globalStorage = JSON.parse(items.settings)
      document.getElementById('default_apply').checked = globalStorage.totalControl
      document.getElementById('preview_image').checked = globalStorage.enableImagePreview
      document.getElementById('rotate_image').checked = globalStorage.enableImageRotation
      document.getElementById('move_ratebutton').checked = globalStorage.enableMoveRate
      document.getElementById('use_ratebox').checked = globalStorage.enableRateBox
      document.getElementById('add_signature').checked = globalStorage.enableSignature
      document.getElementById('signature').value = globalStorage.signatureText
      document.getElementById('download_lesson').checked = globalStorage.enableDownload
      
      form_update()//异步加载，必须要分别加上
    }

  })

  

}

var defApply = document.getElementById("default_apply")
var preImg = document.getElementById("preview_image")
var rotImg = document.getElementById("rotate_image")
var movRate = document.getElementById("move_ratebutton")
var useRBox = document.getElementById("use_ratebox")
var addSign = document.getElementById("add_signature")
var sText = document.getElementById("signature")
var dlLesson = document.getElementById("download_lesson")

document.getElementById('reset').addEventListener('click', function () {
  
  reset_options()
  form_update()

})

document.getElementById('save').addEventListener('click', save_options)

document.addEventListener('DOMContentLoaded', load_options)

var all_cbox = document.getElementsByClassName('cbox')

for (let cboxid = 0; cboxid < all_cbox.length; cboxid++) {
  
  all_cbox[cboxid].onclick = form_update
  
}

