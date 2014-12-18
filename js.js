(function() {
	$(function() {
	
	
	
	$("#Signature").click(function () {
			var PopUpWindow = OpenWindow(133);
			$(PopUpWindow).html('<canvas id="Canvas" width="320" height="100"></canvas>\
										<br>\
										<input id="Button" type="button" value="Сохранить" />');
		

			var canvas = document.getElementById("Canvas");
			var context = canvas.getContext('2d');

			$("#Canvas").mousedown(function(e) {
				var coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
				var coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

				context.beginPath();
				context.moveTo(coordX, coordY);

				$("#Canvas").mousemove(function(e) {
					coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
					coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

					context.lineTo(coordX, coordY);

					context.strokeStyle = "#008";
					context.stroke();
				});
				$("#Canvas").mouseup(function(e) {
					coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
					coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

					context.lineTo(coordX, coordY);
					
					context.strokeStyle = "#008";
					context.stroke();
					
					context.closePath();
					
					$("#Canvas").unbind("mousemove");
					$("#Canvas").unbind("mouseup");
				});
			});

			$("#Button").click(function() {
				$("#Signature").html("<img>");
				$("#Signature img").attr("src", canvas.toDataURL('image/png')).css("width", "200px");
				CloseWindow();
			});
		});
	
	
	

		$("#Photo").click(function() {
    	var videoUrl = false;           
			var PopUpWindow = OpenWindow(300);
			$(PopUpWindow).html('<video id="video" width="320" height="240" autoplay="autoplay" ></video>\
										<br>\
										<input id="Button" type="button" value="Сделать фото" />');

			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		  window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;

		  
		  navigator.getUserMedia({video: true}, function (stream) {

				videoUrl = window.URL.createObjectURL(stream);
				 
				$("#video").attr("src", videoUrl);
		  }, function () {
              console.log('');
		  });

			$("#Button").click(function() {
				var canvas = document.createElement("canvas");
				canvas.height = 240;
				canvas.width = 320;
				var context = canvas.getContext('2d');

				if (!videoUrl) alert('Ошибка веб-камеры');
		   
		    context.translate(canvas.width, 0);
		    context.scale(-1, 1);
		   
				context.drawImage($("#video")[0], 0, 0, $("#video").attr("width"), $("#video").attr("height"));
		
		    var base64dataUrl = canvas.toDataURL('image/png');

				var img = new Image();
				img.src = base64dataUrl;

				context.setTransform(1, 0, 0, 1, 0, 0);
				context.drawImage(img, 80, 10, img.width, img.height, 0, 0, canvas.width, canvas.height);

				base64dataUrl = canvas.toDataURL('image/png');

		    $("#Photo").css("background-image", "url(" + base64dataUrl + ")");
				CloseWindow();
			});
		});
		$(".edit").each(function() {
			
            if(!$(this).text()) {
			$(this).text($(this).attr("data-value"));
            }
		});
		$(".edit").click(function() {
			var value = $(this).text() == $(this).attr("data-value") ? "" : $(this).text();
			var id = $(this).attr("id");

			$(this).text("");
			$(this).after('<input type="text"  value="' + value + '" id="edit' + id + '">');
			$("#edit" + id).focus();

			$("#edit" + id).blur(function() {
				var val = $(this).val();

				$(this).unbind("blur");
				$(this).remove();
				$("#" + id).text(val);
				
                 if(!$($("#" + id)).text()) {
			$($("#" + id)).text($($("#" + id)).attr("data-value"));
            }
			});
		});
	});
    
    
	function OpenWindow(height) {
		$("body").prepend('<div id="ArroundArea"></div><div id="PopUpWindow"></div>');
		$("#ArroundArea").click(function() {
			CloseWindow();
		});
		return $("#PopUpWindow")
			.css("height", height == undefined ? "300px" : height + "px");
	}
	function CloseWindow() {
			$("#ArroundArea, #PopUpWindow").remove();
	}
    
    
    		

})();