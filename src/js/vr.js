(function($, W){
    
if (top != self) { top.location.replace(self.location.href); }

var $win = $(W),
    $body = $('body'),
    $doc =$(document);

var VR = {
    ensureValidProtocol: function($el, evt) {
        var protocol = $el.val().substring(0,4),
        $parent = $el.parent(),
        regex = new RegExp(":\/\/");
        $parent.removeClass('error');
        if(regex.test($el.val()) && protocol != 'http') {
            $el.focus().select();
            $parent.addClass('error');
            evt.stopPropagation();
            evt.preventDefault();
        }
    },
    createBookmarklet: function() {
        var title = document.title,
            address =  W.location.href,
            elem;
        if(W.sidebar) {
            W.sidebar.addPanel(title,address);
        } else if(W.external) {
            W.external.AddFavorite(address,title);
        } else if(W.opera && W.print) {
            elem = document.createElement('a');
            elem.setAttribute('href',address);
            elem.setAttribute('title',title);
            elem.setAttribute('rel','sidebar');
            elem.click();
        }
    },
    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    init:function(){ 
        delete this.init;
        //setup bookmarks   
        $('[rel="bookmark"]').attr('href', "javascript:document.location='"+document.location+"?url=' + document.location.href;");
        this.$frame = $('#vrFrame');
        this.initUA();
        initEvts();
        this.toggleSiteLoader(true);
        this.parseUrl();
        this.parseAddrBar();
        restoreFromCookie(this.getDeviceFromUrl());
    },
    parseUrl:function(reload){
        // parse url parameter
        var urlParam = this.url = this.getParameterByName('url'),
            vrt = new Date().getTime();
        if(urlParam.length > 0) {
            if(urlParam.substr(0,4) != 'http') {
                urlParam = 'http://' + urlParam;
            }
            this.url = urlParam;
            $('[name="url"]').val(this.url);

            if(reload === true){
                if(urlParam.indexOf('?')>0){
                    urlParam = urlParam + '&vrt='+ vrt;
                }else{
                    urlParam = urlParam + '?vrt='+ vrt;
                }
            }

            this.showLoader();
            this.$frame.attr('src', urlParam);
            $('#vrPage').removeClass('hidden');
        } else {
            $('#indexPage').removeClass('hidden');
            $('#ribbon-wrapper').removeClass('hidden');
        }
    },
    parseAddrBar: function(){
        var addrBar = this.getParameterByName('addrbar'),
            $toolbar = $('#toolbar');
        addrBar = addrBar === '1' ? '1':'0';
        document.getElementById('iptAddrBar').value = addrBar;
        if(addrBar === '1'){
            this.toggleAddressBar();
        }        
    },
    getDeviceFromUrl: function(){
        var device = this.getParameterByName('device');
        document.getElementById('iptDevice').value = device;
        return device;
    },
    showLoader:function(){
        this.$frame.addClass('invisible'); 
        this.toggleSiteLoader(false);
    },
    hideLoader:function(){
        this.$frame.removeClass('invisible');
        this.toggleSiteLoader(true);
    },
    toggleAddressBar: function(){
        $('#toolbar').toggleClass('open');
        $('[data-addrtoggle]').toggleClass('open');
    },
    toggleSiteLoader:function(hide){
        if(hide === true){
            $('#siteLoader').addClass('hidden').removeClass('animate-rotate360');
        }else{
            $('#siteLoader').removeClass('hidden').addClass('animate-rotate360');
        }
    },
    initUA:function(){
        var ua = navigator.userAgent;
        $('.desktop-only').attr('data-user-agent', ua); 
    },
    setUA:function(win, userAgent) {
        //iframe id
        if(typeof(win)==='string'){
            win = document.querySelector('#'+win).contentWindow;
        }
        if (win.navigator.userAgent != userAgent) {
            var userAgentProp = { get: function () { return userAgent; } };
            try {
                Object.defineProperty(win.navigator, 'userAgent', userAgentProp);
            } catch (e) {
                win.navigator = Object.create(navigator, {
                    userAgent: userAgentProp
                });
            }
        }
    }
};

var restoreFromCookie = function(userDevice){ 
    var device = $.cookie('vr-device'),
        orient = $.cookie('vr-orientation');

    device = userDevice === '' ? device : userDevice;

    device = device || 'iphone5'; 

    if( device ) {
        $('[data-device="'+device+'"]').trigger('click');
    }
    if( orient === 'landscape' ) {
        $('#btnToggleRotate').trigger('click');
    }
   
};

var initEvts = function() {

    var $viewports = $('button[data-viewport-width]'),
        $frame =VR.$frame,
        $rotateViewports = $('button[data-rotate=true]'),
        $vr = $('#vr');

    var forceClose = function() {
        if($('#closeResizer').length>0) {
            closeResizer();
        }else{
            document.location = document.getElementById('btnVRClose').getAttribute('href');
        }
    },
    closeResizer = function() {
        var newWidth = $win.width(),
            newHeight = $win.height();
        $viewports.removeClass('active');
        $frame.css({
            'max-width': newWidth,
            'max-height': newHeight
        });
        $vr.fadeOut(500, function() {
            document.location = $frame[0].contentWindow.location.href;
        });
    };

    $frame.on('load',function(e){
        VR.hideLoader();
    });

    $body.on('click', 'button[data-viewport-width]', function(e) {
        var newWidth = this.getAttribute('data-viewport-width'),
            newHeight = this.getAttribute('data-viewport-height'),
            $this = $(this),
            device = this.getAttribute('data-device'),
            ua = this.getAttribute('data-user-agent');

        $viewports.removeClass('active');
        $this.addClass('active');
        $.cookie('vr-device', device);
        $frame.css({
            'max-width': newWidth,
            'max-height': newHeight
        });
        VR.setUA($frame[0].id, ua);
        console.log('ua', ua); 
        e.preventDefault();
        return false;
    }).on('click', 'rotate', function(e) {
        $rotateViewports.each(function() {
            var $this = $(this).toggleClass('landscape'),
                width = $this.attr('data-viewport-width'),
                height = $this.attr('data-viewport-height');
            
            $this.attr('data-viewport-width', height);
            $this.attr('data-viewport-height', width);
            if($this.hasClass('active')) {
                $this.trigger('click');
                if( $this.hasClass('landscape') ) {
                  $.cookie('vr-orientation', 'landscape');
                }else{
                  $.removeCookie('vr-orientation');
                }
            }
        });
    }).on('click', 'button.refresh', function(e) {
        VR.parseUrl(true);
    }).on('click', '#closeResizer', function(e) {
        closeResizer();
    }).on('click', '[data-addrtoggle]', function(e) {
        var $this = $(this),
            $el = $(this.getAttribute('data-toggle'));
        VR.toggleAddressBar();
        if($el.hasClass('open')) {
            $el.find('[name="url"]').focus().select();
        }
        
    }).on('keyup', 'input', function(e) {
        if(e.keyCode == 27) {
            $('[data-toggle]').first().trigger('click');
            $('[name="url"]').val(VR.url);
        }
        e.stopPropagation();
    }).on('keypress', '[name="url"]', function(e) {
        if(e.keyCode == 13) {
            VR.ensureValidProtocol($(this), e);
        }
    }).on('click', 'button[type="submit"]', function(e) {
        VR.ensureValidProtocol($(this).parents('form').find('[name="url"]'), e);
    }).on('click', '[rel="bookmark"]', function(e) {
        e.preventDefault();
        return false;
    });

    $doc.on('keyup', function(e) {
        switch(e.keyCode) {
          case 27:
            $('[data-toggle]').first().trigger('click');
            break;
          case 49:
            $('[data-device="fullscreen"]').trigger('click');
            break;
          case 50:
            $('[data-device="desktop"]').trigger('click');
            break;
          case 51:
            $('[data-device="macbook"]').trigger('click');
            break;
          case 52:
            $('[data-device="iPadMini"]').trigger('click');
            break;
          case 53:
            $('[data-device="iphone6+"]').trigger('click');
            break;
          case 54:
            $('[data-device="iphone6"]').trigger('click');
            break;
          case 55:
            $('[data-device="iphone5"]').trigger('click');
            break;
          case 32:
          case 56:
          case 82:
            $('.rotate').trigger('click');
            break;
          case 88:
            forceClose();
            break;
        }
    });


    $('form').on('submit', function(e) {
        var $url = $(this).find(['name="url"']),
            $urlParent = $url.parent();
        $urlParent.removeClass('error');
        if($url.val() === '') {
            $urlParent.addClass('error');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

};

//doc ready
$(function(){
    VR.init();    
});

})(jQuery,window);
