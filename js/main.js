define(["jquery"], function ($) {
$(document).ready(function () {
    //элемент с текстом
    var $span_element;
    //элемент для рисования(canvas) фото
    var foto = document.getElementById("foto");
    var foto_context = foto.getContext("2d");
    //для чтения картинки
    var reader = new FileReader();
    var img = new Image();
    //элемент для вывода видеопотока
    var video = document.getElementById("camera");
    //видеопоток
    var videoStreamUrl = false;
    //canvas для подписи
    var signature = document.getElementById("signature");
    var signature_context = signature.getContext("2d");
    var is_drawing = false;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    reader.onload = function (event) {
        var dataUri = event.target.result;
	//ждать, пока изображение не будет полностью обработано
        img.onload = function () {
            //изображение должно быть с таким же отношением высоты и ширины как у элемента foto
            foto_context.drawImage(img, 0, 0, foto.width, foto.height);
        };
        img.src = dataUri;
    };

    //написать свою информацию(любой текст)
    function change_text() {
        //создаем поле для ввода
        $input_element = $("<input class='input'></input>");
        //при снятии фокуса сохраняем текст
        $input_element.blur(save_text);
        //сохраняем элемент с текстом
        $span_element = $(this);
        //заменяем текст на поле ввода
        $(this).replaceWith($input_element);
        $input_element.focus();
    }

    //сохранить текст, введенный в input
    function save_text() {
        if ($(this).val().length > 0) {
            $span_element.text($(this).val());
        }
        $span_element.click(change_text);
        //возвращаем элемент с текстом
        $(this).replaceWith($span_element);
    }

    function load_from_file() {
        var file = document.getElementById('file').files[0];
        reader.readAsDataURL(file);
        $(".get_foto").hide();
        $("#hide").hide();
	$("#clear").hide();
    }

    //включение отображения с камеры в video
    function start_camera() {
        navigator.getUserMedia({
            video: true
        }, function (stream) {
            // разрешение от пользователя получено

            try {
                window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;
                // получаем url поточного видео
                videoStreamUrl = window.URL.createObjectURL(stream);
                //устанавливаем как источник для video
                video.src = videoStreamUrl;
            } catch (exception_var) {
                alert("Your browser does not support video stream");
            }
        }, function () {});
    }

    //возвращает массив из 4 элементов-параметров, задающих обрезку фото с камеры
    //обрезка подбирается в зависимости от размеров foto
    function central_area() {
        var ratio = foto.width / foto.height;
        if (ratio < video.videoWidth / video.videoHeight) {
            var new_width = video.videoHeight * ratio
            return [(video.videoWidth - new_width) / 2, 0, new_width, video.videoHeight]
        } else {
            var new_height = video.videoWidth * ratio
            return [0, (video.videoHeight - new_height) / 2, video.videoWidth, new_height]
        }
    }

    function capture() {
        if (!videoStreamUrl) {
            alert("Camera is disabled");
            return;
        }

        //параметры обрезки
        var params = central_area();
        // отрисовываем на canvas текущий обрезанный кадр видео
        foto_context.drawImage(video, params[0], params[1], params[2], params[3], 0, 0, foto.width, foto.height);
        $(".get_foto").hide();
        $("#hide").hide();
	$("#clear").hide();
    }

    //привязка событий кнопок

    $(".text").click(change_text);
    $(".text2").click(change_text);
    $("#foto").click(function () {
        $("#hide").show();
        $(".get_foto").show();
    });
    $("#load").click(load_from_file);
    $("#start").click(start_camera);
    $("#capture").click(capture);
    $("#hide").click(function () {
        $("#hide").hide();
        $(".get_foto").hide();
        $("#clear").hide();
    });
    $("#clear").click(function () {
        signature_context.clearRect(0, 0, signature.width, signature.height);
    });

    //привязка событий для рисования

    signature.onmousedown = function (e) {
        $("#clear").show();
        $("#hide").show();
        signature_context.beginPath();
        signature_context.moveTo(e.offsetX, e.offsetY);
        is_drawing = true;
    }

    signature.onmouseup = function (e) {
        is_drawing = false;
    }

    signature.onmouseout = function (e) {
        is_drawing = false;
    }

    signature.onmousemove = function (e) {
        if (is_drawing) {
            signature_context.lineTo(e.offsetX, e.offsetY);
            signature_context.stroke();
        }
    }
});
});