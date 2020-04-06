

var currentURL = window.location.href;
var lessonStr = "S-Lesson-index"
var TWorkStr = "T-Work-treviewinfo"

if (currentURL.includes(TWorkStr)) {

  document.getElementsByClassName('caozuo')[0].setAttribute("style", "position:unset;text-align:right;");

  var homeworkPara = homework.question_list

  console.log("捕捉到作业文件")

  //console.log(homeworkPara)

  var questionCount = homeworkPara.length

  //console.log(questionCount)

  var fileLinks = []
  var imgLinks = []
          
  var attachElements = document.querySelectorAll('div.records-exam-section.s-work-section > div > div > div:not(.change) > a')

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

        for (let k = 0; k < attachElements.length; k++) {
          if (attachElements[k].textContent.indexOf(fName) > -1){
            attachInfo.push(attachElements[k])
          }
          
        }
        if ('jpg|jpeg|png|gif'.indexOf(fExt.toLowerCase()) > -1 ) {
          imgLinks.push(attachInfo)
        }else {
          fileLinks.push(attachInfo)
        }

      }
    }

  imgLinks.forEach(function (link) {
    var br1 = document.createElement('br')
    var br2 = document.createElement('br')
    var canvas = document.createElement('canvas')
    var img = document.createElement('img')
    img.src = link[2]
    img.className = "previewImg"
    canvas.className = "previewCanvas-0"
    var ctx = canvas.getContext('2d')
    img.onload = function(){
      
      canvas.width = link[3].parentElement.offsetWidth
      canvas.height = link[3].parentElement.offsetWidth*img.height/img.width
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height) 

    }
    canvas.addEventListener('click',function () {
      var currentDeg = parseInt((/[0-9]+/i).exec(this.className))
      var newDeg = (currentDeg + 90) % 360
      var ctx = this.getContext('2d')
      var img = this.children[0]
      switch (newDeg) {
        case 90:
          ctx.clearRect(0,0,canvas.width,canvas.height)
          canvas.height = this.parentElement.offsetWidth*img.width/img.height
          ctx.rotate(1/2*Math.PI)
          ctx.translate(0,-canvas.width)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width) 
          ctx.translate(0,canvas.width)
          ctx.rotate(-1/2*Math.PI)
          break;

        case 180:
          ctx.clearRect(0,0,canvas.width,canvas.height)
          canvas.height = this.parentElement.offsetWidth*img.height/img.width
          ctx.rotate(Math.PI)
          ctx.translate(-canvas.width,-canvas.height)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height) 
          ctx.translate(canvas.width,canvas.height)
          ctx.rotate(-Math.PI)
          break;

        case 270:
          ctx.clearRect(0,0,canvas.width,canvas.height)
          canvas.height = this.parentElement.offsetWidth*img.width/img.height
          ctx.rotate(-1/2*Math.PI)
          ctx.translate(-canvas.height,0)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width) 
          ctx.translate(canvas.height,0)
          ctx.rotate(1/2*Math.PI)
          break;

        case 0:
          canvas.height = this.parentElement.offsetWidth*img.height/img.width
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height) 
          break;
        
        default:
          break;
      }

      this.className = "previewCanvas-" + newDeg.toString()
    })
    canvas.appendChild(img)
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

