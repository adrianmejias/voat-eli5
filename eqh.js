// equal heights
(function($) {
    $.fn.eqh = function() {
        var currentTallest = 0,
            currentRowStart = 0,
            rowDivs = [],
            topPosition = 0;
        return this.each(function() {
            if (undefined === $(this).data('voat')) {
                $(this).data('voat', 'true');
                topPosition = $(this).position().top;
                if (currentRowStart != topPosition) {
                    for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                        rowDivs[currentDiv].height(currentTallest);
                    }
                    rowDivs = [];
                    currentRowStart = topPosition;
                    currentTallest = $(this).height();
                    rowDivs.push($(this));
                } else {
                    rowDivs.push($(this));
                    currentTallest = currentTallest < $(this).height() ? $(this).height() : currentTallest;
                }
                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                    rowDivs[currentDiv].height(currentTallest);
                }
            }
        });​
    };
})(jQuery);