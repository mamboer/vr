/*!
 * {{name}} {{version}}
 * {{description}}
 * @Author {{author|raw}} 
 */
/*jshint browser: true, strict: true, undef: true */
/*global define: false */
(function (root, factory) {
    
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery','mintpl'], factory );
    } else {
        // Browser globals
        root.VR = factory(root.jQuery, root.mintpl);
    }
}(this, function ($, T) {

    'use strict';

    var tplHead = new T.heredoc(function(){/*
        <title><%=title%></title>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9, chrome=1"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <link rel="stylesheet" href="<%=css%>"/>
        <style type="text/css" media="print"></style>
        <style></style>
    */}); 

    var tplBody = new T.heredoc(function(){/*
        <script src="<%=js%>"></script>
        <div id="vrNotice" class="vr-notice">
            <div class="vrn-inner">
                <div class="vrn-well">
                    <a id="vrBookmarklet" data-text="<%=bookmarkText%>"><span><%=bookmarkTitle%></span></a>
                    <span class="vr-hide"><%=updateText%></span>
                </div>
                <dl class="vrn-meta">
                    <dt><%=versionText%></dt>
                    <dd><%=name%> (<%=version%>)</dd>
                    <dt>User Agent</dt>
                    <dd data-pro="userAgent"><%=userAgent%></dd>
                    <dt>Meta Viewport</dt>
                    <dd data-pro="viewport"><%=viewport%></dd>
                </dl>
                <div class="vr-muted">
                    <%=aboutText%>: <a href="<%=homepage%>" target="_blank"><%=name%></a> is designed by <%=author%> (&copy;) <%=copyrightTime%>
                </div>
            </div>
        </div>
        <div id="vrToolbar" data-resizer="basic" class="vr-toolbar">
            <ul id="vrDevices" class="vr-devices">
                <li><a data-viewport="auto" data-icon="auto" title="Auto Size" class="">Auto Size</a></li>
                <li><a data-viewport="320x480" data-version="4" data-icon="iphone" class="portrait" title="iPhone 4">iPhone 4</a></li>
                <li><a data-viewport="320x568" data-version="5" data-icon="iphone" class="portrait active" title="iPhone 5">iPhone 5</a></li>
                <li><a data-viewport="375x667" data-version="6" data-icon="iphone" class="portrait" title="iPhone 6">iPhone 6</a></li>
                <li><a data-viewport="414x736" data-version="6+" data-icon="iphone" class="portrait" title="iPhone 6+">iPhone 6+</a></li>
            </ul>
            <ul id="vrTools" class="vr-tools">
                <li class="activeAdd">
                    <label for="vrEdit" data-icon="edit" title="<%=customSizeText%>"><span><%=customizeText%>:</span></label>
                    <input id="vrEdit" type="text" value=""/>
                    <a id="vrAdd" data-viewport="530x736" data-icon="add" title="<%=customizeText%>" class="vr-custom">530x736</a>
                </li>
                <li class="vr-info">
                    <b id="vrDeviceName" data-pro="deviceName">iPhone 5</b>
                    <span data-pro="deviceMeta">Size: 320x568 (Portrait), Ratio: 40:71</span>
                </li>
            </ul>
            <ul id="vrExtras" class="vr-extras">
                <li><a title="<%=animateViewportText%>"><%=animateText%></a></li>
                <li>
                    <a data-icon="reload" title="<%=reloadCurrentPageText%>"></a>
                </li>
                <li>
                    <a data-icon="print" title="<%=printViewportText%>"></a>
                </li>
                <li>
                    <a data-icon="hint" title="<%=informationText%>"></a>
                </li>
                <li>
                    <a data-icon="close" title="<%=closeToolbarText%>"></a>
                </li>
            </ul>
        </div>
        <div id="vrContainer" class="vr-transition">
            <div id="vrPhantom" class="vr-phantom"></div>
            <div id="vrWrapper" class="vr-wrapper">
                <iframe id="vrFrame" class="vr-frame" name="content" frameborder="0" src="about:blank"></iframe>
                <i id="handle-e" class="vr-handle-e"></i>
                <i id="handle-s" class="vr-handle-s"></i>
                <i id="handle-w" class="vr-handle-w"></i>
                <i id="handle-se" class="vr-handle-se"></i>
                <i id="handle-sw" class="vr-handle-sw"></i>
            </div>
        </div>
    */});

    var api = {
        data: {
            'name':'{{name}}',
            'version':'{{version}}',
            'js':'{{meta.js}}',
            'css':'{{meta.css}}',
            'author':'{{author}}',
            'versionText':'Version',
            'bookmarkText':'Your Bookmarket',
            'bookmarkTitle':'↔ Resizer',
            'updateText':' has been changed. Please save or update your bookmarklet.',
            'aboutText':'About',
            'copyrightTime':'2015 - ' + new Date().getFullYear(),
            'customSizeText':'Custom Size',
            'customizeText':'Customize',
            'animateViewportText':'Animate Viewport',
            'animateText':'Animate',
            'reloadCurrentPageText':'Reload Current Page',
            'printViewportText':'Print Viewport',
            'informationText':'Information',
            'closeToolbarText':'Close',
            'userAgent': (typeof navigator.userAgent === "undefined" ? 'N/A' : navigator.userAgent),
        },
        init: function(){
            
        } 
    };

    return api;

}));
