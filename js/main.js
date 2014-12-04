define(["jquery"], function ($) {
$(function () {
$(document).ready(function() {
		
    function edit(){
		$a = $(this);
		
		$enter_text = $("<input class = 'data' type = 'text' size='10' value =" + $(this).text() +"></input>");
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

    $(".data").click(edit);
	
	$("#foto").click( function () {
		$(".foto_panel").show();
	})
	
		$("#sf").click( function () {
			start();
			});
	
    var foto = document.getElementById("foto");
    var fContext = foto.getContext("2d");
    var video = document.getElementById("camera");
    var videoStreamUrl = false;
                                    
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
    var localStream;
    
   function start() {
	   console.log("start");
	   
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
		   function(){console.log("Error");}
	   );
   }  ;
   
   function capture() {
        if (!videoStreamUrl) {
            alert("Camera is off!");
            return;
        }
        
        var width = photo.width;
        var heigth = photo.height;
        fContext.drawImage(video, 0,0,width,height);
        localStream.stop()
    }
    

	
	//$('#sf').click(start);
	
	
});

});
});

