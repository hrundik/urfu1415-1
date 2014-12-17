define(["jquery"], function ($) {
$(function () {
$(document).ready(function() {
	
	var photo = $("#photo")[0];				//canvas для фото
	var	fContext = photo.getContext("2d");
	var	video = $("#cam")[0];				//вывод видеопотока
	var	videoStreamUrl = false;				//поток видео
	var	localStream;
	var	reader = new FileReader();			//чтение картинки
	var canvas, context, tool;    			//canvas для подписи
	
		
		//замена текста
    function edit(){
		$text = $(this);

		$enter_text = $("<input class = 'text' type = 'text' value =" + $(this).text() +"></input>");
		$(this).replaceWith($enter_text);

		$enter_text.focus();

		$enter_text.blur( function() {
			if ($(this).val().length > 0) {
				$text.text($(this).val());
			}
			$enter_text.replaceWith($text);
			$text.click(edit);
		});

	}    

	
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	//включение камеры
    function start() {	
 	    navigator.getUserMedia (
		{
			video: true, 
		},
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
   };
	//захват из веб-камеры и отрисовка в canvas
	function capture() {
         if (!videoStreamUrl) {
             alert("Камера не включена!");
             return;
         }	         
        var width = photo.width;
        var heigth = photo.height;
        fContext.drawImage(video, 0,0,width,heigth);
        localStream.stop();
		$(".panel").hide();
     }
	 
	reader.onload = function(event) {
		var dataUri = event.target.result;
		var img = new Image();
	
		img.onload = function() {
			fContext.drawImage(img, 0, 0,photo.width,photo.height);
		};
		
		img.src = dataUri;
		$(".panel").hide();
	};
	//вставка фото из файла
	function load() {
		var file = $('#file_name')[0].files[0];
		if (file != undefined){
			reader.readAsDataURL(file);
		}
	}
	
	 
    function init () {
        canvas = document.getElementById('sign');
        context = canvas.getContext('2d');
        tool = new tool_pencil();
        canvas.addEventListener('mousedown', ev_canvas, false);
        canvas.addEventListener('mousemove', ev_canvas, false);
        canvas.addEventListener('mouseup',   ev_canvas, false);
    }

    // движения мыши
    function tool_pencil () {
        var tool = this;
        this.started = false;
    
        this.mousedown = function (ev) {
            context.beginPath();
            context.moveTo(ev._x, ev._y);
            tool.started = true;
        };

        // рисования при нажатий на клавишу
        this.mousemove = function (ev) {
            if (tool.started) {
				
                context.lineTo(ev._x, ev._y);
                context.stroke();
            }
        };

        // Событие при отпускании мыши
        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
            }
        };
    }

    // Эта функция определяет позицию курсора относительно холста
    function ev_canvas (ev) {
        if (ev.offsetX || ev.offsetX == 0) { 
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

        // Вызываем обработчик события tool
        var func = tool[ev.type];
        if (func) {
            func(ev);
        }
    }
	function clear_canvas() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
    init();

	
	
	
	
	$("#photo").click( function () {
	
		$(".panel").show();
	})
	$("#cam_photo").click(start);
	$("#take_photo").click(capture);
	$("#load").click(load);
	
	$("#6").click(clear_canvas);//удаление подписи по нажатию на 6
	
	$(".text").click(edit);
	$(".text_3").click(edit);
	$(".text_4").click(edit);
	$(".category").click(edit);




});

});
});