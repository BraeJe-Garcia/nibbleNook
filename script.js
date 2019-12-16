$(document).ready(function() {
    setupToggled();
    setupAccordion();
    setupDropdown();
    $('body').addClass('javascript');
});
function setupToggled() {
    $('.toggled').each(function() {
        var node = $(this);
        var open_toggles = $('.' + node.attr('id') + "_open");
        var close_toggles = $('.' + node.attr('id') + "_close");
        if (node.hasClass('open')) {
            close_toggles.each(function() {
                $(this).show();
            });
            open_toggles.each(function() {
                $(this).hide();
            });
        } else {
            node.hide();
            close_toggles.each(function() {
                $(this).hide();
            });
            open_toggles.each(function() {
                $(this).show();
            });
        }
        open_toggles.each(function() {
            $(this).click(function(e) {
                if ($(this).attr('href') == '#') {
                    e.preventDefault();
                }
                node.show();
                open_toggles.each(function() {
                    $(this).hide();
                });
                close_toggles.each(function() {
                    $(this).show();
                });
            });
        });
        close_toggles.each(function() {
            $(this).click(function(e) {
                if ($(this).attr('href') == '#') {
                    e.preventDefault();
                }
                node.hide();
                close_toggles.each(function() {
                    $(this).hide();
                });
                open_toggles.each(function() {
                    $(this).show();
                });
            });
        });
    });
}

function setupDropdown() {
    $('#header').find('.dropdown').attr("aria-haspopup", true);
    $('#header').find('.dropdown, .dropdown .actions').children('a').attr({
        'class': 'dropdown-toggle',
        'data-toggle': 'dropdown',
        'data-target': '#'
    });
    $('.dropdown').find('.menu').addClass("dropdown-menu");
    $('.dropdown').find('.menu').children('li').attr("role", "menu-item");
}

function setupAccordion() {
	$(".expandable").each(function() {
		var pane = $(this);
		if (!pane.hasClass("hidden")) {
			pane.addClass("hidden");
		}
		;pane.prev().removeClass("hidden").addClass("collapsed").click(function(e) {
			var expander = $(this);
			if (expander.attr('href') == '#') {
				e.preventDefault();
			}
			;expander.toggleClass("collapsed").toggleClass("expanded").next().toggleClass("hidden");
		});
	});
}

function toggleFilter() {
    document.getElementById("work-filters").classList.toggle("narrow-hidden");
}