var pages = [],
    links = [],
    loading = false,
    shorten = 30,
    no_more = false,
    stickied = false,
    duplicates = [],
    columns = 2;
$('body').css('font-family', "'Open Sans', sans-serif");
$('#header-account').hide();
$('.side').hide();
$('.tabmenu').append($('<li>').addClass('disabled').append($('<a>').addClass('toggle-side').attr('href', '#').text('Show Side').click(function() {
    $('.side').toggle();
    if ($('.side').is(':hidden')) {
        $(this).text('Show Side');
        $('.sitetable .submission[data-fullname]').removeClass('col-1').addClass('col-' + columns);
        if (columns > 1) {
            $('.sitetable .submission[data-fullname]').eqh();
        }
    } else {
        $(this).text('Hide Side');
        $('.sitetable .submission[data-fullname]').removeClass('col-' + columns).addClass('col-1');
    }
}))).append($('<li>').addClass('disabled').append($('<a>').addClass('toggle-votes').attr('href', '#').text('Show Votes').click(function() {
    $('.midcol.unvoted, .scorebar').toggle();
    if ($('.midcol.unvoted').is(':hidden')) {
        $(this).text('Show Votes');
    } else {
        $(this).text('Hide Votes');
    }
}))).append($('<li>').addClass('disabled').append($('<a>').addClass('toggle-account').attr('href', '#').text('Show Account').click(function() {
    $('#header-account').toggle();
    if ($('#header-account').is(':hidden')) {
        $(this).text('Show Account');
    } else {
        $(this).text('Hide Account');
    }
})));
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
            console.log('duplicate', id);
        }
    };
    $('.sitetable .submission').each(formatSubmission);
    $('.sitetable').addClass('verse');
    $('[data-fullname]').eqh();
    $(window).scroll(function(e) {
        if (no_more) {
            $('.load-more').hide();
            $('.no-more').show();
            return;
        }
        if (loading) {
            return;
        }
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
            $('.more').show();
        }
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            $('.more').hide();
            $('.no-more').hide();
            console.log('load next page');
            var next = $('.pagination-container [rel=next]').attr('href'),
                nextHash = next.replace(/\/v\/([^\?]+)\?/g, '').replace('page=', '').replace('/?', '');
            console.log('check for next page');
            if (next.length > 0) {
                console.log('next', next, $.inArray(next, pages));
                if ($.inArray(next, pages) == -1) {
                    loading = true;
                    console.log('get next page', next);
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
                                    console.log('next page', nextPage);
                                    $('.pagination-container [rel=next]').attr('href', nextPage);
                                    console.log('submissions', submissions.length, 'duplicates', duplicates.length, duplicates);
                                    $('.sitetable').append(submissions.attr('data-page', nextHash));
                                    console.log('hash', nextHash);
                                    $(window.location).attr('hash', 'page-' + nextHash);
                                } else {
                                    console.log('no more')
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
                        console.log('loaded more');
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