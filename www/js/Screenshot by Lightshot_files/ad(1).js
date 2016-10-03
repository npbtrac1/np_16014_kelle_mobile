var adserver_domain = 'ssp.mediawayss.com';
var script_name = 'ad.js';
var delivery_path = '/delivery/impress';

/* Are you using the Forensiq.com Ad Fraud Service? */
var forensiq_enabled = false;
var forensiq_api_key = '';

var cookie_matching_pixels = [
    // ZENOVIA EXCHANGE
    // "//sync.nj.zenoviaexchange.com/usersync2/partner_id",
    // TURN
    // "//ad.turn.com/server/pixel.htm?fpid=13&r=12345",
    // MEDIA MATH
    // "//pixel.mathtag.com/sync/js?sync=auto",
    // DSTILLERY
    // "//idpix.media6degrees.com/orbserv/hbpix?pixId=1",
    // CHANGO
    // "//lj.d.chango.com/m/lj?r=12345",
    // RFI HUB
    // "//p.rfihub.com/cm?in=1&pub=1",
    // APPNEXUS
    // "//ib.adnxs.com/getuid?http://mydomain.com/merge?pid=12&3pid=$UID",
    // RTB BIDDER
    // "//match.rtbidder.net/match?p=31&ord=12345",
    // SITE SCOUT
    // "//pixel.sitescout.com/dmp/pixelSync?network=partner_id",
    // CASALE MEDIA
    // "//ip.casalemedia.com/usermatch?s=178636&cb=http%3A%2F%2Fmydomain.com%2Fmerge%3Fpid%3D18%263pid%3D",
    // IPONWEB:
    // "//x.bidswitch.net/sync?ssp=partner_id",
    // TRADE DESK
    // "//data.adsrvr.org/track/cmf/generic?ttd_pid=partner_id",
    // RUBICON PROJECT
    // "//pixel.rubiconproject.com/tap.php?v=other&nid=partner_id&put={user_token}&expires={days}",
    // AUDIENCE SCIENCE
    // "//pix04.revsci.net/D08734/a3/0/3/0.302?matchId=100&PV=0",
    // FIDELITY MEDIA
    // "//x.fidelity-media.com/pixel.gif?dsp=<DSP-ID>&url=<DSP-Redirect-URL>&<DSP-ID-Variable>=<DSPUser-ID>&<SSP-ID-Variable>=<SSP-User-ID>"
];

function createTrackingPixel(url) {
    (new Image()).src = url;
}

function fireCookieMatchingPixels() {
    for (i in cookie_matching_pixels) {
        createTrackingPixel(cookie_matching_pixels[i]);
    }
}

function fireQSPixels(id, id_type, org_tld, ref) {
    if (forensiq_enabled == true) {
        trackForensiq(id, id_type, org_tld, ref);
    }
}

if (typeof NGIN_AdsiFrame_Opts === "undefined") {
    var NGIN_AdsiFrame_Opts = null;
}

if (typeof NGIN_placement_id === "undefined") {
    var NGIN_placement_id = null;
}

var NGIN_AdsiFrame = (function () {

    function isInIframe() {
        return self !== top;
    }

    function getScriptTag() {
        if ('currentScript' in document) {
            return document.currentScript;
        }
        var scripts = document.getElementsByTagName('script');
        var last_script = scripts[scripts.length - 1];
        var rg = new RegExp(script_name, 'i');
        if (last_script.src.search(rg) >= 0) {
            return last_script;
        } else {
            try {
                for (var n = scripts.length - 1; n >= 0; n--) {
                    if (scripts[n].src.search(rg) >= 0) {
                        return scripts[n];
                    }
                }
            } catch (e) { }
        }
        return last_script;
    }

    function getQueryString() {
        var myScript = getScriptTag();
        var rg = new RegExp(script_name, 'i');
        if (myScript.src.search(rg) >= 0) {
            return myScript.src.replace(/^[^\?]+\??/, '');
        } else {
            return false;
        }
    }

    function getQueryStringArg(qs, key, default_) {
        default_ = default_ || '';
        var query_obj = {};
        qs.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function ($0, $1, $2, $3) {
            query_obj[$1] = $3;
        });
        if (typeof(query_obj[key]) === 'undefined' || query_obj[key] === null) {
            return default_;
        } else {
            return query_obj[key];
        }
    }

    function getSiteURL() {
        var site_loc = '';
        try {
            if (isInIframe() && document.referrer) {
                site_loc = document.referrer.replace(/^\s+|\s+$/g, '');
            } else {
                site_loc = document.location.href;
            }
        } catch (e) { }
        return site_loc.replace(/["']/g, '');
    }

    function getRefSiteURL() {
        var ref = '';
        if (!isInIframe()) {
            ref = document.referrer.replace(/^\s+|\s+$|["']/g, '');
        }
        return ref;
    }

    function getOD() {
        return parseUri(document.location.href.replace(/["']/g, '')).host;
    }

    function getNGINAtf(id, viewport) {
        var ret = "";
        if (!viewport || viewport.status != "ok") {
            ret = "error";
        }
        try {
            var rect = getNGINPosition(id);
            ret = ((rect.x + rect.width <= viewport.x + viewport.width) && (rect.y + rect.height <= viewport.y + viewport.height));
        } catch (e) {
            ret = "error";
        }
        return ret == true ? 1 : 0;
    }

    function getNGINPosition(id, width, height) {
        var w = (width) ? width : 0;
        var h = (height) ? height : 0;
        var y = 0;
        var x = 0;
        var rect = {x: x, y: y, width: w, height: h};
        var de = document.documentElement;
        try {
            var obj = document.getElementById(id);
            while (obj) {
                rect.x += obj.offsetLeft;
                rect.y += obj.offsetTop;
                obj = obj.offsetParent;
            }
            if (self.pageYOffset) {
                rect.x -= self.pageXOffset;
                rect.y -= self.pageYOffset;
            } else if (de && de.scrollTop) {
                rect.x -= de.scrollLeft;
                rect.y -= de.scrollTop;
            } else if (document.body) {
                rect.x -= document.body.scrollLeft;
                rect.y -= document.body.scrollTop;
            }
        } catch (e) { }
        return rect;
    }

    function getNGINViewport() {
        var viewport = {x: 0, y: 0, width: 0, height: 0, status: ''};
        var bw = 0;
        var bh = 0;
        var de = de;
        var w = window;
        var db = document.body;
        try {
            if (typeof w.innerWidth === 'number') {
                bw = w.innerWidth;
                bh = w.innerHeight;
            } else if (de && (de.clientWidth || de.clientHeight)) {
                bw = de.clientWidth;
                bh = de.clientHeight;
            } else if (db && (db.clientWidth || db.clientHeight)) {
                bw = db.clientWidth;
                bh = db.clientHeight;
            } else if (de && (de.offsetWidth || de.offsetHeight)) {
                bw = de.offsetWidth;
                bh = de.offsetHeight;
            }
            viewport.status = "ok";
            viewport.width = bw;
            viewport.height = bh;
        } catch (e) {
            viewport.status = "error";
        }
        return viewport;
    }

    function parseUri(u) {
        try {
            var o = {
                key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
                q: {name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g},
                parser: {loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}
            };
            var m = o.parser.loose.exec(u);
            var uri = {};
            var i = 14;
            while (i--) {
                uri[o.key[i]] = m[i] || '';
            }
            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
                if ($1) uri[o.q.name][$1] = $2;
            });
            return uri;
        } catch (e) { }
        return u;
    }

    function getNGINQueryString(id, qs, atf, add_all_tokens) {
        var qstring = '?atf=' + atf;
        var viewport = getNGINViewport();
        if (viewport && viewport.status == "ok") {
            qstring += '&scres_height=' + viewport.height;
            qstring += '&scres_width=' + viewport.width;
        }
        var adPosition = getNGINPosition(id);
        if (adPosition) {
            qstring += '&adpos_x=' + adPosition.x;
            qstring += '&adpos_y=' + adPosition.y;
        }
        var e = encodeURIComponent;
        if (add_all_tokens) {
            qstring += '&loc=' + e(getSiteURL()) + '&od=' + e(getOD()) + '&ref=' + e(getRefSiteURL());
        }
        var args = qs.split('&');
        for (var i = 0; i < args.length; i++) {
            var arg = args[i].split('=')
            var key = arg[0]
            var value = arg[1];
            if (key === 'debug' || key === 'u' || key === 'zoneid' || key === 'pzoneid' || key === 'n' || key === 'NGIN_domain' || key.match(/^NGIN_/)) {
                qstring += '&' + e(key) + "=" + e(value);
            }
        }
        return qstring;
    }

    function createiFrame(id, width, height) {
        var ifrm = document.createElement('iframe');
        ifrm.setAttribute('id', id);
        ifrm.setAttribute('margin', '0');
        ifrm.setAttribute('padding', '0');
        ifrm.setAttribute('frameBorder', '0');
        ifrm.setAttribute('width', width + '');
        ifrm.setAttribute('height', height + '');
        ifrm.setAttribute('scrolling', 'no');
        try {
            ifrm.style.margin = "0px";
            ifrm.style.padding = "0px";
            ifrm.style.border = '0px none';
            ifrm.style.width = width + "px";
            ifrm.style.height = height + "px";
            ifrm.style.overflow = 'hidden';
        } catch (e) { }
        return ifrm;
    }

    function createBrandItem()
    {
        var brandSrc = "http://ssp.mediawayss.com/images/favicon-16px.png";
        var link = document.createElement('a');
        try{
            link.className = "brand-link";
            link.title = "Mediawayss";
            link.href = "http://mediawayss.com";
            link.target = "_blank";
            link.style.position = "fixed";
            link.style.bottom = "3px";
            link.style.right = "0px";
            link.style.height = "15px";
            link.style.display = "block";
            link.style.paddingLeft = "18px";
            link.style.backgroundImage = "url(" + brandSrc + ")";
            link.style.backgroundSize = "15px";
            link.style.backgroundPosition = "0% 50%";
            link.style.backgroundRepeat = "no-repeat";
            link.style.cursor = "pointer";
            link.style.textDecoration = "none";

            var text = document.createElement('span');
            try{
                text.className = 'brand-text';
                text.style.color = "rgb(33, 33, 33)";
                text.style.fontSize = "10px";
                text.style.lineHeight = "15px";
                text.style.fontFamily = "Arial, sans-serif";
                text.style.opacity = "0";
                link.style.width = "0px";
                text.textContent = "Mediawayss";
                text.style.transition = "all 0.5s 0.5s linear";
                link.style.transition = "width 0.5s 0.5s linear";
                link.appendChild(text);
                link.onmouseover = function () {
                    text.style.visibility = "visible";
                    link.style.width = "60px";
                    text.style.opacity = "1";
                }
                link.onmouseout = function () {
                    text.style.visibility = "hidden";
                    link.style.width = "0px";
                    text.style.opacity = "0";
                }
            }catch (e) { }
        }catch (e) { }

        return link;
    }

    var qs = null;
    var scriptTag;
    if (NGIN_AdsiFrame_Opts !== null) {
        qs = NGIN_AdsiFrame_Opts;
    } else {
        qs = getQueryString();
    }
    var domain = getQueryStringArg(qs, 'NGIN_domain', adserver_domain);
    var id_type = 'pzoneid';
    var id = getQueryStringArg(qs, 'pzoneid');
    if (!id) {
        id = getQueryStringArg(qs, 'zoneid');
        id_type = 'zoneid';
    }
    var abf = getNGINAtf(id, getNGINViewport());
    var org_tld = getQueryStringArg(qs, 'tld', "");
    var ct_url = getQueryStringArg(qs, 'ct0', "");
    var buyer_id = getQueryStringArg(qs, 'buyerid', "");
    var sndprc = getQueryStringArg(qs, 'sndprc', "");
    var ui = getQueryStringArg(qs, 'ui', "");
    var cb = Math.round(new Date().getTime() / 1000);
    var hb = getQueryStringArg(qs, 'hb', "false");
    var hb_adid = getQueryStringArg(qs, 'hb_adid', "");
    var hb_bidder = getQueryStringArg(qs, 'hb_bidder', "");
    var hb_nginad_bidder_id = getQueryStringArg(qs, 'hb_nginad_bidder_id', "");
    var hb_pb = getQueryStringArg(qs, 'hb_pb', "");
    var houseAds = getQueryStringArg(qs, 'houseAds', "");

    fireCookieMatchingPixels();

    fireQSPixels(id, id_type, org_tld, getRefSiteURL());

    var adQueryString = getNGINQueryString(id, qs, abf, false);
    adQueryString += "&dt=in";
    adQueryString += "&buyerid=" + encodeURIComponent(buyer_id);
    adQueryString += "&loc=" + encodeURIComponent(getSiteURL());
    adQueryString += "&ref=" + encodeURIComponent(getRefSiteURL());
    adQueryString += "&ifr=" + (isInIframe() ? '1' : '0');
    adQueryString += "&tld=" + encodeURIComponent(getOD());
    adQueryString += "&sndprc=" + encodeURIComponent(sndprc);
    adQueryString += "&ui=" + ui;
    adQueryString += "&ct=" + encodeURIComponent(ct_url);
    adQueryString += "&org_tld=" + encodeURIComponent(org_tld);
    adQueryString += "&cb=" + cb;
    if (hb == "true") {
        adQueryString += "&hb=" + hb;
        adQueryString += "&hb_adid=" + hb_adid;
        adQueryString += "&hb_bidder=" + hb_bidder;
        adQueryString += "&hb_nginad_bidder_id=" + hb_nginad_bidder_id;
        adQueryString += "&hb_pb=" + hb_pb;
        adQueryString += "&houseAds=" + houseAds;
    }

    var fpTag = '<scr' + 'ipt type="text/javascript" src="//' + domain + delivery_path + adQueryString + '"></scr' + 'ipt>';
    var htmlPrefix = "<html><head><title></title></head><body style='padding:0px;margin:0px;'>";
    var htmlSuffix = "<![if !IE]><script type='text/javascript'>document.close();</script><![endif]></body></html>";

    if (isInIframe()) {
        document.write(fpTag);
    } else {
        if (NGIN_AdsiFrame_Opts !== null) {
            var placement = NGIN_placement_id || "NGIN_FPI_" + getQueryStringArg(qs, 'z', 0);
            scriptTag = document.getElementById(placement) || getScriptTag();
        } else {
            scriptTag = getScriptTag();
        }
        var width = getQueryStringArg(qs, 'width', 160);
        var height = getQueryStringArg(qs, 'height', 600);
        var ifrm = createiFrame(id, width, height);
        var brand = createBrandItem();
        scriptTag.parentNode.insertBefore(ifrm, scriptTag);
        fpTag = '<scr' + 'ipt type="text/javascript" src="//' + domain + delivery_path + adQueryString + '"></scr' + 'ipt>';
        if (getQueryStringArg(qs, 'NGIN_src', '0') === '1') {
            var ad_server_domain = getQueryStringArg(qs, 'NGIN_ad_domain', adserver_domain);
            ifrm.src = '//' + ad_server_domain + delivery_path + adQueryString;
        } else {
            var ifr_content = ifrm.contentWindow.document || ifrm.contentDocument;
            ifr_content.write(htmlPrefix + fpTag + htmlSuffix);
            ifr_content.body.appendChild(brand);
        }
    }
    return {};
})();

NGIN_placement_id = null;
NGIN_AdsiFrame_Opts = null;

function trackForensiq(id, id_type, org_tld, ref) {
    var cmpid = id_type + '-' + id;
    var forensiqTracker = '//c.fqtag.com/tag/implement-r.js?org=' + forensiq_api_key;
    forensiqTracker += '&s=' + guid();
    forensiqTracker += '&p=' + encodeURIComponent(org_tld);
    forensiqTracker += '&cmp=' + cmpid;
    forensiqTracker += '&rt=display&sl=1';
    forensiqTracker += '&fmt=banner';
    forensiqTracker += '&rd=' + encodeURIComponent(ref);
    forensiqTracker += '&fq=1';
    document.write('<scri' + 'pt src="' + forensiqTracker + '"></scri' + 'pt>');
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
