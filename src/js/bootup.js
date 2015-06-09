(function(w,d) {
    if (self != top || d.getElementById('vrToolbar') && d.getElementById('vrToolbar').getAttribute('data-resizer')) return false;
    var configs = [
        '<a data-viewport="320x480" data-icon="mobile">Mobile (e.g. Apple iPhone)</a>',
        '<a data-viewport="320x568" data-icon="mobile" data-version="5">Apple iPhone 5</a>',
        '<a data-viewport="600x800" data-icon="small-tablet">Small Tablet</a>',
        '<a data-viewport="768x1024" data-icon="tablet">Tablet (e.g. Apple iPad 2-3rd, mini)</a>',
        '<a data-viewport="1280x800" data-icon="notebook">Widescreen</a>',
        '<a data-viewport="1920%C3%971080" data-icon="tv">HDTV 1080p</a>'
    ];
    var doc = 
        '<!DOCTYPE HTML>' + 
        '<html style="opacity:0;">' + 
        '<head>' + 
            '<meta charset="utf-8"/>' +
        '</head>' +
        '<body>' + 
            '$',
            '<script src="src/jquery.js"></script>' + 
            '<script src="src/mintpl.js"></script>' + 
            '<script src="src/vr.js"></script>' + 
        '</body>' + 
        '</html>';

    w.VR = {
        go:function(customConfigs){
            configs = customConfigs||configs;
            doc = doc.replace('$', configs.join(''));
            d.write(doc);
        }
    };

})(window, document));
