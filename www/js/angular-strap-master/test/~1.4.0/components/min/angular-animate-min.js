/**
 * @license AngularJS v1.4.9
 * (c) 2010-2015 Google, Inc. http://angularjs.org
 * License: MIT
 */
!function(n,t,e){"use strict";function a(n,t,e){if(!n)throw Cn("areq","Argument '{0}' is {1}",t||"?",e||"required");return n}function r(n,t){return n||t?n?t?(H(n)&&(n=n.join(" ")),H(t)&&(t=t.join(" ")),n+" "+t):n:t:""}function i(n){var t={};return n&&(n.to||n.from)&&(t.to=n.to,t.from=n.from),t}function o(n,t,e){var a="";return n=H(n)?n:n&&V(n)&&n.length?n.split(/\s+/):[],L(n,function(n,r){n&&n.length>0&&(a+=r>0?" ":"",a+=e?t+n:n+t)}),a}function s(n,t){var e=n.indexOf(t);t>=0&&n.splice(e,1)}function u(n){if(n instanceof q)switch(n.length){case 0:return[];break;case 1:if(n[0].nodeType===W)return n;break;default:return q(l(n))}return n.nodeType===W?q(n):void 0}function l(n){if(!n[0])return n;for(var t=0;t<n.length;t++){var e=n[t];if(e.nodeType==W)return e}}function c(n,t,e){L(t,function(t){n.addClass(t,e)})}function f(n,t,e){L(t,function(t){n.removeClass(t,e)})}function m(n){return function(t,e){e.addClass&&(c(n,t,e.addClass),e.addClass=null),e.removeClass&&(f(n,t,e.removeClass),e.removeClass=null)}}function v(n){if(n=n||{},!n.$$prepared){var t=n.domOperation||M;n.domOperation=function(){n.$$domOperationFired=!0,t(),t=M},n.$$prepared=!0}return n}function d(n,t){p(n,t),h(n,t)}function p(n,t){t.from&&(n.css(t.from),t.from=null)}function h(n,t){t.to&&(n.css(t.to),t.to=null)}function g(n,t,e){var a=(t.addClass||"")+" "+(e.addClass||""),r=(t.removeClass||"")+" "+(e.removeClass||""),i=C(n.attr("class"),a,r);e.preparationClasses&&(t.preparationClasses=T(e.preparationClasses,t.preparationClasses),delete e.preparationClasses);var o=t.domOperation!==M?t.domOperation:null;return R(t,e),o&&(t.domOperation=o),i.addClass?t.addClass=i.addClass:t.addClass=null,i.removeClass?t.removeClass=i.removeClass:t.removeClass=null,t}function C(n,t,e){function a(n){V(n)&&(n=n.split(" "));var t={};return L(n,function(n){n.length&&(t[n]=!0)}),t}var r=1,i=-1,o={};n=a(n),t=a(t),L(t,function(n,t){o[t]=r}),e=a(e),L(e,function(n,t){o[t]=o[t]===r?null:i});var s={addClass:"",removeClass:""};return L(o,function(t,e){var a,o;t===r?(a="addClass",o=!n[e]):t===i&&(a="removeClass",o=n[e]),o&&(s[a].length&&(s[a]+=" "),s[a]+=e)}),s}function y(n){return n instanceof t.element?n[0]:n}function D(n,t,e){var a="";t&&(a=o(t,Y,!0)),e.addClass&&(a=T(a,o(e.addClass,G))),e.removeClass&&(a=T(a,o(e.removeClass,X))),a.length&&(e.preparationClasses=a,n.addClass(a))}function b(n,t){t.preparationClasses&&(n.removeClass(t.preparationClasses),t.preparationClasses=null),t.activeClasses&&(n.removeClass(t.activeClasses),t.activeClasses=null)}function A(n,t){var e=t?"-"+t+"s":"";return w(n,[hn,e]),[hn,e]}function k(n,t){var e=t?"paused":"",a=rn+mn;return w(n,[a,e]),[a,e]}function w(n,t){var e=t[0],a=t[1];n.style[e]=a}function T(n,t){return n?t?n+" "+t:n:t}function S(n){return[pn,n+"s"]}function x(n,t){var e=t?dn:hn;return[e,n+"s"]}function j(n,t,e){var a=Object.create(null),r=n.getComputedStyle(t)||{};return L(e,function(n,t){var e=r[n];if(e){var i=e.charAt(0);("-"===i||"+"===i||i>=0)&&(e=O(e)),0===e&&(e=null),a[t]=e}}),a}function O(n){var t=0,e=n.split(/\s*,\s*/);return L(e,function(n){"s"==n.charAt(n.length-1)&&(n=n.substring(0,n.length-1)),n=parseFloat(n)||0,maxValueID=maxValueID?Math.max(n,maxValueID):n}),maxValueID}function P(n){return 0===n||null!=n}function I(n,t){var e=en,a=n+"s";return t?e+=sn:a+=" linear all",[e,a]}function N(){var n=Object.create(null);return{flush:function(){n=Object.create(null)},count:function(t){var e=n[t];return e?e.total:0},get:function(t){var e=n[t];return e&&e.value},put:function(t,e){n[t]?n[t].total++:n[t]={total:1,value:e}}}}function F(n,t,e){L(e,function(e){n[e]=K(n[e])?n[e]:t.style.getPropertyValue(e)})}var M=t.noop,E=t.copy,R=t.extend,q=t.element,L=t.forEach,H=t.isArray,V=t.isString,B=t.isObject,J=t.isUndefined,K=t.isDefined,Q=t.isFunction,U=t.isElement,W=1,z=8,G="-add",X="-remove",Y="ng-",Z="-active",_="ng-animate",nn="$$ngAnimateChildren",tn="",en,an,rn,on;J(n.ontransitionend)&&K(n.onwebkittransitionend)?(tn="-webkit-",en="WebkitTransition",an="webkitTransitionEnd transitionend"):(en="transition",an="transitionend"),J(n.onanimationend)&&K(n.onwebkitanimationend)?(tn="-webkit-",rn="WebkitAnimation",on="webkitAnimationEnd animationend"):(rn="animation",on="animationend");var sn="Duration",un="Property",ln="Delay",cn="TimingFunction",fn="IterationCount",mn="PlayState",vn=9999,dn=rn+ln,pn=rn+sn,hn=en+ln,gn=en+sn,$n=function(n){return!(!n||!n.then)},Cn=t.$$minErr("ng"),yn=["$$rAF",function(n){function t(n){a=a.concat(n),e()}function e(){if(a.length){for(var t=a.shift(),i=0;i<t.length;i++)t[i]();r||n(function(){r||e()})}}var a,r;return a=t.queue=[],t.waitUntilQuiet=function(t){r&&r(),r=n(function(){r=null,t(),e()})},t}],Dn=[function(){return function(n,e,a){var r=a.ngAnimateChildren;t.isString(r)&&0===r.length?e.data(nn,!0):a.$observe("ngAnimateChildren",function(n){n="on"===n||"true"===n,e.data(nn,n)})}}],bn="$$animateCss",An=1e3,kn=10,wn=3,Tn=1.5,Sn={transitionDuration:gn,transitionDelay:hn,transitionProperty:en+un,animationDuration:pn,animationDelay:dn,animationIterationCount:rn+fn},xn={transitionDuration:gn,transitionDelay:hn,animationDuration:pn,animationDelay:dn},jn=["$animateProvider",function(n){var t=N(),e=N();this.$get=["$window","$$jqLite","$$AnimateRunner","$timeout","$$forceReflow","$sniffer","$$rAFScheduler","$$animateQueue",function(n,a,r,u,l,c,f,g){function C(n,t){var e="$$ngAnimateParentKey",a=n.parentNode,r=a[e]||(a[e]=++R);return r+"-"+n.getAttribute("class")+"-"+t}function D(e,a,r,i){var o=t.get(r);return o||(o=j(n,e,i),"infinite"===o.animationIterationCount&&(o.animationIterationCount=1)),t.put(r,o),o}function b(r,i,s,u){var l;if(t.count(s)>0&&(l=e.get(s),!l)){var c=o(i,"-stagger");a.addClass(r,c),l=j(n,r,u),l.animationDuration=Math.max(l.animationDuration,0),l.transitionDuration=Math.max(l.transitionDuration,0),a.removeClass(r,c),e.put(s,l)}return l||{}}function T(n){V.push(n),f.waitUntilQuiet(function(){t.flush(),e.flush();for(var n=l(),a=0;a<V.length;a++)V[a](n);V.length=0})}function O(n,t,e){var a=D(n,t,e,Sn),r=a.animationDelay,i=a.transitionDelay;return a.maxDelay=r&&i?Math.max(r,i):r||i,a.maxDuration=Math.max(a.animationDuration*a.animationIterationCount,a.transitionDuration),a}var N=m(a),R=0,q,V=[];return function B(n,e){function l(){m()}function f(){m(!0)}function m(t){W||_&&z||(W=!0,z=!1,V.$$skipPreparationClasses||a.removeClass(n,yn),a.removeClass(n,kn),k(J,!1),A(J,!1),L(K,function(n){J.style[n[0]]=""}),N(n,V),d(n,V),Object.keys(B).length&&L(B,function(n,t){n?J.style.setProperty(t,n):J.style.removeProperty(t)}),V.onDone&&V.onDone(),pn&&pn.length&&n.off(pn.join(" "),R),nn&&nn.complete(!t))}function D(n){Vn.blockTransition&&A(J,n),Vn.blockKeyframeAnimation&&k(J,!!n)}function j(){return nn=new r({end:l,cancel:f}),T(M),m(),{$$willAnimate:!1,start:function(){return nn},end:l}}function R(n){n.stopPropagation();var t=n.originalEvent||n,e=t.$manualTimeStamp||Date.now(),a=parseFloat(t.elapsedTime.toFixed(wn));Math.max(e-dn,0)>=ln&&a>=fn&&(_=!0,m())}function q(){function t(){if(!W){if(D(!1),L(K,function(n){var t=n[0],e=n[1];J.style[t]=e}),N(n,V),a.addClass(n,kn),Vn.recalculateTimingStyles){if(Dn=J.className+" "+yn,On=C(J,Dn),Ln=O(J,Dn,On),Hn=Ln.maxDelay,sn=Math.max(Hn,0),fn=Ln.maxDuration,0===fn)return void m();Vn.hasTransitions=Ln.transitionDuration>0,Vn.hasAnimations=Ln.animationDuration>0}if(Vn.applyAnimationDelay&&(Hn="boolean"!=typeof V.delay&&P(V.delay)?parseFloat(V.delay):Hn,sn=Math.max(Hn,0),Ln.animationDelay=Hn,Bn=x(Hn,!0),K.push(Bn),J.style[Bn[0]]=Bn[1]),ln=sn*An,mn=fn*An,V.easing){var t,r=V.easing;Vn.hasTransitions&&(t=en+cn,K.push([t,r]),J.style[t]=r),Vn.hasAnimations&&(t=rn+cn,K.push([t,r]),J.style[t]=r)}Ln.transitionDuration&&pn.push(an),Ln.animationDuration&&pn.push(on),dn=Date.now();var i=ln+Tn*mn,o=dn+i,s=n.data(bn)||[],l=!0;if(s.length){var c=s[0];l=o>c.expectedEndTime,l?u.cancel(c.timer):s.push(m)}if(l){var f=u(e,i,!1);s[0]={timer:f,expectedEndTime:o},s.push(m),n.data(bn,s)}pn.length&&n.on(pn.join(" "),R),V.to&&(V.cleanupStyles&&F(B,J,Object.keys(V.to)),h(n,V))}}function e(){var t=n.data(bn);if(t){for(var e=1;e<t.length;e++)t[e]();n.removeData(bn)}}if(!W){if(!J.parentNode)return void m();var r=function(n){if(_)z&&n&&(z=!1,m());else if(z=!n,Ln.animationDuration){var t=k(J,z);z?K.push(t):s(K,t)}},i=Rn>0&&(Ln.transitionDuration&&0===Pn.transitionDuration||Ln.animationDuration&&0===Pn.animationDuration)&&Math.max(Pn.animationDelay,Pn.transitionDelay);i?u(t,Math.floor(i*Rn*An),!1):t(),tn.resume=function(){r(!0)},tn.pause=function(){r(!1)}}}var V=e||{};V.$$prepared||(V=v(E(V)));var B={},J=y(n);if(!J||!J.parentNode||!g.enabled())return j();var K=[],Q=n.attr("class"),U=i(V),W,z,_,nn,tn,sn,ln,fn,mn,dn,pn=[];if(0===V.duration||!c.animations&&!c.transitions)return j();var hn=V.event&&H(V.event)?V.event.join(" "):V.event,gn=hn&&V.structural,$n="",Cn="";gn?$n=o(hn,Y,!0):hn&&($n=hn),V.addClass&&(Cn+=o(V.addClass,G)),V.removeClass&&(Cn.length&&(Cn+=" "),Cn+=o(V.removeClass,X)),V.applyClassesEarly&&Cn.length&&N(n,V);var yn=[$n,Cn].join(" ").trim(),Dn=Q+" "+yn,kn=o(yn,Z),Sn=U.to&&Object.keys(U.to).length>0,jn=(V.keyframeStyle||"").length>0;if(!jn&&!Sn&&!yn)return j();var On,Pn;if(V.stagger>0){var In=parseFloat(V.stagger);Pn={transitionDelay:In,animationDelay:In,transitionDuration:0,animationDuration:0}}else On=C(J,Dn),Pn=b(J,yn,On,xn);V.$$skipPreparationClasses||a.addClass(n,yn);var Nn;if(V.transitionStyle){var Fn=[en,V.transitionStyle];w(J,Fn),K.push(Fn)}if(V.duration>=0){Nn=J.style[en].length>0;var Mn=I(V.duration,Nn);w(J,Mn),K.push(Mn)}if(V.keyframeStyle){var En=[rn,V.keyframeStyle];w(J,En),K.push(En)}var Rn=Pn?V.staggerIndex>=0?V.staggerIndex:t.count(On):0,qn=0===Rn;qn&&!V.skipBlocking&&A(J,vn);var Ln=O(J,Dn,On),Hn=Ln.maxDelay;sn=Math.max(Hn,0),fn=Ln.maxDuration;var Vn={};if(Vn.hasTransitions=Ln.transitionDuration>0,Vn.hasAnimations=Ln.animationDuration>0,Vn.hasTransitionAll=Vn.hasTransitions&&"all"==Ln.transitionProperty,Vn.applyTransitionDuration=Sn&&(Vn.hasTransitions&&!Vn.hasTransitionAll||Vn.hasAnimations&&!Vn.hasTransitions),Vn.applyAnimationDuration=V.duration&&Vn.hasAnimations,Vn.applyTransitionDelay=P(V.delay)&&(Vn.applyTransitionDuration||Vn.hasTransitions),Vn.applyAnimationDelay=P(V.delay)&&Vn.hasAnimations,Vn.recalculateTimingStyles=Cn.length>0,(Vn.applyTransitionDuration||Vn.applyAnimationDuration)&&(fn=V.duration?parseFloat(V.duration):fn,Vn.applyTransitionDuration&&(Vn.hasTransitions=!0,Ln.transitionDuration=fn,Nn=J.style[en+un].length>0,K.push(I(fn,Nn))),Vn.applyAnimationDuration&&(Vn.hasAnimations=!0,Ln.animationDuration=fn,K.push(S(fn)))),0===fn&&!Vn.recalculateTimingStyles)return j();if(null!=V.delay){var Bn;"boolean"!=typeof V.delay&&(Bn=parseFloat(V.delay),sn=Math.max(Bn,0)),Vn.applyTransitionDelay&&K.push(x(Bn)),Vn.applyAnimationDelay&&K.push(x(Bn,!0))}return null==V.duration&&Ln.transitionDuration>0&&(Vn.recalculateTimingStyles=Vn.recalculateTimingStyles||qn),ln=sn*An,mn=fn*An,V.skipBlocking||(Vn.blockTransition=Ln.transitionDuration>0,Vn.blockKeyframeAnimation=Ln.animationDuration>0&&Pn.animationDelay>0&&0===Pn.animationDuration),V.from&&(V.cleanupStyles&&F(B,J,Object.keys(V.from)),p(n,V)),Vn.blockTransition||Vn.blockKeyframeAnimation?D(fn):V.skipBlocking||A(J,!1),{$$willAnimate:!0,end:l,start:function(){return W?void 0:(tn={end:l,cancel:f,resume:null,pause:null},nn=new r(tn),T(q),nn)}}}}]}],On=["$$animationProvider",function(n){function t(n){return n.parentNode&&11===n.parentNode.nodeType}n.drivers.push("$$animateCssDriver");var e="ng-animate-shim",a="ng-anchor",r="ng-anchor-out",i="ng-anchor-in";this.$get=["$animateCss","$rootScope","$$AnimateRunner","$rootElement","$sniffer","$$jqLite","$document",function(n,o,s,u,l,c,f){function v(n){return n.replace(/\bng-\S+\b/g,"")}function d(n,t){return V(n)&&(n=n.split(" ")),V(t)&&(t=t.split(" ")),n.filter(function(n){return-1===t.indexOf(n)}).join(" ")}function p(t,o,u){function l(n){var t={},e=y(n).getBoundingClientRect();return L(["width","height","top","left"],function(n){var a=e[n];switch(n){case"top":a+=C.scrollTop;break;case"left":a+=C.scrollLeft}t[n]=Math.floor(a)+"px"}),t}function c(){var t=n(h,{addClass:r,delay:!0,from:l(o)});return t.$$willAnimate?t:null}function f(n){return n.attr("class")||""}function m(){var t=v(f(u)),e=d(t,g),a=d(g,t),o=n(h,{to:l(u),addClass:i+" "+e,removeClass:r+" "+a,delay:!0});return o.$$willAnimate?o:null}function p(){h.remove(),o.removeClass(e),u.removeClass(e)}var h=q(y(o).cloneNode(!0)),g=v(f(h));o.addClass(e),u.addClass(e),h.addClass(a),b.append(h);var D,A=c();if(!A&&(D=m(),!D))return p();var k=A||D;return{start:function(){function n(){e&&e.end()}var t,e=k.start();return e.done(function(){return e=null,!D&&(D=m())?(e=D.start(),e.done(function(){e=null,p(),t.complete()}),e):(p(),void t.complete())}),t=new s({end:n,cancel:n})}}}function h(n,t,e,a){var r=g(n,M),i=g(t,M),o=[];return L(a,function(n){var t=n.out,a=n["in"],r=p(e,t,a);r&&o.push(r)}),r||i||0!==o.length?{start:function(){function n(){L(t,function(n){n.end()})}var t=[];r&&t.push(r.start()),i&&t.push(i.start()),L(o,function(n){t.push(n.start())});var e=new s({end:n,cancel:n});return s.all(t,function(n){e.complete(n)}),e}}:void 0}function g(t){var e=t.element,a=t.options||{};t.structural&&(a.event=t.event,a.structural=!0,a.applyClassesEarly=!0,"leave"===t.event&&(a.onDone=a.domOperation)),a.preparationClasses&&(a.event=T(a.event,a.preparationClasses));var r=n(e,a);return r.$$willAnimate?r:null}if(!l.animations&&!l.transitions)return M;var C=f[0].body,D=y(u),b=q(t(D)||C.contains(D)?D:C),A=m(c);return function k(n){return n.from&&n.to?h(n.from,n.to,n.classes,n.anchors):g(n)}}]}],Pn=["$animateProvider",function(n){this.$get=["$injector","$$AnimateRunner","$$jqLite",function(t,e,a){function r(e){e=H(e)?e:e.split(" ");for(var a=[],r={},i=0;i<e.length;i++){var o=e[i],s=n.$$registeredAnimations[o];s&&!r[o]&&(a.push(t.get(s)),r[o]=!0)}return a}var i=m(a);return function(n,t,a,o){function s(){o.domOperation(),i(n,o)}function u(){m=!0,s(),d(n,o)}function l(n,t,a,r,i){var o;switch(a){case"animate":o=[t,r.from,r.to,i];break;case"setClass":o=[t,p,h,i];break;case"addClass":o=[t,p,i];break;case"removeClass":o=[t,h,i];break;default:o=[t,i]}o.push(r);var s=n.apply(n,o);if(s)if(Q(s.start)&&(s=s.start()),s instanceof e)s.done(i);else if(Q(s))return s;return M}function c(n,t,a,r,i){var o=[];return L(r,function(r){var s=r[i];s&&o.push(function(){var r,i,o=!1,u=function(n){o||(o=!0,(i||M)(n),r.complete(!n))};return r=new e({end:function(){u()},cancel:function(){u(!0)}}),i=l(s,n,t,a,function(n){var t=n===!1;u(t)}),r})}),o}function f(n,t,a,r,i){var o=c(n,t,a,r,i);if(0===o.length){var s,u;"beforeSetClass"===i?(s=c(n,"removeClass",a,r,"beforeRemoveClass"),u=c(n,"addClass",a,r,"beforeAddClass")):"setClass"===i&&(s=c(n,"removeClass",a,r,"removeClass"),u=c(n,"addClass",a,r,"addClass")),s&&(o=o.concat(s)),u&&(o=o.concat(u))}if(0!==o.length)return function l(n){var t=[];return o.length&&L(o,function(n){t.push(n())}),t.length?e.all(t,n):n(),function a(n){L(t,function(t){n?t.cancel():t.end()})}}}var m=!1;3===arguments.length&&B(a)&&(o=a,a=null),o=v(o),a||(a=n.attr("class")||"",o.addClass&&(a+=" "+o.addClass),o.removeClass&&(a+=" "+o.removeClass));var p=o.addClass,h=o.removeClass,g=r(a),C,y;if(g.length){var D,b;"leave"==t?(b="leave",D="afterLeave"):(b="before"+t.charAt(0).toUpperCase()+t.substr(1),D=t),"enter"!==t&&"move"!==t&&(C=f(n,t,o,g,b)),y=f(n,t,o,g,D)}if(C||y){var A;return{$$willAnimate:!0,end:function(){return A?A.end():(u(),A=new e,A.complete(!0)),A},start:function(){function n(n){u(n),A.complete(n)}function t(t){m||((a||M)(t),n(t))}if(A)return A;A=new e;var a,r=[];return C&&r.push(function(n){a=C(n)}),r.length?r.push(function(n){s(),n(!0)}):s(),y&&r.push(function(n){a=y(n)}),A.setHost({end:function(){t()},cancel:function(){t(!0)}}),e.chain(r,n),A}}}}}]}],In=["$$animationProvider",function(n){n.drivers.push("$$animateJsDriver"),this.$get=["$$animateJs","$$AnimateRunner",function(n,t){function e(t){var e=t.element,a=t.event,r=t.options,i=t.classes;return n(e,a,i,r)}return function a(n){if(n.from&&n.to){var a=e(n.from),r=e(n.to);if(!a&&!r)return;return{start:function(){function n(){return function(){L(i,function(n){n.end()})}}function e(n){o.complete(n)}var i=[];a&&i.push(a.start()),r&&i.push(r.start()),t.all(i,e);var o=new t({end:n(),cancel:n()});return o}}}return e(n)}}]}],Nn="data-ng-animate",Fn="$ngAnimatePin",Mn=["$animateProvider",function(n){function t(n){if(!n)return null;var t=n.split(c),e=Object.create(null);return L(t,function(n){e[n]=!0}),e}function e(n,e){if(n&&e){var a=t(e);return n.split(c).some(function(n){return a[n]})}}function r(n,t,e,a){return f[n].some(function(n){return n(t,e,a)})}function i(n,t){n=n||{};var e=(n.addClass||"").length>0,a=(n.removeClass||"").length>0;return t?e&&a:e||a}var o=1,s=2,c=" ",f=this.rules={skip:[],cancel:[],join:[]};f.join.push(function(n,t,e){return!t.structural&&i(t.options)}),f.skip.push(function(n,t,e){return!t.structural&&!i(t.options)}),f.skip.push(function(n,t,e){return"leave"==e.event&&t.structural}),f.skip.push(function(n,t,e){return e.structural&&e.state===s&&!t.structural}),f.cancel.push(function(n,t,e){return e.structural&&t.structural}),f.cancel.push(function(n,t,e){return e.state===s&&t.structural}),f.cancel.push(function(n,t,a){var r=t.options.addClass,i=t.options.removeClass,o=a.options.addClass,s=a.options.removeClass;return J(r)&&J(i)||J(o)&&J(s)?!1:e(r,s)||e(i,o)}),this.$get=["$$rAF","$rootScope","$rootElement","$document","$$HashMap","$$animation","$$AnimateRunner","$templateRequest","$$jqLite","$$forceReflow",function(t,e,c,f,p,h,C,A,k,w){function T(){var n=!1;return function(t){n?t():e.$$postDigest(function(){n=!0,t()})}}function S(n,t){return g(n,t,{})}function x(n,t,e){var a=y(t),r=y(n),i=[],o=X[e];return o&&L(o,function(n){tn.call(n.node,a)?i.push(n.callback):"leave"===e&&tn.call(n.node,r)&&i.push(n.callback)}),i}function j(n,a,l){function c(e,a,r,i){j(function(){var e=x(k,n,a);e.length&&t(function(){L(e,function(t){t(n,r,i)})})}),e.progress(a,r,i)}function m(t){b(n,p),_(n,p),d(n,p),p.domOperation(),w.complete(!t)}var p=E(l),A,k;n=u(n),n&&(A=y(n),k=n.parent()),p=v(p);var w=new C,j=T();if(H(p.addClass)&&(p.addClass=p.addClass.join(" ")),p.addClass&&!V(p.addClass)&&(p.addClass=null),H(p.removeClass)&&(p.removeClass=p.removeClass.join(" ")),p.removeClass&&!V(p.removeClass)&&(p.removeClass=null),p.from&&!B(p.from)&&(p.from=null),p.to&&!B(p.to)&&(p.to=null),!A)return m(),w;var I=[A.className,p.addClass,p.removeClass].join(" ");if(!Z(I))return m(),w;var R=["enter","move","leave"].indexOf(a)>=0,q=!z||f[0].hidden||Q.get(A),J=!q&&M.get(A)||{},K=!!J.state;if(q||K&&J.state==o||(q=!N(n,k,a)),q)return m(),w;R&&O(n);var U={structural:R,element:n,event:a,close:m,options:p,runner:w};if(K){var W=r("skip",n,U,J);if(W)return J.state===s?(m(),w):(g(n,J.options,p),J.runner);var G=r("cancel",n,U,J);if(G)if(J.state===s)J.runner.end();else{if(!J.structural)return g(n,J.options,U.options),J.runner;J.close()}else{var X=r("join",n,U,J);if(X){if(J.state!==s)return D(n,R?a:null,p),a=U.event=J.event,p=g(n,J.options,U.options),J.runner;S(n,p)}}}else S(n,p);var Y=U.structural;if(Y||(Y="animate"===U.event&&Object.keys(U.options.to||{}).length>0||i(U.options)),!Y)return m(),P(n),w;var nn=(J.counter||0)+1;return U.counter=nn,F(n,o,U),e.$$postDigest(function(){var t=M.get(A),e=!t;t=t||{};var r=n.parent()||[],o=r.length>0&&("animate"===t.event||t.structural||i(t.options));if(e||t.counter!==nn||!o)return e&&(_(n,p),d(n,p)),(e||R&&t.event!==a)&&(p.domOperation(),w.end()),void(o||P(n));a=!t.structural&&i(t.options,!0)?"setClass":t.event,F(n,s);var u=h(n,a,t.options);u.done(function(t){m(!t);var e=M.get(A);e&&e.counter===nn&&P(y(n)),c(w,a,"close",{})}),w.setHost(u),c(w,a,"start",{})}),w}function O(n){var t=y(n),e=t.querySelectorAll("["+Nn+"]");L(e,function(n){var t=parseInt(n.getAttribute(Nn)),e=M.get(n);if(e)switch(t){case s:e.runner.end();case o:M.remove(n)}})}function P(n){var t=y(n);t.removeAttribute(Nn),M.remove(t)}function I(n,t){return y(n)===y(t)}function N(n,t,e){var a=q(f[0].body),r=I(n,a)||"HTML"===n[0].nodeName,i=I(n,c),o=!1,s,u=Q.get(y(n)),l=n.data(Fn);for(l&&(t=l);t&&t.length;){i||(i=I(t,c));var m=t[0];if(m.nodeType!==W)break;var v=M.get(m)||{};if(!o){var d=Q.get(m);if(d===!0&&u!==!1){u=!0;break}d===!1&&(u=!1),o=v.structural}if(J(s)||s===!0){var p=t.data(nn);K(p)&&(s=p)}if(o&&s===!1)break;if(r||(r=I(t,a)),r&&i)break;t=i||!(l=t.data(Fn))?t.parent():l}var h=(!o||s)&&u!==!0;return h&&i&&r}function F(n,t,e){e=e||{},e.state=t;var a=y(n);a.setAttribute(Nn,t);var r=M.get(a),i=r?R(r,e):e;M.put(a,i)}var M=new p,Q=new p,z=null,G=e.$watch(function(){return 0===A.totalPendingRequests},function(n){n&&(G(),e.$$postDigest(function(){e.$$postDigest(function(){null===z&&(z=!0)})}))}),X={},Y=n.classNameFilter(),Z=Y?function(n){return Y.test(n)}:function(){return!0},_=m(k),tn=Node.prototype.contains||function(n){return this===n||!!(16&this.compareDocumentPosition(n))};return{on:function(n,t,e){var a=l(t);X[n]=X[n]||[],X[n].push({node:a,callback:e})},off:function(n,t,e){function a(n,t,e){var a=l(t);return n.filter(function(n){var t=n.node===a&&(!e||n.callback===e);return!t})}var r=X[n];r&&(X[n]=1===arguments.length?null:a(r,t,e))},pin:function(n,t){a(U(n),"element","not an element"),a(U(t),"parentElement","not an element"),n.data(Fn,t)},push:function(n,t,e,a){return e=e||{},e.domOperation=a,j(n,t,e)},enabled:function(n,t){var e=arguments.length;if(0===e)t=!!z;else{var a=U(n);if(a){var r=y(n),i=Q.get(r);1===e?t=!i:Q.put(r,!t)}else t=z=!!n}return t}}}]}],En=["$animateProvider",function(n){function t(n,t){n.data(s,t)}function e(n){n.removeData(s)}function a(n){return n.data(s)}var i="ng-animate-ref",o=this.drivers=[],s="$$animationRunner";this.$get=["$$jqLite","$rootScope","$injector","$$AnimateRunner","$$HashMap","$$rAFScheduler",function(n,s,u,l,c,f){function p(n){function t(n){if(n.processed)return n;n.processed=!0;var e=n.domNode,r=e.parentNode;i.put(e,n);for(var o;r;){if(o=i.get(r)){o.processed||(o=t(o));break}r=r.parentNode}return(o||a).children.push(n),n}function e(n){var t=[],e=[],a;for(a=0;a<n.children.length;a++)e.push(n.children[a]);var r=e.length,i=0,o=[];for(a=0;a<e.length;a++){var s=e[a];0>=r&&(r=i,i=0,t.push(o),o=[]),o.push(s.fn),s.children.forEach(function(n){i++,e.push(n)}),r--}return o.length&&t.push(o),t}var a={children:[]},r,i=new c;for(r=0;r<n.length;r++){var o=n[r];i.put(o.domNode,n[r]={domNode:o.domNode,fn:o.fn,children:[]})}for(r=0;r<n.length;r++)t(n[r]);return e(a)}var h=[],g=m(n);return function(c,m,C){function D(n){var t="["+i+"]",e=n.hasAttribute(i)?[n]:n.querySelectorAll(t),a=[];return L(e,function(n){var t=n.getAttribute(i);t&&t.length&&a.push(n)}),a}function b(n){var t=[],e={};L(n,function(n,a){var r=n.element,o=y(r),s=n.event,u=["enter","move"].indexOf(s)>=0,l=n.structural?D(o):[];if(l.length){var c=u?"to":"from";L(l,function(n){var t=n.getAttribute(i);e[t]=e[t]||{},e[t][c]={animationID:a,element:q(n)}})}else t.push(n)});var a={},r={};return L(e,function(e,i){var o=e.from,s=e.to;if(!o||!s){var u=o?o.animationID:s.animationID,l=u.toString();return void(a[l]||(a[l]=!0,t.push(n[u])))}var c=n[o.animationID],f=n[s.animationID],m=o.animationID.toString();if(!r[m]){var v=r[m]={structural:!0,beforeStart:function(){c.beforeStart(),f.beforeStart()},close:function(){c.close(),f.close()},classes:A(c.classes,f.classes),from:c,to:f,anchors:[]};v.classes.length?t.push(v):(t.push(c),t.push(f))}r[m].anchors.push({out:o.element,"in":s.element})}),t}function A(n,t){n=n.split(" "),t=t.split(" ");for(var e=[],a=0;a<n.length;a++){var r=n[a];if("ng-"!==r.substring(0,3))for(var i=0;i<t.length;i++)if(r===t[i]){e.push(r);break}}return e.join(" ")}function k(n){for(var t=o.length-1;t>=0;t--){var e=o[t];if(u.has(e)){var a=u.get(e),r=a(n);if(r)return r}}}function w(){c.addClass(_),I&&n.addClass(c,I)}function T(n,t){function e(n){a(n).setHost(t)}n.from&&n.to?(e(n.from.element),e(n.to.element)):e(n.element)}function S(){var n=a(c);!n||"leave"===m&&C.$$domOperationFired||n.end()}function x(t){c.off("$destroy",S),e(c),g(c,C),d(c,C),C.domOperation(),I&&n.removeClass(c,I),c.removeClass(_),O.complete(!t)}C=v(C);var j=["enter","move","leave"].indexOf(m)>=0,O=new l({end:function(){x()},cancel:function(){x(!0)}});if(!o.length)return x(),O;t(c,O);var P=r(c.attr("class"),r(C.addClass,C.removeClass)),I=C.tempClasses;return I&&(P+=" "+I,C.tempClasses=null),h.push({element:c,classes:P,event:m,structural:j,options:C,beforeStart:w,close:x}),c.on("$destroy",S),h.length>1?O:(s.$$postDigest(function(){var n=[];L(h,function(t){a(t.element)?n.push(t):t.close()}),h.length=0;var t=b(n),e=[];L(t,function(n){e.push({domNode:y(n.from?n.from.element:n.element),fn:function t(){n.beforeStart();var t,e=n.close,r=n.anchors?n.from.element||n.to.element:n.element;if(a(r)){var i=k(n);i&&(t=i.start)}if(t){var o=t();o.done(function(n){e(!n)}),T(n,o)}else e()}})}),f(p(e))}),O)}}]}];t.module("ngAnimate",[]).directive("ngAnimateChildren",Dn).factory("$$rAFScheduler",yn).provider("$$animateQueue",Mn).provider("$$animation",En).provider("$animateCss",jn).provider("$$animateCssDriver",On).provider("$$animateJs",Pn).provider("$$animateJsDriver",In)}(window,window.angular);