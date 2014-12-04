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

	$(".text").click(edit);
	$(".text_3").click(edit);
	$(".text_4").click(edit);
	$(".category").click(edit);




});

});
});