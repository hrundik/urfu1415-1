define(["jquery"], function ($) {
$(function () {
$(document).ready(function() {
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
	var
		photo = $("#photo")[0],				//canvas для фото
		fContext = photo.getContext("2d"),
		video = $("#cam")[0],
		videoStreamUrl = false,
		localStream;
                                     		                                     
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
     		     
     		     
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
	
	function capture() {

         if (!videoStreamUrl) {
             alert("Camera is off!");
             return;
         }
         		         
        var width = photo.width;
        var heigth = photo.height;
        fContext.drawImage(video, 0,0,width,heigth);
        localStream.stop();
		$(".panel").hide();
		
     }
	
	
	
	
	$("#photo").click( function () {
	
		$(".panel").show();
	})
	$("#cam_photo").click(start);
	$("#take_photo").click(capture);
	
	$(".text").click(edit);
	$(".text_3").click(edit);
	$(".text_4").click(edit);
	$(".category").click(edit);




});

});
});