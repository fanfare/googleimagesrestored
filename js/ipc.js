// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
var fromCharCode = String.fromCharCode;
var btoaUTF8 = (function(btoa, replacer){"use strict";
    return function(inputString, BOMit){
        return btoa((BOMit ? "\xEF\xBB\xBF" : "") + inputString.replace(
            /[\x80-\uD7ff\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g, replacer
        ));
    }
})(btoa, function(nonAsciiChars){"use strict";
    // make the UTF string into a binary UTF-8 encoded string
    var point = nonAsciiChars.charCodeAt(0);
    if (point >= 0xD800 && point <= 0xDBFF) {
        var nextcode = nonAsciiChars.charCodeAt(1);
        if (nextcode !== nextcode) // NaN because string is 1 code point long
            return fromCharCode(0xef/*11101111*/, 0xbf/*10111111*/, 0xbd/*10111101*/);
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        if (nextcode >= 0xDC00 && nextcode <= 0xDFFF) {
            point = (point - 0xD800) * 0x400 + nextcode - 0xDC00 + 0x10000;
            if (point > 0xffff)
                return fromCharCode(
                    (0x1e/*0b11110*/<<3) | (point>>>18),
                    (0x2/*0b10*/<<6) | ((point>>>12)&0x3f/*0b00111111*/),
                    (0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/),
                    (0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/)
                );
        } else return fromCharCode(0xef, 0xbf, 0xbd);
    }
    if (point <= 0x007f) return nonAsciiChars;
    else if (point <= 0x07ff) {
        return fromCharCode((0x6<<5)|(point>>>6), (0x2<<6)|(point&0x3f));
    } else return fromCharCode(
        (0xe/*0b1110*/<<4) | (point>>>12),
        (0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/),
        (0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/)
    );
});

const ajaxwindow = `
  <div id="gisipcwindowcontext" style="display:none">${JSON.stringify({gisipcblobid:0, gisipcblobfullsize:""})}</div>
  <div id="gisipcajaxcontent" style="display:none"></div>
`

try {
  document.body.insertAdjacentHTML("afterbegin", ajaxwindow)
}
catch(e) {
  // regarding:
  // content-security-policy: require-trusted-types-for 'script';report-uri /_/VisualFrontendUi/cspreport
  
  // chrome 96
  if (typeof trustedTypes !== 'undefined') {
    const policy = trustedTypes.createPolicy('report-uri', {
      createHTML: (input) => input
    })
    document.body.insertAdjacentHTML("afterbegin", policy.createHTML(ajaxwindow))
  }
  else {
    console.error("trustedTypes is undefined - ajaxwindow")
  }
}

var imagepoolfromallresponsestext = ""

;(function(open) {
  XMLHttpRequest.prototype.open = function(a, b, c, d, e) {
    this.addEventListener("readystatechange", function() {
      try {
        if ( this 
          && this.readyState 
          && this.readyState === 4 
          && this.responseText 
          && this.responseText.length > 0 ) {
          imagepoolfromallresponsestext = imagepoolfromallresponsestext + this.responseText
          var gisipcajaxcontent = document.getElementById("gisipcajaxcontent")
          try {
            gisipcajaxcontent.innerHTML = btoaUTF8(imagepoolfromallresponsestext)
          }
          catch(e) {
            // chrome 96
            if (typeof trustedTypes !== 'undefined') {
              const policy = trustedTypes.createPolicy('report-uri', {
                createHTML: (input) => input
              })
              gisipcajaxcontent.innerHTML = policy.createHTML(btoaUTF8(imagepoolfromallresponsestext))
            }
            else {
              console.error("trustedTypes is undefined - imagepoolfromallresponsetext")
            }            
          }
        }
      }
      catch(e) {
        console.log(e)
      }
    }, false)
    open.call(this, a, b, c, d, e)
  }
})(XMLHttpRequest.prototype.open);

// gisipcprocess(391, "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRwoVCofjadFKP2kZYbTTMtiaHE1Ts-N_J-NQXullw0dwg_dZR1")

function gisipcprocess(gisipcblobid, gisipcblobdata) {
  var fullsize = ""  
  var realfullsizeimage = null
  // initial images 
  try {
    var clipf = "Cf"
    var smef = document.querySelectorAll(`c-wiz.P3Xfjc`)[0].__jscontroller.o.H[0][clipf]
    if (smef && !smef.j) {
      clipf = "Of"
    }
    var tarlength = document.querySelectorAll(`c-wiz.P3Xfjc`)[0].__jscontroller.o.H[0][clipf].j[0].j[3].length
    for (let i=0;i<tarlength;i++) {
      try {
        let reqei = gisipcblobdata
        let basei = document.querySelectorAll(`c-wiz.P3Xfjc`)[0].__jscontroller.o.H[0][clipf].j[0].j[3][i]
        var subasei = basei.j[2].j[3].H[0]
        if (subasei === reqei) {
          try {
            realfullsizeimage = basei.j[2].j[4].H[0]
          }
          catch(e) {
            
          }
          break
        }
      }
      catch(e) {
        // console.error(e)  
      }
    }
  }
  catch(e) {
    console.log("primary fullsize method not found.. onward")
  }
  
  if (realfullsizeimage !== null) {
    console.log("1n f")
    fullsize = realfullsizeimage
    document.getElementById("gisipcwindowcontext").innerText = JSON.stringify({gisipcblobid:gisipcblobid, gisipcblobfullsize:fullsize})
    return
  }  
  
  try {
    var thumbn = gisipcblobdata
    var cwizzes = document.querySelectorAll("c-wiz")
    var gisarray = (data) => {
      return Object.prototype.toString.call(data) == '[object Array]'
    }
    var xfound = false
    var control = null
    for (let i=0;i<cwizzes.length;i++) {
      if (xfound) {
        break
      }
      if (cwizzes[i].__jscontroller) {
        let controller = cwizzes[i].__jscontroller
        for (j in controller) {
          control = controller[j]
          if ( typeof control === "object" 
            && control !== null 
            && control !== 'undefined'
            && !gisarray(control) ) {
            xfound = true
            break
          }
        }
      }
    }
    if (control) {
      function loopcwiz(maincwiz) {
        var findarraylength = document.querySelectorAll(`div.${document.querySelectorAll('div[data-ri="0"]')[0].classList[0]}`).length
        var full = null
        var itemfound = false
        var largearrayfound = false
        function faketraverse(data) { 
          if (!data) {
            return
          }
          if (itemfound) {
            return
          }
          if ( typeof data === "object" 
            && gisarray(data) 
            && data.length === findarraylength) {
            itemfound = true
            full = data
            return
          }
          if (typeof data === "object" 
            && data !== "null"
            && data !== "undefined" 
            && data instanceof Element === false) {
            var keys = Object.keys(data)
            for (let i=0;i<keys.length;i++) {
              var item = keys[i]
              if (item.toString().length < 4) {
                if ( item.toString() === "j"
                  || item.toString() === "o"
                  || item.toString() === "H"
                  || !isNaN(item.toString()) === true
                  || ( item.toString().length === 2 && item.toString().slice(-1) === "f" )) {
                  if (!itemfound) {
                    faketraverse(data[item])
                  }
                }
              }
            }
          }
          return
        }
        faketraverse(maincwiz)
        return full
      }
      var maincwiz = document.querySelectorAll(`c-wiz.P3Xfjc`)[0].__jscontroller
      var largearray = loopcwiz(maincwiz)
      if (largearray !== null) {
        for (let i=0;i<largearray.length;i++) {
          var item = largearray[i]
          if ( item 
            && item.j 
            && item.j[2] 
            && item.j[2].j 
            && item.j[2].j[3] 
            && item.j[2].j[3].H 
            && item.j[2].j[3].H[0] ) {
            var encs = item.j[2].j[3].H[0]
            if (encs === thumbn) {
              if (item.j[2].j[4] && item.j[2].j[4].H && item.j[2].j[4].H[0]) {
                var fullnx = item.j[2].j[4].H[0]
                realfullsizeimage = fullnx
              }
              break
            }
          }
        }
      }
      else {
        console.log("couldnt find large array")
      }
    }
    else {
      console.log("no control found")
    }
  }
  catch(e) {
    console.log("secondary fullsize method not found.. onward")
  }
  
  if (realfullsizeimage !== null) {
    console.log("2n f")
    fullsize = realfullsizeimage
    document.getElementById("gisipcwindowcontext").innerText = JSON.stringify({gisipcblobid:gisipcblobid, gisipcblobfullsize:fullsize})
    return
  }
  
  try {
    var getCircularReplacer = () => {
      const seen = new WeakSet()
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return
          }
          seen.add(value)
        }
        return value
      }
    }
    // text string of full window object
    let AgisXp = JSON.stringify(window, getCircularReplacer())
    // search for full size url based on thumbnail url
    try {
      var Xfindenc = gisipcblobdata
      var pstart = AgisXp.indexOf(Xfindenc)
      if (pstart === -1) {
        throw new Error("less than one")
      }
      AgisXp = AgisXp.slice(pstart + Xfindenc.length)
      var Xrealurlstart = AgisXp.indexOf(`"http`)
      AgisXp = AgisXp.slice(Xrealurlstart + 1)
      var Xendquote = AgisXp.indexOf(`"`)
      if (Xendquote === -1) {
        throw new Error("less than one")
      }
      AgisXp = AgisXp.substring(0,Xendquote)
      // update the DOM with full size url accessible from content script
      document.getElementById("gisipcwindowcontext").innerText = JSON.stringify({gisipcblobid:gisipcblobid, gisipcblobfullsize:AgisXp})
      return
    }
    catch(e) {
      console.log(e)
      throw new Error(e)
    }

  }
  catch(e) {
    var startlogging = false
    var fullsizematch = "0"
    try {
      var getCircularReplacer = () => {
        var seen = new WeakSet()
        return (key, value) => {
          if (startlogging && typeof value === "string" && value.startsWith("http")) {
            fullsizematch = value
            throw new Error("got what we needed")
          }
          if (value === gisipcblobdata) {
            startlogging = true
          }
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return
            }
            seen.add(value)
          }
          return value
        }
      }
      JSON.stringify(window, getCircularReplacer())
    }
    catch(e) {
      document.getElementById("gisipcwindowcontext").innerText = JSON.stringify({gisipcblobid:gisipcblobid, gisipcblobfullsize:fullsizematch})
    }    
  }
}

function gisipcreceivemessage(e) {
  try {
    if (e && e.data) {
      let blob = JSON.parse(e.data)
      if (blob.gisipcblob) {
        gisipcprocess(blob.gisipcblob.id, blob.gisipcblob.data)
        return
      }
    }
  }
  catch(e) {
    
  }
}

window.addEventListener("message", gisipcreceivemessage, false);
