
try {
  
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
    var img = document.createElement('img')
    img.src = link[2]
    link[3].parentNode.insertBefore(img, link[3].nextSibling)
  })
  fileLinks.forEach(function (link) {
    link[3].href = link[2]
    link[3].target = '_blank'
  })
}
catch(hmerr){
  console.error(hmerr)
}


try {
  var resource = lessonindex.lesson_list
  console.log("捕捉到课件文件")

  for (let ri = 0; ri < resource.length; ri++) {
    resource[ri].can_download = 1
  }

}
catch(lserr){
  console.error(lserr)
}
