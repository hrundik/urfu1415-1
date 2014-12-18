(function () {
    $(function () {
				$("#PersonImage").click(function () {
        var videoStreamUrl = false;

        var modal = openModal(300);
        $(modal).html('<video id="video" width="320" height="240" autoplay="autoplay" ></video>\
										<br>\
										<input id="button" type="button" value="Сделать фото" />');


        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;

        // запрашиваем разрешение на доступ к камере
        navigator.getUserMedia({
            video: true
        }, function (stream) {
            videoStreamUrl = window.URL.createObjectURL(stream);
            $("#video").attr("src", videoStreamUrl); //Проигрываем видео из потока
        }, function () {});

        $("#button").click(function () {
            var canvas = document.createElement("canvas");
            canvas.height = 240;
            canvas.width = 320;
            var context = canvas.getContext('2d');

            if (!videoStreamUrl) alert('Error!');

            context.translate(canvas.width, 0); //сдвигаем
            context.scale(-1, 1); //отражаем сверху вниз
            context.drawImage($("#video")[0], 0, 0, $("#video").attr("width"), $("#video").attr("height"));



            $("#PersonImage").attr("src", canvas.toDataURL('image/png'));
            closeModal();

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.drawImage(img, 80, 10, img.width, img.height, 0, 0, canvas.width, canvas.height);

            var base64dataUrl = canvas.toDataURL('image/png');

            $("#PersonImage").css("background-image", "url(" + base64dataUrl + ")");
            closeModal();
        });
    });
        $("#sign").click(function () {
            var modal = openModal(133);
            $(modal).html('<canvas id="canvas" width="320" height="100"></canvas>\
										<br>\
										<input id="button" type="button" value="Расписаться" />');
            $("#canvas").css("position", "relative").css("border-bottom", "4px solid #0099CC");

            var canvas = document.getElementById("canvas");
            var context = canvas.getContext('2d');

            $("#canvas").mousedown(function (e) {
                var coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
                var coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

                context.beginPath();
                context.moveTo(coordX, coordY);

                $("#canvas").mousemove(function (e) {
                    coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
                    coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

                    context.lineTo(coordX, coordY);

                    context.strokeStyle = "#0099CC";
                    context.stroke();
                });
                $("#canvas").mouseup(function (e) {
                    coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
                    coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

                    context.lineTo(coordX, coordY);

                    context.strokeStyle = "#0099CC";
                    context.stroke();

                    context.closePath();

                    $("#canvas").unbind("mousemove");
                    $("#canvas").unbind("mouseup");
                });
            });

            $("#button").click(function () {
                $("#sign").html("<img>");
                $("#sign img").attr("src", canvas.toDataURL('image/png')).css("width", "200px");

                closeModal();
            });
        });

        $(".fields").each(function () {
            checkElem(this);
        });
        $(".fields").click(function () {
            var value = $(this).text() == $(this).attr("data-value") ? "" : $(this).text();
            var id = $(this).attr("id");

            $(this).text("");
            $(this).after('<input type="text" value="' + value + '" id="fields' + id + '">');
            $("#fields" + id).focus();

            $("#fields" + id).blur(function () {
                var val = $(this).val();

                $(this).unbind("blur");
                $(this).remove();
                $("#" + id).text(val);
                checkElem($("#" + id));
            });
        });
    });

    function checkElem(elem) {
        if (!$(elem).text()) {
            $(elem).text($(elem).attr("data-value"));


        }
    }


    function openModal(height) {
        $("body").prepend('<div id="modal"></div>');
        return $("#modal")
            .css("height", height == undefined ? "300px" : height + "px");
    }

    function closeModal() {
        $("#modal").remove();
    }

    


})();
