var masquable = $('<div>')
            .css({
                position: 'relative',
                width:'200px',
                height: '100px',
                background: 'blue',
                margin: '5px',
                display: 'none'
            })
            .append(
                $('<div>')
                    .css({
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        bottom: 10,
                        width: '50%',
                        background: 'pink'
                    })
            );

var zoneSensible = $('<div>')
	.css({
        position: 'relative',
		width:'200px',
		height: '100px',
		background: 'red',
        margin: '5px'
	})
    .append(
        $('<div>')
            .css({
                position: 'absolute',
                top: 10,
                right: 10,
                bottom: 10,
                width: '50%',
                background: 'green'
            })
    )
    .add(masquable)
	.appendTo(document.body)
	.hoverintent(
		function() {
			$(masquable).fadeIn();
		},
		function() {
			$(masquable).fadeOut();
		},
        {
            group:true
        }
	);
