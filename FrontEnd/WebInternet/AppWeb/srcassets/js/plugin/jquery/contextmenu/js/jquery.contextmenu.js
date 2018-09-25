(function ($, window) {

	$.fn.contextMenu = function (settings) {

		return this.each(function () {

			// Open context menu
			$(this).on("contextmenu", function (e) {
				// return native menu if pressing control
				if (e.ctrlKey) return;

				//open menu
				$(settings.menuSelector)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                    	position: "absolute",
                    	left: getMenuPosition(e.pageX, 'width'),
                    	top: getMenuPosition(e.pageY, 'height')
                    })
                    .off('click')
                    .on('click', function (e) {
                    	$(this).hide();

                    	var $invokedOn = $(this).data("invokedOn");
                    	var $selectedMenu = $(e.target);

                    	settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                    });

				return false;
			});

			//make sure menu closes on any click
			$(document).click(function () {
				$(settings.menuSelector).hide();
			});
		});

		function getMenuPosition(mouse, direction) {
			var win = $(window)[direction]();
			var page = $(document)[direction]();
			var menu = $(settings.menuSelector)[direction]();

			//if (direction == 'height') {
			//	console.log("direction:", direction);
			//	console.log("mouse", mouse);
			//	console.log("menu", Math.round(menu));
			//	console.log("page", page);
			//	console.log("window", win);
			//}

			// opening menu would pass the side of the page
			if (mouse + menu > page && menu < mouse) {
				return mouse - menu;
			}
			return mouse;
		}

	};
})(jQuery, window);