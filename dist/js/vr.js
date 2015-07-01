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
        this.$loader = $('#vrLoader');
        this.$frame = $('#vrFrame');
        initEvts();
        this.parseUrl();
        restoreFromCookie();
    },
    parseUrl:function(){
        // parse url parameter
        var urlParam = this.url = this.getParameterByName('url');
        if(urlParam.length > 0) {
            if(urlParam.substr(0,4) != 'http') {
                urlParam = 'http://' + urlParam;
            }
            this.url = urlParam;
            $('[name="url"]').val(this.url);
            this.showLoader();
            this.$frame.attr('src',this.url);
            $('#indexPage').hide();
            $('#vrPage').show();
        }
    },
    showLoader:function(){
        this.$frame.addClass('hidden'); 
        this.$loader.removeClass('hidden');
    },
    hideLoader:function(){
        this.$frame.removeClass('hidden');
        this.$loader.addClass('hidden');
    }

};

var restoreFromCookie = function(){ 
    var device = $.cookie('vr-device'),
        orient = $.cookie('vr-orientation');

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
            device = this.getAttribute('data-device');

        $viewports.removeClass('active');
        $this.addClass('active');
        $.cookie('vr-device', device);
        $frame.css({
            'max-width': newWidth,
            'max-height': newHeight
        });
        e.preventDefault();
        return false;
    }).on('click', 'button.rotate', function(e) {
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
        $(this).find('i[class*="icon-"]').addClass('icon-rotate-360');
        VR.showLoader();
        $frame[0].contentWindow.location.reload(true);
    }).on('click', '#closeResizer', function(e) {
        closeResizer();
    }).on('click', '[data-toggle]', function(e) {
        var $el = $(this.getAttribute('data-toggle'));
        $el.slideToggle(150, function() {
            if($el.is(':visible')) {
                $el.find('[name="url"]').focus().select();
            }
        });
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
            $('[data-device="ipad"]').trigger('click');
            break;
          case 53:
            $('[data-device="tablet"]').trigger('click');
            break;
          case 54:
            $('[data-device="android"]').trigger('click');
            break;
          case 55:
            $('[data-device="iphone"]').trigger('click');
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
