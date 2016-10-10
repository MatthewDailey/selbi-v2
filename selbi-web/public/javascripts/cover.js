$('li').on('click', function() {
	if($(this).hasClass('active')) {
		return;
	} else {
		$('li').removeClass('active');
		$(this).addClass('active');
	}
})