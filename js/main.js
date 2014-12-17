define(["jquery"], function ($) {
$(function () {
	//$(".cardContents").text("Hello, world!");
	var i = 0;
        var inputs = document.getElementsByName("input");
        function getNextElement(elem) {
            if(elem.nextSibling==null)
                return elem.nextSibling;
            else
            {
                var x=elem.nextSibling;
                return (x.nodeType==1) ? x:getNextElement(x);
            }
        };
        var firstname = document.getElementById("1");
        var secondname = document.getElementById("2");    
        var bornplace = document.getElementById("3a");
        var agency = document.getElementById("4c");
        var wherewasgiven = document.getElementById("8");
        function translit(elem)
        {
            //console.log(this.firstname);
            var par = elem.parentNode;
            var next = getNextElement(par);
            var text = elem.value;                
            var transl=new Array();
            transl['А']='A';     transl['а']='a';
            transl['Б']='B';     transl['б']='b';
            transl['В']='V';     transl['в']='v';
            transl['Г']='G';     transl['г']='g';
            transl['Д']='D';     transl['д']='d';
            transl['Е']='E';     transl['е']='e';
            transl['Ё']='Yo';    transl['ё']='yo';
            transl['Ж']='Zh';    transl['ж']='zh';
            transl['З']='Z';     transl['з']='z';
            transl['И']='I';     transl['и']='i';
            transl['Й']='J';     transl['й']='j';
            transl['К']='K';     transl['к']='k';
            transl['Л']='L';     transl['л']='l';
            transl['М']='M';     transl['м']='m';
            transl['Н']='N';     transl['н']='n';
            transl['О']='O';     transl['о']='o';
            transl['П']='P';     transl['п']='p';
            transl['Р']='R';     transl['р']='r';
            transl['С']='S';     transl['с']='s';
            transl['Т']='T';     transl['т']='t';
            transl['У']='U';     transl['у']='u';
            transl['Ф']='F';     transl['ф']='f';
            transl['Х']='H';     transl['х']='h';
            transl['Ц']='C';     transl['ц']='c';
            transl['Ч']='Ch';    transl['ч']='ch';
            transl['Ш']='Sh';    transl['ш']='sh';
            transl['Щ']='Shh';    transl['щ']='shh';
            transl['Ъ']='"';     transl['ъ']='"';
            transl['Ы']='Y\'';    transl['ы']='y\'';
            transl['Ь']='\'';    transl['ь']='\'';
            transl['Э']='E\'';    transl['э']='e\'';
            transl['Ю']='Yu';    transl['ю']='yu';
            transl['Я']='Ya';    transl['я']='ya';
            
            var result='';
            for(j=0;j<text.length;j++) {
                if(transl[text[j]]!=undefined) 
                { 
                    result+=transl[text[j]]; 
                }
                else 
                { 
                    result+=text[j]; 
                }
            }
            next.innerText=result;
        };



    while (i<10)
    {
        //очистить инпут на клик
        inputs[i].onclick = function(){this.value="";};
        
        //вернуть defaultValue на пустой клик
        //или оставить значение, если что-то ввели
        inputs[i].onblur = function(){
            var locali = i;
            return function()
            {
                if (this.value==="")
                this.value=this.defaultValue;
            }
        }();
        
        i = i+1;
    }
    
    //события на перевод в транслит мелких надписей
    inputs[0].onchange = function(){translit(firstname);}
    inputs[1].onchange = function(){translit(secondname);}
    inputs[3].onchange = function(){translit(bornplace);}
    inputs[6].onchange = function(){translit(agency);}
    inputs[8].onchange = function(){translit(wherewasgiven)};
                                    
    //ВСПЛЫВАЮЩИЕ КНОПКИ
    var photoArea = document.getElementById("photo");
    var pictureButtons = document.getElementsByClassName("pictureButtons");
    var hideAllButton = document.getElementById("hideAll");
    var turnOnCameraButton = document.getElementById("start");
    var loadFileButton = document.getElementById("load");
    var captureButton = document.getElementById("capture");
    var hideSignatureButton = document.getElementById("hideSignature");
    
                    
                                     
    //ОБРАБОТКА ФОТКИ
    var photo = document.getElementById("photo");
    var photoContext = photo.getContext("2d");
    var video = document.getElementById("camera");
    var videoStreamUrl = false;
                                    
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
    var localStream;
    
   function start() {
   navigator.getUserMedia (
      {
         video: true,
      },
       //если получили разрешение
      function (localMediaStream) {
                window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;
                // получаем url поточного видео
                videoStreamUrl = window.URL.createObjectURL(localMediaStream);
                //устанавливаем как источник для video
                video.src = videoStreamUrl;
          localStream = localMediaStream;
      },
       //если ошибка
       function(){}
   );
   }    
    
    function capture() {
        if (!videoStreamUrl) {
            alert("Camera is off!");
            return;
        }
        
        var picWidth = photo.width;
        var picHeight = photo.height;
        photoContext.drawImage(video, 0,0,picWidth,picHeight);
        localStream.stop()
        $(pictureButtons).hide();
        $(hideAllButton).hide();
        $(hideSignatureButton).hide();
    }
    
    //ЗАГРУЗКА КАРТИНКИ ИЗ ФАЙЛА
    var fileStream = new FileReader();
    var image = new Image();
    
    fileStream.onload = function(e)
    {
        var dataUri = e.target.result;
        image.onload = function()
        {
            photoContext.drawImage(image,0,0,photo.width,photo.height);
        }
        image.src = dataUri;
    }
    
    function loadFile() 
    {
        var file = document.getElementById('file').files[0];
        fileStream.readAsDataURL(file);
    }
    

    //ОБРАБОТКА ПОДПИСИ
    var signatureArea = document.getElementById("signature");
    var signatureAreaContext = signatureArea.getContext("2d");
    var Drawing = false;
    var signatureButton = document.getElementById("signatureButton");
    var signatureCanvas = document.getElementById("hide-layout");
    var signatureContext = signatureCanvas.getContext("2d");
    
    signatureArea.onclick = function(){
        $(signatureCanvas).show();
        $(hideSignatureButton).show();
    }
    
    
    //События, отвечающие за взаимодействие мыши и канваса
        
    signatureCanvas.onmousedown = function (e) {
        $(hideSignatureButton).show();
        $(signatureCanvas).show();
        Drawing = true;
        signatureContext.beginPath();
        signatureContext.moveTo(e.offsetX, e.offsetY);        
    }
    signatureCanvas.onmousemove = function (e) {
        if (Drawing) {
            document.body.style.cursor='pointer';
            signatureContext.lineTo(e.offsetX, e.offsetY);
            signatureContext.stroke();
        }
    }
    signatureCanvas.onmouseup = function (e) {
        document.body.style.cursor='default';
        Drawing = false;
    }
    signatureCanvas.onmouseout = function (e) {
        document.body.style.cursor='default';
        Drawing = false;
    }
    
    signatureButton.onclick = function()
    {
        signatureAreaContext.clearRect(0, 0, signatureArea.width, signatureArea.height);
        signatureAreaContext.drawImage(signatureCanvas,0,0,signatureArea.width, signatureArea.height);
        signatureContext.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        $(signatureCanvas).hide();
    }
    
    //СОБЫТИЯ НА ВСПЛЫВАЮЩИЕ КНОПКИ
    photoArea.onclick = function () {
        $(pictureButtons).show();
        $(hideAllButton).show();
    }
    
    turnOnCameraButton.onclick = function () {start()};
    captureButton.onclick = function () { capture()};
    loadFileButton.onclick = function () { loadFile()};
    hideAllButton.onclick = function()
    {
        $(hideAllButton).hide();
        $(pictureButtons).hide();
        $(hideSignatureButton).hide();
    }
    hideSignatureButton.onclick = function()
    {
        signatureAreaContext.clearRect(0, 0, signatureArea.width, signatureArea.height);
        $(hideSignatureButton).hide();
    };
});
});