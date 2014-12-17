 define(["jquery"], function ($) {
$(function () {
$(document).ready(function() {
		
    function edit(){
		$a = $(this);
		
		$enter_text = $("<input class = 'data' type = 'text' size='8' value =" + $(this).text() +"></input>");
		$(this).replaceWith($enter_text);	
				
		$enter_text.focus();
		
 		$enter_text.blur( function() { 
 			if ($(this).val().length > 0) {		
				$a.text($(this).val());
			}
				$enter_text.replaceWith($a);
				$a.click(edit);
			});	
    }
	
	var
		sign = $("#sign")[0],
		foto = $("#foto")[0],
		fContext = foto.getContext("2d"),
		video = $("#camera")[0],
		videoStreamUrl = false,
		localStream;
                                    
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    

    
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
   };
   
   function capture() {

        if (!videoStreamUrl) {
            alert("Camera is off!");
            return;
        }
        
        var width = foto.width;
        var heigth = foto.height;
        fContext.drawImage(video, 0,0,width,heigth);
        localStream.stop();
		$(".foto_panel").hide();
		
    }
	
	
	var reader = new FileReader();
	reader.onload = function(event) {
		var dataUri = event.target.result,
			img = new Image();
	
		img.onload = function() {
			fContext.drawImage(img, 0, 0,foto.width,foto.height);
		};
		
		img.src = dataUri;
		$(".foto_panel").hide();
	};
	
	function load() {
		var file = $('#file')[0].files[0];
		if (file != undefined){
			reader.readAsDataURL(file);
		}
	}
	
	function draw() {
	
		//var dp = open("index.html","SignPanel","height = 250, width = 500, left = 500, top = 200, location = no, toolbar = no, menubar = no");
	  canvas = document.getElementById("sign");
      context = canvas.getContext("2d");
	  isDrawing = false;
	  $(this).css("cursor","pointer");
	  
		function startDrawing(e) {
			isDrawing = true;
			context.beginPath();
			context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
		}
		
		function drawing(e) {
			if (isDrawing == true)
			{
				var x = e.pageX - canvas.offsetLeft;
				var y = e.pageY - canvas.offsetTop;
				context.lineTo(x, y);
				context.stroke();
			}
		}
		
		function stopDrawing() {
			isDrawing = false;	
			$(this).css("cursor","default");
		}
				
      canvas.onmousedown = startDrawing;
      canvas.onmouseup = stopDrawing;
      canvas.onmouseout = stopDrawing;
      canvas.onmousemove = drawing;
	  
	};
	
		function clear() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	$(".data").click(edit);	
	$("#foto").click( function () {
	
		$(".foto_panel").show();
	})
	
	$("#sf").click(start);
	$("#tfoto").click(capture);
	$("#load").click(load);
	$("#sign").click(draw);
	$("#signt").click(clear);
	
	
});

});
});

