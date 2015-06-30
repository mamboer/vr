/*!
 * mintpl 1.0.0
 * MinTpl.JS - A library agnostic, Minimal Javascript Template Engine, inspired by John Resig&#39;s micro templating code snippet.
 * @Author Levin Van <github.com/mamboer> 
 */
/*jshint browser: true, strict: true, undef: true */
/*global define: false */
(function (root, factory) {
    
    if (typeof exports === 'object') {
        module.exports = factory();    
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define( factory );
    } else {
        // Browser globals
        root.mintpl = factory();
    }
}(this, function () {

    'use strict';

    function heredoc(fn) {
        this.text = fn.toString().split('\n').slice(1,-1).join('\n') + '\n';
    }

    heredoc.prototype = {
        stripPattern : /^[ \t]*(?=[^\s]+)/mg,
        // normalizes leading indentation https://github.com/jden/heredoc/pull/6
        val : function() {
            var text = this.text;
            var indentLen = text.match(this.stripPattern).reduce(function (min, line) {
                return Math.min(min, line.length)
            }, Infinity);

            var indent = new RegExp('^[ \\t]{' + indentLen + '}', 'mg');
            return ( indentLen > 0 ? text.replace(indent, '') : text );
        }        
    };

    var cache = {};

    function tmpl(str, data){

        if ( str instanceof heredoc ){
            return tmpl(str.val(),data);
        }

        if ( typeof str === 'function' ) {
            return tmpl( new heredoc(str), data );
        }

        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        // \W Matches any non-word character. Equivalent to [^A-Za-z0-9_]
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :
     
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
           
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
           
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };


    var api = {
        heredoc:heredoc,
        render: tmpl 
    };

    return api;

}));
