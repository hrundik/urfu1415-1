(function () {
    $(function () {


        $("#userphoto").click(function () {

            var modal = createModal();
            $(modal).html(' <div class="modal"> <video width="200" height="200" id="video" autoplay="autoplay"></video> </div> <input id="button" type="button" value="Сделать снимок" /> <input id="buttonSave" type="button" value="Сохранить в профиль" /><div align="right" class="screen"> <canvas id="canvas" width="200" height="200"></canvas></div>');
            var canvas = document.getElementById('canvas');
            var video = document.getElementById('video');
            var button = document.getElementById('button');
            var context = canvas.getContext('2d');
            var videoStreamUrl = false;

             
            var captureMe = function () {
                if (!videoStreamUrl) alert('что то не так с видеостримом')
                // переворачиваем canvas зеркально по горизонтали 
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                context.drawImage(video, 0, 0, video.width, video.height);
                var urlNewUserPhoto = canvas.toDataURL('image/png');
                context.setTransform(1, 0, 0, 1, 0, 0); // убираем все кастомные трансформации canvas            
               

                $("#buttonSave").click(function () {
                    $("#userphoto").attr({
                        'src': urlNewUserPhoto,
                            'width': 200,
                            'height': 150
                    });
                    $("#background, #modal").remove();

                })

            }

            button.addEventListener('click', captureMe);

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;

            // запрашиваем разрешение на доступ к поточному видео камеры
            navigator.getUserMedia({
                video: true
            }, function (stream) {
                // получаем url поточного видео
                videoStreamUrl = window.URL.createObjectURL(stream);
                // устанавливаем как источник для video 
                video.src = videoStreamUrl;

            }, function () {
                console.log('что-то не так с видеостримом или пользователь запретил его использовать');
            });

        })



        $(".changeInfo").each(function () {
            textEdit(this)
        });

        $(".changeInfo").click(function () {

            var value = $(this).text() == $(this).attr("data-value") ? "" : $(this).text();
            var id = $(this).attr("id");

            $(this).text("");
            $(this).after('<input type="text" value="' + value + '" id="changeInfo' + id + '">');
            $("#changeInfo" + id).focus();

            $("#changeInfo" + id).blur(function () {
                var val = $(this).val();
                $(this).remove();
                $("#" + id).text(val);
                textEdit($("#" + id));
            });
        });
    

    function textEdit(elem) {
        if (!$(elem).text()) {
            $(elem).text($(elem).attr("data-value"));
        }
    }

    function createModal() {
        $("body").prepend('<div id="background"></div><div id="modal"></div>');
        $("#background").click(function () {
            $("#background, #modal").remove();
        });
        return $("#modal")

    }


        $("#drawsign").click(function () {
        var modal = createModal();
        $(modal).html('<canvas id="canvasSign" width="420" height="200"></canvas>\
										<br>\
										<input id="buttonSign" type="button" value="Сохранить подпись в профиль" />');


        var canvas = document.getElementById("canvasSign");
        var context = canvas.getContext('2d');

        $("#canvasSign").mousedown(function (e) {
            var coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
            var coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

            context.beginPath();
            context.moveTo(coordX, coordY);

            $("#canvasSign").mousemove(function (e) {
                coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
                coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

                context.lineTo(coordX, coordY);

                context.strokeStyle = "#000";
                context.stroke();
            });
            
            $("#canvasSign").mouseup(function (e) {
                coordX = e.offsetX == undefined ? e.layerX : e.offsetX;
                coordY = e.offsetY == undefined ? e.layerY : e.offsetY;

                context.lineTo(coordX, coordY);

                context.strokeStyle = "#000";
                context.stroke();

                context.closePath();

                $("#canvasSign").unbind("mousemove");
                $("#canvasSign").unbind("mouseup");
            });
        });
        
        $("#buttonSign").click(function () {
            $("#drawsign").html("<img>");
            $("#drawsign img").attr("src", canvas.toDataURL('image/png')).css("width", "100px");
            $("#background, #modal").remove();
        });
        
        });
        
    });
})();