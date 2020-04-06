

var currentURL = window.location.href;
var lessonStr = "S-Lesson-index"
var TWorkStr = "T-Work-treviewinfo"

if (currentURL.includes(TWorkStr)) {

  rate = document.getElementsByClassName('caozuo')[0]
  rate.setAttribute("style", "position:unset;text-align:right;");
  
  var teachername = ""

  var homeworkPara = homework.question_list

  var gatherRate = []

  rate.addEventListener('click',function () {
    document.querySelector('.teacherRating-content > span > textarea').value = gatherRate.join('；')
  })

  console.log("捕捉到作业文件")

  //console.log(homeworkPara)

  var questionCount = homeworkPara.length

  //console.log(questionCount)

  var fileLinks = []
  var imgLinks = []
          
  var attachElements = document.querySelectorAll('div.records-exam-section.s-work-section > div > div > div:not(.change) > a')

  var imgInserted = document.querySelectorAll('div.records-exam-section.s-work-section > div > div img:not(.previewImg)')

  //console.log(attachElements)

  for (let i = 0; i < questionCount; i++) {
          
    var attachment = homeworkPara[i].answer_record.attach_info

    var attachCount = attachment.length
    for (let j = 0; j < attachCount; j++) {
      var attachInfo = []

      var fName = attachment[j].filename
      var tmpURL = attachment[j].path
      var fExt = attachment[j].ext

      attachInfo.push(fName)
      attachInfo.push(fExt)
      attachInfo.push(tmpURL)

      attachInfo.push(attachElements[j])
        
      if ('jpg|jpeg|png|gif'.indexOf(fExt.toLowerCase()) > -1 ) {
        imgLinks.push(attachInfo)
      }else {
        fileLinks.push(attachInfo)
      }

    }
  }

  
  
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

    img2.onload = function(){

      imgctx2 = this.parentElement.getContext('2d')

      this.parentElement.width = this.parentElement.parentElement.parentElement.offsetWidth
      this.parentElement.height = this.parentElement.parentElement.parentElement.offsetWidth*this.height/this.width
      imgctx2.drawImage(this, 0, 0, this.width, this.height, 0, 0, this.parentElement.width, this.parentElement.height)

    }
    
    imgCanvas.parentElement.insertBefore(document.createElement('br'), imgCanvas)
    imgCanvas.addEventListener('click', function () {
      var currentDeg = parseInt((/[0-9]+/i).exec(this.className))
      var newDeg = (currentDeg + 90) % 360
      var ctx = this.getContext('2d')
      var img = this.children[0]
      switch (newDeg) {
        case 90:
          ctx.clearRect(0,0,this.width,this.height)
          this.height = this.parentElement.offsetWidth*img.width/img.height
          ctx.rotate(1/2*Math.PI)
          ctx.translate(0,-this.width)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.height, this.width) 
          ctx.translate(0,this.width)
          ctx.rotate(-1/2*Math.PI)
          break;
  
        case 180:
          ctx.clearRect(0,0,this.width,this.height)
          this.height = this.parentElement.offsetWidth*img.height/img.width
          ctx.rotate(Math.PI)
          ctx.translate(-this.width,-this.height)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.width, this.height) 
          ctx.translate(this.width,this.height)
          ctx.rotate(-Math.PI)
          break;
  
        case 270:
          ctx.clearRect(0,0,this.width,this.height)
          this.height = this.parentElement.offsetWidth*img.width/img.height
          ctx.rotate(-1/2*Math.PI)
          ctx.translate(-this.height,0)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.height, this.width) 
          ctx.translate(this.height,0)
          ctx.rotate(1/2*Math.PI)
          break;
  
        case 0:
          this.height = this.parentElement.offsetWidth*img.height/img.width
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.width, this.height) 
          break;
        
        default:
          break;
      }
  
      this.className = "imgCanvas-" + newDeg.toString()


    })

    var inbox2 = document.createElement('textarea')
    inbox2.className = 'ratebox'
    inbox2.placeholder = '点击可以在这里记录本题评语！'
    inbox2.rows = 2
    inbox2.style.width = "100%"
    inbox2.addEventListener('change',function () {
      rateboxes = document.getElementsByClassName('ratebox')
      gatherRate = []
      for (let boxid = 0; boxid < rateboxes.length; boxid++) {
        gatherRate.push(rateboxes[boxid].value)
      }

    })
    imgCanvas.parentNode.insertBefore(inbox2, imgCanvas.nextSibling)
    imgCanvas.parentElement.insertBefore(document.createElement('br'), imgCanvas.nextSibling)
  }

  imgLinks.forEach(function (link) {
    var inbox = document.createElement('textarea')
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

    var br1 = document.createElement('br')
    var br2 = document.createElement('br')
    var canvas = document.createElement('canvas')
    var img = document.createElement('img')
    img.src = link[2]
    img.className = "previewImg"
    canvas.className = "previewCanvas-0"
    

    canvas.appendChild(img)
    img.onload = function(){
      var ctx = this.parentElement.getContext('2d')

      this.parentElement.width = link[3].parentElement.offsetWidth
      this.parentElement.height = link[3].parentElement.offsetWidth*this.height/this.width
      ctx.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.parentElement.width, this.parentElement.height) 

    }
    canvas.addEventListener('click', function () {
      var currentDeg = parseInt((/[0-9]+/i).exec(this.className))
      var newDeg = (currentDeg + 90) % 360
      var ctx = this.getContext('2d')
      var img = this.children[0]
      switch (newDeg) {
        case 90:
          ctx.clearRect(0,0,this.width,this.height)
          this.height = this.parentElement.offsetWidth*img.width/img.height
          ctx.rotate(1/2*Math.PI)
          ctx.translate(0,-this.width)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.height, this.width) 
          ctx.translate(0,this.width)
          ctx.rotate(-1/2*Math.PI)
          break;
  
        case 180:
          ctx.clearRect(0,0,this.width,this.height)
          this.height = this.parentElement.offsetWidth*img.height/img.width
          ctx.rotate(Math.PI)
          ctx.translate(-this.width,-this.height)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.width, this.height) 
          ctx.translate(this.width,this.height)
          ctx.rotate(-Math.PI)
          break;
  
        case 270:
          ctx.clearRect(0,0,this.width,this.height)
          this.height = this.parentElement.offsetWidth*img.width/img.height
          ctx.rotate(-1/2*Math.PI)
          ctx.translate(-this.height,0)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.height, this.width) 
          ctx.translate(this.height,0)
          ctx.rotate(1/2*Math.PI)
          break;
  
        case 0:
          this.height = this.parentElement.offsetWidth*img.height/img.width
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.width, this.height) 
          break;
        
        default:
          break;
      }
  
      this.className = "previewCanvas-" + newDeg.toString()
    })
    
    link[3].parentNode.insertBefore(inbox, link[3].nextSibling)
    link[3].parentNode.insertBefore(br1, link[3].nextSibling)
    link[3].parentNode.insertBefore(canvas, link[3].nextSibling)
    link[3].parentNode.insertBefore(br2, link[3].nextSibling)
  })

  fileLinks.forEach(function (link) {
    link[3].href = link[2]
    link[3].target = '_blank'
  })

}


if (currentURL.includes(lessonStr)) {
  var resource = lessonindex.lesson_list
  console.log("捕捉到课件文件")

  for (let ri = 0; ri < resource.length; ri++) {
    resource[ri].can_download = 1
  }
}

