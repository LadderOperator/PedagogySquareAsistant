function debug(param) {
  if (globalDebugMode) {
    console.log(param)
  }
}

/* function changeNext() {
  if (0 < notMarkCount) {

    var nextURL = document.URL.split("#")[0] + "#" + TWorkStr + "-id-" + hid.toString() + "-be_uid-" + nuid.toString()
    document.querySelectorAll(".report-box-head > .pull-right > a").forEach(function (btn) {
      btn.href = nextURL
    }

    )
  }
} */

function getAttachment() {

  /* 
  获取页面的附件信息
  */

  for (let i = 0; i < questionCount; i++) {

    if (!homeworkPara[i].answer_record.hasOwnProperty('attach_info')) {
      continue
    }
    debug("捕捉到作业附件")
    var attachment = homeworkPara[i].answer_record.attach_info

    var attachCount = attachment.length
    for (let j = 0; j < attachCount; j++) {
      var attachInfo = []

      var fName = attachment[j].filename //文件名
      var tmpURL = attachment[j].path //文件实际下载路径
      var fExt = attachment[j].ext //文件扩展名

      attachInfo.push(fName)
      attachInfo.push(fExt)
      attachInfo.push(tmpURL)

      attachInfo.push(attachElements[j])//附件所属<a>元素

      /* 附件分类 */
      if ('jpg|jpeg|png|gif'.indexOf(fExt.toLowerCase()) > -1) {
        imgLinks.push(attachInfo)
      } else {
        fileLinks.push(attachInfo)
      }

    }
  }
}

function img2canvas() {

  /* 
  将img转换为canvas，以便应用旋转功能 
  */

  for (let imgIndex = 0; imgIndex < imgInserted.length; imgIndex++) {
    var imgCanvas = document.createElement('canvas')
    var img2 = document.createElement('img')
    imgCanvas.className = "imgCanvas-0"

    var imgctx = imgCanvas.getContext('2d')
    imgs = imgInserted[imgIndex]
    img2.src = imgs.src
    img2.className = 'insertedImg'
    imgCanvas.appendChild(img2)
    imgs.parentNode.appendChild(imgCanvas)

    imgs.parentNode.removeChild(imgs)

    /* 在canvas绘制图片内容 */


    imgctx2 = img2.parentElement.getContext('2d')

    img2.parentElement.width = img2.parentElement.parentElement.parentElement.offsetWidth
    img2.parentElement.height = img2.parentElement.parentElement.parentElement.offsetWidth * img2.height / img2.width
    imgctx2.drawImage(img2, 0, 0, img2.width, img2.height, 0, 0, img2.parentElement.width, img2.parentElement.height)


    imgCanvas.parentElement.insertBefore(document.createElement('br'), imgCanvas)

    if (settings.enableImageRotation) {
      setImgRotate(imgCanvas, "imgCanvas-")
    }

    /* 为每个图片下方添加评语框 */

    if (settings.enableRateBox) {
      addImgRateBox(imgCanvas)
    }

  }

}

function setImgRotate(imgCanvas, tagPreffix) {

  /* 
  imgCanvas: 绘制图片的canvas
  tagPreffix: 绘制图片canvas class的前缀格式
  */

  imgCanvas.addEventListener('click', function () {
    var currentDeg = parseInt((/[0-9]+/i).exec(this.className))
    var newDeg = (currentDeg + 90) % 360
    var ctx = this.getContext('2d')
    var img = this.children[0]
    switch (newDeg) {
      case 90:
        ctx.clearRect(0, 0, this.width, this.height)
        this.height = this.parentElement.offsetWidth * img.width / img.height
        ctx.rotate(1 / 2 * Math.PI)
        ctx.translate(0, -this.width)
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.height, this.width)
        ctx.translate(0, this.width)
        ctx.rotate(-1 / 2 * Math.PI)
        break;

      case 180:
        ctx.clearRect(0, 0, this.width, this.height)
        this.height = this.parentElement.offsetWidth * img.height / img.width
        ctx.rotate(Math.PI)
        ctx.translate(-this.width, -this.height)
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.width, this.height)
        ctx.translate(this.width, this.height)
        ctx.rotate(-Math.PI)
        break;

      case 270:
        ctx.clearRect(0, 0, this.width, this.height)
        this.height = this.parentElement.offsetWidth * img.width / img.height
        ctx.rotate(-1 / 2 * Math.PI)
        ctx.translate(-this.height, 0)
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.height, this.width)
        ctx.translate(this.height, 0)
        ctx.rotate(1 / 2 * Math.PI)
        break;

      case 0:
        this.height = this.parentElement.offsetWidth * img.height / img.width
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.width, this.height)
        break;

      default:
        break;
    }

    this.className = tagPreffix + newDeg.toString()


  })
}

function addImgRateBox(imgCanvas) {

  /* 
  imgCanvas: 希望在下方增加输入框的canvas
  */

  var inbox2 = document.createElement('textarea')
  inbox2.className = 'ratebox'
  inbox2.placeholder = '点击可以在这里记录本题评语，评语会最终汇总到总评里'
  inbox2.rows = 2
  inbox2.style.width = "100%"
  inbox2.addEventListener('change', function () {
    rateboxes = document.getElementsByClassName('ratebox')
    gatherRate = []
    for (let boxid = 0; boxid < rateboxes.length; boxid++) {
      gatherRate.push(rateboxes[boxid].value)
    }

  })
  imgCanvas.parentNode.insertBefore(inbox2, imgCanvas.nextSibling)
  imgCanvas.parentElement.insertBefore(document.createElement('br'), imgCanvas.nextSibling)
}

function showPreviewImg(link) {

  /* 
  link: 预览图片的附件元素
  */

  var br1 = document.createElement('br')
  var br2 = document.createElement('br')
  var canvas = document.createElement('canvas')
  var img = document.createElement('img')
  img.src = link[2]
  img.className = "previewImg"
  canvas.className = "previewCanvas-0"


  canvas.appendChild(img)
  img.onload = function () {
    var ctx = this.parentElement.getContext('2d')

    this.parentElement.width = link[3].parentElement.offsetWidth
    this.parentElement.height = link[3].parentElement.offsetWidth * this.height / this.width
    ctx.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.parentElement.width, this.parentElement.height)

  }

  link[3].parentNode.insertBefore(br1, link[3].nextSibling)
  link[3].parentNode.insertBefore(canvas, link[3].nextSibling)
  link[3].parentNode.insertBefore(br2, link[3].nextSibling)

  if (settings.enableImageRotation) {
    setImgRotate(canvas, "previewImg-")
  }

  if (settings.enableRateBox) {
    addImgRateBox(canvas)
  }
}

function addFloatRatebox() {

  var insertNode = document.querySelector(".caozuo a")
  var inbox2 = document.createElement('textarea')
  inbox2.className = 'ratebox'
  inbox2.id = "float-ratebox"
  inbox2.placeholder = '这里是浮动评语框，点击可以在这里随时记录想写的评语，同样会最终汇总到总评'
  inbox2.rows = 2
  inbox2.style.width = "90%"
  inbox2.style.float = "left"
  inbox2.style.border = "black 2px solid"
  inbox2.addEventListener('change', function () {
    rateboxes = document.getElementsByClassName('ratebox')
    gatherRate = []
    for (let boxid = 0; boxid < rateboxes.length; boxid++) {
      gatherRate.push(rateboxes[boxid].value)
    }

  })
  insertNode.parentNode.insertBefore(inbox2, insertNode)
  
}

function moveRateButton() {
  var rateStyle = document.createElement('style')
  rateStyle.innerHTML = 
  ".caozuo {\
    background:rgba(255,255,255,0.6);\
    position:fixed!important;\
    left:0px!important;\
    right:unset!important;\
    top:unset!important;\
    bottom:0px!important;\
    text-align:right!important;\
    height:fit-content;\
    margin:0px 20% 0px 20%;\
    width:70%;\
    z-index:100;\
    padding:10px;\
  }"
  document.head.appendChild(rateStyle)
}

function hideSrvBtn() {
  var kfButton = document.querySelector('[id*=support-btn]')
  kfButton.style.display = "none"
}

function fillRate() {
  var combinedRates = settings.enableSignature ? gatherRate.join(' ') + signature : gatherRate.join(' ')
  if ("" == document.querySelector('.teacherRating-content > span > textarea').value.replace(/\s*/g, "")) {
    document.querySelector('.teacherRating-content > span > textarea').value = combinedRates
  }
}

function collectRates() {

    document.querySelector('.caozuo').addEventListener('click',fillRate )

}

function signOnly() {

  if ("" == document.querySelector('.teacherRating-content > span > textarea').value.replace(/\s*/g, "")) {
    document.querySelector('.teacherRating-content > span > textarea').value = signature
  }

}

function sign() {

    document.querySelector('.caozuo').addEventListener('click', signOnly)

}



function showDlBtn() {

  debug("捕捉到课件文件")

  var lesson_items = document.querySelectorAll("tbody > tr")

  for (let ri = 0; ri < resource.length; ri++) {
    resource[ri].can_download = 1
    if (settings.enableDownload){
      lesson_url = lesson_items[ri].lastElementChild.lastElementChild
      lesson_url.href = resource[ri].path
    }
  }
}

function checkPage() {
  if (oldPage != parseInt(document.querySelector(".pagination .active").textContent)) {
    showDlBtn()
    oldPage = parseInt(document.querySelector(".pagination .active").textContent)
  }
}

function mainPart() {


/* 根据当前页面选择执行不同功能 */

if (currentURL.includes(TWorkStr)) {

  var signature = settings.signatureText

  // var gatherRate = []
  nuid = homework.next_uid
  hid = homework.hid
  notMarkCount = homework.not_mark_uids_arr.length
  homeworkPara = homework.question_list
  questionCount = homeworkPara.length
/*   var rateboxes = []
  var gatherRate = []

  var fileLinks = []
  var imgLinks = [] */

  attachElements = document.querySelectorAll('div.records-exam-section.s-work-section > div > div > div:not(.change) > a') //捕捉附件

  imgInserted = document.querySelectorAll('div.records-exam-section.s-work-section > div > div img:not(.previewImg)') //捕捉插入图片


  /* 捕捉作业附件 */

  getAttachment()

  /* 为所有插入的图片套上一层canvas */

  img2canvas()


  /* 处理上传附件的列表 */

  imgLinks.forEach(function (link) {



    /*     var inbox = document.createElement('textarea')
        inbox.className = 'ratebox'
        inbox.placeholder = '点击可以在这里记录本题评语！'
        inbox.rows = 2
        inbox.style.width = "100%"
        inbox.addEventListener('change',function () {
          rateboxes = document.getElementsByClassName('ratebox')
          gatherRate = []
          for (let boxid = 0; boxid < rateboxes.length; boxid++) {
            gatherRate.push(rateboxes[boxid].value)
          }
    
        })
    
        link[3].parentNode.insertBefore(inbox, link[3].nextSibling) */
    /* 创建canvas并在其中绘制图片 */



    if (settings.enableImagePreview) {

      showPreviewImg(link)

    }




  })
  if (settings.enableRateBox && settings.enableMoveRate) {
    addFloatRatebox()
  }

  /* 为非图片替换原先的下载链接 */

  // fileLinks.forEach(function (link) {
  //   try{
  //     link[3].href = "javascript:window.open(" + link[2] +")"
  //   } catch(errFile){
  //       debug("[Info][injected] Maybe no file.")
  //   }

  // })

  /* 评阅按钮移动到底部 */

  if (settings.enableMoveRate) {
    moveRateButton()
  }

  /* 收集评语 */
  if (settings.enableRateBox) {
    collectRates(gatherRate)
  }

  if (settings.enableSignature) {
    sign()
  }

  //changeNext()

  if (settings.enableHideSrv) {
    hideSrvBtn()
  }

}

/* 学生功能，显示课件的下载按键 */



if (currentURL.includes(lessonStr)) {

  resource = lessonindex.lesson_list

  if (true) {
    showDlBtn()
    var interval = 100;
    oldPage = parseInt(document.querySelector(".pagination .active").textContent)//获取当前列表页
    window.setInterval(checkPage, interval)//间隔判断当期页面是否发生改变
  }

  if (settings.enableHideSrv) {
    hideSrvBtn()
  }

}

}


var globalDebugMode = true
var settings = JSON.parse(document.getElementById('opt_data').textContent)
var currentURL = window.location.href;
var lessonStr = "S-Lesson-index"
var TWorkStr = "T-Work-treviewinfo"
var signature = settings.signatureText
var gatherRate = []
var homeworkPara
var questionCount
var nuid
var hid
var notMarkCount
var rateboxes = []
var gatherRate = []
var fileLinks = []
var imgLinks = []
var attachElements
var imgInserted
var resource 
var oldPage

try {
  mainPart()
  debug("[Info] Done.")
} catch (error) {
  debug(error)
  debug("[Info] Wait.")
  window.setTimeout(mainPart, 1500)
  debug("[Info] Done.")
}