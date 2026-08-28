var kojibrslider = ''
template = 'Landing pages'

$(document).ready(function () {
    alert('Landing pages: git → template OK');
    init_mobileapp_Landing_pages();
    AOS.init();

    const inViewport = (entries, observer) => {
        entries.forEach(entry => {
            entry.target.classList.toggle("is-inViewport", entry.isIntersecting);
            if ($(entry.target).hasClass("is-inViewport")) {
                if ($(entry.target).attr('animationinit') != 'T') {
                    $(entry.target).attr('animationinit', 'T');
                    //   for (var i = 0; i < entry.target.classList.length; i++) {
                    //       if (entry.target.classList[i].substring(0,8) === 'animate_' && entry.target.classList[i]!='animate__animated' && entry.target.classList[i].substring(0,9)!='animate__') {
                    //         let animClass = entry.target.classList[i];
                    //           console.log('entry je ' + animClass.replace(/_/,'__'))
                    //           console.log(entry.target)
                    //           animClass=animClass.replace(/_/,'__')
                    //           $(entry.target).addClass('animate__animated').addClass(animClass);
                    //       }
                    //     }
                    if ($(entry.target).attr('animation') != undefined) {
                        $(entry.target).addClass('animate__animated').addClass($(entry.target).attr('animation'))
                    }
                }
                // console.log(entry.target.classList)
            }
        });
    };

    const Obs = new IntersectionObserver(inViewport);
    const obsOptions = {}; //See: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options

    // Attach observer to every [data-inviewport] element:
    const ELs_inViewport = document.querySelectorAll('[animation]');
    ELs_inViewport.forEach(EL => {
        console.log(EL)
        Obs.observe(EL, obsOptions);
    });
    
    formatmoneyvalues('.lp_content')
    $('.katalogv2_art_img[src=""], .katalogv2_art_img[src="/"]').attr('src', nophoto)
})

function init_mobileapp_Landing_pages() {
    developer_toops_init()
    init_sliders()
}

function init_sliders() {
    if ($(window).width() < 992) {
        $('.mobileslider').slick({
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            dots: true
        });
        $('.lista_izabranih_proizvoda').slick({
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            dots: true
        });
        formatmoneyvalues('.prodcene-wrap')
    } else {
        $('.lista_izabranih_proizvoda').slick({
            arrows: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            dots: true
        });
        formatmoneyvalues('.prodcene-wrap')
    }
    $('.pb_slider').each(function () {
        var speed = $(this).attr('speed')
        if ($(window).width() < 481) {
            var dajbr = $(this).attr('slidenomob')

        } else if ($(window).width() > 481 && $(window).width() < 991) {
            var dajbr = $(this).attr('slidenotblt')
        } else if ($(window).width() > 992) {
            var dajbr = $(this).attr('slideno')

        }
        if ($(window).width() < 992) {
            var slidestoshow = parseFloat($(this).attr('slidestoshowmob'))
        } else {
            var slidestoshow = parseFloat($(this).attr('slidestoshow'))
        }

        var isautoplay = $(this).attr('isautoplay')
        var slideid = $(this).attr('id')
        var speed = $(this).attr('autoplayspeed')
        if (isautoplay == "false") {
            speed = 99999
        }
        if ($(this).attr('navigation') == 'dots') {
            $(this).slick({
                arrows: false,
                dots: true,
                slidesToShow: parseInt(dajbr),
                slidesToScroll: parseInt(slidestoshow),
                autoplay: isautoplay,
                infinite: true,
                autoplaySpeed: speed
            });
        } else {
            if($(this).attr('navigation') == 'arrows'){
                $(this).slick({
                    arrows: true,
                    dots: false,
                    slidesToShow: parseInt(dajbr),
                    slidesToScroll: parseInt(slidestoshow),
                    infinite: true,
                    autoplay: isautoplay,
                    autoplaySpeed: speed
                });
            } else {
                $(this).slick({
                    arrows: true,
                    dots: true,
                    slidesToShow: parseInt(dajbr),
                    slidesToScroll: parseInt(slidestoshow),
                    infinite: true,
                    autoplay: isautoplay,
                    autoplaySpeed: speed
                });
            }
        }

    })

    //halfslide padding
    $('.pb_slider').each(function () {
        if ($(window).width() > 992) {
            if ($(this).attr('aspectration') != '' || $(this).attr('aspectration') != undefined) {
                $(this).find('.singlesection ').css('aspect-ratio', $(this).attr('aspectration'))
            }
        } else if ($(window).width() > 481 && $(window).width() < 991) {
            if ($(this).attr('aspectratiotblt') != '' || $(this).attr('aspectratiotblt') != undefined) {
                $(this).find('.singlesection ').css('aspect-ratio', $(this).attr('aspectratiotblt'))
            }

        } else {
            if ($(this).attr('aspectratiomob') != '' || $(this).attr('aspectratiomob') != undefined) {
                $(this).find('.singlesection ').css('aspect-ratio', $(this).attr('aspectratiomob'))
            }
        }
        if ($(this).attr('halfslide') == 'true') {
            if ($(window).width() < 992) {
                console.log('mob')
                var koliko = $(this).attr('slidenomob')
            } else {
                var koliko = $(this).attr('slideno')
            }
            if (koliko == 1) {
                var padding = '25%'
            }
            if (koliko == 2) {
                var padding = '21%'
            }
            if (koliko == 3) {
                var padding = '17%'
            }
            if (koliko == 4) {
                var padding = '13%'
            }
            if (koliko == 5) {
                var padding = '9%'
            }
            if (koliko == 6) {
                var padding = '5%'
            }
            $(this).find('.slick-list').css('padding-right', padding)
        }
    })
    $('button.slick-next.slick-arrow').html('<i class="icon-angle-right"></i>')
    $('button.slick-prev.slick-arrow').html('<i class="icon-angle-left"></i>')


    $('.sectionwrapper').each(function () {
        $(this).find('.title_show_all_hold').append($(this).find('.show_all_sect').first().removeClass('hidden'))
        if ($(this).find('.grouptitle_desc').text() != 'undefined') {
            $(this).find('.grouptitle_desc').removeClass('hidden')
        }
    })
    $('.show_all_sect').each(function () {
        if ($(this).attr('href') == '#field5#' || $(this).attr('href') == 'undefined') {
            $(this).addClass('hidden')
        }
    })
    $('section').each(function () {
        if ($(this).html() == '\n\n\n\n') {
            $(this).addClass('hidden')
        }
    })


    $('.section.blog_vertical_wrap_one').each(function () {
        var kategorija = $(this).attr('kat')
        var tip = $(this).attr('tip')
        if (kategorija) {
            if ($(this).find('.category_span').length) {

            } else {
                $(this).prepend(`<div class="category_span">` + kategorija + `</div>`)
            }

            if ($('.blog_vertical_outer[kat="' + kategorija + '"][tip="' + tip + '"]').length) {

            } else {
                $('.section.blog_vertical_wrap_one[kat="' + kategorija + '"][tip="' + tip + '"]').wrapAll('<div tip="' + tip + '" kat="' + kategorija + '" class="container sortable_div blog_vertical_outer"></div>')
            }
        }

        if ($('.blog_vertical_inner[kat="' + kategorija + '"][tip="' + tip + '"]').length) {

        } else {
            $('.blog_vertical_outer[kat="' + kategorija + '"][tip="' + tip + '"] .blog_vertical_wrap_one').not(':first-child').wrapAll('<div tip="' + tip + '" kat="' + kategorija + '" class="blog_vertical_inner"></div>')
        }
        if ($('.blog_vertical_inner_inner[kat="' + kategorija + '"][tip="' + tip + '"]').length) {

        } else {
            $('.blog_vertical_inner[kat="' + kategorija + '"][tip="' + tip + '"] .blog_vertical_wrap_one').not(':first-child').wrapAll('<div tip="' + tip + '" kat="' + kategorija + '" class="blog_vertical_inner_inner sortable_div"></div>')
        }


    })
    $('.blog_vertical_wrap_main_image_date').each(function () {
        $(this).text(moment($(this).text(), 'YYYY-MM-DD').format('DD MMM YYYY'));
    })
    if (getParameterByName('dev') == 'T') {
        $('.blog_detailed_link').removeAttr('href')
        $('.blog_vertical_wrap_one').bind('click', function () {
            open_blog_customization();
        })
        $('.lp_content').append(
            `<div class="hidden popup_blog_edit_wrap">
                <div class="popup_blog_edit_wrap_title_close">
                    <div class="popup_blog_edit_wrap_title">Choose blog</div>
                    <div onclick="$('.popup_blog_edit_wrap').addClass('hidden');" class="popup_blog_edit_wrap_close"><i class="fa fa-times"></i></div>
                </div>          
                <div class="popup_blog_edit_wrap_inner"></div>
                <button class="save_changes">Odaberi</button>
            </div>`
        );
    } else {

    }
}

function open_blog_customization() {
    $('.popup_blog_edit_wrap_inner').html('');
    $('.save_changes').removeAttr('onclick');
    $('.popup_blog_edit_wrap').removeClass('hidden')
    loadcontent('blogedit', {
        template: 'Landing pages',
        jsont: 'T',
        ajax: 'T'
    }, function callback(response) {
        var blogpickhtml = ''
        jsonres = JSON.parse(response)
        jsonres.forEach(x => {
            blogpickhtml =
                ` <div onclick="choose_blog_post(this,'` + x.acckey + `')" acckey="` + x.acckey + `" class="single_blog_pick">
                    <div class="single_blog_pick_image">
                        <img src="docs/` + x.blogpic + `"/>
                    </div>
                    <div class="single_blog_pick_texts">
                        <div>` + x.title + `</div>
                        <div class="single_blog_pick_desctiption">` + x.description + `</div>
                    </div>
                </div>
                `
            $('.popup_blog_edit_wrap').attr('acckey', x.acckey);
            $('.popup_blog_edit_wrap').attr('kat', x.kategorija);
            $('.popup_blog_edit_wrap').attr('tip', x.tip);
            $('.popup_blog_edit_wrap_inner').append(blogpickhtml);
            $('.save_changes').attr('onclick', 'save_blog_changes(this , "' + x.acckey + '", "' + x.kategorija + '", "' + x.tip + '")');
        })

    })
}

function choose_blog_post(elem, key, kat, tip) {
    $('.single_blog_pick').removeClass('chosen_blog');
    $(elem).addClass('chosen_blog');
}

function save_blog_changes(elem, key, kat, tip) {
    $('.popup_blog_edit_wrap').addClass('hidden');
    loadcontent('saveblog', {
        template: 'Landing Pages',
        acckey: key,
        kategorija: kat,
        tip: tip,
        jsont: 'T',
        ajax: 'T'
    }, function callback(response) {
        jsonres = JSON.parse(response)
        console.log(jsonres)
    })

}

// ACCORDION LIST
$('.accordion_item_a').click(function () {
    $(this).children('.fa-solid').toggleClass('hidden')
    var pre = $(this).parents('.accordion_item').siblings().children('.collapse.in')
    pre.siblings('a').click()
})


// PRICING PAGE
var plan1month = '$20'
var plan2month = '$40'
var plan3month = '$60'
var plan1year = '$100'
var plan2year = '$200'
var plan3year = '$300'
var planmonth = 'Mesečno'
var planyear = 'Godišnje'
$('input#switch').on('change', function () {
    if ($('input#switch').is(":checked")) {
        $('.c22S01002112_table_column_price[tip="plan1"]').text(plan1year)
        $('.c22S01002112_table_column_price[tip="plan2"]').text(plan2year)
        $('.c22S01002112_table_column_price[tip="plan3"]').text(plan3year)
        $('.c22S01002112_table_column_price_desription').text(planyear)
        $('.c22S01002112_switch_slider_year_span').css("color", "black")
        $('.c22S01002112_switch_slider_month_span').css("color", "")
    } else {
        $('.c22S01002112_table_column_price[tip="plan1"]').text(plan1month)
        $('.c22S01002112_table_column_price[tip="plan2"]').text(plan2month)
        $('.c22S01002112_table_column_price[tip="plan3"]').text(plan3month)
        $('.c22S01002112_table_column_price_desription').text(planmonth)
        $('.c22S01002112_switch_slider_month_span').css("color", "black")
        $('.c22S01002112_switch_slider_year_span').css("color", "")
    }
})
// PRICING PAGE END


function onloadf() {
    alert('tu')
}

function istaknutiArtikli() {
    $('.cat_istaknuti_holder .katalogv2_art_holder .katalogv2_art_akcija[initialized != "T"]').each(function () {
        if ($(this).text() == '') {
            $(this).parent('.katalogv2_art_akcija_holder').hide()
        } else {
            var kitan = $(this).text().split(/!@!/g)
            var html = ''
            var klasa = ''
            kitan.forEach(x => {
                html += `<div class="${x.replace(' ' ,'_' )}">${x}</div>`
                klasa = x.replace(' ', '_')
            })
            $(this).attr('initialized', 'T').parent().addClass(klasa)
            $(this).html(html)
        }
    })
}

function showKatalogv2ArtModal(elem, ident, kolicina) {

    var modal = $(elem).parents('.katalogv2_art_price_butt_wrap').siblings('.katalogv2_art_modal')
    modal.fadeIn('fast')

    var identforcheck = $(elem).parents('.singleartikal').attr('ident')
    var basketcurr = getCookie2('basket')
    if (basketcurr != '') {
        basketcurr = JSON.parse(basketcurr)
        for (var k in basketcurr) {
            if (identforcheck == basketcurr[k]['ident']) {
                var kolicinazaident = parseInt(basketcurr[k]['kolicina'])
                $(elem).parents('.one-artikal-hold').find('.kolicinaval').val(kolicinazaident)
                break;
            } else {
                $(elem).parents('.one-artikal-hold').find('.kolicinaval').val(1)
            }
        }
    }

    if (!$(elem).parents('.artikal-action').find('.detailbasket').hasClass('hidden')) {
        $(elem).parents('.artikal-action').find('.detailbasket').addClass('hidden')
    } else {
        $('.detailbasket').addClass('hidden')
        $(elem).parents('.artikal-action').find('.detailbasket').removeClass('hidden')
    }
    var isporuka2 = $(elem).parents('.singleartikal').find('.isporuka').attr('lager')
    if (isporuka2 == 'F') {
        opendetbasketchk_v5(elem, '', ident, '', '', kolicina)
        $('.detailbasket').addClass('hidden')

    }
}

$(document).on('click', function (event) {
    if (!$(".katalogv2_art_modal").is(event.target) && !$(".katalogv2_art_modal").has(event.target).length) {
        $('.katalogv2_art_modal').fadeOut()
    }
});

function closeKatalogv2ArtModal(elem){
    $(elem).parent('.katalogv2_art_modal').fadeOut()
}




























