var pages = [],
    links = [],
    loading = false,
    shorten = 30,
    no_more = false,
    stickied = false,
    duplicates = [],
    columns = 2,
    color = $('#header-container').css('color'),
    backgroundColor = $('#header-container').css('background-color'),
    borderColor = $('#header-container').css('border-top-color');
columns = localStorage.columns || columns;
$('body').css('font-family', "'Open Sans', sans-serif");
$('#header-account').hide();
$('.side').hide();
$('.tabmenu').append($('<li>').addClass('disabled').css('opacity', '.45').append($('<a>').addClass('toggle-side').attr('href', '#').append($('<span>').addClass('glyphicon glyphicon-object-align-top')).click(function(e) {
    e.preventDefault();
    $('.side').toggle();
    if ($('.side').is(':hidden')) {
        $(this).css('opacity', '.45');
        $('.sitetable .submission[data-fullname]').removeClass('col-1').addClass('col-' + columns);
        if (columns > 1) {
            $('.sitetable .submission[data-fullname]').eqh();
        }
    } else {
        $(this).css('opacity', '1');
        $('.sitetable .submission[data-fullname]').removeClass('col-' + columns).addClass('col-1');
    }
}))).append($('<li>').addClass('disabled').css('opacity', '.45').append($('<a>').addClass('toggle-votes').attr('href', '#').append($('<span>').addClass('glyphicon glyphicon-thumbs-up')).click(function(e) {
    e.preventDefault();
    $('.midcol.unvoted, .scorebar').toggle();
    if ($('.midcol.unvoted').is(':hidden')) {
        $(this).css('opacity', '.45');
    } else {
        $(this).css('opacity', '1');
    }
}))).append($('<li>').addClass('disabled').css('opacity', '.45').append($('<a>').addClass('toggle-account').attr('href', '#').append($('<span>').addClass('glyphicon glyphicon-user')).click(function(e) {
    e.preventDefault();
    $('#header-account').toggle();
    if ($('#header-account').is(':hidden')) {
        $(this).css('opacity', '.45');
    } else {
        $(this).css('opacity', '1');
    }
}))).append($('<li>').addClass('disabled column-btn-list').append($('<a>').attr('href', '#').append($('<span>').addClass('glyphicon glyphicon-th-large')).hover(function(){
    $(this).find('.toggle-columns').show();
}, function(){}).blur(function() {
    $(this).find('.toggle-columns').hide();
}).append($('<ul>').hover(function() {
    $(this).show();
}, function() {
    $(this).hide();
}).addClass('list-unstyled toggle-columns').css({
    color: color,
    backgroundColor: backgroundColor,
    border: '1px solid ' + borderColor
}).append($('<li>').append($('<a>').attr('href', '#').click(function(e) {
    e.preventDefault();
    $('.sitetable .submission[data-fullname]').removeClass('col-2 col-3').addClass('col-1');
    columns = 1;
    localStorage.columns = 1;
}).text('1 Column'))).append($('<li>').append($('<a>').attr('href', '#').click(function(e) {
    e.preventDefault();
    $('.sitetable .submission[data-fullname]').removeClass('col-1 col-2').addClass('col-2').eqh();
    columns = 2;
    localStorage.columns = 2;
}).text('2 Columns'))).append($('<li>').append($('<a>').attr('href', '#').click(function(e) {
    e.preventDefault();
    $('.sitetable .submission[data-fullname]').removeClass('col-1 col-2').addClass('col-3').eqh();
    columns = 3;
    localStorage.columns = 3;
}).text('3 Columns'))))));
//$('.content').css('width', '100%');
if ($('.pagination-container').length) {
    $('.pagination-container').hide();
    $('.sitetable').after($('<div>').addClass('pagination-container').append(
        $('<ul>')
        .append($('<li>').addClass('btn-whoaverse-paging more').append($('<a>').attr('href', '#').text('Scroll to load more...')).hide())
        .append($('<li>').addClass('btn-whoaverse-paging load-more').append($('<a>').attr('href', '#').text('Loading more...')).hide())
        .append($('<li>').addClass('btn-whoaverse-paging no-more').append($('<a>').attr('href', '#').text('No more pages to load.')).hide())
    ));
    $('a[href="/random"]').remove();
    $('body').prepend($('<div>').attr('id', 'link-overlay').addClass('link-overlay').hide().click(function(e) {
        e.preventDefault();
        $(this).hide();
        $('#expando-item').remove();
    }));
    // format submission on init
    var formatSubmission = function() {
        var id = $(this).data('fullname') || -1;
        if (id == -1) {
            if (stickied) {
                $(this).hide();
            }
            stickied = true;
            return;
        }
        if ($.inArray(id, links) == -1) {
            links.push(id);
            $(this).addClass('col col-' + columns);
            var commentLink = $(this).find('.flat-list.buttons .first a'),
                link = $(this).find('p.title a.title'),
                text = link.text();
            // trim title
            /*if (text.length > shorten + 3) {
                trimmedString = text.substring(0, shorten);
                trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
                link.text(trimmedString + ' ..');
            }*/
            $(this).find('.scorebar').addClass('no-scorebar');
            // hide voting
            $(this).find('.midcol.unvoted, .scorebar').hide();
            // show comment + link
            if (commentLink.attr('href') != link.attr('href')) {
                $(this).find('.flat-list.buttons .first').after($('<li>').append($('<a>').attr({
                    href: link.attr('href'),
                    target: '_blank'
                }).addClass('option main active').text('open link and ' + (commentLink.text() == 'discuss' ? 'discuss' : 'comments')).click(function(e) {
                    window.open(commentLink.attr('href'), '_blank');
                })));
            }
            // override expando
            var $this = $(this);
            $(this).find('.expando-button').hide();
            // big thumbnail
            var thumbnail = $(this).find('.thumbnail').css('border', 'none'),
                title = $(this).find('p.title a.title');
            var youtube = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
            if (title.length > 0 && title.attr('href').match(/veuwer\.com\/i\/([a-zA-Z0-9]+)$/g)) {
                titleSrc = title.attr('href').replace('http:', 'https:') + '.jpg';
                $(this).find('.clearleft').after(
                    $('<div>').addClass('embed-item').append(
                        $('<img>').attr('src', titleSrc).addClass('img-responsive').attr('data-featherlight', titleSrc)
                    )
                );
                if (thumbnail.length > 0) {
                    thumbnail.remove();
                }
            } else if (title.length > 0 && title.attr('href').match(/(.+)\.(jpe|jpe?g|gif|png)$/g) && !title.attr('href').match(/slimimgur\.com/g)) {
                titleSrc = title.attr('href').match(/imgur\.com/g) && !title.attr('href').match(/slimimgur\.com/g) ? title.attr('href').replace('http:', 'https:') : title.attr('href');
                $(this).find('.clearleft').after(
                    $('<div>').addClass('embed-item').append(
                        $('<img>').attr('src', titleSrc).addClass('img-responsive').attr('data-featherlight', titleSrc)
                    )
                );
                if (thumbnail.length > 0) {
                    thumbnail.remove();
                }
            } else if (title.length > 0 && title.attr('href').match(/(.+)\.(gifv|webm)$/g) && !title.attr('href').match(/slimimgur\.com/g)) {
                titleSrc = title.attr('href').match(/imgur\.com/g) ? title.attr('href').replace('http:', 'https:') : title.attr('href');
                $(this).find('.clearleft').after(
                    $('<div>').addClass('embed-responsive embed-responsive-4by3 embed-item').append(
                        $('<iframe>').addClass('embed-responsive-item').attr({
                            src: titleSrc
                        })
                    )
                );
                thumbnail.remove();
            } else if (title.length > 0 && title.attr('href').match(youtube)) {
                titleSrc = title.attr('href').replace('http:', 'https:');
                yid = title.attr('href').match(youtube)[1];
                $(this).find('.clearleft').after(
                    $('<div>').addClass('embed-responsive embed-responsive-4by3 embed-item').append(
                        $('<iframe>').addClass('embed-responsive-item').attr({
                            src: 'https://www.youtube.com/embed/' + yid
                        })
                    )
                );
                thumbnail.remove();
            } else if (title.length > 0) {
                title.text(title.attr('title')).addClass('article-title');
                thumbnail.remove();
            }
        } else {
            $(this).hide();
            duplicates.push(id);
        }
    };
    $('.sitetable .submission').each(formatSubmission);
    $('.sitetable').addClass('verse');
    $('.sitetable .submission[data-fullname]').eqh();
    $(window).scroll(function(e) {
        if (no_more) {
            $('.load-more').hide();
            $('.no-more').show();
            return;
        }
        if (loading) {
            return;
        }
        if (($(window).scrollTop() + $(window).height()) > ($(document).height() - 200) || ($('.more').is(':hidden') && $('.more').is(':appeared'))) {
            $('.more').show();
        }
        if (($(window).scrollTop() + $(window).height()) == $(document).height() || ($('.more').is(':visible') && $('.more').is(':appeared'))) {
            $('.more').hide();
            $('.no-more').hide();
            var next = $('.pagination-container [rel=next]').attr('href'),
                nextHash = next.replace(/\/v\/([^\?]+)\?/g, '').replace('page=', '').replace('/?', '');
            if (next.length > 0) {
                if ($.inArray(next, pages) == -1) {
                    loading = true;
                    $('.load-more').show();
                    $.get(next, function(response) {
                        if (response) {
                            pages.push(next);
                            var html = $('<div>').html(response.replace(/<script(.|\s)*?\/script>/g, '')),
                                submissions = html.find('.sitetable .submission'),
                                nextPage = html.find('.pagination-container [rel=next]').attr('href'),
                                nextPageHash = nextPage ? nextPage.replace(/\/v\/([^\?]+)\?/g, '').replace('page=', '') : -1;
                            if (submissions.length > 0) {
                                // check for duplicates
                                console.log('check for duplicates');
                                duplicates = [];
                                $(submissions).each(formatSubmission);
                                if (nextPage) {
                                    $('.pagination-container [rel=next]').attr('href', nextPage);
                                    $('.sitetable').append(submissions.attr('data-page', parseInt(nextHash)));
                                    $(window.location).attr('hash', 'page-' + nextHash);
                                } else {
                                    no_more = true;
                                }
                            }
                        }
                    }, 'html').done(function() {
                        // second success
                        if (columns > 1) {
                            $('.sitetable .submission[data-fullname]').eqh();
                        }
                    }).fail(function() {
                        // error
                    }).always(function() {
                        $('.load-more').hide();
                        loading = false;
                    });
                }
            } else {
                $('.no-more').show();
            }
        }
    });
}