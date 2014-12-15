(function() {
	$(function() {
		$("#sign").click(function () {
			var modal = openModal(133);
			$(modal).html('<canvas id="canvas" width="320" height="100"></canvas>\
										<br>\
										<input id="button" type="button" value="Сохранить" />');
			$("#canvas").css("position", "relative").css("border-bottom", "1px solid #000");

			var canvas = document.getElementById("canvas");
			var context = canvas.getContext('2d');

			$("#canvas").mousedown(function(e) {
				var coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
				var coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

				context.beginPath();
				context.moveTo(coordX, coordY);

				$("#canvas").mousemove(function(e) {
					coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
					coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

					context.lineTo(coordX, coordY);

					context.strokeStyle = "#000";
					context.stroke();
				});
				$("#canvas").mouseup(function(e) {
					coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
					coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

					context.lineTo(coordX, coordY);
					
					context.strokeStyle = "#000";
					context.stroke();
					
					context.closePath();
					
					$("#canvas").unbind("mousemove");
					$("#canvas").unbind("mouseup");
				});
			});

			$("#button").click(function() {
				$("#sign").html("<img>");
				$("#sign img").attr("src", canvas.toDataURL('image/png')).css("width", "200px");
				closeModal();
			});
		});
		$("#foto").click(function() {
    	var videoStreamUrl = false;

			var modal = openModal(273);
			$(modal).html('<video id="video" width="320" height="240" autoplay="autoplay" ></video>\
										<br>\
										<input id="button" type="button" value="Сфотографировать" />');

			//разруливаем браузерную войну
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		  window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;

		  // запрашиваем разрешение на доступ к поточному видео камеры
		  navigator.getUserMedia({video: true}, function (stream) {
				// получаем url поточного видео
				videoStreamUrl = window.URL.createObjectURL(stream);
				// устанавливаем как источник для video 
				$("#video").attr("src", videoStreamUrl);
		  }, function () {
		    console.log('что-то не так с видеостримом или пользователь запретил его использовать :P');
		  });

			$("#button").click(function() {
				var canvas = document.createElement("canvas");
				canvas.height = 240;
				canvas.width = 320;
				var context = canvas.getContext('2d');

				if (!videoStreamUrl) alert('То-ли вы не нажали "разрешить" в верху окна, то-ли что-то не так с вашим видео стримом');
		    // переворачиваем canvas зеркально по горизонтали
		    context.translate(canvas.width, 0);
		    context.scale(-1, 1);
		    // отрисовываем на канвасе текущий кадр видео
				context.drawImage($("#video")[0], 0, 0, $("#video").attr("width"), $("#video").attr("height"));
		    //
		    // получаем data: url изображения c canvas
		    var base64dataUrl = canvas.toDataURL('image/png');

				var img = new Image();
				img.src = base64dataUrl;

				context.setTransform(1, 0, 0, 1, 0, 0);
				context.drawImage(img, 80, 10, img.width, img.height, 0, 0, canvas.width, canvas.height);

				base64dataUrl = canvas.toDataURL('image/png');

		    $("#foto").css("background-image", "url(" + base64dataUrl + ")");
				closeModal();
			});
		});
		$(".editable").each(function() {
			checkElem(this);
		});
		$(".editable").click(function() {
			var value = $(this).text() == $(this).attr("data-value") ? "" : $(this).text();
			var id = $(this).attr("id");

			$(this).text("");
			$(this).after('<input type="text" value="' + value + '" id="editable' + id + '">');
			$("#editable" + id).focus();

			$("#editable" + id).blur(function() {
				var val = $(this).val();

				$(this).unbind("blur");
				$(this).remove();
				$("#" + id).text(val);
				checkElem($("#" + id));
			});
		});
	});
	function openModal(height) {
		$("body").prepend('<div id="place"></div><div id="modal"></div>');
		$("#place").click(function() {
			closeModal();
		});
		return $("#modal")
			.css("height", height == undefined ? "300px" : height + "px");
	}
	function closeModal() {
			$("#place, #modal").remove();
	}
	function checkElem(elem) {
		if(!$(elem).text()) {
			$(elem).text($(elem).attr("data-value"));
			$(elem).addClass("empty");
		} else {
			$(elem).removeClass("empty");
		}
	}
})();
