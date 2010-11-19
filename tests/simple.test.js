var zoneSensible = $('<div>')
	.css({
		width:'200px',
		height: '100px',
		background: 'red'
	})
	.appendTo(document.body)
	.hoverintent(
		function() {
			$(this).css('background', 'lime');
		},
		function() {
			$(this).css('background', 'red');
		}
	);
