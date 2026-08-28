//------------------------------------------------------------------------------Standardni parametri koji se u idealnim uslovima ne diraju-----------------------------------------------------------------------------------------------------------------------
var wrapper_template = 'Wrapper'

var pageid = getParameterByName('pageid') == null ? getCookie('homepage') : getParameterByName('pageid');
var usergroup = getCookie('usergroup')
var userid = getCookie('userid')

var homepage_pageid = getCookie('homepage')
var menuParentid_pageid = getCookie('menuParentid')
var loginpage_pageid = getCookie('loginpage')
var registration_pageid = getCookie('registration')
var clientVerification_pageid = getCookie('clientservicepage')
var noAuthorization_pageid = getCookie('noautorisation')
var productdetails_pageid = getCookie('productdetails')
var searchpage_pageid = getCookie('searchpage') == '' ? 'A59' : getCookie('searchpage')
var checkoutpage = getCookie('checkoutpage')
var checkoutAfterpage = getCookie('checkoutAfterpage')
var blogHome_pageid = getCookie('blogHomePage')
var blogSinglePost_pageid = getCookie('blogSinglePostPage')
var privacyPolicy_pageid = getCookie('privacyPage')
var cookiePolicy_pageid = getCookie('cookiePolicyPage')
var purchaseTerms_pageid = getCookie('purchaseTermsPage')

var my_profile_page_id = getCookie('myPortalPage')
var notifications_pageid = getCookie('notificationsPag')
var help_desk_page_id = getCookie('helpDeskPage')
var dugovanja_pageid = getCookie('dugovanjaPage')
var narudzbine_pageid = getCookie('narudzbinePage')
var otvoreneStavke_pageid = getCookie('otvoreneStPage')
var fakture_pageid = getCookie('fakturePage')
var dilerskaPonuda_pageid = getCookie('DilerskaPoPage')
var projekti_pageid = getCookie('projektiPage')
var situacije_pageid = getCookie('situacijePage')
var narudzbenice_pageid = getCookie('narudzbenicePage')
var odsustva_pageid = getCookie('odsustvaPage')

var skladistaString = getCookie('skladistaString')
// var skladistaJSON
// if (getCookie('skladistaJSON') == ''){
//     skladistaJSON = ''
// } else {
//     skladistaJSON = JSON.parse(decodeURIComponent(escape(getCookie('skladistaJSON'))))
// }

var headerHeight
var footerHeight
var contentMinHeight

// varijabla koja pokazuje da li je aktivan developer mode (T)
var dev = getParameterByName('dev')

var loading = 'false'

var searchAnalytics_loading = false

// var brandsearch = ''
// var mainauth = [{'delmesto':''}] 
// var app
var global_project = ''
var global_projectphaze = ''
var global_veznidok = ''
var serijski_broj = ''
var instance = '#instance#'

// varijabla za simbol valute
var global_valuta = getCookie('userCurrency')
var valuta_symbol = global_valuta

var caseeditor = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_403_3223)"><path d="M12.0001 8.00061C11.209 8.00061 10.4356 8.23521 9.77781 8.67473C9.12002 9.11426 8.60733 9.73897 8.30458 10.4699C8.00182 11.2008 7.92261 12.005 8.07695 12.781C8.23129 13.5569 8.61226 14.2696 9.17167 14.829C9.73108 15.3884 10.4438 15.7694 11.2197 15.9238C11.9957 16.0781 12.7999 15.9989 13.5308 15.6961C14.2617 15.3934 14.8864 14.8807 15.326 14.2229C15.7655 13.5651 16.0001 12.7917 16.0001 12.0006C16.0001 10.9397 15.5787 9.92233 14.8285 9.17218C14.0784 8.42204 13.061 8.00061 12.0001 8.00061ZM12.0001 14.0006C11.6045 14.0006 11.2179 13.8833 10.889 13.6635C10.5601 13.4438 10.3037 13.1314 10.1523 12.766C10.001 12.4005 9.96135 11.9984 10.0385 11.6104C10.1157 11.2225 10.3062 10.8661 10.5859 10.5864C10.8656 10.3067 11.222 10.1162 11.6099 10.039C11.9979 9.96187 12.4 10.0015 12.7655 10.1529C13.1309 10.3042 13.4433 10.5606 13.663 10.8895C13.8828 11.2184 14.0001 11.605 14.0001 12.0006C14.0001 12.531 13.7894 13.0398 13.4143 13.4148C13.0392 13.7899 12.5305 14.0006 12.0001 14.0006Z" fill="#374957"/><path d="M21.294 13.9L20.85 13.644C21.0499 12.5564 21.0499 11.4416 20.85 10.354L21.294 10.098C21.6355 9.90102 21.9348 9.63871 22.1748 9.32606C22.4149 9.01341 22.591 8.65654 22.6932 8.27582C22.7953 7.8951 22.8215 7.49799 22.7702 7.10716C22.7188 6.71633 22.591 6.33944 22.394 5.998C22.1971 5.65656 21.9348 5.35727 21.6221 5.1172C21.3095 4.87714 20.9526 4.70101 20.5719 4.59886C20.1911 4.49672 19.794 4.47056 19.4032 4.52189C19.0124 4.57321 18.6355 4.70102 18.294 4.898L17.849 5.155C17.0086 4.43692 16.0427 3.88025 15 3.513V3C15 2.20435 14.684 1.44129 14.1214 0.87868C13.5588 0.31607 12.7957 0 12 0C11.2044 0 10.4413 0.31607 9.87872 0.87868C9.31611 1.44129 9.00004 2.20435 9.00004 3V3.513C7.95743 3.88157 6.99189 4.4396 6.15204 5.159L5.70504 4.9C5.01548 4.50218 4.19612 4.39457 3.42723 4.60086C2.65833 4.80715 2.00287 5.31044 1.60504 6C1.20722 6.68956 1.09962 7.50892 1.30591 8.27782C1.5122 9.04672 2.01548 9.70218 2.70504 10.1L3.14904 10.356C2.94915 11.4436 2.94915 12.5584 3.14904 13.646L2.70504 13.902C2.01548 14.2998 1.5122 14.9553 1.30591 15.7242C1.09962 16.4931 1.20722 17.3124 1.60504 18.002C2.00287 18.6916 2.65833 19.1948 3.42723 19.4011C4.19612 19.6074 5.01548 19.4998 5.70504 19.102L6.15004 18.845C6.99081 19.5632 7.95702 20.1199 9.00004 20.487V21C9.00004 21.7956 9.31611 22.5587 9.87872 23.1213C10.4413 23.6839 11.2044 24 12 24C12.7957 24 13.5588 23.6839 14.1214 23.1213C14.684 22.5587 15 21.7956 15 21V20.487C16.0427 20.1184 17.0082 19.5604 17.848 18.841L18.295 19.099C18.9846 19.4968 19.804 19.6044 20.5729 19.3981C21.3418 19.1918 21.9972 18.6886 22.395 17.999C22.7929 17.3094 22.9005 16.4901 22.6942 15.7212C22.4879 14.9523 21.9846 14.2968 21.295 13.899L21.294 13.9ZM18.746 10.124C19.0847 11.3511 19.0847 12.6469 18.746 13.874C18.6869 14.0876 18.7004 14.3147 18.7844 14.5198C18.8684 14.7249 19.0181 14.8963 19.21 15.007L20.294 15.633C20.5239 15.7656 20.6916 15.9841 20.7603 16.2403C20.829 16.4966 20.7932 16.7697 20.6605 16.9995C20.5279 17.2293 20.3095 17.397 20.0532 17.4658C19.7969 17.5345 19.5239 17.4986 19.294 17.366L18.208 16.738C18.0159 16.6267 17.7923 16.5826 17.5723 16.6124C17.3523 16.6423 17.1485 16.7445 16.993 16.903C16.103 17.8117 14.9816 18.46 13.75 18.778C13.5351 18.8333 13.3446 18.9585 13.2086 19.1339C13.0727 19.3094 12.9989 19.525 12.999 19.747V21C12.999 21.2652 12.8937 21.5196 12.7062 21.7071C12.5186 21.8946 12.2643 22 11.999 22C11.7338 22 11.4795 21.8946 11.2919 21.7071C11.1044 21.5196 10.999 21.2652 10.999 21V19.748C10.9992 19.526 10.9254 19.3104 10.7894 19.1349C10.6535 18.9595 10.463 18.8343 10.248 18.779C9.01639 18.4597 7.89537 17.81 7.00604 16.9C6.85057 16.7415 6.64678 16.6393 6.4268 16.6094C6.20682 16.5796 5.98315 16.6237 5.79104 16.735L4.70704 17.362C4.59327 17.4287 4.46743 17.4722 4.33677 17.4901C4.2061 17.508 4.0732 17.4998 3.9457 17.4661C3.8182 17.4324 3.69862 17.3738 3.59386 17.2937C3.4891 17.2136 3.40122 17.1135 3.33528 16.9993C3.26934 16.8851 3.22664 16.759 3.20964 16.6282C3.19264 16.4974 3.20168 16.3646 3.23623 16.2373C3.27079 16.11 3.33017 15.9909 3.41098 15.8866C3.49178 15.7824 3.5924 15.6952 3.70704 15.63L4.79104 15.004C4.98299 14.8933 5.13272 14.7219 5.2167 14.5168C5.30069 14.3117 5.31417 14.0846 5.25504 13.871C4.9164 12.6439 4.9164 11.3481 5.25504 10.121C5.31311 9.90788 5.29898 9.68153 5.21486 9.47729C5.13074 9.27305 4.98136 9.10241 4.79004 8.992L3.70604 8.366C3.47623 8.23339 3.30851 8.01492 3.23978 7.75865C3.17105 7.50239 3.20693 7.22931 3.33954 6.9995C3.47215 6.76969 3.69062 6.60197 3.94689 6.53324C4.20316 6.46451 4.47623 6.50039 4.70604 6.633L5.79204 7.261C5.98362 7.37251 6.20682 7.41721 6.42657 7.38807C6.64632 7.35893 6.85015 7.25759 7.00604 7.1C7.89613 6.19134 9.01747 5.54302 10.249 5.225C10.4647 5.16956 10.6556 5.04375 10.7917 4.8675C10.9277 4.69125 11.001 4.47464 11 4.252V3C11 2.73478 11.1054 2.48043 11.2929 2.29289C11.4805 2.10536 11.7348 2 12 2C12.2653 2 12.5196 2.10536 12.7071 2.29289C12.8947 2.48043 13 2.73478 13 3V4.252C12.9999 4.47396 13.0737 4.68964 13.2096 4.86508C13.3456 5.04052 13.5361 5.16573 13.751 5.221C14.9831 5.54015 16.1044 6.18988 16.994 7.1C17.1495 7.25847 17.3533 7.36069 17.5733 7.39057C17.7933 7.42044 18.0169 7.37626 18.209 7.265L19.293 6.638C19.4068 6.5713 19.5327 6.52777 19.6633 6.5099C19.794 6.49204 19.9269 6.50019 20.0544 6.5339C20.1819 6.56761 20.3015 6.6262 20.4062 6.70631C20.511 6.78642 20.5989 6.88646 20.6648 7.00067C20.7307 7.11488 20.7734 7.24101 20.7904 7.37179C20.8074 7.50257 20.7984 7.63542 20.7639 7.76269C20.7293 7.88997 20.6699 8.00915 20.5891 8.11337C20.5083 8.2176 20.4077 8.30482 20.293 8.37L19.209 8.996C19.0181 9.10671 18.8691 9.27748 18.7854 9.48169C18.7016 9.68591 18.6878 9.9121 18.746 10.125V10.124Z" fill="#374957"/></g><defs><clipPath id="clip0_403_3223"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>'

var grapeeditor = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_403_3434)"><path d="M22.94 1.05872C22.2602 0.379917 21.3387 -0.00134277 20.378 -0.00134277C19.4173 -0.00134277 18.4958 0.379917 17.816 1.05872L0 18.8747V23.9987H5.124L22.94 6.18272C23.6186 5.50274 23.9997 4.58135 23.9997 3.62072C23.9997 2.66009 23.6186 1.7387 22.94 1.05872ZM4.3 21.9987H2V19.6987L15.31 6.39872L17.61 8.69872L4.3 21.9987ZM21.526 4.76872L19.019 7.27572L16.724 4.97572L19.23 2.47272C19.535 2.16772 19.9487 1.99637 20.38 1.99637C20.8113 1.99637 21.225 2.16772 21.53 2.47272C21.835 2.77772 22.0063 3.19139 22.0063 3.62272C22.0063 4.05405 21.835 4.46772 21.53 4.77272L21.526 4.76872Z" fill="#374957"/></g><defs><clipPath id="clip0_403_3434"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>'

var potvrdibrisanjetext = "Da li želite da obrišete stavku?"

// varijabla za svg ikonicu korpe koja ce se prikazivati na sajtu (ako je prazno prikazuju se osnovne ikonice)
var korpa_svg = ``

//relativna putanja unutar instance koja vodi do predefinisane slike za slucaj nedostatka slike na proizvodu
var nophoto = 'commonAssets/Images/coming_soon_transparent.png'

const katalog_upit_forma_oddelek = '21S01003616'

var template_string


//------------------------------------------------------------------------------Parametri za podesavanje wrapper-a na novoj instanci-----------------------------------------------------------------------------------------------------------------------------
websyncinstance = getCookie('websyncinstance')

function websyncbind() {}

// function ntf_init() {}

// -----------------------------------------------------------------------------Standardne funkcije koje se u idealnim slucajevima ne diraju---------------------------------------------------------------------------------------------------------------------

var dateFormatter = function (cell, formatterParams) {
    var value = cell.getValue();

    if (value) {
        value = moment(value, "YYYY-MM-DD").format("DD.MM.YYYY");
    }

    return value;
}

function moneyFormatter(cell, formatterParams) {
    var value = cell.getValue();
    if (typeof value === 'string') {
        value = parseFloat(value.replace(/[^\d.-]/g, ''));
    }
    if (!isNaN(value)) {
        var decimal = formatterParams && formatterParams.decimal ? formatterParams.decimal : '.';
        var thousand = formatterParams && formatterParams.thousand ? formatterParams.thousand : ',';
        var precision = formatterParams && formatterParams.precision !== undefined ? formatterParams.precision : 2;
        var formattedValue = value.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
        formattedValue = formattedValue.replace('.', decimal);
        return formattedValue;
    }

    return value;
}

function customDebt(cell, formatterParams, onRendered) {
    var value = cell.getValue();
    var div = document.createElement("div");
    div.classList.add("custom_cell_class_money");
    div.innerHTML = value;
    return div;
}

// funkcija za gradjenje menija u headeru
function menubuild() {
    $('.main-ul a').each(function () {
        if ($(window).width() < 992) {
            $(this).attr("onclick", "$('.main_navigation').slideUp('slow')")
        }
        if ($(this).attr("sub") == 'sub') {
            $(this).attr("data-hover", "dropdown")
            if ($(this).attr("parent") == '') {
                $(this).addClass("dropdown-toggle")
            }
            $(this).append('<i onclick="event.preventDefault(); event.stopPropagation(); expandmenulevel(this)" class="open fas fa-angle-up"></i>') //ovo
            $('ul[parent="' + $(this).attr("parent") + '"]').append('<li megamenutype="' + $(this).attr("menutype") + '" group="' + $(this).attr("grupa") + '" level="' + $(this).attr("level") + '" class="' + $(this).attr("tip") + ' dropdown ' + ($(this).attr("parent") == '' ? '' : 'sublist') + '">' + this.outerHTML + '<ul level="' + $(this).attr("level") + '" parent="' + $(this).attr("pageid") + '" class="dropdown-menu"></ul></li>')
        } else {
            $('ul[parent="' + $(this).attr("parent") + '"]').append('<li megamenutype="' + $(this).attr("menutype") + '" group="' + $(this).attr("grupa") + '" level="' + $(this).attr("level") + '" class="' + $(this).attr("tip") + ' ' + ($(this).attr("parent") == '' ? '' : 'sublist') + '">' + this.outerHTML + '</li>')
        }

    })
    if (getCookie('userid') == '-1' || getCookie('userid') == null || getCookie('userid') == '') {
        $("#logoff-btn-a").hide()
        $('#backoffice-btn').remove()
    } else {
        $("#registrate-btn").hide()
        if (getCookie('usertype') == 'U') {
            $('#backoffice-btn').removeClass('hidden')
        }
    }
    
    headerHeight = $('#header').outerHeight()
    footerHeight = $('footer').outerHeight()
    contentMinHeight = 'calc(100dvH - ' + (headerHeight + footerHeight) + 'px)'
    document.documentElement.style.setProperty("--contentMinHeight", contentMinHeight);
    $('body .content.wrapper-content').css('min-height', contentMinHeight)
}

function my_profile_build() {
    if ($('.my_profile_pic_img').attr('src') !== '') {
        $('.my_profile_pic_svg_placeholder').addClass('hidden')
        $('.my_profile_pic_initials').addClass('hidden')
    } else {
        $('.my_profile_pic_img').addClass('hidden')
    }

    if (getCookie('userid') == '-1' || getCookie('userid') == null || getCookie('userid') == '') {
        $('.ny_profile_anon').removeClass('hidden')
        $('.my_profile_wrap').addClass('hidden')
    } else {
        $('#my_portal_a').attr('href', 'index.php?pageid=' + my_profile_page_id)
        $('.ny_profile_anon').addClass('hidden')
        $('#my_portal_li').removeClass('hidden')
        $('#logoff_li').removeClass('hidden')
        if (getCookie('usertype') == 'U') {
            $('#backoffice_li').removeClass('hidden')
        }
    }

    $(document).click(function (event) {
        if (!$(".my_profile_holder").is(event.target) && !$(".my_profile_holder").has(event.target).length) {
            $('.my_profile_dropdown').slideUp();
        }
    });

    if (typeof my_profile_page_id != typeof undefined) {
        my_portal_to_my_profile_dropdown(my_profile_page_id)
    }

    // Dodavanje alert ikonice za dugovanja
    if ($(window).width() < 991) {
        $('.my_profile_wrap').prepend('<div class="my_profile_alert_icon_holder hidden"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="32" height="32" x="0" y="0" viewBox="0 0 489.418 489.418" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M244.709 389.496c18.736 0 34.332-14.355 35.91-33.026l24.359-290.927a60.493 60.493 0 0 0-15.756-46.011C277.783 7.09 261.629 0 244.709 0s-33.074 7.09-44.514 19.532a60.485 60.485 0 0 0-15.755 46.011l24.359 290.927c1.578 18.671 17.174 33.026 35.91 33.026zM244.709 410.908c-21.684 0-39.256 17.571-39.256 39.256 0 21.683 17.572 39.254 39.256 39.254s39.256-17.571 39.256-39.254c0-21.685-17.572-39.256-39.256-39.256z" fill="#000000" data-original="#000000" class=""></path></g></svg> </div>')
        var debt_t = $('.debt').text()
        debt_t = parseFloat(debt_t)
        if (userid !== '-1' && userid !== '0') {
            if (debt_t !== 0 && debt_t !== 'NaN') {
                $('.my_profile_alert_icon_holder').removeClass('hidden')

                if (getCookie('debtAlertTimer') == '') {
                    // popup_mobile_dugovanja_modal()
                }
            }
        }
    }
}

function deleteitemDisprove() {
    $('.wrapper_confirm_modal_holder').hide()
    $('.wrapper_confirm_modal_butt_da').off('click', function(){
        deleteitemConfirm(userid, ident, insert_to_db, serialno)
    });
    $('.wrapper_confirm_modal_butt_ne').off('click', deleteitemDisprove)
}

// izvlaci valutu za usera i stavlja je u globalnu varijablu
function initUserCurrency(){
    if(getCookie('userCurrency') == ''){
        loadcontent('userCurrency', {template: wrapper_template, jsont: 'T', ajax: 'T', notpublished: 'T'}, function(response){
            var json = JSON.parse(response)
            global_valuta = json[0].valuta
            setCookie('userCurrency', global_valuta)
        })
        
        loadcontent('appSettings', {template: wrapper_template, jsont: 'T', ajax: 'T', notpublished: 'T'}, function(response){
            var json = JSON.parse(response)
            websyncinstance = json[0].instance
            setCookie('websyncinstance', websyncinstance)
        })
        
    }
}

async function initElastycSettings(){
    if(getLocalStorage('elastycSettingsInitialized') !== 'T'){
        await new Promise((resolve, reject) => {
            loadcontent('elastycSettings', {template: wrapper_template, jsont: 'T', ajax: 'T', notpublished: 'T'}, function(response){
                var json = JSON.parse(response)
                console.log(json)
                var elastSett = json[0]
                
                Object.entries(elastSett).forEach(([key, value]) => {
                    setLocalStorage(key, value);
                });
                
                setLocalStorage('elastycSettingsInitialized', 'T', 600)
                resolve()
            })
        })
    }
    
    if(typeof initCatalogSettings == 'function'){
        initCatalogSettings()
    }
}

function reload_basket_items() {
    $('.basket_content_wrap').html('')
    $('.basket_content_holder_loader').show()
    if((getLocalStorage('samoUlogKorDodUKorp') == 'T' && userid !== '-1') || getLocalStorage('samoUlogKorDodUKorp') !== 'T'){
        
        loadcontent('reloadbasket', {
            template: wrapper_template,
            notpublished: 'T',
            ajax: 'T',
            jsont: 'T',
            userid: userid,
            // sessionid: getCookie('sessionid')
        }, function callback(response) {
            var reprez = response.replace(/\\\\"/g, '');
            var basket_rez = JSON.parse(reprez)
            // basket_rez = basket_rez[0]['json']
            var basket_html = ''
            if (basket_rez.length != 0) {
                $('.go_to_basket').remove()
                basket_rez.forEach(item => {
                    var slika = item.slika
                    // console.log(slika)
                    basket_html += `
                                    <div id="${item.ident}" ident ="${item.ident}" class="single-cart basket_content_item">
                                        <div class="cart-img basket_content_item_img">
                                            <img src="${slika.includes('thumb') ? slika : slika.replace(/artikli/g, 'artikli\\thumb')}">
                                        </div>
                                        <div class="basket_content_item_info_holder">
                                            <div class="basket_content_item_title_wrap">
                                                <div class="basket_content_item_title">
                                                    <a href="index.php?pageid=a36&SEO_title=${item.naziv}&acckey=${item.acckey}&ident=${item.ident}" class="basket_content_item_title_a">${item.naz}  <span class="serial_no">${item.serijskibr !=='undefined' ? item.serijskibr : ''} </span></a>
                                                </div>
                                                <div class="basket_content_item_ident">${item.ident}</div>
                                            </div>
                                            <div class="basket_content_item_info_wrap">
                                                <div class="basket_content_item_info">
                                                    <div class="basket_content_item_info_row basket_content_item_info_row_kolicina">
                                                        <span class="basket_content_item_info_row_span_ph">Količina:</span>
                                                        <span class="basket_content_item_info_row_span">${item.kol}</span>
                                                    </div>
                                                    <div class="basket_content_item_info_row basket_content_item_info_row_rabat">
                                                        <span class="basket_content_item_info_row_span_ph">Rabat:</span>
                                                        <span class="basket_content_item_info_row_span">${item.rabat} %</span>
                                                    </div>
                                                    <div class="basket_content_item_info_row basket_content_item_info_row_pdv">
                                                        <span class="basket_content_item_info_row_span_ph">PDV:</span>
                                                        <span class="basket_content_item_info_row_span">${item.PDV} %</span>
                                                    </div>
                                                    <div class="basket_content_item_info_row basket_content_item_info_row_staracena" style="display: none;">
                                                        <span class="basket_content_item_info_row_span_ph">Stara cena:</span>
                                                        <span class="basket_content_item_info_row_span"></span>
                                                        <span class="basket_content_item_info_row_span_valuta"></span>
                                                    </div>
                                                    <div class="basket_content_item_info_row basket_content_item_info_row_cena">
                                                        <span class="basket_content_item_info_row_span_ph">Cena:</span>
                                                        <span class="basket_content_item_info_row_span money">${item.zaPlacanje}</span>
                                                        <span class="basket_content_item_info_row_span_valuta"></span>
                                                    </div>
                                                </div>
                                                <div class="basket_content_item_close" onclick="deleteitem(this, userid, '${item.ident}', true,'${item.serijskibr !=='undefined' ? item.serijskibr : ''}')">
                                                    <i class="fa fa-trash"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                    `;
                    $('.basket_content_wrap').html(basket_html)
                });
                formatmoneyvalues('.basket_content_wrap')
                var totalprice = 0
                for (var i = 0; i < basket_rez.length; i++) {
                    var itempriceparent = basket_rez[i]
                    var itemprice = itempriceparent['zaPlacanje']
                    totalprice += parseFloat(itemprice)
    
                }
                $('.basket_content_footer_price_info_wrap_cena .basket_content_footer_price_info_cifra').html(totalprice).addClass('money')
                formatmoneyvalues('.basket_content_footer_price_info_wrap_cena')
                $('.cart-no').html(basket_rez.length);
                $('.cart-no').removeClass('hidden')
                $('.basket_content_footer').show()
            } else {
                $('.cart-no').text('')
                $('.cart-no').addClass('hidden')
                $('.cart-pro-val, .cart-pro-checkout').addClass('hidden')
                $('.basket_content_wrap').html('<div class="nocontent_wrap"><div class="nocontent_text">Nemate proizvode u korpi.</div><div class="nocontent_svg"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" zoomAndPan="magnify" viewBox="0 0 810 809.999993" height="24" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="90ccae9e5e"><path d="M 67.8125 67.8125 L 742.0625 67.8125 L 742.0625 742.0625 L 67.8125 742.0625 Z M 67.8125 67.8125 " clip-rule="nonzero"/></clipPath><clipPath id="77912e7420"><path d="M 57 126 L 711 126 L 711 780 L 57 780 Z M 57 126 " clip-rule="nonzero"/></clipPath><clipPath id="19e33fc078"><path d="M 39.238281 755.765625 L 686.769531 108.230469 L 729.199219 150.65625 L 81.664062 798.191406 Z M 39.238281 755.765625 " clip-rule="nonzero"/></clipPath><clipPath id="b3736dccb1"><path d="M 39.238281 755.765625 L 686.769531 108.230469 L 729.199219 150.65625 L 81.664062 798.191406 Z M 39.238281 755.765625 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#90ccae9e5e)"><path fill="#374957" d="M 657.78125 236.375 L 573.5 236.375 C 573.5 191.671875 555.742188 148.796875 524.128906 117.183594 C 492.519531 85.574219 449.644531 67.8125 404.9375 67.8125 C 360.234375 67.8125 317.359375 85.574219 285.746094 117.183594 C 254.136719 148.796875 236.375 191.671875 236.375 236.375 L 152.09375 236.375 C 129.742188 236.375 108.304688 245.257812 92.5 261.0625 C 76.695312 276.867188 67.8125 298.304688 67.8125 320.65625 L 67.8125 601.59375 C 67.859375 638.835938 82.671875 674.539062 109.003906 700.871094 C 135.339844 727.207031 171.042969 742.019531 208.28125 742.0625 L 601.59375 742.0625 C 638.835938 742.019531 674.539062 727.207031 700.871094 700.871094 C 727.207031 674.539062 742.019531 638.835938 742.0625 601.59375 L 742.0625 320.65625 C 742.0625 298.304688 733.183594 276.867188 717.378906 261.0625 C 701.574219 245.257812 680.132812 236.375 657.78125 236.375 Z M 404.9375 124 C 434.742188 124 463.328125 135.839844 484.398438 156.914062 C 505.476562 177.988281 517.3125 206.574219 517.3125 236.375 L 292.5625 236.375 C 292.5625 206.574219 304.402344 177.988281 325.476562 156.914062 C 346.550781 135.839844 375.132812 124 404.9375 124 Z M 685.875 601.59375 C 685.875 623.945312 676.996094 645.386719 661.191406 661.191406 C 645.386719 676.996094 623.945312 685.875 601.59375 685.875 L 208.28125 685.875 C 185.929688 685.875 164.492188 676.996094 148.6875 661.191406 C 132.882812 645.386719 124 623.945312 124 601.59375 L 124 320.65625 C 124 313.207031 126.960938 306.0625 132.230469 300.792969 C 137.5 295.523438 144.644531 292.5625 152.09375 292.5625 L 236.375 292.5625 L 236.375 348.75 C 236.375 356.203125 239.335938 363.347656 244.605469 368.617188 C 249.875 373.882812 257.019531 376.84375 264.46875 376.84375 C 271.921875 376.84375 279.066406 373.882812 284.335938 368.617188 C 289.605469 363.347656 292.5625 356.203125 292.5625 348.75 L 292.5625 292.5625 L 517.3125 292.5625 L 517.3125 348.75 C 517.3125 356.203125 520.273438 363.347656 525.542969 368.617188 C 530.808594 373.882812 537.957031 376.84375 545.40625 376.84375 C 552.859375 376.84375 560.003906 373.882812 565.273438 368.617188 C 570.539062 363.347656 573.5 356.203125 573.5 348.75 L 573.5 292.5625 L 657.78125 292.5625 C 665.234375 292.5625 672.378906 295.523438 677.648438 300.792969 C 682.914062 306.0625 685.875 313.207031 685.875 320.65625 Z M 685.875 601.59375 " fill-opacity="1" fill-rule="nonzero"/></g><g clip-path="url(#77912e7420)"><g clip-path="url(#19e33fc078)"><g clip-path="url(#b3736dccb1)"><path fill="#374957" d="M 659.507812 135.492188 L 66.351562 728.652344 C 54.652344 740.351562 54.652344 759.320312 66.351562 771.019531 C 78.050781 782.71875 97.019531 782.71875 108.71875 771.019531 L 701.878906 177.863281 C 713.578125 166.164062 713.578125 147.191406 701.878906 135.492188 C 690.179688 123.792969 671.207031 123.792969 659.507812 135.492188 Z M 659.507812 135.492188 " fill-opacity="1" fill-rule="nonzero"/></g></g></g></svg></div></div>')
                $('.basket_content_footer').hide()
                if ($('.go_to_basket').length) {
    
                } else {
                    $('.total-cart-pro').after('<a href="index.php?pageid=' + checkoutpage + '" class="go_to_basket">Nastavi u korpu <i class="fa fa-chevron-right"></i></a>')
                }
            }
            
            $('.basket_content_item_img img[src=""]').attr('src', nophoto)
            $('.basket_content_holder_loader').fadeOut('fast')
        })
        
    } else {
        $('.cart-no').text('')
        $('.cart-no').addClass('hidden')
        $('.cart-pro-val, .cart-pro-checkout').addClass('hidden')
        $('.basket_content_wrap').html('<div class="nocontent_wrap"><div class="nocontent_text"><a href="/index.php?pageid='+loginpage_pageid+'">Prijavite se</a> da bi dodali u korpu</div></div>')
        $('.basket_content_footer').hide()
        $('.basket_content_holder_loader').fadeOut('fast')
    }
    
}

function toggleBasketMenu() {
    if (!$('.basket_content_holder_wrap').hasClass('basket_content_holder_wrap_open')) {
        reload_basket_items()
        $('.basket_content_holder_wrap').toggle().toggleClass('basket_content_holder_wrap_open')
        if ($(window).width() < 992) {
            $('body').addClass('overflowhidden')
        }
        $('.toast_notif_popup').remove()
    } else {
        $('.basket_content_holder_wrap').removeClass('basket_content_holder_wrap_open')
        setTimeout(function () {
            $('.basket_content_holder_wrap').hide()
        }, 200)
    }
}

$('.basket_content_holder_wrap').on('click', function (event) {
    if (!$(".basket_content_holder").is(event.target) && !$(".basket_content_holder").has(event.target).length && !$(".wrapper_confirm_modal_overlay").is(event.target) && !$(".wrapper_confirm_modal_overlay").has(event.target).length) {
        closeBasketMenu();
    }
});

function closeBasketMenu() {
    $('.basket_content_holder_wrap').removeClass('basket_content_holder_wrap_open')
    setTimeout(function () {
        $('.basket_content_holder_wrap').hide()
    }, 200)
    $('body').removeClass('overflowhidden')
}

// FUNKCIJA KOJA GRADI STRANICIU U MY PROFILE DROPDOWN MENIJU
function my_portal_to_my_profile_dropdown(parentPageId) {
    var html = $('.applink[pageid="' + parentPageId + '"]').parent().find('ul').html()
    $('.my_profile_dropdown_extra_holder').html(html)
    $('a.applink[pageid="' + parentPageId + '"]').parent('li').addClass('hidden')

    // DEO KOJI SKIDA HREF SA PARENTA (GRUPE)
    $('.my_profile_dropdown li.dropdown.sublist[level="3"]').find('a.applink[level="3"]:first-child').each(function () {
        $(this).removeAttr('href')
    })
}


function toggleFav() {
    var favorites = JSON.parse(localStorage.getItem('favorites'))
    $('.favorites_holder').fadeToggle('hidden')
    if (favorites != null) {
        var html = ''
        favorites.forEach(favs => {
            var href = 'index.php?pageid='+productdetails_pageid+'&frontpage='+favs.frontpage+'&SEO_title='+favs.naslov+'&acckey='+favs.acckey+'&ident='+favs.ident
            html += `<div acckey="${favs.acckey}" class="faitemshold">
                        <a href="${href}">
                            <div class="favitem-inner">
                                <div class="favitem_imghold"><img src="${favs.slika}"></div>
                                <div class="right-sect-wrap">
                                <div class="nazivfav">${favs.naslov}</div>
                                </div>
                            </div>
                        </a>
                        <div onclick="deleteFav(this, '${favs.acckey}')" class="delete-fav"><i class="fa fa-trash"></i></div>
                    </div>
        `
            $('.fav-items-list').html(html)

        })
    }

    if ($('.faitemshold').length) {
        $('.favitems-dropdown').addClass('hasfavs')
        if ($('.favitems-dropdown.hasfavs').length) {
            $('.nofav').addClass('hidden')
            $('.hasfav').removeClass('hidden')
            $('.num_fav_items').removeClass('hidden')
        }
    } else {
        $('.nofav').removeClass('hidden')
        $('.hasfav').addClass('hidden')
        $('.favitems-dropdown').removeClass('hasfavs')
        $('.fav-items-list').html('<div class="no_favorites">Nemate omiljene proizvode!</div>')
        $('.num_fav_items').addClass('hidden')
    }

    var broj_omiljenih = 0;
    broj_omiljenih = $('.faitemshold').length
    $('.num_fav_items').empty()
    $('.num_fav_items').append(broj_omiljenih)


    // Funkcija koja zatvara fauvorites dropdown na klik sa strane
    $(document).click(function (e) {
        if (!$(e.target).is('.faitemshold *, .delete-fav, .favitems-dropdown') &&
            $(e.target).closest('.faitemshold, .delete-fav, .favitems-dropdown').length === 0) {
            // Trigger function here
            $('.favorites_holder').fadeOut()
        }
    });

}

function deleteFav(elem, acckey) {
    $(elem).parents('.faitemshold').remove()
    var favorites = JSON.parse(localStorage.getItem('favorites'))
    for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].acckey == acckey) {
            favorites.splice(i, 1);
        }
    }
    favorites = JSON.stringify(favorites)
    localStorage.setItem("favorites", favorites)
    if (!$('.faitemshold').length) {
        $('.favitems-dropdown').removeClass('hasfavs')
        $('.fav-items-list').html('<div class="no_favorites">Nemate omiljene proizvode!</div>')
    } else {

    }

    checkAddedItemAndHighlight()
    checkAddedItemAndHighlightDPP()

    var brojfava = $('.fav-items-list .faitemshold').length
    if (brojfava !== '0') {
        $('.num_fav_items').text(brojfava)
    }

    if ($('.faitemshold').length) {
        $('.favitems-dropdown').addClass('hasfavs')
        if ($('.favitems-dropdown.hasfavs').length) {
            $('.nofav').addClass('hidden')
            $('.hasfav').removeClass('hidden')
            $('.num_fav_items').removeClass('hidden')
        }
    } else {
        $('.nofav').removeClass('hidden')
        $('.hasfav').addClass('hidden')
        $('.favitems-dropdown').removeClass('hasfavs')
        $('.fav-items-list').html('<div class="no_favorites">Nemate omiljene proizvode!</div>')
        $('.num_fav_items').addClass('hidden')
    }
}

// dodaje i uklanja proizvod iz liste omiljenih proizvoda
function addToFavoritesKatalog(elem, acckey, ident, frontpage, seoTitle, slika){
    if (userid !== '-1') {
        var elem = $(elem)
        if(elem.hasClass('katalogv2_favorite_wrap_fav')){
            var favorites = JSON.parse(localStorage.getItem('favorites'))
            
            for (var i = 0; i < favorites.length; i++) {
                if (favorites[i].acckey == acckey) {
                    favorites.splice(i, 1);
                }
            }
            favorites = JSON.stringify(favorites)
            localStorage.setItem("favorites", favorites)
            if (!$('.faitemshold').length) {
                $('.favitems-dropdown').removeClass('hasfavs')
                $('.fav-items-list').html('<div class="no_favorites">Nemate omiljene proizvode!</div>')
            }
            $('.faitemshold[acckey="' + acckey + '"]').remove()
            openFavList('')
            elem.removeClass('katalogv2_favorite_wrap_fav')
        } else {
            elem.addClass('katalogv2_favorite_wrap_fav')
        
            var favorites = [{
                acckey: acckey,
                ident: ident,
                frontpage: frontpage,
                naslov: seoTitle,
                slika: slika,
            }]

            // console.log('favorites', favorites)

            var morefavs = localStorage.getItem('favorites')
            if (typeof morefavs == typeof null || !morefavs.length) {
                localStorage.setItem('favorites', JSON.stringify(favorites))
            } else {
                morefavs = JSON.parse(morefavs)
                var imaga = false
                morefavs.forEach(x => {
                    for (const [key, value] of Object.entries(x)) {
                        if (key == 'acckey') {
                            if (value == favorites[0]['acckey']) {
                                imaga = true
                            }
                        }
                    }
                })
                if (!imaga) {
                    morefavs.push(favorites[0])
                    localStorage.setItem('favorites', JSON.stringify(morefavs))
                }
            }
            $('.favitems-dropdown').addClass('hasfavs')
            openFavList('open')
            
        }
    } else {
        window.location.href = "index.php?pageid=" + loginpage_pageid
    }
}

// otvara listu omiljenih proizvoda
var myTimeout
function openFavList(open) {
    var favorites = JSON.parse(localStorage.getItem('favorites'))
    if (open == 'open') {
        // if ($(window).width() > 992) {
        //     $('.favorites_holder').fadeIn()
        //     clearTimeout(myTimeout);
        //     myTimeout = setTimeout(function () {
        //         $('.favorites_holder').fadeOut()
        //     }, 2500);
        // }
    }
    if (favorites != null) {
        var html = ''
        favorites.forEach(favs => {
            html += `<div acckey="${favs.acckey}" class="faitemshold">
                        <a href="${favs.link}">
                            <div class="favitem-inner">
                                <div class="favitem_imghold"><img src="${favs.slika}"></div>
                                <div class="right-sect-wrap">
                                <div class="nazivfav">${favs.naslov}</div>
                                </div>
                            </div>
                        </a>
                        <div onclick="deleteFav(this, '${favs.acckey}')" class="delete-fav"><i class="fa fa-trash"></i></div>
                    </div>
        `
            $('.fav-items-list').html(html)

        })
    }

    if ($('.faitemshold').length) {
        $('.favitems-dropdown').addClass('hasfavs')
        if ($('.favitems-dropdown.hasfavs').length) {
            $('.nofav').addClass('hidden')
            $('.hasfav').removeClass('hidden')
            $('.num_fav_items').removeClass('hidden')
        }

    } else {
        $('.nofav').removeClass('hidden')
        $('.hasfav').addClass('hidden')
        $('.favitems-dropdown').removeClass('hasfavs')
        $('.fav-items-list').html('<div class="no_favorites">Nemate omiljene proizvode!</div>')
        $('.num_fav_items').addClass('hidden')
    }

    var broj_omiljenih = 0;
    broj_omiljenih = $('.faitemshold').length
    $('.num_fav_items').empty()
    $('.num_fav_items').append(broj_omiljenih)


    // Funkcija koja zatvara fauvorites dropdown na klik sa strane
    $(document).click(function (e) {
        if (!$(e.target).is('.faitemshold *, .delete-fav, .favitems-dropdown') &&
            $(e.target).closest('.faitemshold, .delete-fav, .favitems-dropdown').length === 0) {
            // Trigger function here
            $('.favorites_holder').fadeOut()
        }
    });


}

// inicijalizuje developer mode
function developer_toops_init() {
    if (dev == 'T') {
        $('section').addClass('editable_dev')
        $('section.editable_dev').each(function () {
            $(this).prepend(`<div class="developer_tools_wrap">
                                    <div type="grape" onclick="if(template == 'User manual'){parent.loadfromwebpreview($(this).parent().parent().attr('acckey'),'grape',$(this).parent().parent().attr('html'),$(this).parent().parent().attr('css') , $('.container.user-manual-page.clearfix').scrollTop())}else{parent.loadfromwebpreview($(this).parent().parent().attr('acckey'),'grape',$(this).parent().parent().attr('html'),$(this).parent().parent().attr('css') , $('html').scrollTop())}" class="grape_editor">` + grapeeditor + `</div>
                                    <div type="case" onclick="if(template == 'User manual'){parent.loadfromwebpreview($(this).parent().parent().attr('acckey'),'case','','', $('.container.user-manual-page.clearfix').scrollTop())}else{parent.loadfromwebpreview($(this).parent().parent().attr('acckey'),'case','','', $('html').scrollTop())}" class="case_editor">` + caseeditor + `</div>
                                    <div type="sort" class="sort_wrap" onmousedown="$('.lp_content').sortable('enable');if(template == 'User manual'){$('.user-manual-page.clearfix').css('scroll-behavior', 'unset')}" onmouseup="$('.lp_content').sortable('disable');if(template == 'User manual'){$('.user-manual-page.clearfix').css('scroll-behavior', 'smooth')}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_403_3008)"><path d="M7 0H4C2.93913 0 1.92172 0.421427 1.17157 1.17157C0.421427 1.92172 0 2.93913 0 4L0 7C0 8.06087 0.421427 9.07828 1.17157 9.82843C1.92172 10.5786 2.93913 11 4 11H7C8.06087 11 9.07828 10.5786 9.82843 9.82843C10.5786 9.07828 11 8.06087 11 7V4C11 2.93913 10.5786 1.92172 9.82843 1.17157C9.07828 0.421427 8.06087 0 7 0V0ZM9 7C9 7.53043 8.78929 8.03914 8.41421 8.41421C8.03914 8.78929 7.53043 9 7 9H4C3.46957 9 2.96086 8.78929 2.58579 8.41421C2.21071 8.03914 2 7.53043 2 7V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7Z" fill="#374957"/><path d="M7 13H4C2.93913 13 1.92172 13.4214 1.17157 14.1716C0.421427 14.9217 0 15.9391 0 17L0 20C0 21.0609 0.421427 22.0783 1.17157 22.8284C1.92172 23.5786 2.93913 24 4 24H7C8.06087 24 9.07828 23.5786 9.82843 22.8284C10.5786 22.0783 11 21.0609 11 20V17C11 15.9391 10.5786 14.9217 9.82843 14.1716C9.07828 13.4214 8.06087 13 7 13ZM9 20C9 20.5304 8.78929 21.0392 8.41421 21.4142C8.03914 21.7893 7.53043 22 7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0392 2 20.5304 2 20V17C2 16.4696 2.21071 15.9609 2.58579 15.5858C2.96086 15.2107 3.46957 15 4 15H7C7.53043 15 8.03914 15.2107 8.41421 15.5858C8.78929 15.9609 9 16.4696 9 17V20Z" fill="#374957"/><path d="M22.2932 19.049L20.0002 21.339V2.63297L22.2932 4.92297C22.3861 5.01581 22.4964 5.08945 22.6178 5.13967C22.7391 5.18989 22.8692 5.21572 23.0005 5.21567C23.1319 5.21563 23.2619 5.18971 23.3833 5.1394C23.5046 5.08909 23.6148 5.01538 23.7077 4.92247C23.8005 4.82956 23.8742 4.71927 23.9244 4.5979C23.9746 4.47654 24.0004 4.34647 24.0004 4.21512C24.0003 4.08377 23.9744 3.95371 23.9241 3.83238C23.8738 3.71105 23.8001 3.60081 23.7072 3.50797L21.1202 0.924968C20.5577 0.363166 19.7952 0.0476074 19.0002 0.0476074C18.2052 0.0476074 17.4427 0.363166 16.8802 0.924968L14.2932 3.50797C14.2003 3.60081 14.1266 3.71105 14.0763 3.83238C14.026 3.95371 14 4.08377 14 4.21512C14 4.34647 14.0258 4.47654 14.076 4.5979C14.1262 4.71927 14.1999 4.82956 14.2927 4.92247C14.3855 5.01538 14.4958 5.08909 14.6171 5.1394C14.7384 5.18971 14.8685 5.21563 14.9998 5.21567C15.1312 5.21572 15.2613 5.18989 15.3826 5.13967C15.504 5.08945 15.6143 5.01581 15.7072 4.92297L18.0002 2.63297V21.339L15.7072 19.049C15.6143 18.9561 15.504 18.8825 15.3826 18.8323C15.2613 18.7821 15.1312 18.7562 14.9998 18.7563C14.8685 18.7563 14.7384 18.7822 14.6171 18.8325C14.4958 18.8829 14.3855 18.9566 14.2927 19.0495C14.1999 19.1424 14.1262 19.2527 14.076 19.374C14.0258 19.4954 14 19.6255 14 19.7568C14 19.8882 14.026 20.0182 14.0763 20.1396C14.1266 20.2609 14.2003 20.3711 14.2932 20.464L16.8802 23.047C17.4427 23.6088 18.2052 23.9243 19.0002 23.9243C19.7952 23.9243 20.5577 23.6088 21.1202 23.047L23.7072 20.464C23.8001 20.3711 23.8738 20.2609 23.9241 20.1396C23.9744 20.0182 24.0003 19.8882 24.0004 19.7568C24.0004 19.6255 23.9746 19.4954 23.9244 19.374C23.8742 19.2527 23.8005 19.1424 23.7077 19.0495C23.6148 18.9566 23.5046 18.8829 23.3833 18.8325C23.2619 18.7822 23.1319 18.7563 23.0005 18.7563C22.8692 18.7562 22.7391 18.7821 22.6178 18.8323C22.4964 18.8825 22.3861 18.9561 22.2932 19.049Z" fill="#374957"/></g><defs><clipPath id="clip0_403_3008"><rect width="24" height="24" fill="white"/></clipPath></defs></svg></div>
                                </div>`)

        })
        $('.sectionwrapper').each(function () {
            //$(this).siblings('.developer_tools_wrap').find('.grape_editor').addClass('hidden')
        })

        import('https://code.jquery.com/ui/1.12.1/jquery-ui.js').then(() => {
            $(".lp_content").sortable({
                placeholder: "ui-state-highlight",
                items: "section",
                update: function () {
                    var niz = ''
                    $('.lp_content section').each(
                        function (index) {
                            if (niz == '') {
                                niz = niz + $(this).attr('acckey')
                            } else {
                                niz = niz + ',' + $(this).attr('acckey')
                            }
                        }
                    )
                    parent.savefrontsort(niz)
                }
            })
            $(".lp_content").sortable("disable");
        });
        var scrolltop = getParameterByName('scrollposition')
        if (template == 'User manual') {
            $('.container.user-manual-page.clearfix').scrollTop(scrolltop)
        } else {
            $('html').scrollTop(scrolltop)
        }


    }
}

// funkcija za prikazivanje search polja u mobilnoj verziji
function displaySearch() {
    $('.main_navigation').slideUp('slow')
    $('.login_form_btns_login').slideUp('slow')
    $('.total-cart-in ul').removeClass('active')
    event.preventDefault();
    event.stopPropagation();
    if (!$('.top-search-box').hasClass('activesearch')) {
        $('.top-search-box').addClass('activesearch')
        $('.activesearch .search-inner-wrap #topsearchinput').focus()
        $('.top-search-box').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        $('body').click(function () {
            $('.top-search-box').removeClass('activesearch')
        });
    } else {
        $('.top-search-box').removeClass('activesearch')
    }
    if ($(window).width() < 992) {
        $('.searchresultswrap').removeClass('hidden')
        $('body').css('overflow', 'hidden')
    }
}


// funkcija za prikazivanje/sakrivanje dugmeta za vrh strane
function scrollToTopHanlder(offset) {
    typeof offset == 'undefined' ? offset = 500 : offset = offset
    behavior: 'smooth'
    if (pageYOffset > 500) {
        $('#scroll-top').removeClass('fixed')
    } else {
        $('#scroll-top').addClass('fixed')
    }
}

$(document).on('scroll', scrollToTopHanlder)


// prvi deo funkcije za pretragu, mozda potrebna promena
async function empty() {
    var x;
    // x = $('input[name="searchterm"]').val().replace(/-/g, ' ').replace(/\//g, '$2F').replace(/\./g, ' ').replace(/\s+/g, '* *')
    x = $('input[name="searchterm"]').val().replace(/\//g, '$2F').replace(/\s+/g, '* *').replace(/-/g, '*')
    x = '*' + x + '*'
    if (x == "") {
        return false;
    } else {
        await searchAnalytics(x.replace(/\*/g, ''))
        document.location.href = "index.php?pageid=" + searchpage_pageid + "&search=" + x
    }
}

// // funkcija za expandovanje nivoa u headeru, mozda nepotrebna
function expandmenulevel(elem) {
    $(elem).closest('.dropdown').toggleClass('open')
    $(elem).closest('.fa-angle-up').toggleClass('open')
}

// BOJA HEADER ADRESS BARA PRETRAZIVACA NA MOBILNOM    
var headerbar_color = $('#header').css('background-color')
$('html head').append('<meta name="theme-color" content="' + headerbar_color + '"/>')


if(getCookie('userCurrency') == ''){
    initUserCurrency()
} else {
    global_valuta = getCookie('userCurrency')
    websyncinstance = getCookie('websyncinstance')
}

// funkcija koja se izvrsava na zavrsenom ucitavanju strane
$(document).ready(function () {
    initElastycSettings()
    template_string = template.replace(/ /g, '_')
    $('body').attr('template', template.replace(/Š/g, 'S').replace(/š/g, 's').replace(/Ž/g, 'Z').replace(/ž/g, 'z').replace(/Č/g, 'C').replace(/č/g, 'c').replace(/Ć/g, 'C').replace(/ć/g, 'c').replace(/Đ/g, 'Dj').replace(/đ/g, 'dj').replace(/ /g, '_'))
    $('body').removeAttr('id')
    if (getCookie('lang') == '') {
        setCookie('lang', 'SR')
    }
    $('.displayed-lang').text(getCookie('lang'))
    if ($(window).width() > 992) {
        $('.pick-me').removeAttr('style')
        $('.pick-me').addClass('closed')
    }
    if ($('#username1').is(":focus") || $('#password1').is(":focus")) {
        $('#loginform1 .form-control').keyup(function (e) {
            if (e.which == 13) {
                $('#loginformsubmit1').click()
            }
        });
    }

    initFavIcon()

    $('.total-cart-in').removeClass('hidden')

    if (!(getCookie('userid') == '-1' || getCookie('userid') == '')) {
        $('#loginform1').addClass('hidden')
        $('.privacy-seg a').text('Odjavi se').attr('href', 'logoff.php')
    }
    $('.pick-me').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $('.pick-me a').click(function (e) {
        e.stopPropagation();
    });
    $('.login-btns').click(function (e) {
        e.stopPropagation();
    });
    if (getCookie('cookie_notice_accepted') != 'T') {
        $('.cookiebanner').removeClass('hidden')
    }

    // if(userid !== -1 && userid !== 0 && userid !== '-1' && userid !== '0'){
    //     load_and_show_debt()
    // } else {
    //     $('.finance_wrap').css('display','none')
    // }

    menubuild()
    my_profile_build()
    init_debt()

    if ($(window).width() > 992) {
        // $('.menuholder .mainmenu .applink[template="Moj_profil"]').prepend(`<div class="mysvghold"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_403_2799)"><path d="M12 11.9999C13.1867 11.9999 14.3467 11.648 15.3334 10.9888C16.3201 10.3295 17.0892 9.3924 17.5433 8.29604C17.9974 7.19969 18.1162 5.99329 17.8847 4.8294C17.6532 3.66551 17.0818 2.59642 16.2426 1.7573C15.4035 0.918186 14.3344 0.346741 13.1705 0.11523C12.0067 -0.116281 10.8003 0.00253868 9.7039 0.456664C8.60754 0.91079 7.67047 1.67983 7.01118 2.66652C6.35189 3.65321 6 4.81325 6 5.99994C6.00159 7.59075 6.63424 9.11595 7.75911 10.2408C8.88399 11.3657 10.4092 11.9984 12 11.9999ZM12 1.99994C12.7911 1.99994 13.5645 2.23454 14.2223 2.67406C14.8801 3.11359 15.3928 3.7383 15.6955 4.46921C15.9983 5.20011 16.0775 6.00438 15.9231 6.7803C15.7688 7.55623 15.3878 8.26896 14.8284 8.82837C14.269 9.38778 13.5563 9.76874 12.7804 9.92308C12.0044 10.0774 11.2002 9.99821 10.4693 9.69546C9.73836 9.39271 9.11365 8.88002 8.67412 8.22222C8.2346 7.56443 8 6.79107 8 5.99994C8 4.93908 8.42143 3.92166 9.17157 3.17151C9.92172 2.42137 10.9391 1.99994 12 1.99994Z" fill="#374957"/><path d="M12 14.0006C9.61386 14.0033 7.32622 14.9523 5.63896 16.6396C3.95171 18.3268 3.00265 20.6145 3 23.0006C3 23.2658 3.10536 23.5202 3.29289 23.7077C3.48043 23.8953 3.73478 24.0006 4 24.0006C4.26522 24.0006 4.51957 23.8953 4.70711 23.7077C4.89464 23.5202 5 23.2658 5 23.0006C5 21.1441 5.7375 19.3636 7.05025 18.0509C8.36301 16.7381 10.1435 16.0006 12 16.0006C13.8565 16.0006 15.637 16.7381 16.9497 18.0509C18.2625 19.3636 19 21.1441 19 23.0006C19 23.2658 19.1054 23.5202 19.2929 23.7077C19.4804 23.8953 19.7348 24.0006 20 24.0006C20.2652 24.0006 20.5196 23.8953 20.7071 23.7077C20.8946 23.5202 21 23.2658 21 23.0006C20.9974 20.6145 20.0483 18.3268 18.361 16.6396C16.6738 14.9523 14.3861 14.0033 12 14.0006Z" fill="#374957"/></g><defs><clipPath id="clip0_403_2799"><rect width="24" height="24" fill="white"/></clipPath></defs></svg></div>`)
        // $('.menuholder .mainmenu li:has(> .applink[template="Moj_profil"]) ul.dropdown-menu .sublist .applink').prepend(`<div class="my_profile_menu_svg"></div>`)
        // $('.menuholder .mainmenu li:has(> .applink[template="Moj_profil"]) ul.dropdown-menu .sublist .applink[template="Odsustva"] .my_profile_menu_svg').html(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="937c17c923"><path d="M 66 56.402344 L 318.902344 56.402344 L 318.902344 309 L 66 309 Z M 66 56.402344 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#937c17c923)"><path fill="#000000" d="M 192.65625 56.457031 C 190.589844 56.457031 188.527344 56.507812 186.464844 56.609375 C 184.402344 56.710938 182.34375 56.863281 180.289062 57.066406 C 178.234375 57.265625 176.183594 57.519531 174.140625 57.824219 C 172.097656 58.125 170.0625 58.480469 168.039062 58.882812 C 166.011719 59.285156 164 59.738281 161.996094 60.238281 C 159.992188 60.742188 158 61.292969 156.023438 61.890625 C 154.050781 62.492188 152.089844 63.136719 150.144531 63.832031 C 148.199219 64.53125 146.273438 65.273438 144.367188 66.0625 C 142.457031 66.851562 140.570312 67.691406 138.703125 68.574219 C 136.835938 69.457031 134.992188 70.382812 133.171875 71.359375 C 131.347656 72.332031 129.554688 73.347656 127.78125 74.410156 C 126.011719 75.472656 124.265625 76.578125 122.546875 77.722656 C 120.832031 78.871094 119.144531 80.058594 117.484375 81.289062 C 115.824219 82.519531 114.199219 83.789062 112.601562 85.101562 C 111.003906 86.410156 109.441406 87.757812 107.910156 89.148438 C 106.382812 90.535156 104.886719 91.957031 103.425781 93.417969 C 101.964844 94.878906 100.542969 96.371094 99.15625 97.902344 C 97.769531 99.433594 96.417969 100.996094 95.109375 102.59375 C 93.800781 104.191406 92.527344 105.816406 91.296875 107.476562 C 90.070312 109.132812 88.878906 110.824219 87.730469 112.539062 C 86.585938 114.257812 85.480469 116 84.417969 117.773438 C 83.355469 119.542969 82.339844 121.339844 81.367188 123.160156 C 80.390625 124.984375 79.464844 126.828125 78.582031 128.695312 C 77.699219 130.5625 76.863281 132.449219 76.070312 134.355469 C 75.28125 136.265625 74.539062 138.191406 73.84375 140.136719 C 73.144531 142.078125 72.5 144.039062 71.898438 146.015625 C 71.300781 147.992188 70.75 149.980469 70.246094 151.984375 C 69.746094 153.988281 69.292969 156.003906 68.890625 158.027344 C 68.488281 160.054688 68.132812 162.089844 67.832031 164.132812 C 67.527344 166.175781 67.273438 168.222656 67.074219 170.277344 C 66.871094 172.332031 66.71875 174.394531 66.617188 176.457031 C 66.515625 178.519531 66.464844 180.582031 66.464844 182.648438 C 66.464844 184.710938 66.515625 186.777344 66.617188 188.839844 C 66.71875 190.902344 66.871094 192.960938 67.074219 195.015625 C 67.273438 197.070312 67.527344 199.121094 67.832031 201.164062 C 68.132812 203.207031 68.488281 205.242188 68.890625 207.265625 C 69.292969 209.292969 69.746094 211.304688 70.246094 213.308594 C 70.75 215.3125 71.300781 217.300781 71.898438 219.277344 C 72.5 221.253906 73.144531 223.214844 73.839844 225.160156 C 74.539062 227.105469 75.28125 229.03125 76.070312 230.9375 C 76.859375 232.847656 77.699219 234.734375 78.582031 236.601562 C 79.464844 238.46875 80.390625 240.3125 81.367188 242.132812 C 82.339844 243.953125 83.355469 245.75 84.417969 247.523438 C 85.480469 249.292969 86.585938 251.039062 87.730469 252.753906 C 88.878906 254.472656 90.066406 256.160156 91.296875 257.820312 C 92.527344 259.476562 93.796875 261.105469 95.109375 262.703125 C 96.417969 264.296875 97.765625 265.863281 99.15625 267.390625 C 100.542969 268.921875 101.964844 270.417969 103.425781 271.878906 C 104.886719 273.335938 106.378906 274.761719 107.910156 276.148438 C 109.441406 277.535156 111.003906 278.882812 112.601562 280.195312 C 114.199219 281.503906 115.824219 282.773438 117.484375 284.003906 C 119.140625 285.234375 120.832031 286.421875 122.546875 287.570312 C 124.265625 288.71875 126.007812 289.824219 127.78125 290.882812 C 129.550781 291.945312 131.347656 292.964844 133.167969 293.9375 C 134.992188 294.910156 136.835938 295.839844 138.703125 296.722656 C 140.570312 297.605469 142.457031 298.441406 144.363281 299.230469 C 146.273438 300.023438 148.199219 300.765625 150.144531 301.460938 C 152.085938 302.15625 154.046875 302.804688 156.023438 303.402344 C 158 304.003906 159.988281 304.554688 161.992188 305.054688 C 163.996094 305.558594 166.011719 306.011719 168.035156 306.414062 C 170.0625 306.816406 172.097656 307.167969 174.140625 307.472656 C 176.183594 307.773438 178.230469 308.027344 180.285156 308.230469 C 182.339844 308.433594 184.402344 308.585938 186.464844 308.6875 C 188.527344 308.785156 190.589844 308.835938 192.65625 308.835938 C 194.71875 308.835938 196.785156 308.785156 198.847656 308.6875 C 200.910156 308.585938 202.96875 308.433594 205.023438 308.230469 C 207.078125 308.027344 209.128906 307.773438 211.171875 307.472656 C 213.214844 307.167969 215.25 306.816406 217.273438 306.414062 C 219.300781 306.011719 221.3125 305.558594 223.316406 305.054688 C 225.320312 304.554688 227.308594 304.003906 229.285156 303.402344 C 231.261719 302.804688 233.222656 302.15625 235.167969 301.460938 C 237.113281 300.765625 239.039062 300.023438 240.945312 299.230469 C 242.855469 298.441406 244.742188 297.605469 246.609375 296.722656 C 248.476562 295.839844 250.320312 294.910156 252.140625 293.9375 C 253.960938 292.964844 255.757812 291.945312 257.53125 290.882812 C 259.300781 289.824219 261.046875 288.71875 262.761719 287.570312 C 264.480469 286.421875 266.167969 285.234375 267.828125 284.003906 C 269.484375 282.773438 271.113281 281.503906 272.710938 280.195312 C 274.304688 278.882812 275.871094 277.535156 277.398438 276.148438 C 278.929688 274.761719 280.425781 273.335938 281.886719 271.878906 C 283.34375 270.417969 284.769531 268.921875 286.15625 267.390625 C 287.542969 265.859375 288.890625 264.296875 290.203125 262.703125 C 291.511719 261.105469 292.78125 259.476562 294.011719 257.820312 C 295.242188 256.160156 296.429688 254.472656 297.578125 252.753906 C 298.726562 251.039062 299.832031 249.292969 300.890625 247.523438 C 301.953125 245.75 302.972656 243.953125 303.945312 242.132812 C 304.917969 240.3125 305.847656 238.46875 306.730469 236.601562 C 307.613281 234.734375 308.449219 232.847656 309.238281 230.9375 C 310.03125 229.03125 310.773438 227.101562 311.46875 225.160156 C 312.164062 223.214844 312.8125 221.253906 313.410156 219.277344 C 314.011719 217.300781 314.5625 215.3125 315.0625 213.308594 C 315.566406 211.304688 316.019531 209.289062 316.421875 207.265625 C 316.824219 205.238281 317.175781 203.207031 317.480469 201.164062 C 317.78125 199.121094 318.035156 197.070312 318.238281 195.015625 C 318.441406 192.960938 318.59375 190.902344 318.695312 188.839844 C 318.792969 186.773438 318.84375 184.710938 318.84375 182.644531 C 318.84375 180.582031 318.789062 178.519531 318.6875 176.457031 C 318.582031 174.394531 318.429688 172.335938 318.226562 170.28125 C 318.019531 168.226562 317.765625 166.179688 317.460938 164.136719 C 317.15625 162.09375 316.800781 160.0625 316.398438 158.039062 C 315.992188 156.011719 315.539062 154 315.035156 151.996094 C 314.53125 149.996094 313.980469 148.007812 313.378906 146.03125 C 312.777344 144.054688 312.128906 142.097656 311.433594 140.152344 C 310.738281 138.210938 309.992188 136.285156 309.203125 134.378906 C 308.410156 132.472656 307.574219 130.585938 306.691406 128.71875 C 305.804688 126.851562 304.878906 125.011719 303.902344 123.191406 C 302.929688 121.367188 301.910156 119.574219 300.847656 117.804688 C 299.789062 116.03125 298.683594 114.289062 297.535156 112.574219 C 296.386719 110.855469 295.199219 109.167969 293.96875 107.511719 C 292.738281 105.855469 291.46875 104.226562 290.15625 102.632812 C 288.847656 101.035156 287.5 99.472656 286.113281 97.941406 C 284.726562 96.414062 283.304688 94.917969 281.84375 93.460938 C 280.382812 92 278.890625 90.574219 277.359375 89.191406 C 275.828125 87.804688 274.265625 86.453125 272.671875 85.144531 C 271.074219 83.835938 269.449219 82.566406 267.792969 81.335938 C 266.132812 80.105469 264.445312 78.914062 262.730469 77.769531 C 261.011719 76.621094 259.269531 75.515625 257.5 74.453125 C 255.730469 73.390625 253.933594 72.375 252.113281 71.398438 C 250.292969 70.425781 248.449219 69.496094 246.585938 68.613281 C 244.71875 67.730469 242.832031 66.890625 240.925781 66.101562 C 239.019531 65.308594 237.09375 64.566406 235.148438 63.871094 C 233.207031 63.171875 231.246094 62.523438 229.269531 61.921875 C 227.296875 61.324219 225.308594 60.769531 223.304688 60.265625 C 221.304688 59.765625 219.289062 59.308594 217.265625 58.90625 C 215.242188 58.5 213.207031 58.148438 211.164062 57.84375 C 209.125 57.535156 207.074219 57.28125 205.019531 57.078125 C 202.964844 56.875 200.910156 56.71875 198.847656 56.617188 C 196.785156 56.511719 194.722656 56.460938 192.65625 56.457031 Z M 192.65625 297.714844 C 190.773438 297.714844 188.890625 297.667969 187.011719 297.574219 C 185.128906 297.484375 183.253906 297.34375 181.378906 297.160156 C 179.503906 296.976562 177.636719 296.746094 175.773438 296.46875 C 173.910156 296.191406 172.054688 295.871094 170.207031 295.503906 C 168.359375 295.136719 166.523438 294.722656 164.699219 294.265625 C 162.871094 293.808594 161.054688 293.304688 159.253906 292.761719 C 157.453125 292.214844 155.664062 291.621094 153.890625 290.988281 C 152.117188 290.355469 150.363281 289.675781 148.621094 288.957031 C 146.882812 288.234375 145.160156 287.472656 143.457031 286.667969 C 141.757812 285.863281 140.074219 285.015625 138.414062 284.128906 C 136.753906 283.238281 135.113281 282.3125 133.5 281.34375 C 131.882812 280.375 130.292969 279.367188 128.726562 278.324219 C 127.164062 277.277344 125.621094 276.191406 124.109375 275.070312 C 122.597656 273.949219 121.113281 272.789062 119.65625 271.59375 C 118.203125 270.402344 116.777344 269.171875 115.382812 267.90625 C 113.984375 266.640625 112.621094 265.34375 111.289062 264.011719 C 109.960938 262.679688 108.660156 261.316406 107.398438 259.921875 C 106.132812 258.527344 104.902344 257.101562 103.707031 255.644531 C 102.511719 254.191406 101.355469 252.707031 100.234375 251.191406 C 99.109375 249.679688 98.027344 248.140625 96.980469 246.574219 C 95.933594 245.007812 94.925781 243.417969 93.960938 241.804688 C 92.992188 240.1875 92.0625 238.550781 91.175781 236.890625 C 90.289062 235.230469 89.441406 233.546875 88.636719 231.84375 C 87.832031 230.144531 87.066406 228.421875 86.347656 226.683594 C 85.625 224.941406 84.949219 223.183594 84.316406 221.414062 C 83.679688 219.640625 83.089844 217.851562 82.542969 216.050781 C 81.996094 214.246094 81.492188 212.433594 81.035156 210.605469 C 80.578125 208.78125 80.167969 206.941406 79.800781 205.097656 C 79.433594 203.25 79.109375 201.394531 78.832031 199.53125 C 78.558594 197.667969 78.328125 195.800781 78.140625 193.925781 C 77.957031 192.050781 77.820312 190.175781 77.726562 188.292969 C 77.632812 186.414062 77.589844 184.53125 77.589844 182.648438 C 77.589844 180.765625 77.632812 178.882812 77.726562 177 C 77.820312 175.121094 77.957031 173.242188 78.140625 171.367188 C 78.328125 169.496094 78.558594 167.625 78.832031 165.761719 C 79.109375 163.902344 79.433594 162.046875 79.800781 160.199219 C 80.167969 158.351562 80.578125 156.515625 81.035156 154.6875 C 81.492188 152.863281 81.996094 151.046875 82.542969 149.246094 C 83.089844 147.441406 83.679688 145.65625 84.3125 143.882812 C 84.949219 142.109375 85.625 140.351562 86.347656 138.613281 C 87.066406 136.875 87.832031 135.152344 88.636719 133.449219 C 89.441406 131.746094 90.289062 130.066406 91.175781 128.40625 C 92.0625 126.746094 92.992188 125.105469 93.957031 123.492188 C 94.925781 121.875 95.933594 120.285156 96.980469 118.71875 C 98.027344 117.152344 99.109375 115.613281 100.234375 114.101562 C 101.355469 112.589844 102.511719 111.105469 103.707031 109.648438 C 104.902344 108.195312 106.132812 106.769531 107.394531 105.371094 C 108.660156 103.976562 109.957031 102.613281 111.289062 101.28125 C 112.621094 99.949219 113.984375 98.652344 115.382812 97.386719 C 116.777344 96.125 118.203125 94.894531 119.65625 93.699219 C 121.113281 92.503906 122.597656 91.347656 124.109375 90.222656 C 125.621094 89.101562 127.160156 88.019531 128.726562 86.972656 C 130.292969 85.925781 131.882812 84.917969 133.5 83.949219 C 135.113281 82.984375 136.753906 82.054688 138.414062 81.167969 C 140.074219 80.28125 141.753906 79.433594 143.457031 78.628906 C 145.160156 77.824219 146.882812 77.058594 148.621094 76.339844 C 150.359375 75.617188 152.117188 74.941406 153.890625 74.304688 C 155.664062 73.671875 157.449219 73.082031 159.253906 72.535156 C 161.054688 71.988281 162.871094 71.484375 164.695312 71.027344 C 166.523438 70.570312 168.359375 70.160156 170.207031 69.792969 C 172.054688 69.421875 173.910156 69.101562 175.769531 68.824219 C 177.632812 68.550781 179.503906 68.320312 181.375 68.132812 C 183.25 67.949219 185.128906 67.8125 187.007812 67.71875 C 188.890625 67.625 190.773438 67.582031 192.65625 67.582031 C 194.539062 67.582031 196.421875 67.625 198.300781 67.71875 C 200.183594 67.8125 202.058594 67.949219 203.933594 68.132812 C 205.808594 68.320312 207.675781 68.550781 209.539062 68.824219 C 211.402344 69.101562 213.257812 69.421875 215.105469 69.792969 C 216.949219 70.160156 218.789062 70.570312 220.613281 71.027344 C 222.441406 71.484375 224.253906 71.988281 226.058594 72.535156 C 227.859375 73.082031 229.648438 73.671875 231.421875 74.304688 C 233.195312 74.941406 234.949219 75.617188 236.691406 76.339844 C 238.429688 77.058594 240.152344 77.824219 241.851562 78.628906 C 243.554688 79.433594 245.238281 80.28125 246.898438 81.167969 C 248.558594 82.054688 250.195312 82.984375 251.8125 83.949219 C 253.425781 84.917969 255.015625 85.925781 256.582031 86.972656 C 258.148438 88.019531 259.6875 89.101562 261.199219 90.222656 C 262.714844 91.347656 264.199219 92.503906 265.652344 93.699219 C 267.109375 94.894531 268.535156 96.125 269.929688 97.386719 C 271.324219 98.652344 272.6875 99.949219 274.019531 101.28125 C 275.351562 102.613281 276.648438 103.976562 277.914062 105.371094 C 279.179688 106.769531 280.410156 108.195312 281.605469 109.648438 C 282.796875 111.105469 283.957031 112.589844 285.078125 114.101562 C 286.199219 115.613281 287.285156 117.152344 288.332031 118.71875 C 289.375 120.285156 290.382812 121.875 291.351562 123.492188 C 292.320312 125.105469 293.246094 126.742188 294.136719 128.40625 C 295.023438 130.066406 295.871094 131.746094 296.675781 133.449219 C 297.480469 135.152344 298.242188 136.871094 298.964844 138.613281 C 299.683594 140.351562 300.363281 142.109375 300.996094 143.882812 C 301.628906 145.65625 302.222656 147.441406 302.769531 149.246094 C 303.316406 151.046875 303.816406 152.859375 304.273438 154.6875 C 304.730469 156.515625 305.144531 158.351562 305.511719 160.199219 C 305.878906 162.042969 306.199219 163.898438 306.476562 165.761719 C 306.753906 167.625 306.984375 169.492188 307.167969 171.367188 C 307.351562 173.242188 307.492188 175.121094 307.585938 177 C 307.675781 178.882812 307.722656 180.761719 307.722656 182.644531 C 307.71875 184.527344 307.671875 186.410156 307.578125 188.289062 C 307.484375 190.171875 307.34375 192.046875 307.15625 193.921875 C 306.972656 195.792969 306.738281 197.660156 306.460938 199.523438 C 306.183594 201.386719 305.859375 203.238281 305.492188 205.085938 C 305.121094 206.933594 304.707031 208.769531 304.25 210.59375 C 303.789062 212.417969 303.289062 214.234375 302.738281 216.035156 C 302.191406 217.835938 301.601562 219.621094 300.964844 221.394531 C 300.328125 223.167969 299.652344 224.921875 298.929688 226.660156 C 298.207031 228.398438 297.445312 230.121094 296.640625 231.820312 C 295.832031 233.523438 294.988281 235.203125 294.097656 236.863281 C 293.210938 238.523438 292.28125 240.160156 291.3125 241.773438 C 290.34375 243.390625 289.339844 244.980469 288.292969 246.542969 C 287.246094 248.109375 286.160156 249.648438 285.039062 251.160156 C 283.917969 252.671875 282.761719 254.15625 281.566406 255.609375 C 280.371094 257.066406 279.140625 258.488281 277.878906 259.886719 C 276.613281 261.28125 275.316406 262.644531 273.984375 263.972656 C 272.652344 265.304688 271.289062 266.601562 269.894531 267.867188 C 268.5 269.132812 267.074219 270.359375 265.621094 271.554688 C 264.164062 272.75 262.679688 273.910156 261.167969 275.03125 C 259.65625 276.152344 258.121094 277.234375 256.554688 278.28125 C 254.988281 279.328125 253.398438 280.335938 251.785156 281.304688 C 250.171875 282.273438 248.535156 283.203125 246.875 284.089844 C 245.214844 284.976562 243.53125 285.824219 241.832031 286.628906 C 240.128906 287.4375 238.410156 288.199219 236.671875 288.921875 C 234.933594 289.640625 233.175781 290.320312 231.40625 290.957031 C 229.632812 291.589844 227.847656 292.183594 226.042969 292.730469 C 224.242188 293.277344 222.429688 293.78125 220.605469 294.242188 C 218.777344 294.699219 216.941406 295.113281 215.097656 295.480469 C 213.25 295.851562 211.394531 296.175781 209.535156 296.453125 C 207.671875 296.730469 205.804688 296.960938 203.929688 297.148438 C 202.058594 297.335938 200.179688 297.476562 198.300781 297.570312 C 196.421875 297.664062 194.539062 297.710938 192.65625 297.714844 Z M 192.65625 297.714844 " fill-opacity="1" fill-rule="nonzero"/></g><path fill="#000000" d="M 198.21875 183.933594 L 198.21875 101.507812 C 198.21875 101.144531 198.183594 100.78125 198.109375 100.421875 C 198.039062 100.066406 197.933594 99.71875 197.792969 99.378906 C 197.65625 99.042969 197.484375 98.722656 197.28125 98.417969 C 197.078125 98.113281 196.847656 97.832031 196.589844 97.574219 C 196.332031 97.316406 196.050781 97.085938 195.746094 96.882812 C 195.441406 96.679688 195.121094 96.511719 194.785156 96.371094 C 194.449219 96.230469 194.101562 96.125 193.742188 96.054688 C 193.382812 95.984375 193.023438 95.945312 192.65625 95.945312 C 192.292969 95.945312 191.929688 95.984375 191.570312 96.054688 C 191.214844 96.125 190.867188 96.230469 190.527344 96.371094 C 190.191406 96.511719 189.871094 96.679688 189.566406 96.882812 C 189.261719 97.085938 188.980469 97.316406 188.722656 97.574219 C 188.464844 97.832031 188.234375 98.113281 188.03125 98.417969 C 187.828125 98.722656 187.660156 99.042969 187.519531 99.378906 C 187.378906 99.71875 187.273438 100.066406 187.203125 100.421875 C 187.132812 100.78125 187.09375 101.144531 187.09375 101.507812 L 187.09375 186.234375 C 187.09375 186.972656 187.238281 187.683594 187.519531 188.363281 C 187.800781 189.046875 188.203125 189.648438 188.726562 190.167969 L 236.832031 238.277344 C 237.089844 238.535156 237.371094 238.765625 237.675781 238.96875 C 237.980469 239.171875 238.300781 239.34375 238.636719 239.480469 C 238.976562 239.621094 239.324219 239.726562 239.679688 239.796875 C 240.039062 239.871094 240.402344 239.90625 240.765625 239.90625 C 241.128906 239.90625 241.492188 239.871094 241.851562 239.796875 C 242.207031 239.726562 242.554688 239.621094 242.894531 239.480469 C 243.230469 239.34375 243.550781 239.171875 243.855469 238.96875 C 244.160156 238.765625 244.4375 238.535156 244.699219 238.277344 C 244.957031 238.019531 245.1875 237.738281 245.390625 237.433594 C 245.59375 237.128906 245.761719 236.808594 245.902344 236.472656 C 246.042969 236.136719 246.148438 235.789062 246.21875 235.429688 C 246.289062 235.070312 246.328125 234.710938 246.328125 234.34375 C 246.328125 233.980469 246.289062 233.617188 246.21875 233.257812 C 246.148438 232.902344 246.042969 232.554688 245.902344 232.214844 C 245.761719 231.878906 245.59375 231.558594 245.390625 231.253906 C 245.1875 230.953125 244.957031 230.671875 244.699219 230.414062 Z M 198.21875 183.933594 " fill-opacity="1" fill-rule="nonzero"/></svg>`)
        // $('.menuholder .mainmenu li:has(> .applink[template="Moj_profil"]) ul.dropdown-menu .sublist .applink[template="Help_Desk"] .my_profile_menu_svg').html(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="8c805f55f2"><path d="M 29.210938 41.445312 L 345.710938 41.445312 L 345.710938 333.195312 L 29.210938 333.195312 Z M 29.210938 41.445312 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#8c805f55f2)"><path fill="#004aad" d="M 334.445312 239.289062 C 334.445312 244.121094 330.59375 247.972656 325.761719 247.972656 L 296.820312 247.664062 L 296.820312 189.105469 L 325.761719 189.105469 C 330.59375 189.105469 334.445312 192.953125 334.445312 197.785156 Z M 188.109375 68.8125 C 187.769531 68.8125 187.460938 68.8125 187.460938 68.8125 L 186.816406 68.8125 C 129.886719 69.457031 83.246094 113.519531 78.410156 169.152344 L 69.421875 164.347656 C 71.359375 102.585938 123.453125 52.710938 187.460938 52.710938 C 187.769531 52.710938 187.769531 52.710938 187.769531 52.710938 L 188.109375 52.710938 C 252.117188 52.710938 304.210938 102.585938 306.148438 164.347656 L 296.175781 169.492188 C 291.679688 113.519531 245.035156 69.457031 188.109375 68.8125 Z M 78.101562 247.664062 L 49.160156 247.972656 C 44.328125 247.972656 40.480469 244.121094 40.480469 239.289062 L 40.480469 197.785156 C 40.480469 192.953125 44.328125 189.105469 49.160156 189.105469 L 77.765625 189.105469 L 77.765625 247.664062 Z M 230.253906 322.265625 L 213.816406 322.265625 C 210.613281 322.265625 208.03125 319.707031 208.03125 316.476562 C 208.03125 313.273438 210.613281 310.6875 213.816406 310.6875 L 230.253906 310.6875 C 233.457031 310.6875 236.042969 313.273438 236.042969 316.476562 C 236.042969 319.707031 233.457031 322.265625 230.253906 322.265625 Z M 325.761719 177.835938 L 304.855469 177.835938 L 314.832031 172.695312 C 316.769531 171.738281 317.726562 169.800781 317.726562 167.550781 C 317.726562 98.0625 259.816406 41.472656 188.417969 41.472656 C 188.109375 41.472656 188.109375 41.472656 188.109375 41.472656 L 187.769531 41.472656 C 116.0625 41.472656 58.152344 98.0625 58.152344 167.550781 C 58.152344 169.492188 59.136719 171.402344 61.046875 172.386719 L 70.710938 177.527344 L 49.160156 177.527344 C 38.203125 177.527344 29.210938 186.519531 29.210938 197.476562 L 29.210938 238.953125 C 29.210938 249.910156 38.203125 258.902344 49.46875 258.902344 L 83.890625 258.59375 C 87.121094 258.59375 89.371094 256.007812 89.371094 252.804688 L 89.371094 178.484375 C 89.371094 124.449219 133.429688 80.390625 187.460938 80.050781 C 241.496094 80.390625 285.582031 124.449219 285.582031 178.484375 L 285.582031 253.113281 C 285.582031 256.34375 288.136719 258.59375 291.03125 258.902344 L 299.378906 258.902344 C 296.484375 286.578125 274.3125 308.441406 246.328125 310.378906 C 244.078125 303.945312 237.644531 299.113281 230.253906 299.113281 L 213.816406 299.113281 C 204.515625 299.113281 196.789062 306.839844 196.789062 316.167969 C 196.789062 325.496094 204.515625 333.195312 213.816406 333.195312 L 230.253906 333.195312 C 237.644531 333.195312 244.078125 328.390625 246.328125 321.617188 C 280.410156 319.707031 307.75 292.675781 310.644531 258.902344 L 325.761719 258.902344 C 336.691406 258.902344 345.710938 249.910156 345.710938 238.953125 L 345.710938 197.785156 C 345.710938 186.855469 336.691406 177.835938 325.761719 177.835938 " fill-opacity="1" fill-rule="nonzero"/></g><path fill="#004aad" d="M 187.152344 144.0625 C 201.621094 144.0625 213.199219 155.667969 213.199219 170.136719 C 213.199219 184.609375 201.621094 196.183594 187.152344 196.183594 C 183.921875 196.183594 181.363281 198.769531 181.363281 201.972656 L 181.363281 222.570312 C 181.363281 225.773438 183.921875 228.359375 187.152344 228.359375 C 190.355469 228.359375 192.941406 225.773438 192.941406 222.570312 L 192.941406 206.804688 C 210.953125 204.222656 224.46875 188.457031 224.46875 169.800781 C 224.46875 149.230469 207.71875 132.484375 187.152344 132.484375 C 166.554688 132.484375 149.835938 149.230469 149.835938 169.800781 C 149.835938 173.03125 152.394531 175.589844 155.625 175.589844 C 158.828125 175.589844 161.414062 173.03125 161.414062 169.800781 C 161.078125 155.667969 172.652344 144.0625 187.152344 144.0625 C 186.816406 144.0625 187.152344 144.0625 187.152344 144.0625 " fill-opacity="1" fill-rule="nonzero"/><path fill="#004aad" d="M 186.816406 240.890625 C 193.054688 240.890625 198.082031 245.949219 198.082031 252.160156 C 198.082031 258.367188 193.054688 263.398438 186.816406 263.398438 C 180.605469 263.398438 175.546875 258.367188 175.546875 252.160156 C 175.546875 245.949219 180.605469 240.890625 186.816406 240.890625 " fill-opacity="1" fill-rule="nonzero"/></svg>`)
        // $('.menuholder .mainmenu li:has(> .applink[template="Moj_profil"]) ul.dropdown-menu .sublist .applink[template="Narudzbine"] .my_profile_menu_svg').html(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="fb99e50037"><path d="M 34.121094 39.421875 L 340.871094 39.421875 L 340.871094 335.671875 L 34.121094 335.671875 Z M 34.121094 39.421875 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#fb99e50037)"><path fill="#03989e" d="M 58.90625 65.972656 L 58.90625 65.554688 C 58.90625 62.835938 61.113281 60.628906 63.828125 60.628906 C 66.546875 60.628906 68.75 62.835938 68.75 65.554688 L 68.75 65.972656 C 68.75 68.691406 66.546875 70.898438 63.828125 70.898438 C 61.113281 70.898438 58.90625 68.691406 58.90625 65.972656 Z M 85.164062 70.46875 C 87.878906 70.46875 90.085938 68.265625 90.085938 65.546875 L 90.085938 65.125 C 90.085938 62.40625 87.878906 60.199219 85.164062 60.199219 C 82.445312 60.199219 80.242188 62.40625 80.242188 65.125 L 80.242188 65.546875 C 80.242188 68.265625 82.445312 70.46875 85.164062 70.46875 Z M 106.496094 70.46875 C 109.214844 70.46875 111.417969 68.265625 111.417969 65.546875 L 111.417969 65.125 C 111.417969 62.40625 109.214844 60.199219 106.496094 60.199219 C 103.777344 60.199219 101.574219 62.40625 101.574219 65.125 L 101.574219 65.546875 C 101.574219 68.265625 103.777344 70.46875 106.496094 70.46875 Z M 338.917969 308.960938 L 314.132812 333.75 C 312.210938 335.671875 309.097656 335.671875 307.175781 333.75 L 282.128906 308.695312 L 262.558594 328.273438 C 260.636719 330.195312 257.519531 330.195312 255.597656 328.273438 C 254.996094 327.667969 254.582031 326.949219 254.359375 326.191406 L 239.640625 277.582031 L 39.097656 277.582031 C 36.378906 277.582031 34.175781 275.378906 34.175781 272.660156 L 34.175781 44.34375 C 34.175781 41.625 36.378906 39.421875 39.097656 39.421875 L 308.285156 39.421875 C 311.003906 39.421875 313.207031 41.625 313.207031 44.34375 L 313.207031 243.671875 L 331.394531 249.183594 C 333.996094 249.964844 335.46875 252.714844 334.679688 255.316406 C 334.425781 256.152344 333.976562 256.863281 333.394531 257.429688 L 313.875 276.957031 L 338.925781 302.011719 C 340.839844 303.925781 340.839844 307.039062 338.917969 308.960938 Z M 44.019531 49.265625 L 44.019531 82.101562 L 303.363281 82.101562 L 303.363281 49.265625 Z M 236.660156 267.738281 L 226.808594 235.210938 L 191.039062 235.210938 C 188.324219 235.210938 186.117188 233.003906 186.117188 230.285156 L 186.117188 204.230469 C 186.117188 201.511719 188.324219 199.304688 191.039062 199.304688 L 274.253906 199.304688 C 276.972656 199.304688 279.175781 201.511719 279.175781 204.230469 L 279.175781 230.285156 C 279.175781 231.335938 278.769531 232.261719 278.210938 233.058594 L 303.355469 240.675781 L 303.355469 91.945312 L 44.019531 91.945312 L 44.019531 267.746094 L 236.660156 267.746094 Z M 229.695312 218.363281 L 252.8125 225.371094 L 269.332031 225.371094 L 269.332031 209.152344 L 195.953125 209.152344 L 195.953125 225.371094 L 223.824219 225.371094 L 223.558594 224.496094 C 223.390625 223.945312 223.359375 223.363281 223.398438 222.765625 C 223.410156 222.582031 223.441406 222.414062 223.472656 222.230469 C 223.503906 222.039062 223.496094 221.839844 223.558594 221.648438 C 223.601562 221.488281 223.71875 221.382812 223.777344 221.226562 C 223.910156 220.914062 224.0625 220.632812 224.246094 220.355469 C 224.421875 220.09375 224.605469 219.859375 224.828125 219.644531 C 225.050781 219.421875 225.28125 219.238281 225.539062 219.0625 C 225.824219 218.871094 226.097656 218.714844 226.414062 218.59375 C 226.566406 218.53125 226.671875 218.417969 226.832031 218.371094 C 227.023438 218.3125 227.222656 218.320312 227.414062 218.289062 C 227.597656 218.257812 227.765625 218.21875 227.949219 218.210938 C 228.5625 218.164062 229.144531 218.195312 229.695312 218.363281 Z M 328.480469 305.484375 L 303.433594 280.433594 C 301.511719 278.511719 301.511719 275.394531 303.433594 273.472656 L 320.679688 256.222656 L 250.515625 234.957031 C 250.515625 234.957031 250.515625 234.957031 250.507812 234.957031 L 238.09375 231.191406 L 235.652344 230.449219 L 261.410156 315.5 L 278.65625 298.25 C 280.578125 296.328125 283.691406 296.328125 285.613281 298.25 L 310.660156 323.304688 Z M 168.460938 143.433594 L 168.460938 230.292969 C 168.460938 233.011719 166.253906 235.21875 163.539062 235.21875 L 81.042969 235.21875 C 78.328125 235.21875 76.121094 233.011719 76.121094 230.292969 L 76.121094 143.433594 C 76.121094 140.714844 78.328125 138.507812 81.042969 138.507812 L 97.109375 138.507812 L 97.109375 133.664062 C 97.109375 126.734375 99.941406 120.429688 104.503906 115.867188 C 109.066406 111.304688 115.367188 108.472656 122.292969 108.472656 C 129.222656 108.472656 135.523438 111.304688 140.082031 115.867188 C 144.644531 120.429688 147.476562 126.734375 147.476562 133.664062 L 147.476562 138.507812 L 163.539062 138.507812 C 166.253906 138.507812 168.460938 140.714844 168.460938 143.433594 Z M 106.953125 138.507812 L 137.632812 138.507812 L 137.632812 133.664062 C 137.632812 129.453125 135.90625 125.605469 133.125 122.828125 C 130.347656 120.046875 126.503906 118.316406 122.292969 118.316406 C 118.078125 118.316406 114.242188 120.046875 111.464844 122.828125 C 108.683594 125.605469 106.953125 129.453125 106.953125 133.664062 Z M 158.617188 148.355469 L 147.46875 148.355469 L 147.46875 159.359375 C 147.46875 162.078125 145.265625 164.28125 142.546875 164.28125 C 139.832031 164.28125 137.625 162.078125 137.625 159.359375 L 137.625 148.355469 L 106.953125 148.355469 L 106.953125 159.359375 C 106.953125 162.078125 104.75 164.28125 102.03125 164.28125 C 99.316406 164.28125 97.109375 162.078125 97.109375 159.359375 L 97.109375 148.355469 L 85.964844 148.355469 L 85.964844 225.371094 L 158.617188 225.371094 Z M 191.039062 148.355469 L 274.253906 148.355469 C 276.972656 148.355469 279.175781 146.152344 279.175781 143.433594 C 279.175781 140.714844 276.972656 138.507812 274.253906 138.507812 L 191.039062 138.507812 C 188.324219 138.507812 186.117188 140.714844 186.117188 143.433594 C 186.117188 146.152344 188.324219 148.355469 191.039062 148.355469 Z M 191.039062 166.410156 L 274.253906 166.410156 C 276.972656 166.410156 279.175781 164.207031 279.175781 161.488281 C 279.175781 158.769531 276.972656 156.566406 274.253906 156.566406 L 191.039062 156.566406 C 188.324219 156.566406 186.117188 158.769531 186.117188 161.488281 C 186.117188 164.207031 188.324219 166.410156 191.039062 166.410156 Z M 191.039062 184.46875 L 248.933594 184.46875 C 251.648438 184.46875 253.855469 182.261719 253.855469 179.542969 C 253.855469 176.824219 251.648438 174.621094 248.933594 174.621094 L 191.039062 174.621094 C 188.324219 174.621094 186.117188 176.824219 186.117188 179.542969 C 186.117188 182.261719 188.324219 184.46875 191.039062 184.46875 Z M 191.039062 184.46875 " fill-opacity="1" fill-rule="nonzero"/></g></svg>`)
        $('#header .main_navigation .megamenu .sublist').each(function () {
            var grupica = $(this).attr('group')
            if (grupica) {
                // console.log(grupica)
                if ($('.group_megamenu_wrap[group="' + grupica + '"]').length) {

                } else {
                    $('#header .main_navigation .sublist[group="' + grupica + '"]').wrapAll('<div group="' + grupica + '" class="group_megamenu_wrap"></div>')
                }
            }

        })
        $('.mainmenu .megamenu ul.dropdown-menu').each(function () {
            var mojid = $(this).attr('parent')
            if ($(this).find('.mainmenu .additional_menu_html[listid="' + mojid + '"]').length) {

            } else {
                $(this).append($('.mainmenu .additional_menu_html[listid="' + mojid + '"]'))
            }
        })
        $('.main_navigation .mainmenu a').each(function () {
            var backgroundclr = $(this).attr('background_color')
            var font_color = $(this).attr('font_color')
            var myid = $(this).attr('pageid')
            if (backgroundclr != '') {
                $(this).siblings('ul.dropdown-menu[parent="' + myid + '"]').css('background', backgroundclr)
                $(this).siblings('ul.dropdown-menu[parent="' + myid + '"]').addClass('custom_menu_background')
            }
            if (font_color != '') {
                $(this).siblings('ul.dropdown-menu[parent="' + myid + '"]').find('a').css('color', font_color)
            }
            if ($(this).attr('linkurl') != '') {
                $(this).attr('href', $(this).attr('linkurl'))
            }
        })

        // funkcija za odredjivanje polozaja vertikalnog megamenu-a
        $('li[megamenutype="Vertikalni"].megamenu.dropdown').mouseenter(function () {
            var window_width = $(window).width();
            var container_width = $('.container').width();
            var margins = window_width - container_width;
            var menu_subject_width = $('li[megamenutype="Vertikalni"].megamenu.dropdown a').width();
            var menu_subject_offset_left = $(this).offset().left;
            var menu_items_width = $('#header .mainmenu li.megamenu[megamenutype="Vertikalni"].dropdown:hover> .dropdown-menu').outerWidth();

            $(this).each(function () {
                if (menu_items_width > container_width) {
                    let offset = -menu_subject_offset_left + margins / 2;
                    $('#header .mainmenu li.megamenu[megamenutype="Vertikalni"].dropdown:hover> .dropdown-menu').css({
                        'width': container_width + 'px',
                        'left': offset + 'px',
                        'flex-wrap': 'wrap',
                    });
                }
            })

            if (menu_items_width > container_width) {
                // console.log('meni je siri od kontejnera'); 
            } else {
                if (menu_subject_offset_left < window_width / 2) {
                    // console.log('meni je sa leve strane '+ menu_items_width)
                    if (menu_items_width > window_width - menu_subject_offset_left - margins / 2) {
                        // console.log('mora da se pomera na levo')
                        let offset = menu_subject_offset_left - margins / 2;
                        $('#header .mainmenu li.megamenu[megamenutype="Vertikalni"].dropdown:hover> .dropdown-menu').css({
                            'position': 'absolute',
                            'left': -offset + 'px',
                        })
                    }
                } else {
                    // console.log('meni je sa desne strane')
                    if (menu_items_width < menu_subject_offset_left + menu_subject_width) {
                        // console.log('ne mora da se pomera')
                        let offset = -menu_items_width + menu_subject_width;
                        $('#header .mainmenu li.megamenu[megamenutype="Vertikalni"].dropdown:hover> .dropdown-menu').css({
                            'position': 'absolute',
                            'left': offset + 'px',
                        })
                    } else {
                        // console.log('mora se pomeri')
                        let offset = -menu_items_width + (window_width - menu_subject_offset_left - margins / 2);
                        $('#header .mainmenu li.megamenu[megamenutype="Vertikalni"].dropdown:hover> .dropdown-menu').css({
                            'position': 'absolute',
                            'left': offset + 'px',
                        })
                    }
                }
            }
        })
    } else {
        $('.mainmenu.dropdown .applink').each(function(){
            if($(this).attr('linkurl') != ''){
                $(this).attr('href' , $(this).attr('linkurl'))
            }
        })
    }

    $('#topsearchinput').on('input', function () {
        if ($(this).val() !== '') {
            $('.top_search_box_clear_icon_wrap').removeClass('hidden')
        } else {
            $('.top_search_box_clear_icon_wrap').addClass('hidden')
        }
    })

    $('.indexlink').attr('href', 'index.php?pageid=' + homepage_pageid + '')
    if (getCookie('userid') == '-1' || getCookie('userid') == null || getCookie('userid') == '') {
        if ($(window).width() < 992) {
            $('.main-ul').after($('.menuholder').html())
            $('.menuholder').css('display', 'none')
        } else {
            $('#registrate-btn').removeClass('hidden')
            $('.my_profile_toggler').remove()
            $('.login_form_btns_login').remove()
        }
        $('#notif-btn').addClass('hidden')
        $('#helpdesk-btn').addClass('hidden')
    } else {
        if ($(window).width() < 992) {
            $('.main-ul').after('<div class="mobile_menuholder">' + $('.menuholder').html() + '</div>')
            $('.menuholder').css('display', 'none')
            $('#login-btn-icon-btn').addClass('hidden')
            $('.header-search-inner').after($('#notif-btn'))
            $('.grupa_proizvoda.primarni.menuitem').each(function () {
                $(this).append('<i class="primarna-strelica icon-angle-down"></i>')
            })
            $('.login_form_btns_login').prepend($('.main_navigation .mainmenu.container.dropdown.pull-left .dropdown:has(>.applink[template="Moj_profil"])').not($('.main_navigation .menuholder .mainmenu.container.dropdown.pull-left .dropdown:has(>.applink[template="Moj_profil"])')))
            $('#header .login_form_btns_login .applink[template="Moj_profil"]').prepend(`<div class="mysvghold"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_405_1531)"><path d="M11.4524 14.0188C7.19063 14.404 3.94378 18.0051 4.00036 22.2838V22.5008C4.00036 23.3292 4.67194 24.0008 5.50036 24.0008C6.32878 24.0008 7.00036 23.3292 7.00036 22.5008V22.2238C6.95527 19.5967 8.89402 17.3564 11.5004 17.0238C14.2516 16.751 16.7031 18.7601 16.9759 21.5114C16.9921 21.674 17.0002 21.8373 17.0003 22.0008V22.5008C17.0003 23.3292 17.6719 24.0008 18.5003 24.0008C19.3288 24.0008 20.0003 23.3292 20.0003 22.5008V22.0008C19.9955 17.5775 16.4057 13.9957 11.9825 14.0006C11.8057 14.0008 11.6288 14.0069 11.4524 14.0188Z" fill="#374957"/><path d="M12.0004 12C15.3141 12 18.0004 9.31369 18.0004 6C18.0004 2.68631 15.3141 0 12.0004 0C8.68668 0 6.00037 2.68631 6.00037 6C6.00365 9.31233 8.68804 11.9967 12.0004 12ZM12.0004 3C13.6572 3 15.0004 4.34316 15.0004 6C15.0004 7.65684 13.6572 9 12.0004 9C10.3435 9 9.00037 7.65684 9.00037 6C9.00037 4.34316 10.3435 3 12.0004 3Z" fill="#374957"/></g><defs><clipPath id="clip0_405_1531"><rect width="24" height="24" fill="white"/></clipPath></defs></svg></div>`)

            $('.login_form_btns_login ul.dropdown-menu .applink').prepend(`<div class="my_profile_menu_svg"></div>`)
            $('.applink[template="Odsustva"] .my_profile_menu_svg').html(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="937c17c923"><path d="M 66 56.402344 L 318.902344 56.402344 L 318.902344 309 L 66 309 Z M 66 56.402344 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#937c17c923)"><path fill="#000000" d="M 192.65625 56.457031 C 190.589844 56.457031 188.527344 56.507812 186.464844 56.609375 C 184.402344 56.710938 182.34375 56.863281 180.289062 57.066406 C 178.234375 57.265625 176.183594 57.519531 174.140625 57.824219 C 172.097656 58.125 170.0625 58.480469 168.039062 58.882812 C 166.011719 59.285156 164 59.738281 161.996094 60.238281 C 159.992188 60.742188 158 61.292969 156.023438 61.890625 C 154.050781 62.492188 152.089844 63.136719 150.144531 63.832031 C 148.199219 64.53125 146.273438 65.273438 144.367188 66.0625 C 142.457031 66.851562 140.570312 67.691406 138.703125 68.574219 C 136.835938 69.457031 134.992188 70.382812 133.171875 71.359375 C 131.347656 72.332031 129.554688 73.347656 127.78125 74.410156 C 126.011719 75.472656 124.265625 76.578125 122.546875 77.722656 C 120.832031 78.871094 119.144531 80.058594 117.484375 81.289062 C 115.824219 82.519531 114.199219 83.789062 112.601562 85.101562 C 111.003906 86.410156 109.441406 87.757812 107.910156 89.148438 C 106.382812 90.535156 104.886719 91.957031 103.425781 93.417969 C 101.964844 94.878906 100.542969 96.371094 99.15625 97.902344 C 97.769531 99.433594 96.417969 100.996094 95.109375 102.59375 C 93.800781 104.191406 92.527344 105.816406 91.296875 107.476562 C 90.070312 109.132812 88.878906 110.824219 87.730469 112.539062 C 86.585938 114.257812 85.480469 116 84.417969 117.773438 C 83.355469 119.542969 82.339844 121.339844 81.367188 123.160156 C 80.390625 124.984375 79.464844 126.828125 78.582031 128.695312 C 77.699219 130.5625 76.863281 132.449219 76.070312 134.355469 C 75.28125 136.265625 74.539062 138.191406 73.84375 140.136719 C 73.144531 142.078125 72.5 144.039062 71.898438 146.015625 C 71.300781 147.992188 70.75 149.980469 70.246094 151.984375 C 69.746094 153.988281 69.292969 156.003906 68.890625 158.027344 C 68.488281 160.054688 68.132812 162.089844 67.832031 164.132812 C 67.527344 166.175781 67.273438 168.222656 67.074219 170.277344 C 66.871094 172.332031 66.71875 174.394531 66.617188 176.457031 C 66.515625 178.519531 66.464844 180.582031 66.464844 182.648438 C 66.464844 184.710938 66.515625 186.777344 66.617188 188.839844 C 66.71875 190.902344 66.871094 192.960938 67.074219 195.015625 C 67.273438 197.070312 67.527344 199.121094 67.832031 201.164062 C 68.132812 203.207031 68.488281 205.242188 68.890625 207.265625 C 69.292969 209.292969 69.746094 211.304688 70.246094 213.308594 C 70.75 215.3125 71.300781 217.300781 71.898438 219.277344 C 72.5 221.253906 73.144531 223.214844 73.839844 225.160156 C 74.539062 227.105469 75.28125 229.03125 76.070312 230.9375 C 76.859375 232.847656 77.699219 234.734375 78.582031 236.601562 C 79.464844 238.46875 80.390625 240.3125 81.367188 242.132812 C 82.339844 243.953125 83.355469 245.75 84.417969 247.523438 C 85.480469 249.292969 86.585938 251.039062 87.730469 252.753906 C 88.878906 254.472656 90.066406 256.160156 91.296875 257.820312 C 92.527344 259.476562 93.796875 261.105469 95.109375 262.703125 C 96.417969 264.296875 97.765625 265.863281 99.15625 267.390625 C 100.542969 268.921875 101.964844 270.417969 103.425781 271.878906 C 104.886719 273.335938 106.378906 274.761719 107.910156 276.148438 C 109.441406 277.535156 111.003906 278.882812 112.601562 280.195312 C 114.199219 281.503906 115.824219 282.773438 117.484375 284.003906 C 119.140625 285.234375 120.832031 286.421875 122.546875 287.570312 C 124.265625 288.71875 126.007812 289.824219 127.78125 290.882812 C 129.550781 291.945312 131.347656 292.964844 133.167969 293.9375 C 134.992188 294.910156 136.835938 295.839844 138.703125 296.722656 C 140.570312 297.605469 142.457031 298.441406 144.363281 299.230469 C 146.273438 300.023438 148.199219 300.765625 150.144531 301.460938 C 152.085938 302.15625 154.046875 302.804688 156.023438 303.402344 C 158 304.003906 159.988281 304.554688 161.992188 305.054688 C 163.996094 305.558594 166.011719 306.011719 168.035156 306.414062 C 170.0625 306.816406 172.097656 307.167969 174.140625 307.472656 C 176.183594 307.773438 178.230469 308.027344 180.285156 308.230469 C 182.339844 308.433594 184.402344 308.585938 186.464844 308.6875 C 188.527344 308.785156 190.589844 308.835938 192.65625 308.835938 C 194.71875 308.835938 196.785156 308.785156 198.847656 308.6875 C 200.910156 308.585938 202.96875 308.433594 205.023438 308.230469 C 207.078125 308.027344 209.128906 307.773438 211.171875 307.472656 C 213.214844 307.167969 215.25 306.816406 217.273438 306.414062 C 219.300781 306.011719 221.3125 305.558594 223.316406 305.054688 C 225.320312 304.554688 227.308594 304.003906 229.285156 303.402344 C 231.261719 302.804688 233.222656 302.15625 235.167969 301.460938 C 237.113281 300.765625 239.039062 300.023438 240.945312 299.230469 C 242.855469 298.441406 244.742188 297.605469 246.609375 296.722656 C 248.476562 295.839844 250.320312 294.910156 252.140625 293.9375 C 253.960938 292.964844 255.757812 291.945312 257.53125 290.882812 C 259.300781 289.824219 261.046875 288.71875 262.761719 287.570312 C 264.480469 286.421875 266.167969 285.234375 267.828125 284.003906 C 269.484375 282.773438 271.113281 281.503906 272.710938 280.195312 C 274.304688 278.882812 275.871094 277.535156 277.398438 276.148438 C 278.929688 274.761719 280.425781 273.335938 281.886719 271.878906 C 283.34375 270.417969 284.769531 268.921875 286.15625 267.390625 C 287.542969 265.859375 288.890625 264.296875 290.203125 262.703125 C 291.511719 261.105469 292.78125 259.476562 294.011719 257.820312 C 295.242188 256.160156 296.429688 254.472656 297.578125 252.753906 C 298.726562 251.039062 299.832031 249.292969 300.890625 247.523438 C 301.953125 245.75 302.972656 243.953125 303.945312 242.132812 C 304.917969 240.3125 305.847656 238.46875 306.730469 236.601562 C 307.613281 234.734375 308.449219 232.847656 309.238281 230.9375 C 310.03125 229.03125 310.773438 227.101562 311.46875 225.160156 C 312.164062 223.214844 312.8125 221.253906 313.410156 219.277344 C 314.011719 217.300781 314.5625 215.3125 315.0625 213.308594 C 315.566406 211.304688 316.019531 209.289062 316.421875 207.265625 C 316.824219 205.238281 317.175781 203.207031 317.480469 201.164062 C 317.78125 199.121094 318.035156 197.070312 318.238281 195.015625 C 318.441406 192.960938 318.59375 190.902344 318.695312 188.839844 C 318.792969 186.773438 318.84375 184.710938 318.84375 182.644531 C 318.84375 180.582031 318.789062 178.519531 318.6875 176.457031 C 318.582031 174.394531 318.429688 172.335938 318.226562 170.28125 C 318.019531 168.226562 317.765625 166.179688 317.460938 164.136719 C 317.15625 162.09375 316.800781 160.0625 316.398438 158.039062 C 315.992188 156.011719 315.539062 154 315.035156 151.996094 C 314.53125 149.996094 313.980469 148.007812 313.378906 146.03125 C 312.777344 144.054688 312.128906 142.097656 311.433594 140.152344 C 310.738281 138.210938 309.992188 136.285156 309.203125 134.378906 C 308.410156 132.472656 307.574219 130.585938 306.691406 128.71875 C 305.804688 126.851562 304.878906 125.011719 303.902344 123.191406 C 302.929688 121.367188 301.910156 119.574219 300.847656 117.804688 C 299.789062 116.03125 298.683594 114.289062 297.535156 112.574219 C 296.386719 110.855469 295.199219 109.167969 293.96875 107.511719 C 292.738281 105.855469 291.46875 104.226562 290.15625 102.632812 C 288.847656 101.035156 287.5 99.472656 286.113281 97.941406 C 284.726562 96.414062 283.304688 94.917969 281.84375 93.460938 C 280.382812 92 278.890625 90.574219 277.359375 89.191406 C 275.828125 87.804688 274.265625 86.453125 272.671875 85.144531 C 271.074219 83.835938 269.449219 82.566406 267.792969 81.335938 C 266.132812 80.105469 264.445312 78.914062 262.730469 77.769531 C 261.011719 76.621094 259.269531 75.515625 257.5 74.453125 C 255.730469 73.390625 253.933594 72.375 252.113281 71.398438 C 250.292969 70.425781 248.449219 69.496094 246.585938 68.613281 C 244.71875 67.730469 242.832031 66.890625 240.925781 66.101562 C 239.019531 65.308594 237.09375 64.566406 235.148438 63.871094 C 233.207031 63.171875 231.246094 62.523438 229.269531 61.921875 C 227.296875 61.324219 225.308594 60.769531 223.304688 60.265625 C 221.304688 59.765625 219.289062 59.308594 217.265625 58.90625 C 215.242188 58.5 213.207031 58.148438 211.164062 57.84375 C 209.125 57.535156 207.074219 57.28125 205.019531 57.078125 C 202.964844 56.875 200.910156 56.71875 198.847656 56.617188 C 196.785156 56.511719 194.722656 56.460938 192.65625 56.457031 Z M 192.65625 297.714844 C 190.773438 297.714844 188.890625 297.667969 187.011719 297.574219 C 185.128906 297.484375 183.253906 297.34375 181.378906 297.160156 C 179.503906 296.976562 177.636719 296.746094 175.773438 296.46875 C 173.910156 296.191406 172.054688 295.871094 170.207031 295.503906 C 168.359375 295.136719 166.523438 294.722656 164.699219 294.265625 C 162.871094 293.808594 161.054688 293.304688 159.253906 292.761719 C 157.453125 292.214844 155.664062 291.621094 153.890625 290.988281 C 152.117188 290.355469 150.363281 289.675781 148.621094 288.957031 C 146.882812 288.234375 145.160156 287.472656 143.457031 286.667969 C 141.757812 285.863281 140.074219 285.015625 138.414062 284.128906 C 136.753906 283.238281 135.113281 282.3125 133.5 281.34375 C 131.882812 280.375 130.292969 279.367188 128.726562 278.324219 C 127.164062 277.277344 125.621094 276.191406 124.109375 275.070312 C 122.597656 273.949219 121.113281 272.789062 119.65625 271.59375 C 118.203125 270.402344 116.777344 269.171875 115.382812 267.90625 C 113.984375 266.640625 112.621094 265.34375 111.289062 264.011719 C 109.960938 262.679688 108.660156 261.316406 107.398438 259.921875 C 106.132812 258.527344 104.902344 257.101562 103.707031 255.644531 C 102.511719 254.191406 101.355469 252.707031 100.234375 251.191406 C 99.109375 249.679688 98.027344 248.140625 96.980469 246.574219 C 95.933594 245.007812 94.925781 243.417969 93.960938 241.804688 C 92.992188 240.1875 92.0625 238.550781 91.175781 236.890625 C 90.289062 235.230469 89.441406 233.546875 88.636719 231.84375 C 87.832031 230.144531 87.066406 228.421875 86.347656 226.683594 C 85.625 224.941406 84.949219 223.183594 84.316406 221.414062 C 83.679688 219.640625 83.089844 217.851562 82.542969 216.050781 C 81.996094 214.246094 81.492188 212.433594 81.035156 210.605469 C 80.578125 208.78125 80.167969 206.941406 79.800781 205.097656 C 79.433594 203.25 79.109375 201.394531 78.832031 199.53125 C 78.558594 197.667969 78.328125 195.800781 78.140625 193.925781 C 77.957031 192.050781 77.820312 190.175781 77.726562 188.292969 C 77.632812 186.414062 77.589844 184.53125 77.589844 182.648438 C 77.589844 180.765625 77.632812 178.882812 77.726562 177 C 77.820312 175.121094 77.957031 173.242188 78.140625 171.367188 C 78.328125 169.496094 78.558594 167.625 78.832031 165.761719 C 79.109375 163.902344 79.433594 162.046875 79.800781 160.199219 C 80.167969 158.351562 80.578125 156.515625 81.035156 154.6875 C 81.492188 152.863281 81.996094 151.046875 82.542969 149.246094 C 83.089844 147.441406 83.679688 145.65625 84.3125 143.882812 C 84.949219 142.109375 85.625 140.351562 86.347656 138.613281 C 87.066406 136.875 87.832031 135.152344 88.636719 133.449219 C 89.441406 131.746094 90.289062 130.066406 91.175781 128.40625 C 92.0625 126.746094 92.992188 125.105469 93.957031 123.492188 C 94.925781 121.875 95.933594 120.285156 96.980469 118.71875 C 98.027344 117.152344 99.109375 115.613281 100.234375 114.101562 C 101.355469 112.589844 102.511719 111.105469 103.707031 109.648438 C 104.902344 108.195312 106.132812 106.769531 107.394531 105.371094 C 108.660156 103.976562 109.957031 102.613281 111.289062 101.28125 C 112.621094 99.949219 113.984375 98.652344 115.382812 97.386719 C 116.777344 96.125 118.203125 94.894531 119.65625 93.699219 C 121.113281 92.503906 122.597656 91.347656 124.109375 90.222656 C 125.621094 89.101562 127.160156 88.019531 128.726562 86.972656 C 130.292969 85.925781 131.882812 84.917969 133.5 83.949219 C 135.113281 82.984375 136.753906 82.054688 138.414062 81.167969 C 140.074219 80.28125 141.753906 79.433594 143.457031 78.628906 C 145.160156 77.824219 146.882812 77.058594 148.621094 76.339844 C 150.359375 75.617188 152.117188 74.941406 153.890625 74.304688 C 155.664062 73.671875 157.449219 73.082031 159.253906 72.535156 C 161.054688 71.988281 162.871094 71.484375 164.695312 71.027344 C 166.523438 70.570312 168.359375 70.160156 170.207031 69.792969 C 172.054688 69.421875 173.910156 69.101562 175.769531 68.824219 C 177.632812 68.550781 179.503906 68.320312 181.375 68.132812 C 183.25 67.949219 185.128906 67.8125 187.007812 67.71875 C 188.890625 67.625 190.773438 67.582031 192.65625 67.582031 C 194.539062 67.582031 196.421875 67.625 198.300781 67.71875 C 200.183594 67.8125 202.058594 67.949219 203.933594 68.132812 C 205.808594 68.320312 207.675781 68.550781 209.539062 68.824219 C 211.402344 69.101562 213.257812 69.421875 215.105469 69.792969 C 216.949219 70.160156 218.789062 70.570312 220.613281 71.027344 C 222.441406 71.484375 224.253906 71.988281 226.058594 72.535156 C 227.859375 73.082031 229.648438 73.671875 231.421875 74.304688 C 233.195312 74.941406 234.949219 75.617188 236.691406 76.339844 C 238.429688 77.058594 240.152344 77.824219 241.851562 78.628906 C 243.554688 79.433594 245.238281 80.28125 246.898438 81.167969 C 248.558594 82.054688 250.195312 82.984375 251.8125 83.949219 C 253.425781 84.917969 255.015625 85.925781 256.582031 86.972656 C 258.148438 88.019531 259.6875 89.101562 261.199219 90.222656 C 262.714844 91.347656 264.199219 92.503906 265.652344 93.699219 C 267.109375 94.894531 268.535156 96.125 269.929688 97.386719 C 271.324219 98.652344 272.6875 99.949219 274.019531 101.28125 C 275.351562 102.613281 276.648438 103.976562 277.914062 105.371094 C 279.179688 106.769531 280.410156 108.195312 281.605469 109.648438 C 282.796875 111.105469 283.957031 112.589844 285.078125 114.101562 C 286.199219 115.613281 287.285156 117.152344 288.332031 118.71875 C 289.375 120.285156 290.382812 121.875 291.351562 123.492188 C 292.320312 125.105469 293.246094 126.742188 294.136719 128.40625 C 295.023438 130.066406 295.871094 131.746094 296.675781 133.449219 C 297.480469 135.152344 298.242188 136.871094 298.964844 138.613281 C 299.683594 140.351562 300.363281 142.109375 300.996094 143.882812 C 301.628906 145.65625 302.222656 147.441406 302.769531 149.246094 C 303.316406 151.046875 303.816406 152.859375 304.273438 154.6875 C 304.730469 156.515625 305.144531 158.351562 305.511719 160.199219 C 305.878906 162.042969 306.199219 163.898438 306.476562 165.761719 C 306.753906 167.625 306.984375 169.492188 307.167969 171.367188 C 307.351562 173.242188 307.492188 175.121094 307.585938 177 C 307.675781 178.882812 307.722656 180.761719 307.722656 182.644531 C 307.71875 184.527344 307.671875 186.410156 307.578125 188.289062 C 307.484375 190.171875 307.34375 192.046875 307.15625 193.921875 C 306.972656 195.792969 306.738281 197.660156 306.460938 199.523438 C 306.183594 201.386719 305.859375 203.238281 305.492188 205.085938 C 305.121094 206.933594 304.707031 208.769531 304.25 210.59375 C 303.789062 212.417969 303.289062 214.234375 302.738281 216.035156 C 302.191406 217.835938 301.601562 219.621094 300.964844 221.394531 C 300.328125 223.167969 299.652344 224.921875 298.929688 226.660156 C 298.207031 228.398438 297.445312 230.121094 296.640625 231.820312 C 295.832031 233.523438 294.988281 235.203125 294.097656 236.863281 C 293.210938 238.523438 292.28125 240.160156 291.3125 241.773438 C 290.34375 243.390625 289.339844 244.980469 288.292969 246.542969 C 287.246094 248.109375 286.160156 249.648438 285.039062 251.160156 C 283.917969 252.671875 282.761719 254.15625 281.566406 255.609375 C 280.371094 257.066406 279.140625 258.488281 277.878906 259.886719 C 276.613281 261.28125 275.316406 262.644531 273.984375 263.972656 C 272.652344 265.304688 271.289062 266.601562 269.894531 267.867188 C 268.5 269.132812 267.074219 270.359375 265.621094 271.554688 C 264.164062 272.75 262.679688 273.910156 261.167969 275.03125 C 259.65625 276.152344 258.121094 277.234375 256.554688 278.28125 C 254.988281 279.328125 253.398438 280.335938 251.785156 281.304688 C 250.171875 282.273438 248.535156 283.203125 246.875 284.089844 C 245.214844 284.976562 243.53125 285.824219 241.832031 286.628906 C 240.128906 287.4375 238.410156 288.199219 236.671875 288.921875 C 234.933594 289.640625 233.175781 290.320312 231.40625 290.957031 C 229.632812 291.589844 227.847656 292.183594 226.042969 292.730469 C 224.242188 293.277344 222.429688 293.78125 220.605469 294.242188 C 218.777344 294.699219 216.941406 295.113281 215.097656 295.480469 C 213.25 295.851562 211.394531 296.175781 209.535156 296.453125 C 207.671875 296.730469 205.804688 296.960938 203.929688 297.148438 C 202.058594 297.335938 200.179688 297.476562 198.300781 297.570312 C 196.421875 297.664062 194.539062 297.710938 192.65625 297.714844 Z M 192.65625 297.714844 " fill-opacity="1" fill-rule="nonzero"/></g><path fill="#000000" d="M 198.21875 183.933594 L 198.21875 101.507812 C 198.21875 101.144531 198.183594 100.78125 198.109375 100.421875 C 198.039062 100.066406 197.933594 99.71875 197.792969 99.378906 C 197.65625 99.042969 197.484375 98.722656 197.28125 98.417969 C 197.078125 98.113281 196.847656 97.832031 196.589844 97.574219 C 196.332031 97.316406 196.050781 97.085938 195.746094 96.882812 C 195.441406 96.679688 195.121094 96.511719 194.785156 96.371094 C 194.449219 96.230469 194.101562 96.125 193.742188 96.054688 C 193.382812 95.984375 193.023438 95.945312 192.65625 95.945312 C 192.292969 95.945312 191.929688 95.984375 191.570312 96.054688 C 191.214844 96.125 190.867188 96.230469 190.527344 96.371094 C 190.191406 96.511719 189.871094 96.679688 189.566406 96.882812 C 189.261719 97.085938 188.980469 97.316406 188.722656 97.574219 C 188.464844 97.832031 188.234375 98.113281 188.03125 98.417969 C 187.828125 98.722656 187.660156 99.042969 187.519531 99.378906 C 187.378906 99.71875 187.273438 100.066406 187.203125 100.421875 C 187.132812 100.78125 187.09375 101.144531 187.09375 101.507812 L 187.09375 186.234375 C 187.09375 186.972656 187.238281 187.683594 187.519531 188.363281 C 187.800781 189.046875 188.203125 189.648438 188.726562 190.167969 L 236.832031 238.277344 C 237.089844 238.535156 237.371094 238.765625 237.675781 238.96875 C 237.980469 239.171875 238.300781 239.34375 238.636719 239.480469 C 238.976562 239.621094 239.324219 239.726562 239.679688 239.796875 C 240.039062 239.871094 240.402344 239.90625 240.765625 239.90625 C 241.128906 239.90625 241.492188 239.871094 241.851562 239.796875 C 242.207031 239.726562 242.554688 239.621094 242.894531 239.480469 C 243.230469 239.34375 243.550781 239.171875 243.855469 238.96875 C 244.160156 238.765625 244.4375 238.535156 244.699219 238.277344 C 244.957031 238.019531 245.1875 237.738281 245.390625 237.433594 C 245.59375 237.128906 245.761719 236.808594 245.902344 236.472656 C 246.042969 236.136719 246.148438 235.789062 246.21875 235.429688 C 246.289062 235.070312 246.328125 234.710938 246.328125 234.34375 C 246.328125 233.980469 246.289062 233.617188 246.21875 233.257812 C 246.148438 232.902344 246.042969 232.554688 245.902344 232.214844 C 245.761719 231.878906 245.59375 231.558594 245.390625 231.253906 C 245.1875 230.953125 244.957031 230.671875 244.699219 230.414062 Z M 198.21875 183.933594 " fill-opacity="1" fill-rule="nonzero"/></svg>`)
            $('.applink[template="Help_Desk"] .my_profile_menu_svg').html(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="8c805f55f2"><path d="M 29.210938 41.445312 L 345.710938 41.445312 L 345.710938 333.195312 L 29.210938 333.195312 Z M 29.210938 41.445312 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#8c805f55f2)"><path fill="#004aad" d="M 334.445312 239.289062 C 334.445312 244.121094 330.59375 247.972656 325.761719 247.972656 L 296.820312 247.664062 L 296.820312 189.105469 L 325.761719 189.105469 C 330.59375 189.105469 334.445312 192.953125 334.445312 197.785156 Z M 188.109375 68.8125 C 187.769531 68.8125 187.460938 68.8125 187.460938 68.8125 L 186.816406 68.8125 C 129.886719 69.457031 83.246094 113.519531 78.410156 169.152344 L 69.421875 164.347656 C 71.359375 102.585938 123.453125 52.710938 187.460938 52.710938 C 187.769531 52.710938 187.769531 52.710938 187.769531 52.710938 L 188.109375 52.710938 C 252.117188 52.710938 304.210938 102.585938 306.148438 164.347656 L 296.175781 169.492188 C 291.679688 113.519531 245.035156 69.457031 188.109375 68.8125 Z M 78.101562 247.664062 L 49.160156 247.972656 C 44.328125 247.972656 40.480469 244.121094 40.480469 239.289062 L 40.480469 197.785156 C 40.480469 192.953125 44.328125 189.105469 49.160156 189.105469 L 77.765625 189.105469 L 77.765625 247.664062 Z M 230.253906 322.265625 L 213.816406 322.265625 C 210.613281 322.265625 208.03125 319.707031 208.03125 316.476562 C 208.03125 313.273438 210.613281 310.6875 213.816406 310.6875 L 230.253906 310.6875 C 233.457031 310.6875 236.042969 313.273438 236.042969 316.476562 C 236.042969 319.707031 233.457031 322.265625 230.253906 322.265625 Z M 325.761719 177.835938 L 304.855469 177.835938 L 314.832031 172.695312 C 316.769531 171.738281 317.726562 169.800781 317.726562 167.550781 C 317.726562 98.0625 259.816406 41.472656 188.417969 41.472656 C 188.109375 41.472656 188.109375 41.472656 188.109375 41.472656 L 187.769531 41.472656 C 116.0625 41.472656 58.152344 98.0625 58.152344 167.550781 C 58.152344 169.492188 59.136719 171.402344 61.046875 172.386719 L 70.710938 177.527344 L 49.160156 177.527344 C 38.203125 177.527344 29.210938 186.519531 29.210938 197.476562 L 29.210938 238.953125 C 29.210938 249.910156 38.203125 258.902344 49.46875 258.902344 L 83.890625 258.59375 C 87.121094 258.59375 89.371094 256.007812 89.371094 252.804688 L 89.371094 178.484375 C 89.371094 124.449219 133.429688 80.390625 187.460938 80.050781 C 241.496094 80.390625 285.582031 124.449219 285.582031 178.484375 L 285.582031 253.113281 C 285.582031 256.34375 288.136719 258.59375 291.03125 258.902344 L 299.378906 258.902344 C 296.484375 286.578125 274.3125 308.441406 246.328125 310.378906 C 244.078125 303.945312 237.644531 299.113281 230.253906 299.113281 L 213.816406 299.113281 C 204.515625 299.113281 196.789062 306.839844 196.789062 316.167969 C 196.789062 325.496094 204.515625 333.195312 213.816406 333.195312 L 230.253906 333.195312 C 237.644531 333.195312 244.078125 328.390625 246.328125 321.617188 C 280.410156 319.707031 307.75 292.675781 310.644531 258.902344 L 325.761719 258.902344 C 336.691406 258.902344 345.710938 249.910156 345.710938 238.953125 L 345.710938 197.785156 C 345.710938 186.855469 336.691406 177.835938 325.761719 177.835938 " fill-opacity="1" fill-rule="nonzero"/></g><path fill="#004aad" d="M 187.152344 144.0625 C 201.621094 144.0625 213.199219 155.667969 213.199219 170.136719 C 213.199219 184.609375 201.621094 196.183594 187.152344 196.183594 C 183.921875 196.183594 181.363281 198.769531 181.363281 201.972656 L 181.363281 222.570312 C 181.363281 225.773438 183.921875 228.359375 187.152344 228.359375 C 190.355469 228.359375 192.941406 225.773438 192.941406 222.570312 L 192.941406 206.804688 C 210.953125 204.222656 224.46875 188.457031 224.46875 169.800781 C 224.46875 149.230469 207.71875 132.484375 187.152344 132.484375 C 166.554688 132.484375 149.835938 149.230469 149.835938 169.800781 C 149.835938 173.03125 152.394531 175.589844 155.625 175.589844 C 158.828125 175.589844 161.414062 173.03125 161.414062 169.800781 C 161.078125 155.667969 172.652344 144.0625 187.152344 144.0625 C 186.816406 144.0625 187.152344 144.0625 187.152344 144.0625 " fill-opacity="1" fill-rule="nonzero"/><path fill="#004aad" d="M 186.816406 240.890625 C 193.054688 240.890625 198.082031 245.949219 198.082031 252.160156 C 198.082031 258.367188 193.054688 263.398438 186.816406 263.398438 C 180.605469 263.398438 175.546875 258.367188 175.546875 252.160156 C 175.546875 245.949219 180.605469 240.890625 186.816406 240.890625 " fill-opacity="1" fill-rule="nonzero"/></svg>`)
            $('.applink[template="Narudzbine"] .my_profile_menu_svg').html(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="fb99e50037"><path d="M 34.121094 39.421875 L 340.871094 39.421875 L 340.871094 335.671875 L 34.121094 335.671875 Z M 34.121094 39.421875 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#fb99e50037)"><path fill="#03989e" d="M 58.90625 65.972656 L 58.90625 65.554688 C 58.90625 62.835938 61.113281 60.628906 63.828125 60.628906 C 66.546875 60.628906 68.75 62.835938 68.75 65.554688 L 68.75 65.972656 C 68.75 68.691406 66.546875 70.898438 63.828125 70.898438 C 61.113281 70.898438 58.90625 68.691406 58.90625 65.972656 Z M 85.164062 70.46875 C 87.878906 70.46875 90.085938 68.265625 90.085938 65.546875 L 90.085938 65.125 C 90.085938 62.40625 87.878906 60.199219 85.164062 60.199219 C 82.445312 60.199219 80.242188 62.40625 80.242188 65.125 L 80.242188 65.546875 C 80.242188 68.265625 82.445312 70.46875 85.164062 70.46875 Z M 106.496094 70.46875 C 109.214844 70.46875 111.417969 68.265625 111.417969 65.546875 L 111.417969 65.125 C 111.417969 62.40625 109.214844 60.199219 106.496094 60.199219 C 103.777344 60.199219 101.574219 62.40625 101.574219 65.125 L 101.574219 65.546875 C 101.574219 68.265625 103.777344 70.46875 106.496094 70.46875 Z M 338.917969 308.960938 L 314.132812 333.75 C 312.210938 335.671875 309.097656 335.671875 307.175781 333.75 L 282.128906 308.695312 L 262.558594 328.273438 C 260.636719 330.195312 257.519531 330.195312 255.597656 328.273438 C 254.996094 327.667969 254.582031 326.949219 254.359375 326.191406 L 239.640625 277.582031 L 39.097656 277.582031 C 36.378906 277.582031 34.175781 275.378906 34.175781 272.660156 L 34.175781 44.34375 C 34.175781 41.625 36.378906 39.421875 39.097656 39.421875 L 308.285156 39.421875 C 311.003906 39.421875 313.207031 41.625 313.207031 44.34375 L 313.207031 243.671875 L 331.394531 249.183594 C 333.996094 249.964844 335.46875 252.714844 334.679688 255.316406 C 334.425781 256.152344 333.976562 256.863281 333.394531 257.429688 L 313.875 276.957031 L 338.925781 302.011719 C 340.839844 303.925781 340.839844 307.039062 338.917969 308.960938 Z M 44.019531 49.265625 L 44.019531 82.101562 L 303.363281 82.101562 L 303.363281 49.265625 Z M 236.660156 267.738281 L 226.808594 235.210938 L 191.039062 235.210938 C 188.324219 235.210938 186.117188 233.003906 186.117188 230.285156 L 186.117188 204.230469 C 186.117188 201.511719 188.324219 199.304688 191.039062 199.304688 L 274.253906 199.304688 C 276.972656 199.304688 279.175781 201.511719 279.175781 204.230469 L 279.175781 230.285156 C 279.175781 231.335938 278.769531 232.261719 278.210938 233.058594 L 303.355469 240.675781 L 303.355469 91.945312 L 44.019531 91.945312 L 44.019531 267.746094 L 236.660156 267.746094 Z M 229.695312 218.363281 L 252.8125 225.371094 L 269.332031 225.371094 L 269.332031 209.152344 L 195.953125 209.152344 L 195.953125 225.371094 L 223.824219 225.371094 L 223.558594 224.496094 C 223.390625 223.945312 223.359375 223.363281 223.398438 222.765625 C 223.410156 222.582031 223.441406 222.414062 223.472656 222.230469 C 223.503906 222.039062 223.496094 221.839844 223.558594 221.648438 C 223.601562 221.488281 223.71875 221.382812 223.777344 221.226562 C 223.910156 220.914062 224.0625 220.632812 224.246094 220.355469 C 224.421875 220.09375 224.605469 219.859375 224.828125 219.644531 C 225.050781 219.421875 225.28125 219.238281 225.539062 219.0625 C 225.824219 218.871094 226.097656 218.714844 226.414062 218.59375 C 226.566406 218.53125 226.671875 218.417969 226.832031 218.371094 C 227.023438 218.3125 227.222656 218.320312 227.414062 218.289062 C 227.597656 218.257812 227.765625 218.21875 227.949219 218.210938 C 228.5625 218.164062 229.144531 218.195312 229.695312 218.363281 Z M 328.480469 305.484375 L 303.433594 280.433594 C 301.511719 278.511719 301.511719 275.394531 303.433594 273.472656 L 320.679688 256.222656 L 250.515625 234.957031 C 250.515625 234.957031 250.515625 234.957031 250.507812 234.957031 L 238.09375 231.191406 L 235.652344 230.449219 L 261.410156 315.5 L 278.65625 298.25 C 280.578125 296.328125 283.691406 296.328125 285.613281 298.25 L 310.660156 323.304688 Z M 168.460938 143.433594 L 168.460938 230.292969 C 168.460938 233.011719 166.253906 235.21875 163.539062 235.21875 L 81.042969 235.21875 C 78.328125 235.21875 76.121094 233.011719 76.121094 230.292969 L 76.121094 143.433594 C 76.121094 140.714844 78.328125 138.507812 81.042969 138.507812 L 97.109375 138.507812 L 97.109375 133.664062 C 97.109375 126.734375 99.941406 120.429688 104.503906 115.867188 C 109.066406 111.304688 115.367188 108.472656 122.292969 108.472656 C 129.222656 108.472656 135.523438 111.304688 140.082031 115.867188 C 144.644531 120.429688 147.476562 126.734375 147.476562 133.664062 L 147.476562 138.507812 L 163.539062 138.507812 C 166.253906 138.507812 168.460938 140.714844 168.460938 143.433594 Z M 106.953125 138.507812 L 137.632812 138.507812 L 137.632812 133.664062 C 137.632812 129.453125 135.90625 125.605469 133.125 122.828125 C 130.347656 120.046875 126.503906 118.316406 122.292969 118.316406 C 118.078125 118.316406 114.242188 120.046875 111.464844 122.828125 C 108.683594 125.605469 106.953125 129.453125 106.953125 133.664062 Z M 158.617188 148.355469 L 147.46875 148.355469 L 147.46875 159.359375 C 147.46875 162.078125 145.265625 164.28125 142.546875 164.28125 C 139.832031 164.28125 137.625 162.078125 137.625 159.359375 L 137.625 148.355469 L 106.953125 148.355469 L 106.953125 159.359375 C 106.953125 162.078125 104.75 164.28125 102.03125 164.28125 C 99.316406 164.28125 97.109375 162.078125 97.109375 159.359375 L 97.109375 148.355469 L 85.964844 148.355469 L 85.964844 225.371094 L 158.617188 225.371094 Z M 191.039062 148.355469 L 274.253906 148.355469 C 276.972656 148.355469 279.175781 146.152344 279.175781 143.433594 C 279.175781 140.714844 276.972656 138.507812 274.253906 138.507812 L 191.039062 138.507812 C 188.324219 138.507812 186.117188 140.714844 186.117188 143.433594 C 186.117188 146.152344 188.324219 148.355469 191.039062 148.355469 Z M 191.039062 166.410156 L 274.253906 166.410156 C 276.972656 166.410156 279.175781 164.207031 279.175781 161.488281 C 279.175781 158.769531 276.972656 156.566406 274.253906 156.566406 L 191.039062 156.566406 C 188.324219 156.566406 186.117188 158.769531 186.117188 161.488281 C 186.117188 164.207031 188.324219 166.410156 191.039062 166.410156 Z M 191.039062 184.46875 L 248.933594 184.46875 C 251.648438 184.46875 253.855469 182.261719 253.855469 179.542969 C 253.855469 176.824219 251.648438 174.621094 248.933594 174.621094 L 191.039062 174.621094 C 188.324219 174.621094 186.117188 176.824219 186.117188 179.542969 C 186.117188 182.261719 188.324219 184.46875 191.039062 184.46875 Z M 191.039062 184.46875 " fill-opacity="1" fill-rule="nonzero"/></g></svg>`)
            $('.login_form_btns_login').append($('.main_navigation .login-btns').not('.menuholder .login-btns'))
        } else {

            // $('.main_navigation').css('display','none')
        }
        $('#notif-btn').removeClass('hidden')
        $('#registrate-btn').addClass('hidden')
        $('#logoff-a-link').html(getCookie2('ime'))
    }
    if (getCookie('userid') != '-1' || getCookie('userid') != null || getCookie('userid') != '') {
        $('.total-cart-in.jfl').before($('.favitems-dropdown'))
    } else {

    }
    // if(getCookie('userid')=='-1'){
    //     $('.favitems-dropdown').addClass('hidden')
    // }
    if (typeof promenilatinicu == 'function') {
        setTimeout(function () {
            promenilatinicu()
        }, 500);
    }
    
    if (userid != '-1') {
        $('.finance').removeClass('hidden')
    }
    // displaySelectedApplink()
    $('.jfl').removeClass('hidden')
    $('body #header .menu-burger').click(function () {
        $('.login_form_btns_login').slideUp('slow')
    })

    if ($('.cart-no').text() == '') {
        $('.cart-no').addClass('hidden')
    } else {
        $('.cart-no').removeClass('hidden')
    }

    get_analitycs_data()
    
    if(pageid !== checkoutpage) reload_basket_items()

    if (korpa_svg !== '') {
        $('.shopping-basket.ikonice_wrap svg').remove()
        $('.shopping-basket.ikonice_wrap').prepend(korpa_svg)
        $('.shopping-basket.ikonice_wrap svg').addClass('shopping_basket_svg')

    }
    initMainJS()
})

// function toggleOptions() {
//     var googlehtml = ''
//     if (getCookie('userid') == '-1') {
//         if ($('#g_id_onload').length) {

//         } else {
//             loadcontent('google', {
//                 template: wrapper_template,
//                 notpublished: 'T',
//                 jsont: 'T',
//                 ajax: 'T'
//             }, function callback(response) {
//                 var googlejson = JSON.parse(response)
//                 googlehtml = `
//                         <script src="https://accounts.google.com/gsi/client" async defer/>
//                             <div id="g_id_onload" data-client_id="` + googlejson[0].googleid + `" data-callback="google_handleCredentialResponse"></div>
//                             <div style="width:250px;text-align:start;" class="g_id_signin" data-type="standard"></div>
//                 `
//                 $('.google_butt').html(googlehtml)
//             })
//         }
//     }
//     $('.login_form_btns_login').slideToggle('slow')
//     // $('.main_navigation').slideUp('slow')
//     // $('body').toggleClass('overflowhidden')
// }

// function google_handleCredentialResponse(CredentialResponse) {
//     $.ajax({
//         type: "POST",
//         data: {
//             "action": 'google',
//             "clientid": CredentialResponse["clientId"],
//             "token": CredentialResponse["credential"],
//             loginver: 'login2'
//         },
//         url: instance + "logcheck.php",
//         success: function (response) {
//             if ((response) == 'succes-b' || (response) == 'succes-f' || (response.authJWT.tip !== undefined)) {
//                 if ((response) == 'succes-f') {
//                     window.location.href = "index.asp";
//                 } else {
//                     if ((response) == 'succes-f') {
//                         window.location.href = "index.asp";
//                     } else {
//                         userid = response.authJWT.userid
//                         localStorage.setItem("userid", response.authJWT.userid);
//                         localStorage.setItem("usergroup", response.authJWT.usergroup);
//                         localStorage.setItem("authJWT", JSON.stringify(response));
//                         if (response.authJWT.tipkor == 'U') {
//                             window.location.href = "app.php"
//                         } else {
//                             $.ajax({
//                                 url: 'index.php?pageid=' + getCookie('homepage'),
//                                 success: function () {
//                                     window.location.href = 'index.php?pageid=' + getCookie('homepage')
//                                 }
//                             })
//                         }
//                     }
//                 }
//             } else {
//                 $btn.button('reset');
//                 $('.alertuser').css('display', 'block')
//                 $('.loaderimg').css('display', 'none')
//             }
//         }
//     })
// }


// funkcija za pretragu na dugme enter
$(document).on('keypress', function (e) {
    if (e.which == 13) {
        if ($('#topsearchinput').is(':focus')) {
            $('.searchbut').click()
        }
    }
})

// // funkcija za prihvatanje kolacica
// function acceptCookies() {
//     setCookie('cookie_notice_accepted', 'T', (10 * 365 * 24 * 60 * 60))
//     $('.cookiebanner').addClass('hidden')
// }

// // funkcija za promenu headera, upisati redni broj ul-a koji ostaje dole
// function headerReorder(childNo) {
//     if (typeof headerReorderBefore !== undefined) {
//         headerReorderBefore()
//     }
//     $('.jfl').removeClass('hidden')
//     $('#header').before('<div class="altheader"><div class="altheader_content container"></div></div>').css('margin-top', '50px')
//     var meni = $('.mainmenu').children('li:nth-child(' + childNo + ')')[0]
//     // if(typeof $('.mainmenu').children('li:nth-child('+childNo+')')[0] != typeof undefined) {
//     $('.mainmenu').children('li:nth-child(' + childNo + ')')[0].remove()
//     $('.altheader_content').html($('.mainmenu')[0].outerHTML)
//     $('.menuholder').html($(meni).find('ul').first()[0].outerHTML)
//     $('.menuholder').find('ul').first().removeClass().addClass('mainmenu container dropdown pull-left')
//     $('.menuholder .mainmenu').children().removeClass('sublist')
//     $('.mainmenu li').attr('onmouseenter', 'giveOpenClass(this)').attr('onmouseleave', 'takeOpenClass(this)')
//     // }

//     if (typeof headerReorderAfter !== undefined) {
//         headerReorderAfter()
//     }
// }

// // funkcija koja se izvrsava na pocetku headerReorder f-je
// function headerReorderAfter() {
//     var levelcounter = $('.altheader .mainmenu .applink[pageid="' + pageid + '"]').parents('ul').length - 1
//     if (levelcounter == 3) {
//         var prvi = $('.altheader .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink').closest('ul').siblings('.applink').closest('ul').siblings('.applink')
//         var drugi = $('.altheader .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink').closest('ul').siblings('.applink')
//         var treci = $('.altheader .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink')
//         $(prvi).addClass('applink_active')
//         $(drugi).addClass('applink_active')
//         $(treci).addClass('applink_active')
//     } else if (levelcounter == 2) {
//         var prvi = $('.altheader .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink').closest('ul').siblings('.applink')
//         var drugi = $('.altheader .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink')
//         $(prvi).addClass('applink_active')
//         $(drugi).addClass('applink_active')
//     } else if (levelcounter == 1) {
//         var prvi = $('.altheader .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink')
//         $(prvi).addClass('applink_active')
//     }
//     $('.applink[pageid="' + pageid + '"]').addClass('applink_active')
//     // zahteva promenu
//     $('.altheader_content').prepend('<ul class="allmedia-wrap"><li class="single-media-wrap"><a href="https://www.facebook.com/Elastyc-113304685375289" class="facebook-media" title="Follow on Facebook" target="_blank"></a></li><li class="single-media-wrap"><a href="https://www.instagram.com" class="instagram-media" title="Follow on Instagram" target="_blank"></a></li><li class="single-media-wrap"><a href="https://www.youtube.com" class="youtube-media" title="Follow on Youtube" target="_blank"></a></li><li class="single-media-wrap"><a href="https://www.linkedin.com/company/elastyc-net/" class="linkedin-media" title="Follow on Linkedin" target="_blank"></a></li></ul>')
//     if ($(window).width() > 992) {
//         $('.menuholder .mainmenu.container.dropdown.pull-left').append('<li onclick="myOptions(this)" class="loginnew"><a>Prijava</a></li>')
//         if (getCookie('userid') != '-1' || getCookie('userid') != '') {
//             $('.loginnew').removeAttr('onclick')
//             $('.loginnew a').text('Odjava')
//             // zahteva promenu, daje link za logoff dugme, proveriti da li radi
//             $('.loginnew a').attr('href', instance + 'logoff.php')
//         }
//     }
// }

// // funkcija koja se izvrsava na kraju headerReorder f-je
// function headerReorderBefore() {
//     if (pageid.toLowerCase() != getCookie('homepage').toLowerCase()) {
//         whereAmI()
//     }
// }


// // pitati polica
// function giveOpenClass(elem) {
//     $(elem).addClass('open').find('i').first().removeClass('open')
// }

// // pitati polica
// function takeOpenClass(elem) {
//     $(elem).removeClass('open').find('i').addClass('open')
// }

// // Napravljeno za dodavanje active klase trenutno izabranoj strani u meniju
// function displaySelectedApplink() {
//     if ($(window).width() < 992) {
//         var levelcounter = $('.main_navigation .mainmenu .applink[pageid="' + pageid + '"]').parents('ul').length - 1
//         if (levelcounter == 3) {
//             var prvi = $('.main_navigation .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink').closest('ul').siblings('.applink').closest('ul').siblings('.applink')
//             var drugi = $('.main_navigation .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink').closest('ul').siblings('.applink')
//             var treci = $('.main_navigation .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink')
//             $(prvi).click()
//             $(drugi).click()
//             $(treci).click()
//         } else if (levelcounter == 2) {
//             var prvi = $('.main_navigation .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink').closest('ul').siblings('.applink')
//             var drugi = $('.main_navigation .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink')
//             $(prvi).click()
//             $(drugi).click()
//         } else if (levelcounter == 1) {
//             var prvi = $('.main_navigation .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink')
//             $(prvi).click()
//         }
//         $('.main_navigation .mainmenu .applink[pageid="' + pageid + '"]').addClass('applink_active')
//     } else {
//         var levelcounter = $('.menuholder .mainmenu .applink[pageid="' + pageid + '"]').parents('ul').length - 1
//         if (levelcounter == 3) {
//             var prvi = $('.menuholder .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink').closest('ul').siblings('.applink').closest('ul').siblings('.applink')
//             var drugi = $('.menuholder .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink').closest('ul').siblings('.applink')
//             var treci = $('.menuholder .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink')
//             $(prvi).addClass('applink_active')
//             $(drugi).addClass('applink_active')
//             $(treci).addClass('applink_active')
//         } else if (levelcounter == 2) {
//             var prvi = $('.menuholder .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink').closest('ul').siblings('.applink')
//             var drugi = $('.menuholder .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink')
//             $(prvi).addClass('applink_active')
//             $(drugi).addClass('applink_active')
//         } else if (levelcounter == 1) {
//             var prvi = $('.menuholder .mainmenu .applink[pageid="' + pageid + '"]').closest('ul').siblings('.applink')
//             $(prvi).addClass('applink_active')
//         }
//         $('.applink[pageid="' + pageid + '"]').addClass('applink_active')
//     }
// }

function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}

async function searchClick(SEO_title, acckey, ident) {
    var search_term = $('#topsearchinput').val()
    await searchAnalytics(search_term + ' - ' + ident)
    window.location.href = `/index.php?pageid=${productdetails_pageid}&SEO_title=${SEO_title}&acckey=${acckey}&ident=${ident}`
}

$(document).on("click", function (e) {
    if ($(e.target).is(".searchresultswrap") === false) {
        $(".searchresultswrap").addClass("hidden");
    }
});

// PROBLEM SA TEMPLATE VARIJABLOM VIDIOVO
function searchHajdeDa(searchparam, searchby, oddelek) {
    if (searchparam != '') {
        $('.searchresultswrap').removeClass('hidden')
        $('.searchresults-subwrap').html('')
        loadcontent('search', {
            // template: wrapper_template,
            template: wrapper_template,
            notpublished: 'T',
            jsont: 'T',
            searchterm: searchparam,
            searchby: searchby,
            oddelek: oddelek
        }, function callback(response) {
            var jsonres = JSON.parse(response)
            jsonres.forEach(x => {
                $('.searchresults-subwrap').append(`
                        <div class="sr-one" acckey="${x.acckey}" onclick="event.stopPropagation();searchClick('${x.SEO_title}', '${x.acckey}', '${x.ident}' , '${x.grupa}')">
                            <div class="sr-client"><div class="labelice_wrap"><label class="labelicanasa">${x.cena}</label></div><span class="result_name">${x.SEO_title}</span></div>
                            <div class="sr-client-img"><img src="${x.slika}"></div>
                        </div>
                    `)
            })
            $('.sr-client-img img[src=""]').attr('src', nophoto)
        })
    } else {
        $('.searchresults-subwrap').html('')
        if ($(window).width() > 992) {
            $('.searchresultswrap').addClass('hidden')
        }
    }
}

function searchAnalytics(term){
    return new Promise((resolve, reject) => {
        if(!searchAnalytics_loading){
            searchAnalytics_loading = true
            var IPadress = ''
            var city = ''
            var region = ''
            var country = ''
            $.getJSON("https://api64.ipify.org?format=json", function(data) {
                IPadress = data.ip
                
                fetch('https://ipwho.is/' + IPadress)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            city = data.city
                            region = data.region
                            country = data.country
                            
                            var userAgent = navigator.userAgent
                            var parser = new UAParser(userAgent)
                            parser = parser.getResult()
                            var browser = parser.browser.name
                            var device = parser.device.type ?? 'web'
                            var os = parser.os.name
                            
                            loadcontent('searchAnalytics', {template: wrapper_template, ajax: 'T', notpublished: "T", jsont: 'T', term: term.replace(/;/g, '.,'), userID: userid,
                                                            IPadress: IPadress, city: city, region: region, country: country, 
                                                            userAgent: userAgent.replace(/;/g, '.,'), browser: browser, device: device, os: os}, function(response){
                                console.log(term, userid, IPadress, navigator.userAgent)
                                
                                var temp1 = JSON.parse(response)
                                console.log(temp1)
                                var data = temp1[0]
                                var client = data.client
                                var timestamp = data.timestamp
                                
                                $.ajax({
                                    url:'elasticsearch-api/elasticsearch-insert-search-logs.php',
                                    data: JSON.stringify({
                                        instance: websyncinstance,
                                        term: term,
                                        client: client,
                                        userID: userid,
                                        IPaddress: IPadress,
                                        city: city,
                                        region: region,
                                        country: country,
                                        userAgent: userAgent,
                                        browser: browser,
                                        device: device,
                                        os: os,
                                        timestamp: timestamp,
                                    }),
                                    method:'POST',
                                    contentType: 'application/json',
                                    success: function(response){
                                        // console.log(response)
                                        searchAnalytics_loading = false
                                        resolve()
                                    },
                                    error: function(xhr, status, error) {
                                        // console.error("Greška:", error, xhr.responseText)
                                        searchAnalytics_loading = false
                                        resolve()
                                        // reject(error)
                                    }
                                })
                                
                            })
                            
                        } else {
                            console.error('Error:', data.message);
                        }
                    })
                    
            })
        }
    })
}

$('#topsearchinput').on('click', function () {
    searchparam = $(this).val();
    event.stopPropagation()
    if (searchparam != '' && $('.searchresultswrap').hasClass('hidden')) {
        $('.searchresultswrap').removeClass('hidden')
    }
})

$("#topsearchinput").keyup(
    delay(function (event) {
        if(event.key !== "Enter" || event.which !== 13){
            searchparam = $(this).val();
            pagenumkat = 0
            loadingendkat = false
            
            searchHajdeDa(searchparam, 'field2, fieldt2, field11, field1, field28, fieldt19', '21S01002971')
        }
    }, 500)
);

if (getParameterByName('utm_source') != null) {
    setCookie2('utm_source', getParameterByName('utm_source'))
}
if (getParameterByName('utm_medium') != null) {
    setCookie2('utm_medium', getParameterByName('utm_medium'))
}
if (getParameterByName('utm_campaign') != null) {
    setCookie2('utm_campaign', getParameterByName('utm_campaign'))
}
if (getParameterByName('utm_content') != null) {
    setCookie2('utm_content', getParameterByName('utm_content'))
}
if (getParameterByName('utm_term') != null) {
    setCookie2('utm_term', getParameterByName('utm_term'))
}


function sendmail(data) {
    $.ajax({
        type: "POST",
        url: "sendmail.php?" + data,
        contentType: "text/html",
        dataType: "html",
        success: function (response) {}
    })
}


$(".toggle-password").click(function () {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

// function changecont() {
//     $('.alert.alert-danger').css('display', 'none')
//     $('.contdiv').toggleClass('active')
// }

// funkcija za proveru maila
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


// // funkcija za nesto oko logina?
// function reset(elem) {
//     $btn = $(elem)
//     $btn.button('loading');
//     $('.loaderimg').css('display', 'inline')
//     req = checkrequired(elem)
//     if (req == 'T') {
//         $btn.button('reset');
//         $('.loaderimg').css('display', 'none')
//         return
//     } else {
//         var pp
//         pp = 'resetpass.php'
//         $.ajax({
//             type: "GET",
//             url: instance + "sendmail.php?tomail=" + $('#resetusername').val() + "&action=forgotpassword&pageid=" + escape(pp) + "&loginver=login2",
//             success: function (response) {
//                 $('.alertmail').css('display', 'block')
//                 $btn.button('reset');
//                 $('.loaderimg').css('display', 'none')
//                 $('.loaderimg').css('display', 'none')
//             }
//         })
//     }
// }


// funkcija koja proverava da li su sva neophodna polja popunjena
function checkrequired(elem) {
    var req = ''
    $(elem).parents('div[name="form"]').find('input[requiredfield="true"]').each(function () {

        if ($(this).val() == '') {
            $(this).siblings('.help-block:eq(0)').css('cssText', 'display: block !important;')
            req = 'T'
        } else {
            $(this).siblings('.help-block:eq(0)').css('cssText', 'display: none !important;')
        }
    })
    return req
}

function initFavIcon() {
    var favorites = JSON.parse(localStorage.getItem('favorites'))
    if (favorites != null) {
        var html = ''
        favorites.forEach(favs => {
            html += `<div acckey="${favs.acckey}" class="faitemshold">
                        <a href="${favs.link}">
                            <div class="favitem-inner">
                                <div class="favitem_imghold"><img src="${favs.slika}"></div>
                                <div class="right-sect-wrap">
                                <div class="nazivfav">${favs.naslov}</div>
                                </div>
                            </div>
                        </a>
                        <div onclick="deleteFav(this)" class="delete-fav"><i class="fa fa-trash"></i></div>
                    </div>
        `
            $('.fav-items-list').html(html)

        })
    }

    if ($('.faitemshold').length) {
        $('.favitems-dropdown').addClass('hasfavs')
        if ($('.favitems-dropdown.hasfavs').length) {
            $('.nofav').addClass('hidden')
            $('.hasfav').removeClass('hidden')
            $('.num_fav_items').removeClass('hidden')
        }

    } else {
        $('.nofav').removeClass('hidden')
        $('.hasfav').addClass('hidden')
        $('.favitems-dropdown').removeClass('hasfavs')
        $('.fav-items-list').html('<div class="no_favorites">Nemate omiljene proizvode!</div>')
        $('.num_fav_items').addClass('hidden')
    }

    var broj_omiljenih = 0;
    broj_omiljenih = $('.faitemshold').length
    $('.num_fav_items').empty()
    $('.num_fav_items').append(broj_omiljenih)
}


function afterCusSat() {
    alert('Hvala na izdvojenom vremenu!')
    $('.cusat').addClass('hidden')
    window.location.href = 'index.php?pageid=' + getCookie('homepage') + ''

}

// FUNCKIJA KOJA GRADI LEVI MENI
function add_left_menu_to_my_portal2(parentPageId) {
    if (parentPageId !== '') {
        $('.hd_wrap').addClass('hd_wrap_left_menu')
        var html = $('.applink[pageid="' + parentPageId + '"]').parent().find('ul').html()
        $('.web_content_left_menu_ul').html(html)

        $('.web_content_left_menu_ul li').each(function () {
            if ($(this).children('a').attr('pageid') == pageid) {
                $(this).children('a').addClass('selected_page')
            }
        })

        $('.web_content_left_menu li.dropdown.sublist[level="3"]').find('a.applink[level="3"]:first-child').each(function () {
            $(this).removeAttr('href')
            $(this).find('div.megamenu_image_text:first-child').addClass('web_content_left_menu_ul_label')
            $(this).addClass('web_content_left_menu_ul_a')
        })
    }
}

function toggle_my_profile_dropdown() {
    if ($(window).width() > 991) {
        $('.my_profile_dropdown').slideToggle(250)
    } else {
        $('.my_profile_dropdown').slideDown()
        $('.my_profile_dropdown_mobile_header').removeClass('hidden')
        $('body').addClass('noscroll')
    }
}


// shorten_menu_list('#header .mainmenu .dropdown.megamenu[megamenutype="Horizontalni"] .dropdown-menu[level="2"]', 5)
// FUNKCIJA ZA SAKRIVANJE LIST ITEMS-A U MENIJU
function shorten_menu_list(menu_selector, displayed_num) {
    const menu = $(menu_selector);
    menu.each(function () {
        var listItems = $(this).children('li')
        listItems.slice(displayed_num).hide();
        $(this).append('<li id="showMore" style="display: none"><div class="showMore_img"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="24" height="24" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M257 0C116.39 0 0 114.39 0 255s116.39 257 257 257 255-116.39 255-257S397.61 0 257 0zm135 285H287v107c0 16.54-13.47 30-30 30-16.54 0-30-13.46-30-30V285H120c-16.54 0-30-13.46-30-30s13.46-30 30-30h107V120c0-16.54 13.46-30 30-30 16.53 0 30 13.46 30 30v105h105c16.53 0 30 13.46 30 30s-13.47 30-30 30z" fill="#000000" data-original="#000000" class=""></path></g></svg><svg style="display: none;" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="24" height="24" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M257 0C116.39 0 0 114.39 0 255s116.39 257 257 257 255-116.39 255-257S397.61 0 257 0zm135 285H120c-16.54 0-30-13.46-30-30s13.46-30 30-30h272c16.53 0 30 13.46 30 30s-13.47 30-30 30z" fill="#000000" data-original="#000000" class=""></path></g></svg></div><div class="showMore_text"><span>Prikaži više</span><span style="display: none;">Prikaži manje</span></div></li>')
        var showMore = $(this).find('#showMore');
        if (listItems.length > displayed_num) {
            showMore.show();
        }

        showMore.click(function () {
            $(this).siblings('li').slice(displayed_num).toggle();
            $(this).find(".showMore_img svg").toggle();
            $(this).find(".showMore_text span").toggle();
            console.log(this)
        });
    })
}

// ADD TO FAVORITES
function addToFavorites(elem) {
    var favorites = [{
        acckey: $(elem).closest('.applink').attr('acckey'),
        slika: $(elem).closest('.product-details').siblings('.artikalimg').children('.slikaartikla').attr('src'),
        naslov: $(elem).closest('.product-details').siblings('.artikalimg').children('.slikaartikla').attr('alt'),
        cena: $(elem).parents('.action_fav_wrap').siblings('.prodcena-artikla').find('.cenacifra').text(),
        link: $(elem).closest('.applink').attr('href')
    }]
    console.log(favorites)
    var morefavs = localStorage.getItem('favorites')
    if (typeof morefavs == typeof null || !morefavs.length) {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    } else {
        morefavs = JSON.parse(morefavs)
        var imaga = false
        morefavs.forEach(x => {
            for (const [key, value] of Object.entries(x)) {
                if (key == 'acckey') {
                    if (value == favorites[0]['acckey']) {
                        imaga = true
                    }
                }
            }
        })
        if (!imaga) {
            morefavs.push(favorites[0])
            localStorage.setItem('favorites', JSON.stringify(morefavs))
        }
    }
    $('.favitems-dropdown').addClass('hasfavs')
    toggleFav()
    $('.favitems-dropdown.hasfavs .fav-items-list').removeClass('hidden');
    checkAddedItemAndHighlight()
}

function checkAddedItemAndHighlight(template) {
    $('.katalogv2_favorite_wrap').removeClass('katalogv2_favorite_wrap_fav');
    $('.faitemshold').each(function () {
        var vrednostFavAtributa = $(this).attr('acckey');
        $('.katalogv2_art_holder_a').each(function () {
            if ($(this).attr('acckey') == vrednostFavAtributa) {
                $(this).find('.katalogv2_favorite_wrap').addClass('katalogv2_favorite_wrap_fav')
            }
        })
    })
}

async function get_analitycs_data() {
    await loadcontent('analitycsdata', {
        template: wrapper_template,
        jsont: 'T',
        notpublished: 'T',
        ajax: 'T',
        pageid: pageid,
        sessionid: getCookie('sessionid'),
        source: document.referrer,
        usergroup: usergroup,
        userid: userid,
        acckey: getParameterByName('acckey') ? getParameterByName('acckey') : ''
    }, function callback(response) {})
}

function show_debts() {
    $('.debts_dropdown').fadeToggle()

    if ($('.debts_dropdown_section').html() == '') {
        $('.debts_konta_link').attr('href', 'index.php?pageid=' + dugovanja_pageid)
        var dugukupno = getCookie('dugukupno')
        var limit = getCookie('limit')
        var dugdospelo = getCookie('dugdospelo')
        var dnizaplac = getCookie('dnizaplac')
        var html1 = ''
        html1 += `  <div class="debts_dropdown_cell">
                            <div class="debts_dropdown_cell_label">Ukupno</div>
                            <div class="debts_dropdown_cell_value_holder"><span class="debts_dropdown_cell_value money">` + dugukupno + `</span><span class="valuta_symbol">` + valuta_symbol + `</span></div>
                        </div>
                        <div class="debts_dropdown_cell">
                            <div class="debts_dropdown_cell_label">Limit</div>
                            <div class="debts_dropdown_cell_value_holder"><span class="debts_dropdown_cell_value money">` + limit + `</span><span class="valuta_symbol">` + valuta_symbol + `</span></div>
                        </div>
                        <div class="debts_dropdown_cell">
                            <div class="debts_dropdown_cell_label">Dospelo</div>
                            <div class="debts_dropdown_cell_value_holder"><span class="debts_dropdown_cell_value money">` + dugdospelo + `</span><span class="valuta_symbol">` + valuta_symbol + `</span></div>
                        </div>
                        <div class="debts_dropdown_cell">
                            <div class="debts_dropdown_cell_label">Valuta</div>
                            <div class="debts_dropdown_cell_value">` + dnizaplac + ` dana</div>
                        </div>`

        $('.debtSubject').html(html1)
        formatmoneyvalues('.finance_wrap')

        $('.debts_dropdown_loader').fadeOut()
    }

    if ($('.debts_dropdown').attr('close_bind') !== 'T') {
        $('.debts_dropdown').attr('close_bind', 'T')
        $(document).click(function (event) {
            if (!$(".finance_wrap").is(event.target) && !$(".finance_wrap").has(event.target).length) {
                $('.debts_dropdown').fadeOut();
            }
        });
    }
}

function init_debt() {
    
    if ($(window).width() > 992) {
        if ((userid == '-1' || userid == '')) {
            // $('.pick-me #registrate-btn').wrapAll('<p class="no-account"> Nemate nalog? Registrujte se</p>')
            // $('.pick-me #registrate-btn').text('ovde')
            $('.finance_wrap').hide()
        } else {
            $('.finance_wrap .debt').text(getCookie('dugdospelo')).addClass('money')
            formatmoneyvalues('.finance_wrap')
            $('.finance_wrap').show()
        }
        // $('.my_profile_toggler').remove()
        // $('.login_form_btns_login').remove()
        // $('.pick-me').css('margin-top' , '50px')
    } else {
        if ((userid !== '-1')) {
            $('.login_form_btns_login #loginform').addClass('hidden')
        } else {
            $('.login_form_btns_login #loginform').removeClass('hidden')
        }
        $('body').click(function () {
            $('.pick-me').slideUp("slow")
        });
    }
}

function format_dugovanja() {
    var number = parseFloat($('.debt').text());
    var formattedNumber = number.toLocaleString('en-US');
    $('.debt').text(formattedNumber)
}

function goToCheckoutNew(userid, usergroup, checkoutpage, refresh) {
    loadcontent('reloadbasket', {
        template: wrapper_template,
        notpublished: 'T',
        ajax: 'T',
        jsont: 'T',
        userid: userid,
        sessionid: getCookie('sessionid')
    }, function callback(response) {
        basket = JSON.parse(response)

        var idents = '';
        console.log('basket', basket)
        basket.forEach(item => {
            if (item.serijskibr !== '') {
                idents += item.ident.trim() + '@' + item.kol + '@' + item.serijskibr + ',';
            } else {
                idents += item.ident.trim() + '@' + item.kol + ',';
            }
        });

        idents = idents.substring(0, idents.length - 1)
        console.log('idents', idents)
        loadcontent('final', {
            template: wrapper_template,
            ident: idents,
            usergroup: usergroup,
            userid: userid,
            jsont: 'T'
        }, function callback(response) {
            if (refresh == 'refresh') {
                initCheckoutItems(userid)
            } else {
                document.location = 'index.php?pageid=' + checkoutpage;
            }
        });

    })
}

var current_cat_ident = ''

function openClientNewCaseModalFront(oddelek, elem, onload, onconfirm, ident) {
    $('body').addClass('noscroll')
    if (!$('.form_modal_holder').length) {
        $('body').append(`
            <div class="form_modal_holder" style="display: none;">
                <div class="form_modal_overlay">
                    <div class="form_modal_container container">
                        <div class="form_modal">
                            <div class="form_modal_header">
                                <div class="form_modal_title"></div>
                                <div class="form_modal_close" onclick="$('.form_modal_holder').fadeOut();$('body').removeClass('noscroll')"><i class="fa fa-times"></i></div>
                            </div>
                            <div class="form_modal_wrap">
                                <div class="form_modal_desc" style="display: none"></div>
                                <div class="form_modal_form"></div>
                            </div>
                            <div class="form_modal_placeholder" style="display: none"></div>
                            <div class="form_modal_loader loader_holder">
                                <div class="loader"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    } else {
        $('.form_modal_placeholder').hide()
    }

    current_cat_ident = ident

    clientNewCase(oddelek, '.form_modal_form', onload, onconfirm)
    $('.form_modal_loader.loader_holder').show()
    $('.form_modal_holder').fadeIn()
}

function openClientNewCaseModalFrontOnLoad(){
    // $('#New_case_front_field1843').val(current_cat_ident)
    // $('#New_case_front_nacinpl').removeAttr('required')
    // $('#New_case_front_deliveryaddr').removeAttr('required')
    // $('#New_case_front_subjekt').val('anonimni kupac')
    // $('#New_case_front_field1792').val('SHOWROOM')
    // $('#New_case_front_field1757').val('')
    // $('#New_case_front_field1756').val('SHOWROOM')
    // $('.form_modal_title').text('Upit')
    // $('#newcase-temp #load').text('Pošaljite upit')
    // // $('.form_modal_desc').text('Opis tekst').show()
    // $('.form_modal_loader.loader_holder').fadeOut('fast')
    
    if(userid !== '-1'){
        $('.flcntfield1936, .flcntfield1937, .flcntfield1935, .flcntfield1938').remove()
    }
    
    if(typeof detaljan_prikaz_proizvoda_current_ident !== 'undefined' && detaljan_prikaz_proizvoda_current_ident !==''){
        current_cat_ident = detaljan_prikaz_proizvoda_current_ident
    }
    if(typeof detaljan_prikaz_proizvoda_varijanta !== 'undefined' && detaljan_prikaz_proizvoda_varijanta !==''){
        $('textarea#New_case_front_field1758').val('Interesujem se za varijantu: ' + detaljan_prikaz_proizvoda_varijanta + '\n')
    }
    $('#New_case_front_field1843').val(current_cat_ident)
    $('#New_case_front_nacinpl').removeAttr('required')
    $('#New_case_front_deliveryaddr').removeAttr('required')
    $('.form_modal_title').text('Upit')
    $('#newcase-temp #load').text('Pošaljite upit')
    $('.form_modal_loader.loader_holder').fadeOut('fast')
    
}

function openClientNewCaseModalFrontOnConfirm(){
    $('.form_modal_placeholder').text('Vaš zahtev je poslat, očekujte odgovor u najkraćem roku!').show()
    setTimeout(function(){
        $('.form_modal_holder').fadeOut()
        $('body').removeClass('noscroll')
    }, 3000)
}

$('.wrapper_confirm_modal_overlay').keydown(function () {
    // Check if Enter key is pressed
    if (event.keyCode === 13) {
        // Call function for Enter press
        $('button.wrapper_confirm_modal_butt.wrapper_confirm_modal_butt_da').click()
    }
    // Check if Escape key is pressed
    else if (event.keyCode === 27) {
        // Call function for Escape press
        $('button.wrapper_confirm_modal_butt.wrapper_confirm_modal_butt_ne').click()
    }
})


function afterAddBasket(elem) {
    Toastify({
        text: "Artikal uspešno dodat u korpu",
        className: "toast_notif_popup",
        duration: 3400,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        offset: {
            y: 74
        },
        onClick: function () {
            toggleBasketMenu()
            $('.toast_notif_popup').remove()
        } // Callback after click
    }).showToast();

    $('.single-cart').each(function () {
        if ($(this).find('.cartvred').attr('cena') == '0') {
            $(this).find('.cartvred').siblings('span').text('Cena na upit.')
            $(this).find('.cartvred').text('')
        }
    })
    $(elem).parents('.katalogv2_art_modal').find('.katalogv2_art_modal_close_wrap').click()
    // reload_basket_items()
}

function goToLoginPage() {
    var login_page = getCookie('loginpage')
    sessionStorage.setItem('previousPage', window.location.href);
    window.location.href = 'index.php?pageid=' + login_page
}


// STANDARDNE FUNKCIJE

function clientNewCase(oddelek, container, onload, onconfirm) {
    $(container).html('')
    openform('New case front', {
        oddelek: oddelek,
        mailaction: 'newpost',
        from: "front",
        onload: onload,
        userid: getCookie('userid'),
        subjekt: getCookie('subjekt'),
        onconfirm: onconfirm
    }, container)
}

function clientNewCase_v2(oddelek, data, container, onload, onconfirm) {
    var data2 = {
        oddelek: oddelek,
        from: "front",
        onload: onload,
        userid: getCookie('userid'),
        onconfirm: onconfirm
    }
    $.extend(data, data2);

    $(container).html('')
    openform('Novi predmet front', data, container, onload)
}

function clientNewCase_NC_Sinp_garant(oddelek, container, onload, onconfirm) {
    $(container).html('')
    openform_NC_Sinp_garant('Novi predmet front', {
        oddelek: oddelek,
        from: "front",
        onload: onload,
        userid: getCookie('userid'),
        onconfirm: onconfirm
    }, container, onload)
}

function clientCaseList(casetype, data, container, beforeload, afterload, templatehtml, append) {

    var listhtml = ''
    if (templatehtml === undefined || templatehtml == '') {
        listhtml = ''
    } else {
        listhtml = $(templatehtml).html()
    }

    if (typeof beforeload == 'function') {
        beforeload()
    }
    var res = ''
    var data2 = data
    var data = {
        pageid: pageid,
        template: 'client recordsets',
        jsont: 'T',
        caseauth: '',
        isback: 'T',
        html: 'T'
    }

    $.extend(data, data2);
    loadcontent('clientcases', data, function callback(response) {
        response = response.replace(/\n|\r/g, '');
        json = JSON.parse(response)


        html = ''

        if (json.length > 1) {
            var string = ''
            if (listhtml != '') {
                string = listhtml
            } else {
                string = json[0]['html']
            }

            for (var i = 1; i < json.length; i++) {
                var string1 = string
                var columnsIn = json[i]
                for (var key in columnsIn) {
                    var reval = "'#" + key + "#'"
                    var re = new RegExp(reval, "g");
                    string1 = string1.replace(re, "'" + json[i][key].replace(/"/g, '"').replace(/'/g, '\\\'') + "'")


                }
                for (var key in columnsIn) {
                    var reval = "#" + key + "#"
                    var re = new RegExp(reval, "g");
                    if (/<[a-z][\s\S]*>/i.test(json[i][key])) {
                        string1 = string1.replace(re, json[i][key])
                    } else {
                        string1 = string1.replace(re, json[i][key].replace(/"/g, '"'))
                    }


                }
                html += string1
            }
        }
        if (append == 'T') {
            $(container).append(html)
        } else {
            $(container).html(html)
        }
        if (typeof afterload === 'string') {
            if (afterload !== '') {
                if (eval('typeof ' + afterload + '===\'function\'')) {
                    eval(afterload + '()')
                }
            }
        }
    })
}

function openform(id, data, container, funkcijaposle, funkcijapre, isback) {
    if (typeof isback === typeof undefined) {
        isback = ''
        urlforajax = instance + "/indexback.php?template=" + escape(id) + '&loadindiv=T' + "&withoutwrap=T"
    } else {

        urlforajax = instance + "/index.php?template=" + escape(id) + '&loadindiv=T&pageid=' + isback + "&withoutwrap=T"
    }
    data['container'] = container
    var idnew = id.replace(/ /g, '_')

    if ($(container).html() == '') {
        $.ajax({
            type: "GET",
            url: urlforajax,
            success: function (response) {
                $(container).html(response)
                for (var i in data) {
                    $(container + ' #' + idnew + '_' + i).val(data[i])
                }
                if (typeof funkcijapre == 'function') {
                    funkcijapre()
                }
                eval('init_' + idnew + '(' + JSON.stringify(data) + ')')

                // if ($(container + ' #' + idnew + '_onload').val() != '' && typeof $(container + ' #' + idnew + '_onload').val() !== 'undefined') {
                //     eval($(container + ' #' + idnew + '_onload').val() + '()')
                // }

                if (typeof funkcijaposle == 'string' && funkcijaposle != '') {
                    eval(funkcijaposle + '()')
                }
            }
        })
    } else {
        $(container).find('.frontdyn_container').val(data.container)
        $(container).find('.frontdyn_oddelek').val(data.oddelek)
        $(container).find('.frontdyn_checkout').val(data.checkout)
        $(container).find('.frontdyn_onload').val(data.onload)
        $(container).find('.frontdyn_onconfirm').val(data.onconfirm)
        if (typeof funkcijapre == 'function') {
            funkcijapre()
        }
        eval('init_' + idnew + '(' + JSON.stringify(data) + ')')
        if (typeof funkcijaposle == 'function') {
            funkcijaposle()
        }
    }
}


// STANDARDNE FUNKCIJE WEBMAIN i WEBBASKET------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var action2 = ''
ajaxclicked = ''
var selectedarray = []
var structmenu = ''
var templatename
var backpath = []
var searchterm = ''
var searchby = ''
var proizvodisearch = ''
iscordova = false
websyncpath = 'http://' + window.location.hostname + '/'
var strPathweb = 'http://' + window.location.hostname + '/'
var strPath = 'http://' + window.location.hostname + '/'
// clientServicePage = 'a15'
clientName = ''
timer = ''

if (typeof platform === 'undefined') {
    var platform = 'Web';
}

var userid = getCookie('userid')
var dodatniuslovdinfiltfront = ''

pagenum = parseInt(getParameterByName('pagenum'))

if (isNaN(pagenum)) pagenum = 0

if (typeof instance === 'undefined') {
    var instance = '';
}

if (typeof notif === 'undefined') {
    var notif = true;
}


// INIICJALIZACIJA MAIN.JS
function initMainJS() {
    // initdebt('.debt')

    if (getCookie('usergroup') == 'B2B+korisnik') {
        $('.b2bkor').css('display', 'block')
    }

    $('.check-out').bind('click', function () {
        if ($('#userid').val() < 0) {
            document.location = 'index.php?pageid=a61#/login'
            return false
        }
    })

    $('.mobile-menu-area').css('display', 'block')
    $('#meandrop li').each(function () {
        if (parseInt($(this).attr('nivo')) < 4 && $(this).find('ul').length != '') {
            $(this).find('> a:first-child()').bind('click', function (event) {
                event.preventDefault()
                $(this).parent().find('> ul').css('display', 'block')

                $(this).parent().find('> .mean-expand').addClass('mean-clicked')
                $(this).parent().find('> .mean-expand').html('-')
            })
        }
    })

    $('.shopping-basket').bind('click', function (event) {
        event.stopPropagation()
        if ($('.detailbasket').hasClass('always-open')) {

        } else {
            $('.detailbasket').addClass('hidden')
        }

        // $('body').toggleClass('overflowhidden')
        $('#header').toggleClass('zindex999')

        if ($('.total-cart-in ul').hasClass('active')) {
            $('.total-cart-in ul').removeClass('active')
            $('body').bind('click', function () {
                $('body').unbind()
                if ($('.total-cart-in ul').hasClass('active')) {

                    $('.shopping-basket').click()
                    $('.total-cart-in ul').removeClass('active')
                } else {

                }

            })
        } else {
            $('.total-cart-in ul').addClass('active')
        }
    })
    $('.cart-price').html($('#cart-price-h').html())

    if ($(window).width() < 991) {
        $('.main_navigation .main-ul').append($('.login-btns'))
        $('.dugovanje-mob-btn').after($('.dropdowninance'))

    }

    checkLogged()
    if (notif) {
        ntf_init()
        websyncbind()
    }

    if (typeof (app) == typeof (undefined) || app != "T") {
        $('#client-loader').delay(10).fadeOut()
    }
}

// IZVLACI VREDNOST PARAMETRA IZ URL-A
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&:@:@:@#:|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

Number.prototype.formatMoney = function (decPlaces, thouSeparator, decSeparator) {
    var n = this,
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSeparator = decSeparator == undefined ? "." : decSeparator,
        thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
        sign = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
}

// FORMATIRANJE CIFRI
function formatmoneyvalues(container, withoutfloat) {
    if (typeof container === 'undefined') {
        container = ''
    }
    $(container + ' .money').each(function (index) {


        if ($(this).attr('type') == 'text' && $(this).val() != '' && typeof $(this).html() !== typeof undefined) {
            var myMoney = eval($(this).val().replace(',', ''));
            var formattedMoney = myMoney.formatMoney(2, ',', '.');
            $(this).val(formattedMoney);
        }
        if ($(this).html() != '' && $(this).html().trim() !== '' && typeof $(this).html() !== typeof undefined) {
            var myMoney = eval($(this).html().replace(',', ''));
            var formattedMoney = typeof withoutfloat === 'undefined' ? myMoney.formatMoney(2, ',', '.') : myMoney.formatMoney(2, ',', '.').split('.')[0];
            $(this).text(formattedMoney);
        }
        if ($(this).attr('type') == 'number' && $(this).val() != '' && typeof $(this).html() !== typeof undefined) {
            var myMoney = eval($(this).val().replace(',', ''));
            var formattedMoney = typeof withoutfloat === 'undefined' ? myMoney.formatMoney(2, ',', '.') : myMoney.formatMoney(2, ',', '.').split('.')[0];
            $(this).val(formattedMoney);
        }
        $(this).removeClass('money')
    });
}

// FORMATIRANJE DATUMA
function formatdate(elem) {
    $(elem + ' .inputdate').each(function () {

        $(this).bind("keydown", function (e) {
            var key = (e.keyCode ? e.keyCode : e.which)
            if (key == 9) {
                closedrop()
            }
            if (key == 13) {
                $(this).parents('.poljeinp').next('.poljeinp').find('input').first().focus()
                e.keyCode = 9
                $(this).trigger(e)

            }
            if (key == 8 || key == 46) {
                $.datepicker._clearDate(this)
            } else {

            }
        })

        datumdisplayval = ''
        datumid = $(this).attr('id')
        datumdisplay = datumid + 'display'
        datumdisplayval = $('#' + datumdisplay).val()

        if ($(this).attr('initialized') != 'T') {
            $(this).bind("click", function () {
                if (typeof $(this).attr('customchange') !== typeof undefined && $(this).attr('customchange') != '' && $(this).attr('customchangechecked') != 'T') {
                    event.preventDefault();
                    event.stopPropagation();
                    var functioncall = $(this).attr('customchange') + '(this)'
                    eval(functioncall)
                    return false
                } else {
                    $(this).attr('customchangechecked', '')
                }
                toggleDatepicker(this)
            })


            $('#' + datumid).datepicker({
                showButtonPanel: true,
                closeText: 'Clear', // Text to show for "close" button
                dateFormat: "dd.mm.yy",
                altField: "#" + datumdisplay,
                showOn: "button",
                altFormat: 'yy-mm-dd',
                dayNames: ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"],
                monthNames: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
                onSelect: function () {
                    $(this).focus()
                    $(this).trigger('change')
                    toggleDatepicker(this)
                },
                beforeShow: function (input) {
                    setTimeout(function () {
                        var clearButton = $(input).datepicker("widget").find(".ui-datepicker-close");
                        clearButton.unbind("click").bind("click", function () {
                            $.datepicker._clearDate(input);
                        });
                    }, 1);

                    setTimeout(function () {
                        var todayButton = $(input).datepicker("widget").find(".ui-datepicker-current");
                        todayButton.unbind("click").bind("click", function () {
                            $(input).datepicker('setDate', new Date())
                            toggleDatepicker(input)
                        })

                    }, 1);

                }

            });
            $(this).attr('initialized', 'T')
        }
        if (datumdisplayval == '') {} else {
            datum3 = new Date(datumdisplayval)
            datum2 = $.datepicker.formatDate('dd.mm.yy', datum3, {
                dayNames: ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"],
                monthNames: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"]
            });
            $('#' + datumid).val(datum2)
        }

    })
}

// POSTAVLJA VREDNOST COOKIE-A
function setCookie(cname, cvalue, cexp) {
    if ((typeof webapp != typeof undefined && webapp == 'T') || ((typeof app == "undefined" ? 'F' : app) != 'T')) {
        //((typeof app == "undefined" ? 'F' : app) != 'T') {
        var d = new Date();
        d.setTime(d.getTime() + (cexp * 1000));
        var expires = "expires=" + d.toUTCString();

        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } else {
        let JWT_obj = JSON.parse((localStorage.getItem('JWT') == null ? '{}' : localStorage.getItem('JWT')))
        JWT_obj[cname] = cvalue
        localStorage.setItem('JWT', JSON.stringify(JWT_obj))
    }
}

// IZVLACI VREDNOST COOKIE-A
function getCookie(cname) {
    if ((typeof webapp != typeof undefined && webapp == 'T') || ((typeof app == "undefined" ? 'F' : app) != 'T')) {
        var name = cname + "=";
        var decodedCookie = document.cookie;
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(unescape(c.substring(name.length, c.length)));
            }
        }
        return "";
    } else {
        var cooksi = JSON.parse(localStorage.getItem('JWT'))
        if (cooksi == null) {
            return ''
        }
        if (cooksi[cname] != undefined) {
            var opavalue = cooksi[cname]

            return opavalue
        }
    }
}

// IZVLACI VREDNOST IZ COOKIE-A
function getCookie2(cname) {
    if ((typeof webapp != typeof undefined && webapp == 'T') || ((typeof app == "undefined" ? 'F' : app) != 'T')) {
        var name = cname + "=";
        var decodedCookie = document.cookie;
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                c = c.split('expireDate');
                return decodeURIComponent(c[0].substring(name.length, c[0].length));
            }
        }
        return "";

    } else {
        var cooksi = JSON.parse(localStorage.getItem('JWT'))
        if (cooksi == null) {
            return ''
        }
        if (cooksi[cname] != undefined) {
            var opavalue = cooksi[cname]

            return opavalue
        }
    }
}

// SKIDA KONTO LOADER VIDIOVO?
function removeLoaderKonto() {
    $('#myModalKonto iframe').ready(function () {
        $('#myModalKonto .modal-body .loaderwrapp').remove()
    });
}

// POZIVA API
function loadcontent(component, data, callback) {
    //mobileapp
    if (typeof (app) != typeof (undefined) && app == "T" && typeof (webapp) == typeof undefined) {
        if (loading == "true") {
            pagenum = eval(pagenum + 1);
        } else {
            pagenum = 1
        }
        datav = data;
        if (typeof data.httprequest === typeof undefined) {
            method = 'POST'
        } else {
            method = data.httprequest
        }
        if (typeof data.async === typeof undefined) {
            async = true
        } else {
            async = data.async
        }
        for (var o in data) {
            // data[o]=encodeURIComponent(unescape(data[o]))
            data[o] = unescape(data[o]).replace(/;/g, ';').replace(/\+/g, '+').replace(/&/g, '&').replace(/%/g, '%')
        }
        adddata = {
            "component": component,
            pagenum: pagenum,
            "pageid": pageid,
            "stranaid": pageid,
            ajax: "T",
            instance: instance,
            JWT: localStorage.getItem('JWT'),
            localstorage: 'T'
        };
        $.extend(adddata, datav);
        if (method == 'POST') {
            $.extend(adddata, {
                httprequest: method
            });
        }
        $.ajax({
            type: method,
            data: adddata,
            url: instance + "webcomp/htmlrecordsetMobileTest.php",
            async: async,
            success: function (response) {
                if (response == '') {
                    loadingend = 'T'
                }
                loading = "false"
                callback(response)
                transformToApp()
            }
        })
        //web
    } else {
        if (loading == "true") {
            pagenum = eval(pagenum + 1);
        } else {
            pagenum = 1
        }
        datav = data;
        if (typeof data.httprequest === typeof undefined) {
            method = 'GET'
        } else {
            method = data.httprequest
        }
        if (typeof data.async === typeof undefined) {
            async = true
        } else {
            async = data.async
        }
        for (var o in data) {
            // data[o]=encodeURIComponent(unescape(data[o]))
            data[o] = unescape(data[o]).replace(/;/g, ';').replace(/\+/g, '+').replace(/&/g, '&').replace(/%/g, '%')
        }
        adddata = {
            "component": component,
            pagenum: pagenum,
            "pageid": pageid,
            "stranaid": pageid,
            ajax: "T",
            instance: instance
        };
        $.extend(adddata, datav);
        if (method == 'POST') {
            $.extend(adddata, {
                httprequest: method
            });
        }
        $.ajax({
            type: method,
            data: adddata,
            url: instance + "webcomp/htmlrecordset.php",
            async: async,
            contentType: 'application/json',
            success: function (response) {
                if (response == '') {
                    loadingend = 'T'
                }
                loading = "false"
                callback(response)
            }
        })

    }
}

// function loadcontentback(component, data, callback) {
//     if (typeof (app) != typeof (undefined) && app == "T" && typeof (webapp) == typeof undefined) {
//         if (pagenum == 0) {
//             pagenum = 1
//         }
//         if (loading == "true") {
//             pagenum = eval(pagenum + 1);
//         }
//         for (var o in data) {
//             data[o] = unescape(data[o]).replace(/;/g, ';').replace(/\+/g, '+').replace(/&/g, '&').replace(/%/g, '%')
//         }
//         if (typeof data.async === typeof undefined) {
//             async = true
//         } else {
//             async = false
//         }
//         datav = data;
//         adddata = {
//             "ajax": 'T',
//             "component": component,
//             "pagenum": pagenum,
//             httprequest: 'POST',
//             instance: instance,
//             JWT: localStorage.getItem('JWT'),
//             localstorageback: 'T'
//         };
//         $.extend(adddata, datav);
//         $.ajax({
//             type: "POST",
//             data: adddata,
//             async: async,
//             contentType: 'multipart/form-data; charset=windows-1250',
//             url: instance + "webcomp/htmlrecordsetback.php",
//             success: function (response) {
//                 if (response == '[]' && loading == 'true') {
//                     loadingend = 'T'
//                 }
//                 loading = "false"
//                 callback(response)
//             }
//         })
//     } else {
//         if (pagenum == 0) {
//             pagenum = 1
//         }
//         if (loading == "true") {
//             pagenum = eval(pagenum + 1);
//         }
//         for (var o in data) {
//             data[o] = unescape(data[o]).replace(/;/g, ';').replace(/\+/g, '+').replace(/&/g, '&').replace(/%/g, '%')
//         }
//         if (typeof data.async === typeof undefined) {
//             async = true
//         } else {
//             async = false
//         }
//         datav = data;
//         adddata = {
//             "ajax": 'T',
//             "component": component,
//             "pagenum": pagenum,
//             httprequest: 'POST'
//         };
//         $.extend(adddata, datav);
//         $.ajax({
//             type: "POST",
//             data: adddata,
//             async: async,
//             contentType: 'multipart/form-data; charset=windows-1250',
//             url: instance + "webcomp/htmlrecordsetback.php",
//             success: function (response) {
//                 if (response == '[]' && loading == 'true') {
//                     loadingend = 'T'
//                 }
//                 loading = "false"
//                 callback(response)
//             }
//         })
//     }
// }

function loadcontentback(component, data, callback) {
    if(typeof(app) != typeof(undefined) && app == "T" && typeof(webapp) == typeof undefined ){
        if (pagenum == 0) {
            pagenum = 1
        }
        if (loading == "true") {
            pagenum = eval(pagenum + 1);
        }
        for (var o in data) {
            data[o] = unescape(data[o]).replace(/;/g, ';').replace(/\+/g, '+').replace(/&/g, '&').replace(/%/g, '%')
        }
        if (typeof data.async === typeof undefined) {
            async = true
        } else {
            async = false
        }
        datav = data;
        adddata = {
            "ajax": 'T',
            "component": component,
            "pagenum": pagenum,
            httprequest: 'POST',
            instance: instance,
            JWT: localStorage.getItem('JWT'),
            localstorageback: 'T'
        };
        $.extend(adddata, datav);
        $.ajax({
            type: "POST",
            data: adddata,
            async: async,
            contentType: 'multipart/form-data; charset=windows-1250',
            url: instance + "webcomp/htmlrecordsetback.php",
            success: function (response) {
                if (response == '[]' && loading == 'true') {
                    loadingend = 'T'
                }
                loading = "false"
                callback(response)
            }
        })
    }else{
        if (pagenum == 0) {
            pagenum = 1
        }
        if (loading == "true") {
            pagenum = eval(pagenum + 1);
        }
        for (var o in data) {
            data[o] = unescape(data[o]).replace(/;/g, ';').replace(/\+/g, '+').replace(/&/g, '&').replace(/%/g, '%')
        }
        if (typeof data.async === typeof undefined) {
            async = true
        } else {
            async = false
        }
        datav = data;
        adddata = {
            "ajax": 'T',
            "component": component,
            "pagenum": pagenum,
            httprequest: 'POST'
        };
        $.extend(adddata, datav);
        $.ajax({
            type: "POST",
            data: adddata,
            async: async,
            contentType: 'multipart/form-data; charset=windows-1250',
            url: instance + "webcomp/htmlrecordsetback.php",
            success: function (response) {
                if (response == '[]' && loading == 'true') {
                    loadingend = 'T'
                }
                loading = "false"
                callback(response)
            }
        })
    }
}

// PROVERAVA DA LI SU POPUNJENA SVA OBAVEZNA POLJA U FORMI I VRACA VREDNOSTI U FORMATU JSONA
function fetchdata(container) {
    container = container.split(',')
    var data = '{'
    var req = []
    container.forEach(function (element) {
        //skinuto je RTRIM sa svih vrednosti 14.5.2019
        $(element + ' .inputcombo,' + element + ' .inputnumeric,' + element + ' .inputtextarea,' + element + ' .inputdate,' + element + ' .inputnumberic,' + element + ' .inputsignature,' + element + ' .inputtext,' + element + ' .input,' + element + ' .inputcheckbox,' + element + ' .inputtags,' + element + ' .inputfile,' + element + ' .inputmulti,' + element + ' .tinyarea').each(function () {
            $(this).removeClass('required')
            $(this).parent('.poljeinp').find('.display_value').removeClass('required')
            $(this).parents('.dyninp').find('.display_value').removeClass('required')
            if (typeof $(this).attr('required') !== typeof undefined && $(this).attr('required') != '') {
                if ($(this).attr('tip') == 'file') {
                    if ($(this).siblings('.dyninputfield').val() == '') {
                        req.push($(this).attr('id'))
                    }
                } else if ($(this).attr('tip') == 'html') {
                    if (tinymce.get($(this).attr('id')).getContent() == '') {
                        req.push($(this).attr('id'))
                    }
                } else {
                    if ($(this).val() == '') {
                        req.push($(this).attr('id'))
                    }
                }
                // if($(this).val()==''){
                //     req.push($(this).attr('id'))
                // }
            }
            if ($(this).hasClass('inputdate')) {
                data += '"' + $(this).attr('therealid') + '":"' + $(this).siblings('.datdisfiled').val().trim() + '",'
            } else if ($(this).hasClass('inputsignature')) {
                idsignfield = $(this).attr('therealid')
                data += '"' + $(this).attr('therealid') + '":"' + $(this).val() + ';' + $('.inputsignature_potpis[therealid="' + idsignfield + '_potpis"]').val() + '",'
            } else if ($(this).hasClass('inputcheckbox')) {
                data += '"' + $(this).attr('therealid') + '":"' + ($(this).is(":checked") ? "T" : "F") + '",'
            } else if ($(this).hasClass('inputtags') || $(this).hasClass('inputmulti')) {
                if ($(this).attr('tip') == 'tag' || $(this).attr('tip') == 'unitag') {

                    data += '"' + $(this).attr('therealid') + '":"' + ($(this).val().replace(/,/g, '!@!')).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"').replace(/\+/g, '+').replace(/&/g, '&') + '",'
                } else {
                    data += '"' + $(this).attr('therealid') + '":"' + ($(this).val().replace(/,/g, '!splitter!')).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"').replace(/\+/g, '+').replace(/&/g, '&') + '",'
                }
            } else if ($(this).hasClass('inputfile')) {
                data += '"' + $(this).attr('therealid') + '":"' + $('#' + $(this).attr('id') + 'val').val() + '",'
            } else if ($(this).hasClass('tinyarea')) {
                var currentURL = window.location.href;
                if (currentURL.includes('app.php')) {
                    data += '"' + $(this).attr('therealid') + '":"' + tinymce.get($(this).attr('id')).getContent().replace(/,/g, '!@!').replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"').replace(/\+/g, '+').replace(/&/g, '&') + '",'
                } else {
                    data += '"' + $(this).attr('therealid') + '":"' + $(this).val().replace(/,/g, '!@!').replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"').replace(/\+/g, '+').replace(/&/g, '&') + '",'
                }

            } else if ($(this).hasClass('inputnumeric')) {
                if ($(this).attr('onfocus') == 'decvalue') {
                    data += '"' + $(this).attr('therealid') + '":"' + ($(this).val().replace(/,/g, "")).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"') + '",'
                } else {
                    data += '"' + $(this).attr('therealid') + '":"' + ($(this).val()).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"') + '",'
                }
            } else {
                data += '"' + $(this).attr('therealid') + '":"' + ($(this).val()).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"').replace(/\+/g, '+').replace(/&/g, '&') + '",'
            }

        })

    })
    if (req.length != 0) {
        for (i = 0; i < req.length; i++) {
            req[i]
            //djiki 
            if ($('' + container + ' ' + '#' + req[i] + '').attr('display')) {
                $('' + container + ' ' + '#' + req[i] + '').parents('.poljeinp').find('.display_value').addClass('required')
                $('' + container + ' ' + '#' + req[i] + '').parents('.dyninp').find('.display_value').addClass('required')

            }
            $('' + container + ' ' + '#' + req[i] + '').addClass('required')
            if ($('' + container + ' ' + '#' + req[i] + '').hasClass('inputfile')) {
                $('' + container + ' ' + '#' + req[i] + '').siblings('label.filelabel').find('.filechoser').addClass('required')
            }

            // $('.reportslist').append('<div id="'+res1[5]+''+res1[0]+'" file="'+res1[2]+'" param="'+res1[3]+'" path="'+res1[4]+'" from="'+res1[5]+'" onclick="checkreport('+res1[5]+''+res1[0]+');showreportlist()">'+res1[1]+'</div>')
        }
    } else {
        if (data != '{') {
            data = data.substring(0, data.length - 1)
        }
        data += '}'
        data = JSON.parse(data)
        return data

    }
}

function fetchdataformular(container) {
    container = container.split(',')
    var data = '{'
    var req = []
    container.forEach(function (element) {
        //skinuto je RTRIM sa svih vrednosti 14.5.2019
        $(element + ' .inputcombo,' + element + ' .inputnumeric,' + element + ' .inputtextarea,' + element + ' .inputdate,' + element + ' .inputnumberic,' + element + ' .inputtext,' + element + ' .input,' + element + ' .inputcheckbox,' + element + ' .inputtags,' + element + ' .inputfile,' + element + ' .inputmulti,' + element + ' .tinyarea').each(function () {
            $(this).removeClass('required')
            $(this).parent('.poljeinp').find('.display_value').removeClass('required')
            $(this).parents('.dyninp').find('.display_value').removeClass('required')
            if (typeof $(this).attr('required') !== typeof undefined && $(this).attr('required') != '') {
                if ($(this).val() == '') {
                    req.push($(this).attr('id'))
                }
            }
            if ($(this).hasClass('inputdate')) {
                data += '"' + $(this).attr('therealid') + '":"' + $(this).siblings('.datdisfiled').val() + '",'
            } else if ($(this).hasClass('inputcheckbox')) {
                data += '"' + $(this).attr('therealid') + '":"' + ($(this).is(":checked") ? "T" : "F") + '",'
            } else if ($(this).hasClass('inputtags') || $(this).hasClass('inputmulti')) {
                if ($(this).attr('tip') == 'tag' || $(this).attr('tip') == 'unitag') {
                    data += '"' + $(this).attr('therealid') + '":"' + ($(this).val().replace(/,/g, '!@!')).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"').replace(/\+/g, '+').replace(/&/g, '&') + '",'
                } else {
                    data += '"' + $(this).attr('therealid') + '":"' + ($(this).val().replace(/,/g, '!splitter!')).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"').replace(/\+/g, '+').replace(/&/g, '&') + '",'
                }
            } else if ($(this).hasClass('inputfile')) {
                data += '"' + $(this).attr('therealid') + '":"' + $('#' + $(this).attr('id') + 'val').val() + '",'
            } else if ($(this).hasClass('tinyarea')) {
                data += '"' + $(this).attr('therealid') + '":"' + tinymce.get($(this).attr('id')).getContent().replace(/,/g, '!@!').replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"').replace(/\+/g, '+').replace(/&/g, '&') + '",'
            } else if ($(this).hasClass('inputnumeric')) {
                if ($(this).attr('onfocus') == 'decvalue') {
                    data += '"' + $(this).attr('therealid') + '":"' + ($(this).val().replace(/,/g, "")).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"') + '",'
                } else {
                    data += '"' + $(this).attr('therealid') + '":"' + ($(this).val()).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"') + '",'
                }
            } else {
                data += '"' + $(this).attr('therealid') + '":"' + ($(this).val()).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/\"/g, '\\"').replace(/\+/g, '+').replace(/&/g, '&') + '",'
            }

        })

    })
    if (req.length != 0) {
        for (i = 0; i < req.length; i++) {
            req[i]
            if ($('' + container + ' ' + '#' + req[i] + '').attr('display')) {
                $('' + container + ' ' + '#' + req[i] + '').parents('.poljeinp').find('.display_value').addClass('required')
                $('' + container + ' ' + '#' + req[i] + '').parents('.dyninp').find('.display_value').addClass('required')

            }
            $('' + container + ' ' + '#' + req[i] + '').addClass('required')


        }
    } else {
        if (data != '{') {
            data = data.substring(0, data.length - 1)
        }
        data += '}'
        data = JSON.parse(data)
        return data

    }
}

function fillform(container, json) {

    for (var i in json) {
        for (var n in json[i]) {

            if ($(container + ' input[therealid="' + n + '"]').attr('type') !== 'file') {
                $(container + ' input[therealid="' + n + '"]').val(json[i][n])
            }
            if ($(container + ' input[therealid="' + n + '"]').hasClass('inputcombo')) {
                if ($(container + ' input[therealid="' + n + '"]').attr('tip') == 'multiselect' && $(container + ' input[therealid="' + n + '"]').hasClass('inputtags')) {

                    vrednost = json[i][n].replace(/!splitter!/g, ',').replace('/', '')
                    niztag = vrednost.split(',')
                    $(container + ' input[therealid="' + n + '"]').val(niztag)
                    if (vrednost != '') {
                        var multiid = $(container + ' input[therealid="' + n + '"]').attr('id')
                        $(container + ' input[therealid="' + n + '"]').siblings('.tagsfillin').html('')
                        for (var t in niztag) {

                            $(container + ' .tagsfillin[for="' + multiid + '"]').append('<div class="filter"><div class="filtersearchvals"><div class="filtervalue">' + niztag[t] + '</div></div><div class="closeilter"><i class="icon-cancel" onclick="removeTagDyn(this)"></i></div></div>')
                        }
                    }

                } else if ($(container + ' input[therealid="' + n + '"]').attr('tip') == 'unitag') {
                    niz = json[i][n].split('!@!')
                    var fieldid = $(container + ' input[therealid="' + n + '"]').attr('id')
                    $(container + ' input[therealid="' + n + '"]').val(niz)
                    if (niz != '') {
                        $(container + ' .tagsfillin[for="' + fieldid + '"]').html('')
                        for (var t in niz) {
                            $(container + ' .tagsfillin[for="' + fieldid + '"]').append('<div class="filter"><div class="filtersearchvals"><div class="filtervalue">' + niz[t] + '</div></div><div class="closeilter"><i class="icon-cancel" onclick="removeTagDyn(this)"></i></div></div>')
                        }
                    }
                } else {
                    if ($(container + ' input[therealid="' + n + '"]').attr('display')) {
                        niz = json[i][n].split('!@!')
                        $(container + ' input[therealid="' + n + '"]').val(niz[0])
                        $(container + ' input[therealid="' + n + '"]').siblings('.display_value').html(niz[1])
                    }
                }
            }
            if ($(container + ' input[therealid="' + n + '"]').hasClass('inputdate')) {
                if (json[i][n] != '') {
                    if (moment(json[i][n], 'DD.MM.YYYY').format("YYYY-MM-DD") == 'Invalid date') {
                        $(container + ' input[therealid="' + n + '"]').siblings('.datdisfiled').val(json[i][n])
                    } else {


                        $(container + ' input[therealid="' + n + '"]').siblings('.datdisfiled').val(moment(json[i][n], 'DD.MM.YYYY').format("YYYY-MM-DD"))
                    }

                } else {
                    $(container + ' input[therealid="' + n + '"]').siblings('.datdisfiled').val('')
                }


            }
            if ($(container + ' input[therealid="' + n + '"]').hasClass('inputcheckbox')) {
                if (json[i][n] == 'T') {
                    $(container + ' input[therealid="' + n + '"]').prop('checked', true)
                } else {
                    $(container + ' input[therealid="' + n + '"]').prop('checked', false)
                }
            }
            if ($(container + ' textarea[therealid="' + n + '"]').hasClass('inputtextarea')) {
                $(container + ' textarea[therealid="' + n + '"]').val(json[i][n])
            }
            if ($(container + ' textarea[therealid="' + n + '"]').hasClass('tinyarea')) {

                if ($(container + ' textarea[therealid="' + n + '"]').attr('initialized') == 'T') {
                    tinymce.get($(container + ' textarea[therealid="' + n + '"]').attr('id')).setContent(json[i][n].replace(/!@!/g, ','))
                } else {
                    $(container + ' textarea[therealid="' + n + '"]').val(json[i][n].replace(/!@!/g, ','))
                }
            }
        }
    }
}

// PUBLISH DATA NEW
function publishDatanew(postid, members) {
    if (members === undefined) {
        return false
    }
    to = members.split(',')
    for (var i = 0; i < to.length; i++) {
        if (to[i] != userid) {
            console.log(to[i])
            tochannel = '/posts/' + websyncinstance + '_C' + to[i]
            chatid = websyncinstance + '_C' + userid
            //console.log('za kanal')
            //console.log(tochannel)
            client.publish({
                channel: tochannel,
                data: {
                    text: postid,
                    chatname: 'ntf',
                    to: to[i],
                    chatid: chatid
                },
                onSuccess: function (args) { // optional
                    console.log('Websync: "Published."')
                    var txt = args.data.text
                    var chatname = args.data.chatname
                },
                onFailure: function (args) { // optional
                    console.log('Publish failed: ' + args.error);
                }
            });
        }
    }
}

// PRAZNI FORMU
function formcleanup(element) {
    $(element + ' .inputcombo,' + element + ' .inputnumeric,' + element + ' .inputdate, ' + element + ' .inputnumberic,' + element + ' .inputtextarea,' + element + ' .inputtext,' + element + ' .input,' + element + ' .inputcheckbox,' + element + ' .inputtags,' + element + ' .inputfile,' + element + ' .tinyarea,' + element + ' input[empty="T"],' + element + ' .inputmulti').each(function () {
        if ($(this).hasClass('inputcombo')) {
            if ($(this).attr('tip') == 'unitag' || $(this).attr('tip') == 'tag' || $(this).attr('tip') == 'multicheck' || $(this).attr('tip') == 'multiselect') {

                $(this).siblings('.tagsfillin').html('')
            }
            if ($(this).attr('tip') == 'multiselect') {


                var multid = $(this).attr('id')
                $(this).parents('.wraptag').find('.tagsfillin[for="' + multid + '"]').html('')
            }
            if ($(this).attr('display') !== undefined) {
                $(this).attr('display', ' ')
            }
            $(this).siblings('.display_value').html('')
        } else if ($(this).hasClass('inputdate')) {
            $(this).siblings('#' + $(this).attr('id') + 'display').val('')
        } else if ($(this).hasClass('inputcheckbox')) {
            $(this).prop('checked', false)
        } else if ($(this).hasClass('inputtags')) {
            var tags
            tags = $(this).val()
            tags = tags.split(',')
            for (var i in tags) {
                $(this).removeTag(tags[i])
            }

        } else if ($(this).hasClass('inputmulti')) {
            $(this).parents('.multicheck').find('.chkbox').each(function () {
                $(this).prop('checked', false)
            })
        } else if ($(this).hasClass('tinyarea')) {
            var currentURL = window.location.href;
            if (currentURL.includes('app.php')) {
                tinymce.get($(this).attr('id')).setContent('')
            } else {

            }
        }

        $(this).val('')
    })

}


// KREIRA HTML ZA BASKET    VIDIOVO
// function initBasketDropdown() {
//     var basket = getBasketItems();
//     var basket_html = '';
//     if (basket.length > 0) {
//         basket.forEach(item => {
//             basket_html += `
//             <div id="${item.ident1}" ident ="${item.ident}" class="single-cart clearfix">
//                 <div class="cart-img">
//                     <a href="#">
//                         <img src="${item.slika.indexOf('thumb') ? item.slika :item.slika.replace(/artikli/g,'artikli/thumb')}">
//                     </a>
//                     <div class="del-icon">
//                         <a href="#">
//                             <i class="fa fa-times" onclick="removeBasketItem(userid, '${item.ident}', true)"></i>
//                         </a>
//                     </div>
//                 </div>
//                 <div class="cart-info">
//                     <h6 class="text-capitalize">
//                         <a href="#">${item.naziv}</a>
//                     </h6>
//                     <p>
//                         <span>KOLIČINA:</span>${item.kolicina}
//                     </p>
//                     <p>
//                         <span>ZA PLAĆANJE:</span><span class="cartvred money" cena="${item.cena}">${item.cena}</span>
//                     </p>
//                     <p>
//                         <span>RABAT:</span><span class="cartvred" rabat="${item.rabat}">${item.rabat}</span>
//                     </p>
//                 </div>
//             </div>`;
//         });
//         $('.cart-pro-val, .cart-pro-checkout').removeClass('hidden')
//         $('.total-cart-pro').html(basket_html);
//         $('.single-cart img').each(function () {
//             if ($(this).attr('src').search('#') != '-1') {
//                 $(this).attr('src', 'https://b2b.valhall-group.com/Assets/images/image-coming-soon.jpeg')
//             }
//         })
//     }
//     var basket_value = getBasketValue();
//     var basket_item_num = basket.length;

//     $('.cart-price').html(basket_value);
//     $('.cart-price').addClass('money');
//     formatmoneyvalues('.total-cart-in', 'T');
//     $('.cart-no').html(basket_item_num);
//     if ($('.cart-no').text() == '0') {
//         $('.cart-no').text('')
//     }
//     itemsInBasket()
// }

// VRACA JSON SA BASKET ITEMIMA
function getBasketItems() {
    var basket = (localStorage.getItem('basket') == null ? '[]' : localStorage.getItem('basket'));
    return JSON.parse(basket);
}

//VRACA SUMU VREDNOSTI ITEMA U BASKETU
function getBasketValue() {
    var basket = getBasketItems();
    var basketsum = 0;
    basket.forEach(item => {
        basketsum += item.kolicina * (item.cena * (1 - item.rabat / 100));
    });
    return basketsum;
}

//ITEMI U BASKETU
function itemsInBasket() {
    var basket = getBasketItems();
    $('.singlecart-no').html('').addClass('hidden')
    basket.forEach(item => {
        $('.singlecart-no[ident="' + item.ident + '"]').html(item.kolicina).removeClass('hidden')
        $('.singlecart-no[ident="' + item.ident + '"]').siblings('.detailbasket').find('.kolicinaval').val(parseInt(item.kolicina))
    })
}

// DODAJE ITEM U KORPU
function addBasketItem(elem, userid, usergroup, ident, kolicina, naziv, cena, slika, rabat, zaliha, insert_to_db, serialno) {
    return new Promise((resolve, reject) => {
        if((getLocalStorage('samoUlogKorDodUKorp') == 'T' && userid !== '-1') || getLocalStorage('samoUlogKorDodUKorp') !== 'T'){
            if (typeof serialno != typeof undefined) {
                serialno = serialno
            } else {
                serialno = ''
            }
            
            loadcontent('addBasket', { template: wrapper_template, ajax: 'T', jsont: 'T', notpublished: 'T', ident: ident, kol: kolicina, userid: userid, usergroup: usergroup, serialno: serialno }, function callback(response) {
                if (pageid !== checkoutpage) {
                    reload_basket_items();
                }
                afterAddBasket(elem)
                resolve();
            });
            
            // console.log(kolicina <= zaliha, dodajUKrpuBezZaliha == 'Dozvoli')
            // if (kolicina <= zaliha || dodajUKrpuBezZaliha !== 'Ne dozvoli') {
            // } else {
            //     $('.wrapper_confirm_modal_text_placeholder').text('Nedovoljna količina na stanju')
            //     $('.wrapper_confirm_modal_holder').addClass('wrapper_confirm_modal_holder_ok').show()
            //     reject('Out of stock');
            // }
        } else {
            reject('not logged-in user');
            window.location = 'index.php?pageid=' + loginpage_pageid
        }
    });
}

// funckija koja otvara modal i binduje funckiju deleteitemConfirm() za brisanje itema iz korpe na klik dugmeta da
function deleteitem(elem, userid, ident, insert_to_db, serialno) {
    $('.wrapper_confirm_modal_text_placeholder').text(potvrdibrisanjetext)
    $('.wrapper_confirm_modal_wrap').attr('userid', userid).attr('ident', ident).attr('insert_to_db', insert_to_db).attr('serialno', serialno)
    $('.wrapper_confirm_modal_holder').show()

    $('.wrapper_confirm_modal_butt_da').on('click', function(){
        deleteitemConfirm(userid, ident, insert_to_db, serialno)
    })
    $('.wrapper_confirm_modal_butt_ne').on('click', deleteitemDisprove)

    $('.wrapper_confirm_modal_overlay').focus()
}

// funckija koja brise item iz korpe
function deleteitemConfirm(userid, ident, insert_to_db, serialno) {
    var useridR = userid
    var identR = ident
    var insert_to_dbR = insert_to_db
    var serialnoR = serialno
    if (insert_to_dbR) {
        loadcontent('deletelogg', {
            template: wrapper_template,
            ajax: 'T',
            jsont: 'T',
            notpublished: 'T',
            userid: useridR,
            ident: identR,
            serialno: serialnoR
        }, function callback(response) {
            reload_basket_items()
        })
    }
    
    $('.wrapper_confirm_modal_holder').hide()
    $('.wrapper_confirm_modal_butt_da').off('click')
    $('.wrapper_confirm_modal_butt_ne').off('click', deleteitemDisprove)
}

// UKLANJA ITEM IZ TEMPLEJTA KORPE
function removeBasketItem(userid, ident, insert_to_db, serialno) {
    return new Promise((resolve, reject) => {
        if (insert_to_db) {
            loadcontent('deletelogg', {
                template: wrapper_template,
                ajax: 'T',
                jsont: 'T',
                ident: ident,
                userid: userid,
                serialno: serialno !== 'undefined' ? serialno : ''
            }, function callback(response) {
                resolve();
            });
        }
    })
}

// SELID
function selid(elem, val, id, naziv, kol, bol) {
    if (typeof kol === 'function') {
        kol(elem)
    } else {

    }

    if ($(elem).parents('.gridrow').length) {


        if (naziv == '') {

        } else {
            $(elem).parents('.gridrow').find('#' + id).siblings('.display_value').html(naziv)
            $(elem).parents('.gridrow').find('#' + id).siblings('.display_value').addClass('lupa-nad-lupamaD')
        }
        var oldval = $(elem).parents('.gridrow').find('#' + id).val()
        $(elem).parents('.gridrow').find('#' + id).val(val)
        var newval = $(elem).parents('.gridrow').find('#' + id).val()
        if (newval != oldval) {

            $('#' + id).trigger('change')


            dirtyform = $(elem).parents('.gridrow').attr('id')
            dirtyformelem = $('#' + id)

            if ($(window).width() > 768) {
                $('.header-buttons .save').removeClass('hidden') //snimi batn web
            }
            $(dirtyform).addClass('dirty')
        }

    } else if ($(elem).parents('.poljeinp').length) {

        if (naziv == '') {
            if ($("#" + id).attr("display")) {
                $("#" + id).attr("display", naziv)
                $(elem).parents('.poljeinp').find('#' + id).siblings('.display_value').addClass('lupa-nad-lupamaD')
            }
            $(elem).parents('.poljeinp').find('#' + id).siblings('.display_value').html(naziv)
        } else {

            if ($("#" + id).attr("display")) {
                $("#" + id).attr("display", naziv)
                $(elem).parents('.poljeinp').find('#' + id).siblings('.display_value').addClass('lupa-nad-lupamaD')
            }

            $(elem).parents('.poljeinp').find('#' + id).siblings('.display_value').html(naziv)
        }

        var oldval = $('#' + id).val()

        $('#' + id).val(val)
        var newval = $('#' + id).val()
        if (newval != oldval) {

            $('#' + id).trigger('change')

        }
        $(elem).parents('.poljeinp').next('.poljeinp').find('input').first().focus()
    } else {

        if (naziv == '') {
            if ($("#" + id).attr("display")) {
                $("#" + id).attr("display", naziv)
                $(elem).parents('.dyninp').find('#' + id).siblings('.display_value').addClass('lupa-nad-lupamaD')
            }
            $(elem).parents('.dyninp').find('#' + id).siblings('.display_value').html(naziv)
        } else {

            if ($("#" + id).attr("display")) {
                $("#" + id).attr("display", naziv)
                $(elem).parents('.dyninp').find('#' + id).siblings('.display_value').addClass('lupa-nad-lupamaD')
            }
            var combobuildcont = ($(elem).parents('#frontdyn').find('.frontdyn_container').val() == undefined ? '.newcasedyn' : $(elem).parents('#frontdyn').find('.frontdyn_container').val())
            $(elem).parents('.dyninp').find('#' + id).siblings('.display_value').html(naziv)

            $(combobuildcont + ' #' + id).unbind()
            $(combobuildcont + ' #' + id).attr('initialized', '')
            $(combobuildcont + ' #' + id).removeClass('lupa-nad-lupama')
            $(combobuildcont + ' #' + id).siblings('.display_value').remove()
            $(combobuildcont + ' #' + id).siblings('.ajaxcombor').remove()
            combobuild(combobuildcont)
        }

        var oldval = $('#' + id).val()

        $('#' + id).val(val)
        var newval = $('#' + id).val()
        if (newval != oldval) {

            $('#' + id).trigger('change')

        }

        $(elem).parents('.dyninp').next('.dyninp').find('input').first().focus()
    }


    $(elem).parents('.ajaxcombor').toggleClass('hidden')

    if (typeof bol === 'function') {
        bol(elem)
    }
    $('body').removeClass('overflowhidden')
}

// INICIJALIZUJE I GRADI AJAXKOMBO
var ajaxcombor_svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" x="0" y="0" viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>'

function combobuild(elem) {
    // console.log('elem', elem)
    $(elem + ' .inputtext').each(function () {
        if ($(this).attr('initialized') != 'T') {
            if ($(this).attr("display")) {
                textid = $(this).attr('id')
                textval = $(this).val().replace(/"/g, '"')
                $(this).attr('initialized', 'T')
                $(this).parent().append('<input id="' + textid + 'value" class="inputtexthidden" type="text" value="' + textval + '"></input>')
            }
            $(this).bind("click", function (event) {
                if (typeof $(this).attr('customchange') !== typeof undefined && $(this).attr('customchange') != '' && $(this).attr('customchangechecked') != 'T') {
                    var functioncall = $(this).attr('customchange') + '(this)'
                    eval(functioncall)
                    return false
                } else {
                    $(this).attr('customchangechecked', '')
                }

            })
        }
        $(this).attr('initialized', 'T')
    })
    $(elem + ' .inputnumeric').each(function () {
        if ($(this).attr('initialized') != 'T') {
            $(this).bind("keydown", function (e) {
                var key = (e.keyCode ? e.keyCode : e.which)
                if (key == 9) {
                    closedrop()
                } else if (key == 13) {
                    $(this).parents('.poljeinp').next('.poljeinp').find('input').first().focus()
                } else {
                    if (typeof $(this).attr('customchange') !== typeof undefined && $(this).attr('customchange') !== '' && $(this).attr('customchangechecked') !== 'T') {
                        timer = setTimeout(function () {
                            $(this).trigger('click')
                        }, 500)
                    }

                }
            })
            $(this).bind("click", function (event) {
                if (typeof $(this).attr('customchange') !== typeof undefined && $(this).attr('customchange') !== '' && $(this).attr('customchangechecked') !== 'T') {

                    if ($(this).parents('.fieldswrap').hasClass('gridrow')) {
                        var functioncall = $(this).attr('customchange') + '("change")'
                    } else {
                        var functioncall = $(this).attr('customchange') + '(this)'
                    }
                    eval(functioncall)
                    return false
                } else {
                    $(this).attr('customchangechecked', '')
                }
                $(this).attr('onkeypress', 'return (event.charCode == 13 || (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 || event.charCode == 45)');
            })
            $(this).attr('initialized', 'T')
        }
    })
    $(elem + ' .inputsignature').each(function () {
        if ($(this).attr('initialized') != 'T') {
            idsign = $(this).attr('therealid')
            eval('canvas' + idsign + '=$(\'#' + idsign + '_canvas\')[0]')
            eval('canvas' + idsign + '.width=350')
            eval('canvas' + idsign + '.height=150')
            eval('signaturePad_' + idsign + ' = new SignaturePad(canvas' + idsign + ')');
            $(this).attr('initialized', 'T')
        }
    })
    $(elem + ' .inputcombo').each(function () {
        sol = ''
        pol = ''
        mol = ''
        fol = ''
        rol = ''
        kol = ''

        if ($(this).attr('initialized') != 'T') {
            $(this)
            var par
            if ($(this).hasClass('dfield')) {
                par = $(this).closest('.dyninp')
            } else if ($(this).hasClass('fakedfield')) {
                par = $(this).closest('.dyninp')
            } else {
                par = $(this).closest('.poljeinp')
            }
            if (!$(this).hasClass('lupa-nad-lupama')) {

                if ($(this).attr('onselect')) {
                    sol = $(this).attr('onselect')
                }
                if ($(this).attr('conditionfield')) {
                    pol = $(this).attr('conditionfield')
                    fol = $(this).attr('confunction')
                }
                if ($(this).attr('onclose')) {
                    mol = $(this).attr('onclose') + '()'
                }
                if (!$(this).attr('required')) {

                }

                if ($(this).attr('beforequery')) {
                    kol = $(this).attr('beforequery')
                }

                if ($(this).attr('additional')) {
                    // console.log('additional')
                    rol = $(this).attr('therealid')
                    $(this).parent().append('<div class="display_value" empty="" conditionfield="' + pol + '" confunction="' + fol + '" onclick=""></div><div class="ajaxcombor hidden"> <button class="identfilter" onclick="choosefiltervalues(this,\'' + rol + '\')"><i class="icon-search"></i><div class="filtname">Filteri</div><i onclick="" class="icon-angle-down"></i></button>  <div class="alldocfiltervalues hidden"></div> <input class="searchfield"  data-role="none" type="text" ftype="search" onkeyup="giveidents(this,\'' + this.id + '\',event,\'' + sol + '\',\'' + kol + '\')"><i onclick=" event.stopPropagation();' + mol + ';closedrop()" class="form-icon icon-cancel"></i><div class="res"></div></div>')
                } else {
                    // console.log('non-additional')
                    $(this).parent().append('<div class="display_value" empty="" conditionfield="' + pol + '" confunction="' + fol + '" onclick=""></div><div class="ajaxcombor hidden"><input class="searchfield"  data-role="none" type="text" ftype="search" onkeyup="giveidents(this,\'' + this.id + '\',event,\'' + sol + '\',\'' + kol + '\')"><div class="searchfield_svg_holder">' + ajaxcombor_svg + '</div><i onclick=" event.stopPropagation();' + mol + ';closedrop()" class="form-icon icon-cancel"></i><div class="res"></div></div>')
                    if (!$(this).parent('.ajaxcombor_wrap').length) {
                        $(this).add($(this).siblings('.ajaxcombor')).add($(this).siblings('.display_value')).wrapAll('<div class="ajaxcombor_wrap"></div>')
                        $(this).parent('.ajaxcombor_wrap').append('<div class="ajaxcombor_svg_holder">' + ajaxcombor_svg + '</div>')
                    }
                }


                if ($(this).attr("display")) {
                    var inicd = $(this).attr('display')
                    par.find('.display_value').html(inicd)
                    par.find('.display_value').addClass('lupa-nad-lupamaD')
                    par.find('.display_value.lupa-nad-lupamaD').bind('click', function (event) {

                        if (typeof $(this).attr('customchange') !== typeof undefined && $(this).attr('customchange') != '' && $(this).attr('customchangechecked') != 'T') {

                            var functioncall = $(this).attr('customchange') + '(this)'
                            eval(functioncall)
                            return false
                        }
                        opendropdown(this)
                        $(this).attr('customchangechecked', '')
                    });

                } else {
                    par.find('.display_value').removeClass('lupa-nad-lupamaD')
                    $(this).css('display', 'inline-block')
                }
                if ($(this).attr('tip') == 'multicheck' || $(this).attr('tip') == 'tag' || $(this).attr('tip') == 'unitag' || $(this).attr('tip') == 'multiselect') {
                    console.log('multicheck')
                    par.children(':not(:first-child)').wrapAll('<div class="wraptag"></div>')
                    par.find('.wraptag .inputcombo, .wraptag .display_value, .wraptag .ajaxcombor').wrapAll('<div class="inputdisplaywrap" ></div>')

                }

                $(this).addClass('lupa-nad-lupama')

                $(this).bind("click", function (event) {
                    if (typeof $(this).attr('customchange') !== typeof undefined && $(this).attr('customchange') != '' && $(this).attr('customchangechecked') != 'T') {
                        var functioncall = $(this).attr('customchange') + '(this)'
                        eval(functioncall)
                        return false
                    }
                    opendropdown(this)
                    $(this).attr('customchangechecked', '')
                });

                $(this).bind("keydown", function (e) {
                    var key = (e.keyCode ? e.keyCode : e.which)

                    if (key == 9) {
                        closedrop()

                    } else if (key == 13) {
                        $(this).parents('.poljeinp').next('.poljeinp').find('input').first().focus()
                    } else if (key !== 40 && key !== 38) {} else {}

                })


                $(this).attr('initialized', 'T')
            }
        }
    })
    $(elem + ' .inputtime').each(function () {
        if ($(this).attr('initialized') != 'T') {
            $(this).clockpicker({
                autoclose: true
            });

            $(this).attr('readonly', 'readonly')
            $(this).attr('initialized', 'T')
        }
    })
    $(elem + ' .inputtags').each(function () {
        if ($(this).attr('initialized') != 'T') {
            var idtag = $(this).attr('therealid')
            if ($(this).hasClass('dfield')) {
                var casetypefield = $(this).attr('casetype')
                if ($(this).attr('tip') == 'tag') {
                    $(this).tagsInput({
                        'autocomplete_url': instance + '/common/combotags.php?oddelek=' + casetypefield + '&fieldid=' + idtag + '&tip=tag',
                        'autocomplete': {},
                        'height': '100px',
                        'width': '100%',
                        'interactive': true,
                        'defaultText': 'add a tag',
                        'delimiter': ',', // Or a string with a single delimiter. Ex: ';'
                        'removeWithBackspace': true,
                        'minChars': 0,
                        'placeholderColor': '#666666'
                    });
                } else if ($(this).attr('tip') == 'multicheck') {
                    $(this).tagsInput({
                        'autocomplete_url': instance + '/common/combotags.php?oddelek=' + casetypefield + '&fieldid=' + idtag + '&tip=multicheck',
                        'autocomplete': {},
                        'height': '100px',
                        'width': '100%',
                        'interactive': true,
                        'defaultText': 'add a tag',
                        'delimiter': ',', // Or a string with a single delimiter. Ex: ';'
                        'removeWithBackspace': true,
                        'minChars': 0,
                        'placeholderColor': '#666666'
                    });
                }
            } else {
                $(this).tagsInput({
                    'autocomplete_url': instance + '/webcomp/htmlrecordsetback.asp?template=' + templatename + '&component=' + idtag + '&jsont=T&ajax=T',
                    'autocomplete': {},
                    'height': '100px',
                    'width': '100%',
                    'interactive': true,
                    'defaultText': 'add a tag',
                    'delimiter': ',', // Or a string with a single delimiter. Ex: ';'
                    'removeWithBackspace': true,
                    'minChars': 0,
                    'placeholderColor': '#666666'
                });
            }
            $(this).attr('initialized', 'T')
        }
    })
    $(elem + ' .inputfile').each(function () {
        if ($(this).attr('initialized') != 'T') {
            if (!$(this).hasClass('dfield')) {
                ident = $(this).attr('id')
                if ($('#' + ident + 'val').val() !== '') {
                    filename = $('#' + ident + 'val').val()
                    filenameext = filename.substr(filename.lastIndexOf('.') + 1)
                    if (filenameext.toLowerCase() == 'jpg' || filenameext.toLowerCase() == 'jpeg' || filenameext.toLowerCase() == 'gif' || filenameext.toLowerCase() == 'jpg' || filenameext.toLowerCase() == 'png' || filenameext.toLowerCase() == 'bmp') {
                        $('#' + ident).siblings('.filelabel').append('<a><span class="openbut" index="' + imgno + '" onclick="event.preventDefault();event.stopPropagation();openPhotoSwipe(this);">Otvori</span></a>')
                        imgno++
                        $('#' + ident).parents('.poljeinp').append('<div class="hidden attgal" ><img titleimg="' + instance + 'docs/' + filename + '" tip="notdoc" fileid="" src="' + instance + 'docs/' + filename + '"></div>')
                    } else {
                        $('#' + ident).parents('.poljeinp').append('<a class="download" target="_blank" href="' + instance + '/docs/' + filename + '" download="' + filename + '"><span class="openbut" onclick="event.stopPropagation()">Otvori</span></a>')
                    }
                    $(this).attr('initialized', 'T')
                }

            }
        }

    })
    $(elem + ' .tinyarea').each(function () {

        var currentURL = window.location.href;
        if (currentURL.includes('app.php')) {
            console.log('URL contains app.php');
            if ($(this).attr('oninit')) {
                tinifinish = $(this).attr('oninit')
            }
            var idtiny = $(this).attr('id')
            if ($(this).attr('initialized') != 'T') {
                tinymce.remove('#' + idtiny)
                tinymce.init({
                    selector: '#' + idtiny,
                    menubar: '',
                    branding: false,
                    plugins: [
                        'jbimages autolink lists link image charmap print preview hr anchor pagebreak',
                        'searchreplace wordcount visualblocks visualchars code fullscreen',
                        'insertdatetime media nonbreaking save table contextmenu directionality',
                        'emoticons template paste textcolor colorpicker textpattern  code'
                    ],
                    toolbar: ' styleselect | bold italic | alignleft aligncenter alignjustify | bullist numlist outdent indent | link | jbimages | media | code | fullscreen',
                    file_browser_callback: RoxyFileBrowser,
                    image_advtab: true,
                    entities: "38,amp,34,quot,162,cent,8364,euro,163,pound,165,yen,169,copy,174,reg,8482,trade",
                    relative_urls: false,
                    allow_script_urls: true,
                    verify_html: false,
                    statusbar: false,
                    remove_script_host: true,
                    toolbar_items_size: 'small',
                    convert_urls: false,
                    menubar: false,
                    setup: function (ed) {
                        ed.hashtags = []
                        ed.hashing = 0
                        ed.on('FullscreenStateChanged', function (e) {
                            if (typeof tinyFullscreen == 'function') {
                                tinyFullscreen(e.target.id, e.state)
                            }
                        });

                        if ($('#' + idtiny).attr('fullscreen') == 'T') {
                            ed.on('Init', function () {
                                this.execCommand("mceFullScreen");
                            });
                        }
                    }

                });
                $(this).attr('initialized', 'T')
                if ($(this).hasClass('noneditable')) {
                    tinymce.get(idtiny).getBody().setAttribute('contenteditable', false);
                }
            }
        } else {
            console.log('URL does not contain app.php');
        }


    })
    $('.dyninp').each(function () {
        $(this).attr('class')
        var arrayd = $(this).attr('class')
        var adyn = arrayd.indexOf("col-");
        if (adyn != -1) {
            $(this).addClass('bootslapcombor')
        }
        inputwidthstart = $(this).find('.inputcombo')
        elemswraptagstart = $(this).find('.wraptag')
        elemstagfillinstart = $(this).find('.tagsfillin')
        filtercountstart = $(this).find('.filter')

        if ($(filtercountstart).length >= 2) {
            $(elemstagfillinstart).addClass('tagsfillininlineblock')
            $(elemswraptagstart).addClass('flexcolumnwraptag')
        } else {

        }
    })
    $('.poljeinp').each(function () {
        $(this).attr('class')
        var arrayp = $(this).attr('class')
        var apolje = arrayp.indexOf("col-");
        if (apolje != -1) {
            $(this).addClass('bootslapcombor')
        }
        inputwidthstart = $(this).find('.inputcombo')
        elemswraptagstart = $(this).find('.wraptag')
        elemstagfillinstart = $(this).find('.tagsfillin')
        filtercountstart = $(this).find('.filter')

        if ($(filtercountstart).length >= 2) {
            $(elemstagfillinstart).addClass('tagsfillininlineblock')
            $(elemswraptagstart).addClass('flexcolumnwraptag')
        } else {

        }
    })
}

// DODAJE EVENT NA KEYDOWN ENTER
function setkeydownstd(elem) {
    $(elem + ' .inputtext,' + elem + ' .inputnumeric,' + elem + ' .inputcombo').keydown(function (e) {
        var key = (e.keyCode ? e.keyCode : e.which)

        if (key == 9) {
            closedrop()

        } else if (key == 13) {
            $(this).parents('.poljeinp').next('.poljeinp').find('input').first().focus()
        } else if (key !== 40 && key !== 38) {
            $(this).click()
        } else {

        }

    })
}

// INICIJALIZUJE DUGOVANJA
function initdebt(divdept) {
    if (getCookie('userid') == '-1') {
        return false
    } else {
        $(divdept).html(getCookie2('dugovanje'))
        if (getCookie2('dugovanje') != '') {
            $(divdept).addClass('money')
            formatmoneyvalues('.finance')
        }
    }
}

// PROVERAVA DA LI JE USER ULOGOVAN
function checkLogged() {
    if (getCookie('userid') == '-1' || getCookie('userid') == null || getCookie('userid') == '') {
        $('#logoff-btn').addClass('hidden')
        $('#finance-btn').addClass('hidden')
        $('.dugovanje-mob-btn').addClass('hidden')
        $('#login-btn').removeClass('hidden')
        // $('#header .jfl').addClass('hidden')
        $('#footer .jfl').addClass('hidden')
        $('.notifikacije').addClass('hidden')
        $('.backoffice').addClass('hidden')
    } else {

        if (getCookie('usertype') == 'U') {
            if ($(window).width() > 991) {
                $('.backoffice').removeClass('hidden')
            }

        }

        $('#header .jfl').removeClass('hidden')
        $('#footer .jfl').removeClass('hidden')
        $('#login-btn').addClass('hidden')
        $('.notifikacije').removeClass('hidden')
        $('#logoff-btn').removeClass('hidden')
        $('#finance-btn').removeClass('hidden')
    }
}

// LOGOFF
function logoff() {
    if (typeof (app) != typeof (undefined) && app == "T") {
        localStorage.clear();
        location.reload()
    } else {
        if (instance == '') {
            localStorage.clear();
            document.location = 'logoff.php'
        } else {
            $.ajax({
                data: {
                    app: 'T'
                },
                type: "GET",
                url: instance + "logoff.php",
                success: function (response) {
                    localStorage.clear();

                    $('.logohold a').trigger("click")
                    showmainmenu()
                    if (typeof initHeader == 'function') {
                        initHeader()
                    }
                    checkLogged()
                }
            })
        }
    }
}

// OTVARA DROPDOWN
function opendropdown(elem) {
    var confield = $(elem).attr('conditionfield')
    var confunct = $(elem).attr('confunction')
    if (confield !== '' && typeof (confield) !== 'undefined') {
        window[confunct](this)
    } else {
        $('.ajaxcombor').addClass('hidden')
        $(elem).parent().find('.searchfield').val('')
        $(elem).siblings(".ajaxcombor").removeClass('hidden')

        $(elem).siblings(".ajaxcombor").on('mouseenter', function () {
            $(elem).parents('.formawrapwindow').addClass('overflowhidden')
        });

        $(elem).siblings(".ajaxcombor").on('mouseleave', function () {
            $(elem).parents('.formawrapwindow').removeClass('overflowhidden')
        });


        if ($(window).width() < 768) {
            $('body').addClass('overflowhidden')
        }
        ajaxclicked = 'T'

        $(elem).parent().find('.searchfield').focus()
        $(elem).parent().find('.searchfield').trigger('keyup');

    }
}

// ZATVARA DROPDOWN
function closedrop() {
    if ($('.newrow #acIdent').val() == '') {
        $('.newrow').remove()
    }
    if ($(window).width() > 991) {
        if ($('.newcasebutwrap').css('display', 'none')) {
            $('.newcasebutwrap').css('display', 'inline-block')
            $('#usersettings').css('display', 'inline-block')
        }
    }

    $('.ajaxcombor').addClass('hidden')
    $('.popup-opomba').addClass('hidden')
    $('.append-opomba').addClass('hidden')
    $('.checkres').addClass('hidden')
    $('body').removeClass('overflowhidden')
}

// otvara i zatvara date picker
function toggleDatepicker(elem) {

    if ($(elem).hasClass('opened')) {
        $(elem).datepicker('hide');
        $(elem).removeClass('opened');
    } else {
        $(elem).datepicker('show');
        $('.inputdate').removeClass('opened')
        $(elem).addClass('opened');
    }

}

// gradi breadcrumb za katalog proizvoda
function whereAmI(container, detaljanPrikaz, selector) {  //nova funckija
    $(container).append('<nav class="breadcrumb_nav"><div class="breadcrumb"></div></nav>')
    
    if(typeof selector == 'undefined'){
        selector = '.menuholder .mainmenu'
    }

    const nazivi = [];
    const linkovi = [];
    
    let currentpage
    if(detaljanPrikaz !== 'T'){
        currentpage = pageid
    } else {
        currentpage = frontpage
    }
    let loop = $(selector + ' a[pageid="'+currentpage+'"]').length
    
    while(loop){
        // console.log('currentpage', currentpage)
        let name = $(selector + ' a[pageid="'+currentpage+'"]').attr('name')
        let link = 'index.php?pageid='+currentpage
        // console.log(name, link)
        nazivi.push(name)
        linkovi.push(link)
        let parent = $(selector + ' a[pageid="'+currentpage+'"]').attr('parent')
        currentpage = parent
        // console.log('currentpagenew', currentpage)
        if(parent == ''){
            loop=false
            nazivi.push('Home')
            linkovi.push('index.php?pageid='+currentpage+getCookie('homepage'))
    
        }
        
    }
    
    for(let i = nazivi.length - 1; i >=0 ; i--){
        $('.breadcrumb').append('<li class="singlestep"><a class="singlesteplink"  href="'+linkovi[i]+'">'+nazivi[i]+'</a></li>')
    }
    
    $('.singlesteplink[href="index.php?pageid='+getCookie('homepage')+'"]').addClass('breadcrumb_home_icon').html('<svg class="home_icon_svg" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="32" height="32" x="0" y="0" viewBox="0 0 511 511.999" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M498.7 222.695c-.016-.011-.028-.027-.04-.039L289.805 13.81C280.902 4.902 269.066 0 256.477 0c-12.59 0-24.426 4.902-33.332 13.809L14.398 222.55c-.07.07-.144.144-.21.215-18.282 18.386-18.25 48.218.09 66.558 8.378 8.383 19.44 13.235 31.273 13.746.484.047.969.07 1.457.07h8.32v153.696c0 30.418 24.75 55.164 55.168 55.164h81.711c8.285 0 15-6.719 15-15V376.5c0-13.879 11.293-25.168 25.172-25.168h48.195c13.88 0 25.168 11.29 25.168 25.168V497c0 8.281 6.715 15 15 15h81.711c30.422 0 55.168-24.746 55.168-55.164V303.14h7.719c12.586 0 24.422-4.903 33.332-13.813 18.36-18.367 18.367-48.254.027-66.633zm-21.243 45.422a17.03 17.03 0 0 1-12.117 5.024H442.62c-8.285 0-15 6.714-15 15v168.695c0 13.875-11.289 25.164-25.168 25.164h-66.71V376.5c0-30.418-24.747-55.168-55.169-55.168H232.38c-30.422 0-55.172 24.75-55.172 55.168V482h-66.71c-13.876 0-25.169-11.29-25.169-25.164V288.14c0-8.286-6.715-15-15-15H48a13.9 13.9 0 0 0-.703-.032c-4.469-.078-8.66-1.851-11.8-4.996-6.68-6.68-6.68-17.55 0-24.234.003 0 .003-.004.007-.008l.012-.012L244.363 35.02A17.003 17.003 0 0 1 256.477 30c4.574 0 8.875 1.781 12.113 5.02l208.8 208.796.098.094c6.645 6.692 6.633 17.54-.031 24.207zm0 0" fill="#000000" data-original="#000000" class=""></path></g></svg>').closest('.singlestep').attr('onclick','window.location.href="index.php?pageid='+getCookie('homepage')+'"').css({
        'cursor' : 'pointer',
    })
}

// OTVARA MENU NA MOBILNOM
function showmainmenu(elem) {
    if (typeof(app) != typeof(undefined) && app == 'T') {
        // $('.menupage[pageid="A409"]').before($('.menupage[pageid="A483"]'))
        if($('.menupage.active').length<1) {
            $('.menupage[pageid="A483"]').addClass('active')
        }
    }
    if ($(window).width() < 770) {
        $('.main_navigation').toggle('medium', function () {
            if ($(this).is(':visible')) {
                $('body').addClass('overflowhidden')
                // $(this).css('display', 'flex');
                $('.main_navigation .main-ul').fadeIn();
                $('.main_navigation .login-btns').fadeIn();
                $('.header-top-bar').fadeIn();
            } else {
                $('.header-top-bar').css('z-index', 'none');
                $('.main_navigation .main-ul').css('display', 'none');
                $('.main_navigation .login-btns').css('display', 'none');
                $('body').removeClass('overflowhidden')
            }
        });

        $('.menu-burger').toggleClass('white-burger')
        if ($('.top-search-box').hasClass('sactive')) {
            showsinput()
        }
        $('.total-cart-in ul').removeClass('active')

    } else {

        $('.main_navigation li').removeClass('activepage')
        $(elem).closest('li').addClass('activepage')
    }

}

// filtrira dati JSON po zadatom stringu
function filterJSONData(json, searchString) {
    var search = searchString.toLowerCase(); // Convert input to lowercase for case-insensitive search
    return $.map(json, function(item) {
    // Check if the search string is present in any field (ignoring undefined/null values)
        if (Object.values(item).some(val => val != null && val.toString().toLowerCase().includes(search))) {
            return item; // Return the item if it matches the search condition
        }
    });
}


// funckija koja kreira event oninput na prosleđenom input tagu i filtrira sve elemente po prosleđenom selektoru
function makeInputSearchable(input_selector, targets_selector) {
    var searchInput = $(input_selector);
    rowWraps = $(targets_selector);
    var inputSelector = input_selector
    var divElement = $('<div class="clear_search_bar_input_value_holder hidden" onclick="$(\'' + inputSelector + '\').val(\'\'); $(\'' + inputSelector + '\').trigger(\'input\');"><i class="icon-cancel"></i></div>');
    $(inputSelector).parent().append(divElement);
    $(input_selector).parent().css('position', 'relative');
    $('.clear_search_bar_input_value_holder').css({
        'position': 'absolute',
        'top': '50%',
        'right': '0',
        'transform': 'translate(-50%, -50%)'
    });
    searchInput.on('input', function () {
        var searchText = $(this).val().toLowerCase().trim();
        console.log(searchText)
        rowWraps.each(function () {
            var rowWrap = $(this);
            var rowText = rowWrap.text().toLowerCase();
            if (rowText.includes(searchText)) {
                console.log(rowText)
                rowWrap.show();
            } else {
                rowWrap.hide();
            }
        });
    });

    $(input_selector).on('input', function () {
        var searchValue = $(this).val();
        if (searchValue !== '') {
            $(input_selector).siblings('.clear_search_bar_input_value_holder').removeClass('hidden')
        } else {
            $(input_selector).siblings('.clear_search_bar_input_value_holder').addClass('hidden')
        }
    });
}

// funckija za upload dokumenta
function docUpload(field, callback) {
    var file_data = field.prop('files');
    var form_data = new FormData();

    for (var i = 0; i < file_data.length; i++) {
        form_data.append('file[' + i + ']', file_data[i]);
    }


    form_data.append('uploader', getCookie('userid'));
    form_data.append('project', '');
    form_data.append('phaze', '');
    form_data.append('subjekt', '');
    form_data.append('contact', '');
    form_data.append('form', '');

    $.ajax({
        url: instance + 'inckomponente/docupload.php', // point to server-side PHP script 
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'POST',
        success: function (response) {
            if (typeof callback == 'function') {
                callback(response)
            }
        }
    });
}

// repalce-uje pattern vrednosti iz json-a sa vrednoscu replacment-a 
function replaceValueInJson(json, pattern, replacement) {
    $.each(json, function(index, item) {
        if (item.fields) {
            $.each(item.fields, function(fieldKey, fieldValues) {
                if (Array.isArray(fieldValues)) {
                    item.fields[fieldKey] = fieldValues.map(val => typeof val === 'string' ? val.replace(pattern, replacement) : val);
                } else {
                    item.fields[fieldKey] = typeof fieldValues === 'string' ? fieldValues.replace(pattern, replacement) : fieldValues;
                }
            });
        }
    });
}

// funckija koja vraca html sa replaceovanim vrednostima izmedju ## iz json-a
function replaceJSONValuesInHTML(html, json) {
    return json.map(item => {
        let newHtml = html;
        $.each(item, (key, value) => {
            newHtml = newHtml.replace(new RegExp(`#${key}#`, 'g'), value);
        });
        return newHtml;
    }).join('');
}

// grupise html elemente po vrednosti njegovog atributa i sve to apenduje u container
function groupItemsByAttribute(selector, attribute, container) {
    let groupedItems = {};

    $(selector).each(function () {
        let attr = $(this).attr(attribute);

        if (!groupedItems[attr]) {
            groupedItems[attr] = [];
        }

        groupedItems[attr].push($(this));
    });

    // console.log(groupedItems);

    for (let attr in groupedItems) {
        let mobContentGroupWrap = $('<div>').addClass('mob_content_group_wrap').attr(attribute, attr).append(`<div class="mob_content_group_wrap_title">${attr}</div>`);

        groupedItems[attr].forEach(function (item) {
            mobContentGroupWrap.append(item);
        });

        $(container).addClass('mob_content_grouped').append(mobContentGroupWrap)
    }
}

// funckija za upload dadoteke
function uploadfile(field) {
    var formData = new FormData();
    var files = field.files;
    var fname = '';
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        formData.append('files[]', file, file.name);
        fname = file.name
    }
    $.ajax({
        url: instance + 'incKomponente/fileuploadphp.php?field=' + field.getAttribute('therealid') + '&maxwidth=' + field.getAttribute('maxwidth') + '&oldfile=' + $('#' + field.getAttribute('id') + 'val').val(),
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'POST',
        success: function (response) {
            if (response.trim() == 'failed' || response.trim() == '') {} else {
                id = $(field).attr('id');
                $('#' + id + 'val').val(response.trim());
                $('.filelabel[for="' + id + '"]').html('<span class="filechoser">Odaberi datoteku</span>')
                filenameext = response.substr(response.lastIndexOf('.') + 1)
                if (filenameext == 'jpg' || filenameext == 'jpeg' || filenameext == 'gif' || filenameext == 'jpg' || filenameext == 'png' || filenameext == 'bmp') {
                    $('.filelabel[for="' + id + '"]').append('<span class="chosen-file-pic" onclick="event.preventDefault();event.stopPropagation();openPhotoSwipe(this);"></span>')
                    $('.filelabel[for="' + id + '"]').append('<div class="hidden attgal" ><img src="docs/' + response + '"></div>')
                } else {
                    $('.filelabel[for="' + id + '"]').append('<span class="chosen-file-hold"><a class="chosen-file-doc" target="_blank" href=\'' + document.location.origin + '/docs/' + response + '\')"></a></span>')
                }

                $('.filelabel[for="' + id + '"]').append('<span class="filename"><p>' + response + '</p></span>')
            }
        }
    })
}

// funckija koja dodaje event listener koji zatvara dropdown na bilo koji klik izvan kontejnera (ako je slideUp = 'T' onda ce prilikom zatvaranja dropdown elementa biti primenjena animacija slideUp)
function autoCloseDropdownOnClickOffContainer(container, dropdown, slideUp){
    $(document).click(function (event) {
        if(slideUp == 'T'){
            if (!$(container).is(event.target) && !$(container).has(event.target).length) {
                $(dropdown).slideUp();
            }
        } else {
            if (!$(container).is(event.target) && !$(container).has(event.target).length) {
                $(dropdown).hide();
            }
        }
    });
}

// radi replace slika na katalogu kada nema slike
function replaceNoPhoto(){
    $('.katalog_lista_proizvoda .katalogv2_art_img:not([replaced="T"])').each(function(){
        var imgsrc = $(this).attr('imgsrc')
        if(imgsrc){
            $(this).attr('src', imgsrc.replace(/images\/artikli\//g, "images/artikli/thumb/"))
        } else {
            $(this).attr('src', nophoto)
        }
        $(this).attr('replaced', 'T')
    })
}

// funckija koja se poziva pri svakom ucitavanju kataloga
async function stockCurrent(){
    $('.katalog_lista_proizvoda .singleartikal:not([initialized]) .katalogv2_art_price_loader').show()
    
    // $('.singleartikal:not([initialized]) .katalogv2_art_akcija_holder').each(function(){
    //     var istaknuto = $(this).attr('istaknuto').replace(/!splitter!/g, ', ')
    //     var klasa = istaknuto.replace(/,/g, '')
    //     $(this).attr('istaknuto', istaknuto).addClass(klasa)
    //     $(this).find('.katalogv2_art_akcija').text(istaknuto)
    // })
    // VIDI SA PEDJOM!!!!!
    
    var identi = []
    $('.katalog_lista_proizvoda .singleartikal:not([initialized])').each(function(){
        var ident = $(this).attr('ident').trim()
        $(this).attr('ident', ident)
        
        if(!identi.includes(ident)){
            identi.push(ident)
        }
    })
    identi = identi.join(',')
    
    await loadcontent('zalihe', {template: wrapper_template, identi: identi, skladistaString: getCookie('skladistaString'), ajax: 'T', jsont: 'T'}, function(response){
        var temp1 = JSON.parse(response)
        temp1.forEach(x => {
            var ident = x.acIdent.trim()
            var zal = parseFloat(x.anStock).toFixed()
            $('.katalogv2_art_holder.singleartikal[ident="'+ident+'"] .katalogv2_art_holder_a.applink').attr('zal', zal)
        })
        
        $('.katalog_lista_proizvoda .singleartikal:not([initialized]) .applink').each(function(){
            var elem = $(this)
            console.log('elem', elem)
            var ident = elem.attr('ident')
            var zal = parseFloat(elem.attr('zal'))
            var poruc = elem.attr('poruc')
            
            if(poruc == 'Dozvoljeno'){
                $(this).find('.katalogv2_art_butt_addToBasket').show().css('display', 'flex')
                $(this).find('.katalogv2_art_butt_askForPrice').remove()
                $(this).find('.katalogv2_art_butt_outOfStock').remove()
            }
            
            if(poruc == 'Ponuda'){
                $(this).find('.katalogv2_art_butt_addToBasket').remove()
                $(this).find('.katalogv2_art_butt_askForPrice').show().css('display', 'flex')
                $(this).find('.katalogv2_art_butt_outOfStock').remove()
            }
            
            if(poruc == 'Dozvoljeno kad je dostupno'){
                if(zal > 0){
                    $(this).find('.katalogv2_art_butt_addToBasket').show()
                    $(this).find('.katalogv2_art_butt_askForPrice').remove()
                    $(this).find('.katalogv2_art_butt_outOfStock').remove()
                } else {
                    $(this).addClass('outOfStock')
                    $(this).find('.katalogv2_art_butt_addToBasket').remove()
                    $(this).find('.katalogv2_art_butt_askForPrice').remove()
                    $(this).find('.katalogv2_art_butt_outOfStock').show().css('display', 'flex')
                }
            }
            
            if(poruc == 'Ponuda kad nije dostupno'){
                if(zal > 0){
                    $(this).find('.katalogv2_art_butt_addToBasket').show()
                    $(this).find('.katalogv2_art_butt_askForPrice').remove()
                    $(this).find('.katalogv2_art_butt_outOfStock').remove()
                } else {
                    $(this).find('.katalogv2_art_butt_addToBasket').remove()
                    $(this).find('.katalogv2_art_butt_askForPrice').show().css('display', 'flex')
                    $(this).find('.katalogv2_art_butt_outOfStock').remove()
                }
            }
        })
    })
    
    await loadcontent('katalogCene', {template: wrapper_template, subjekt: getCookie('subjekt'), identi: identi, valuta: global_valuta, ajax: 'T', jsont: 'T'}, function callback(response){
        var json = JSON.parse(response)
        json.forEach(x => {
            var ident = x.ident.trim()
            var popust = parseFloat(x.popust)
            var cenaclient = parseFloat(x.cenaclient)
            var proizvod = $('.katalogv2_art_holder.singleartikal[ident="'+ident+'"]')
            if(popust > 0){
                var pdv = parseFloat(x.pdv)
                var vpcena = parseFloat(x.vpcena)
                var staracena = vpcena * (1 + pdv / 100)
                var usteda = staracena - cenaclient
                proizvod.find('.katalogv2_art_price_old_wrap').show().find('.katalogv2_art_price_old').text(staracena).addClass('money')
                proizvod.find('.katalogv2_art_price_disc_wrap').show().find('.katalogv2_art_price_disc').text(usteda).addClass('money')
                proizvod.find('.katalogv2_art_price_rebate_wrap').show().find('.katalogv2_art_price_rebate').text(popust)
                proizvod.attr('initialized', 'T').find('.katalogv2_art_price').text(cenaclient).addClass('money')
            } else {
                proizvod.attr('initialized', 'T').find('.katalogv2_art_price').text(cenaclient).addClass('money')
            }
        })
        formatmoneyvalues('.katalog_lista_proizvoda')
        replaceNoPhoto()
        $('.katalog_lista_proizvoda .singleartikal .katalogv2_art_price_loader').fadeOut()
    })
}

function setLocalStorage(key, value, expires) {
	const now = new Date()
	const item = {
		value: value,
		expiry: now.getTime() + (expires * 1000),
	}
	localStorage.setItem(key, JSON.stringify(item))
}

function getLocalStorage(key) {
	const itemStr = localStorage.getItem(key)
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	if (now.getTime() > item.expiry && item.expiry !== null) {
		localStorage.removeItem(key)
		return null
	}
	return item.value
}

function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

// vraca vrednosti za prosledjenje filedove iz array-a koji zadovoljava uslove iz prosledjenog objekta
function filterJSONbyObjectAndGetRequiredValues(data, conditions = {}, returnFields = []) {
    const results = data.filter(item =>
        Object.entries(conditions).every(([field, value]) =>
            String(item[field] ?? "").trim() === String(value).trim()
        )
    );

    let mapped;

    if (results.length === 0) {
        // Ako nema pogodaka › prazan objekat sa traženim poljima
        let empty = {};
        if (returnFields.length > 0) {
            returnFields.forEach(f => empty[f] = "");
        } else if (data.length > 0) {
            Object.keys(data[0]).forEach(f => empty[f] = "");
        }
        return empty;
    } else {
        mapped = results;

        if (returnFields.length > 0) {
            mapped = results.map(item => {
                let obj = {};
                returnFields.forEach(f => obj[f] = item[f] ?? "");
                return obj;
            });
        }
    }

    // deduplikacija
    const unique = Array.from(new Set(mapped.map(JSON.stringify))).map(JSON.parse);

    // uvek vrati OBJEKAT
    return unique.length > 0 ? unique[0] : {};
}

