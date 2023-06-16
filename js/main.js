// ublock filter to hide sticky header: www.google.com##.DU1Mzb

delete window.scrollToSelectedItemInline

let googleimagesrestoredloaded = false

function googleimagesrestored() {
  
  if (googleimagesrestoredloaded) {
    return
  }
  googleimagesrestoredloaded = true
  
  const gisdebugmode = false

  // https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
  var clz32 = Math.clz32 || (function(log, LN2){"use strict";
      return function(x) {return 31 - log(x >>> 0) / LN2 | 0};
  })(Math.log, Math.LN2);
  var fromCharCode = String.fromCharCode;
  var atobUTF8 = (function(atob, replacer){"use strict";
      return function(inputString, keepBOM){
          inputString = atob(inputString);
          if (!keepBOM && inputString.substring(0,3) === "\xEF\xBB\xBF")
              inputString = inputString.substring(3); // eradicate UTF-8 BOM
          // 0xc0 => 0b11000000; 0xff => 0b11111111; 0xc0-0xff => 0b11xxxxxx
          // 0x80 => 0b10000000; 0xbf => 0b10111111; 0x80-0xbf => 0b10xxxxxx
          return inputString.replace(/[\xc0-\xff][\x80-\xbf]*/g, replacer);
      }
  })(atob, function(encoded){"use strict";
      var codePoint = encoded.charCodeAt(0) << 24;
      var leadingOnes = clz32(~codePoint);
      var endPos = 0, stringLen = encoded.length;
      var result = "";
      if (leadingOnes < 5 && stringLen >= leadingOnes) {
          codePoint = (codePoint<<leadingOnes)>>>(24+leadingOnes);
          for (endPos = 1; endPos < leadingOnes; ++endPos)
              codePoint = (codePoint<<6) | (encoded.charCodeAt(endPos)&0x3f/*0b00111111*/);
          if (codePoint <= 0xFFFF) { // BMP code point
            result += fromCharCode(codePoint);
          } else if (codePoint <= 0x10FFFF) {
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000;
            result += fromCharCode(
              (codePoint >> 10) + 0xD800,  // highSurrogate
              (codePoint & 0x3ff) + 0xDC00 // lowSurrogate
            );
          } else endPos = 0; // to fill it in with INVALIDs
      }
      for (; endPos < stringLen; ++endPos) result += "\ufffd"; // replacement character
      return result;
  });

  let gisuniqueid

  function preloadipc(file, node) {
    var th = document.getElementsByTagName(node)[0]
    var s = document.createElement('script')
    s.setAttribute('type', 'text/javascript')
    s.setAttribute('src', file)
    th.appendChild(s)
  }

  function findfullsizeimagefromencurl(uniqueid, encurl) {
    window.postMessage(JSON.stringify({gisipcblob:{id:uniqueid,data:encurl}}), "*")
  }

  preloadipc( chrome.runtime.getURL('js/ipc.js'), 'body')

  var sheet = (function() {
    var style = document.createElement("style")
    style.appendChild(document.createTextNode(""))
    document.head.appendChild(style)
    return style.sheet
  })()

  let gisversion = 1

  if ( document.querySelectorAll(`div[data-ri="0"]`).length > 0 
    && document.querySelectorAll(`[jscontroller="Q7Rsec"]`).length === 0 ) {
    gisversion = 2
  }
  else if ( document.querySelectorAll(`div.isv-r`).length > 0 
    && document.querySelectorAll(`[jscontroller="Q7Rsec"]`).length === 0 ) {
    // in instances where [jsmodel="BV3ECb"] and div.O8VmIc.a3Wc3
    // have prevented div[data-ri="0"] from being found
    gisversion = 3
  }
  
  if (gisdebugmode) {
    console.log("using gisversion", gisversion)
  }
  
  sheet.insertRule('.isv-r {pointer-events:all!important}',0)

  var detailsscale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
  } 

  var appendexactfound = false

  var exactfloatboxdom = `<style>
    .zebragis, #zebidoc, #zebidob, #zebidoa {
      cursor:pointer;
    }
    .oldgisexactsize {
      position: absolute;
      top: 70px;
      right: -250px;
      margin-right: 5px;
      border: 1px solid #ccc;
      z-index: 106;
      background: white;
      display: inline-flex;
      font-size: 12px;
      flex-direction: column;
      padding: 25px 0 15px;
      width: 250px;
      box-shadow: 1px 1px 6px rgba(0,0,0,0.2);
    }
    .oldgisexactsize input {
      width: 85px;
      padding: 2px 4px;
    }
    .oldgisexactsizetoprow {
      font-size:15px;
      margin-bottom: 12px;
      padding-left:24px
    }
    .xogesr {
      text-align:right
    }
    .oldgisexactsizemidrow {
      display: flex;
      justify-content: center;
    }      
    .oldgisexactsizebottomrow {
      text-align: center;
      margin-top: 10px;
    }     
    #xogesb {
      display: inline-block;
      color: #000;
      font-weight: bold;
      font-size: 11px;
      padding: 3px 16px;
      font-family:arial;
      background: #f6f6f6;
      border: 1px solid #dadada;
      border-radius: 2px;
      cursor:pointer;
    }
    #closeexactsize {
      position:absolute;
      top:10px;
      right:12px;
      width:16px;
      height:16px;
      cursor:pointer;
      display:inline-block
    }
    #closeexactsize::before,
    #closeexactsize::after {
      content:'';
      width:2px;
      height:14px;
      background:#666;
      display:inline-block;
      position:absolute;
      top:1px;
      right:7px;
    }
    #closeexactsize::before {
      transform:rotate(45deg)
    }
    #closeexactsize::after {
      transform:rotate(-45deg)
    }
    #oldgisexactsizecloak {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 0;
      background: rgba(255,255,255,.8);
      cursor: pointer;              
    }
    .oldgisexacthide {
      display:none
    }
  </style>  
  <div id="oldgisexactsizecloak" class="oldgisexacthide"></div>
  <div id="oldgisexactsize" class="oldgisexactsize oldgisexacthide exqty">
    <div id="closeexactsize"></div>
    <div class="oldgisexactsizetoprow exqty">Exact size</div>
    <div class="oldgisexactsizemidrow exqty">
      <table class="exqty">
        <tbody class="exqty">
          <tr class="exqty">
            <td class="xogesr exqty">Width:</td>
            <td class="exqty"><input id="oldgisexactlywidth" class="exqty" type="text"></td>
            <td class="exqty">px</td>
          </tr>
          <tr class="exqty">
            <td class="xogesr exqty">Height:</td>
            <td class="exqty"><input id="oldgisexactlyheight" class="exqty" type="text"></td>
            <td class="exqty">px</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="oldgisexactsizebottomrow exqty"><button id="xogesb" class="exqty">Go</div></button>
  </div>`;

  function appendexactly() {
    
    try {
      
      if (gisversion === 1) {
        var largeli = document.querySelectorAll(`#isz_l`)[0]
        if (largeli) {
          var ul = largeli.parentElement
          if (ul && ul.tagName && ul.tagName.toLowerCase() === "ul") {
            var elems = document.querySelectorAll("li")
            // if for some reason it already exists, e.g. google adds it back, dont append it here
            var res = Array.from(elems).find(v => v.textContent.toLowerCase().includes('exact'))
            if (!res) {
              appendexactfound = true
              ul.insertAdjacentHTML("beforeend", `<li class="hdtbItm" id="isz_ex"><a class="q qs" id="isz_ex_a" href="#">Exactly...</a>
                ${exactfloatboxdom}
              </li>`)
            }
            else {
              if (gisdebugmode) {
                console.log("exact size already exists")
              }
            }
          }
        }
      }
      
      else if (gisversion > 1) {
        if (appendexactfound) {
          if (gisdebugmode) {
            console.log("already appended")
          }
          return
        }
        var largeli = document.querySelector(`[aria-label="Large"]`)
        var mediumli = document.querySelector(`[aria-label="Medium"]`)
        if (largeli || mediumli) {
          
          var lastitem = document.querySelector(`[aria-label="Icon"]`)
          // if the selected item was icon then it wont be available so use Medium
          if (!lastitem) {
            lastitem = document.querySelector(`[aria-label="Medium"]`)
          }
          if (!lastitem) {
            // something is wrong.. dont make appendexactfound true and return..
            return
          }
          // aria-label="Any size" // &tbs&
          // aria-label="Large"    // &tbs=isz%3Al
          // aria-label="Medium"   // &tbs=isz%3Am
          // aria-label="Icon"     // &tbs=isz%3Ai
          
          // scrub to eliminate traces of the 'exactly' isz if it exists.
          // some links might not exist, treat on case by case basis

          if (document.querySelector(`[aria-label="Any size"]`)) {
            // document.querySelector(`[aria-label="Any size"]`)
          }
          if (document.querySelector(`[aria-label="Large"]`)) {
            // document.querySelector(`[aria-label="Large"]`)
          }
          if (document.querySelector(`[aria-label="Medium"]`)) {
            // document.querySelector(`[aria-label="Medium"]`)
          }
          if (document.querySelector(`[aria-label="Icon"]`)) {
            // document.querySelector(`[aria-label="Icon"]`)
          }        
          appendexactfound = true
          lastitem.insertAdjacentHTML("afterend", `<a class="MfLWbb" id="zebidoa"><div class="Hm7Qac" id="zebidob"><span class="igM9Le zebragis" id="zebidoc">Exactly..</span></div></a>${exactfloatboxdom}`)
        }
      }
    }
    catch(e) {
      if (gisdebugmode) {
        console.error(e)
      }
    }
  }

  function rawquerystringtojson(e) {
    var pairs = e.split("?").slice(1).join().split("&")
    var result = {}
      pairs.forEach(function(pair) {
      pair = pair.split('=')
      result[pair[0]] = pair[1] || ''
    })
    return JSON.parse(JSON.stringify(result))
  }

  function querystringtojson(e) {
    var pairs = e.split("?").slice(1).join().split("&")
    var result = {}
      pairs.forEach(function(pair) {
      pair = pair.split('=')
      result[pair[0]] = decodeURIComponent(pair[1] || '')
    })
    return JSON.parse(JSON.stringify(result))
  }

  var detailsminheight = window.innerHeight - 240
  var detailsoffsettop

  function calculateoffsets() { 
    detailsoffsettop = ~~(detailsscale(window.innerHeight, 777, 1161, 120, 150))
    detailsminheight = window.innerHeight - 240
    detailsminheight = detailsminheight < 500 ? 500 : detailsminheight
    return
  }

  var realpaddingbottom = 30

  calculateoffsets()

  var jscontroller = "Q7Rsec"
  try {
    if (gisversion > 1) {
      jscontroller = document.querySelector('div[data-ved].isv-r').getAttribute("jscontroller")
    }
    if (!jscontroller) {
      if (gisversion === 2) {
        jscontroller = document.querySelectorAll(`div[data-ri="0"]`)[0].getAttribute("jscontroller")
      }
      else if (gisversion === 3) {
        jscontroller = document.querySelectorAll(`div.isv-r`)[0].getAttribute("jscontroller")  
      }
    }
  }
  catch(e) {
    
  }
  
  // mutationobserver --
  // new jscontroller elements to append size stats
  
  let lastthumbcount = 0
  function propagatesizeinfo() {
    
    let jscontrollercount = document.querySelectorAll(`div[jscontroller="${jscontroller}"]`).length
    if (jscontrollercount === lastthumbcount) {
      // nothing to do
      return
    }
    else {
      lastthumbcount = document.querySelectorAll(`div[jscontroller="${jscontroller}"]`).length
    }
    // loop through each that dont have it
    let notmarked = document.querySelectorAll(`div[jscontroller="${jscontroller}"]:not(.sizepropagated)`)
    for (let i=0;i<notmarked.length;i++) {
      try {
        notmarked[i].classList.add("sizepropagated")
        let gisow = notmarked[i].dataset.ow || 0
        let gisoh = notmarked[i].dataset.oh || 0
        notmarked[i].insertAdjacentHTML("beforeend", `<div class="gishoverinfo">${gisow} x ${gisoh}</div>`)
      }
      catch(e) {
        // if (gisdebugmode) {
        //   console.error(e)
        // }
      }
      
      try {
        let as = notmarked[i].querySelector('a[data-ved]')
        if (!as) {
          as = notmarked[i].querySelector('a.WGvvNb')
        }
        let href = as.href
        let domain = new URL(href)
        let hostname = domain.hostname
        var shortened = hostname.replace(/^www\./g, "")
        if (shortened.length > 32) {
          shortened = shortened.substring(0,29) + "..."
        } 
        let fxg = notmarked[i].querySelector('.fxgdke')
        fxg.innerText = shortened
        let span = as.querySelector('span')
        span.parentNode.insertBefore(span, fxg)
      }
      catch(e) {
        
      }
    }
  }
  
  propagatesizeinfo()
  
  var observer = new MutationObserver(function(mutations) {
    setTimeout(()=>{propagatesizeinfo(),500})
  })
  
  // delayed start observe, nov 7, 2021
  
  let prepareretry = 0
  function prepareforislrg() {
    let node = document.getElementById("islrg")
    if (!node) {
      prepareretry++
      if (prepareretry > 500) {
        if (gisdebugmode) {
          console.error("halt - islrg not found")
        }
      }
      else {
        setTimeout(prepareforislrg, 500)
      }
      return null
    }
    observer.observe(node, {
      attributes: false, 
      childList: true, 
      characterData: false, 
      subtree:true
    })
  }
  
  prepareforislrg()
  
  var classrgl = ".rg_l"
  if (gisversion > 1) {
    try {
      classrgl = ".wXeWr"
      if (document.querySelectorAll(`div[jscontroller="${jscontroller}"]`)[0]) {
        var alinks = document.querySelectorAll(`div[jscontroller="${jscontroller}"]:first-of-type a`)
        for (let i=0;i<alinks.length;i++) {
          if (alinks[i].dataset.nav !== undefined) {
            classrgl = `.${alinks[i].classList[0]}`
            break
          }
        }
      }
    }
    catch(e) {
      
    }
  }

  var classilmbg = ".rg_ilmbg"
  if (gisversion > 1) {
    try {
      classilmbg = ".h312td"
    }
    catch(e) {
      
    }
  }
  sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover ${classrgl} {box-shadow: 0 2px 12px 0 rgba(0,0,0,0.35)!important}`, 0)

  if (gisversion === 1) {
    sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover .rg_ilmbg {pointer-events:none!important;display:block!important}`,0)
  }

  if (gisversion > 1) {
    sheet.insertRule(`div[jscontroller="${jscontroller}"] ${classilmbg} {pointer-events:none!important;display:none!important}`,0)
    sheet.insertRule(`div[jscontroller="${jscontroller}"]:hover .gishoverinfo {pointer-events:none!important;display:inline-block!important}`,0)
  }

  if (gisversion > 1) {
    sheet.insertRule(`div[data-id^="Refinements"] {display:none}`,0)   
    sheet.insertRule(`.MSM1fd:hover .RtIwE {display:none}`,0)
    // related searches, june 25 2020
    sheet.insertRule(`div[jscontroller="K3moCf"] {display:none}`,0)
    // related searches, jan 7 2021
    sheet.insertRule(`div[jscontroller="ewR3bd"] {display:none}`,0)
    // related searches, june 16 2023
    sheet.insertRule(`div[jscontroller="gDvwme"] {display:none}`,0)
  }

  sheet.insertRule(`.islsp {pointer-events:none!important;opacity:0!important}`,0)
  sheet.insertRule(`.MSM1fd:hover .wXeWr {box-shadow:none}`,0)
  sheet.insertRule(`body.exactgisopen #oldgisdetails {z-index:0}`,0)
  sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover .rg_anbg {display:none!important}`,0)
  sheet.insertRule(`.nJGrxf span, .nJGrxf {pointer-events:none!important}`,0)
  sheet.insertRule(`g-loading-icon {display:none!important}`,0)
  sheet.insertRule(`#rg {min-width: 95vw!important}`,0)
  sheet.insertRule(`a${classrgl} {pointer-events: none!important;-moz-pointer-events:none!important}`,0)
  sheet.insertRule(`div[jscontroller="${jscontroller}"] {cursor: pointer;-moz-user-select:none!important;user-select:none!important}`,0)
  sheet.insertRule(`div[jscontroller="KDx8xf"] {cursor: pointer;-moz-user-select:none!important;user-select:none!important}`,0)

  if (gisversion > 1) {
    sheet.insertRule(`span.MfLWbb.itb-st.Wlq9kf {display: none!important}`,0)
  }
  if (gisversion === 1) {
    sheet.insertRule(`div[jscontroller="KDx8xf"]:hover .rg_ilmbg {display:block!important;height:100%!important;pointer-events:none!important}`,0)
  }
  if (gisversion > 1) {
    sheet.insertRule(`div[jscontroller="KDx8xf"]:hover span {display:block!important;height:100%!important;pointer-events:none!important}`,0)
    sheet.insertRule(`div[jscontroller="KDx8xf"]:hover ${classilmbg} {display:block!important;height:100%!important;pointer-events:none!important}`,0)
  }
  document.body.insertAdjacentHTML("beforeend", `
    <style id="oldgisbottommargin">
      html body .fmbrQQxz {margin-bottom:${detailsminheight+50}px!important}
    </style>
  `)
  document.body.insertAdjacentHTML("beforeend", `
    <style id="oldgisdetailsspace">
      #oldgisdetails {left:0;position:absolute;width:100%;display:block;height:${detailsminheight}px;background:#222;top:0px;z-index:100;display:none}
    </style>
  `)   
  sheet.insertRule('.eJXyZe {display:none!important}',0)
  sheet.insertRule(`.fmbrQQxz::before {content:'';z-index:999999999;position: absolute;text-align: center;margin: 0 auto;height: 0px;left: calc(50% - 10px);width: 0;height: 0;background: transparent;bottom: -32px;border-bottom: 17px solid #222;border-left: 16px solid transparent;border-right: 16px solid transparent;}`,0)
  sheet.insertRule(`body.exactgisopen .fmbrQQxz::before {z-index:0}`,0)
  // 2021 APR 10
  // images on when searching by 'all sizes' for the same image no longer show
  // the image size on all of the thumbnails. this allows a user to
  // ctrl+click on the google logo to show all of the image sizes on all of the images.
  sheet.insertRule(`body.forceshowgishoverinfo div[jscontroller="${jscontroller}"] .gishoverinfo {pointer-events:none!important;display:inline-block!important}`,0)
  let siclick = document.querySelector(`a.F1hUFe`)
  if (siclick) {
    siclick.addEventListener('click', (e)=>{
      if (e.ctrlKey) {
        e.preventDefault()
        e.stopPropagation()
        document.body.classList.toggle('forceshowgishoverinfo')
      }
    })
  }    

  var urlsizeparamswap = (append) => {
    if (gisversion === 1) {
      var current = window.location.href
      var params = querystringtojson(current)
      delete params["tbs"]
      var target = `https://www.google.com/search?q=${params["q"]}`
      delete params["q"]
      if (append) {
        target += `&${append}`
      }
      for (var i=0;i<Object.keys(params).length;i++) {
        var key = Object.keys(params)[i]
        target += `&${key}=${params[key]}`
      }
      return target
    }
    else if (gisversion > 1) {
      var current = window.location.href
      var params = rawquerystringtojson(current)

      return null
    }
  }
  var exactlyopen = false
  var exactlytool = {
    open: () => {
      document.body.classList.add("exactgisopen")
      var oldgisexactsizecloak = document.getElementById("oldgisexactsizecloak")
      var oldgisexactsize = document.getElementById("oldgisexactsize")
      oldgisexactsizecloak.classList.remove("oldgisexacthide")
      oldgisexactsize.classList.remove("oldgisexacthide")
      exactlyopen = true
      return
    },
    close: () => {
      document.body.classList.remove("exactgisopen")
      var oldgisexactsizecloak = document.getElementById("oldgisexactsizecloak")
      var oldgisexactsize = document.getElementById("oldgisexactsize")
      var oldgisexactlywidth = document.getElementById("oldgisexactlywidth")
      var oldgisexactlyheight = document.getElementById("oldgisexactlyheight")
      oldgisexactsizecloak.classList.add("oldgisexacthide")
      oldgisexactsize.classList.add("oldgisexacthide")
      oldgisexactlywidth.value = ""
      oldgisexactlyheight.value = ""
      exactlyopen = false
      if (document.querySelectorAll('.hdtb-mn-hd')[0]) {
        document.querySelectorAll('.hdtb-mn-hd')[0].click()
      }
      else if (document.querySelectorAll('.xFo9P')[0]) {
        document.querySelectorAll(".xFo9P")[0].click()
      }
      document.activeElement.blur()
      return
    },
    submit: () => {
      try {
        var oldgisexactlywidth = document.getElementById("oldgisexactlywidth")
        var oldgisexactlyheight = document.getElementById("oldgisexactlyheight")
        var append = null
        var width = oldgisexactlywidth.value
        var height = oldgisexactlyheight.value
        if (gisversion === 1) {
          if (width && !isNaN(width) && width > 0 && height && !isNaN(height) && height > 0) {
            append = `tbs=isz:ex,iszw:${~~(width)},iszh:${~~(height)}`
          }
          else if (width && !isNaN(width) && width > 0) {
            append = `tbs=isz:ex,iszw:${~~(width)},iszh:${~~(width)}`
          }
          else if (height && !isNaN(height) && height > 0) {
            append = `tbs=isz:ex,iszw:${~~(height)},iszh:${~~(height)}`
          }
        }
        else if (gisversion > 1) {
          if (width && !isNaN(width) && width > 0 && height && !isNaN(height) && height > 0) {
            append = `tbs=isz:ex,iszw:${~~(width)},iszh:${~~(height)}`
          }
          else if (width && !isNaN(width) && width > 0) {
            append = `tbs=isz:ex,iszw:${~~(width)},iszh:${~~(width)}`
          }
          else if (height && !isNaN(height) && height > 0) {
            append = `tbs=isz:ex,iszw:${~~(height)},iszh:${~~(height)}`
          }        
        }

        var target = urlsizeparamswap(append)
        if (gisversion === 1) {
          window.location.href = target
        }
        else if (gisversion > 1) {
          return
        }
      }
      catch(e) {
        if (gisdebugmode) {
          console.error("exact size error")
          console.error(e)
        }
      }
      return
    }
  }
  var oldgisdetails = document.createElement("div")
  oldgisdetails.id = "oldgisdetails"
  document.body.appendChild(oldgisdetails)
  oldgisdetails.innerHTML = `
    <style>
      .fullsizeimagearea {
        flex-grow:1;
        min-width:240px;
        display: flex;
        justify-content: center;
        align-items: center;  
        flex-direction:column;  
        overflow:hidden;
      }
      .moredetailsarea {
        width:calc(240px + 21%);
        font-family:arial;
        padding:20px;
        padding-left:5px;
        display: flex;
        justify-content: center;
        flex-direction:column;
      }
      .moredetailsareaheader {
        padding-bottom:20px;
      }
      .moredetailsareafooter {
        padding-top:20px;
      }
      #oldgisdetails, #oldgisdetails * {
        box-sizing:border-box
      }
      .moredetailsarea .moredetailsareatitle {
        color: #bbb;
        font-size:26px;
      }
      .moredetailsareatitle {
        height:62px;
        display:flex;
        align-items:end;
      }
      .moredetailsareatitle:hover {
        text-decoration:underline
      }
      .moredetailsarea .moredetailsareasubtitle {
        color: #707070;
        font-size:14px;
        margin-top:4px;
      }
      .moredetailsareabuttons {
        display:flex;
        margin-top:20px;
      }
      .moredetailsareabuttons div {
        font-size: 11px;
        color:#8e8e8e;
        background:#3b3b3b;
        padding:8px 10px;
        font-weight:bold;
        cursor:pointer;
        user-select:none!important;
        -moz-user-select:none!important;
      }
      .moredetailsareabuttonsvisit {
        margin-right:5px
      }
      .moredetailsarearelatedtitle {
        color:#707070;
        font-size:14px;
        margin-bottom:8px;
      }
      .moredetailsarearelated {
        display:flex;
        flex-direction:column;
      }
      .moredetailsarearelatedrow {
        display:flex;
        flex-direction:row;
      }
      .moredetailsarearelatedbottomrow {
        margin-top:10px;
      }
      .oldgisrelatedimage {
        height:85px;
        width:85px;
        margin-right:10px;
      }
      .oldgisrelatedthumbdata.oldgisrelatedcurrentselection {
        box-shadow: 0px 0px 0px 1px #222, 0px 0px 0px 3px #bbb!important
      }
      .oldgisrelatedthumbdata:hover, .oldgisseemore:hover .oldgisrelatedthumbdata {
        box-shadow: 0px 0px 0px 1px #222, 0px 0px 0px 2px #ddd
      }
      .oldgisrelatedthumbdata:active, .oldgisseemore:active .oldgisrelatedthumbdata {
        box-shadow: 0px 0px 0px 1px #222, 0px 0px 0px 2px #fff
      }
      .oldgisimageareaimage {
        text-align:center;
      }
      .oldgisimageareadetails {
        color:#707070;
        font-size:12px;
        font-family:arial;
        text-align:center;
        margin-top:15px;
      }
      .oldgisspan {
        color:#909090
      }
      .oldgisswapboxholder {
        display:inline-block;
        border:none;
        background-size:cover;
        position:relative
      }
      .oldgisbuttonclose {
        position:absolute;
        top:15px;
        right:15px;
        width:30px;
        height:30px;
        cursor:pointer;
      }
      .oldgisbuttonclose::before, 
      .oldgisbuttonclose::after {
        content:'';
        position:absolute;
        width:2px;
        height:100%;
        background:#555;
        left:50%;
      }
      .oldgisbuttonclose::before {
        transform:rotate(45deg)
      }
      .oldgisbuttonclose::after {
        transform:rotate(-45deg)
      }
      .oldgisbuttonprev, .oldgisbuttonnext {
        height:76px;
        width:32px;
        background:#333;
        position:absolute;
        top:50%;
        margin-top:-38px;
        cursor:pointer;
      }
      .oldgisbuttonprev {
        left:0;
      }
      .oldgisbuttonprev::before,
      .oldgisbuttonnext::before  {
        content:'';
        width:16px;
        height:16px;
        display:inline-block;
        top:50%;
        margin-top:-9px;
        position:absolute;
        transform:rotate(45deg);  
      }
      .oldgisbuttonprev::before {
        border-left:3px solid #777;
        border-bottom:3px solid #777;
        transform:rotate(45deg);  
        left:12px;
      }
      .oldgisbuttonnext::before {
        border-top:3px solid #777;
        border-right:3px solid #777;
        right:10px;
      }
      .oldgisbuttonnext {
        right:0;
      }
      .nounderlinesupport {
        text-decoration:none
      }
      .oldgisseemore {
        position:relative;
        display:block
      }
      .oldgisseemore::before {
        z-index: 99;
        content: 'View\\AMore';
        background: rgba(0, 0, 0, 0.64);
        width: 100%;
        height: 100%;
        font-family: Arial;
        font-size: 16px;
        text-align: center;
        color: rgba(255,255,255,0.7);
        position: absolute;
        display: flex;
        white-space: Pre;
        line-height: 19px;
        vertical-align: center;
        justify-content: center;
        align-items: center;
      }
      .oldgisseemore:hover::before {
        background: rgba(23, 23, 23, 0.64);
        color: rgba(255,255,255,0.88);
      }
    </style>
    <div class="oldgiscontent fullsizeimagearea">
      <div class="oldgisimageareaimage">
        <div class="oldgisswapboxholder" style="width:0px;height:0px;background-image:url()">
          <a class="oldgisswapboxlink" href="" target="_blank"><img src class="oldgisswapbox" style="width:0px;height:0px"></a>
        </div>
      </div>
      <div class="oldgisimageareadetails"><span class="oldgisrealwidth">0</span> × <span class="oldgisrealheight">0</span> · <span class="oldgisspan">Images may be subject to copyright.</span></div>
    </div>
    <div class="oldgiscontent moredetailsarea">
      <div class="moredetailsareaheader">
        <a href="#" class="nounderlinesupport moredetailsareatitlelink" target="_blank"><div class="moredetailsareatitle">Image</div></a>
        <div class="moredetailsareasubtitle">https://google.com</div>
        <div class="moredetailsareabuttons">
          <a href="#" target="_blank" class="nounderlinesupport moredetailsareabuttonsvisitlink"><div class="moredetailsareabuttonsvisit">Visit</div></a>
          <a href="#" target="_blank" class="nounderlinesupport moredetailsareabuttonsviewlink"><div class="moredetailsareabuttonsview">View Image</div></a>
        </div>
      </div>
      <div class="moredetailsareafooter">
        <div class="moredetailsarearelatedtitle">Related images</div>
        <div class="moredetailsarearelated">
          <div class="moredetailsarearelatedrow moredetailsarearelatedtoprow">
            <div class="oldgisrelatedimage" data-gisthumbrelid="0"></div>
            <div class="oldgisrelatedimage" data-gisthumbrelid="1"></div>
            <div class="oldgisrelatedimage" data-gisthumbrelid="2"></div>
            <div class="oldgisrelatedimage" data-gisthumbrelid="3"></div>
          </div>
          <div class="moredetailsarearelatedrow moredetailsarearelatedbottomrow">
            <div class="oldgisrelatedimage" data-gisthumbrelid="4"></div>
            <div class="oldgisrelatedimage" data-gisthumbrelid="5"></div>
            <div class="oldgisrelatedimage" data-gisthumbrelid="6"></div>
            <div class="oldgisrelatedimage" data-gisthumbrelid="7"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="oldgisbuttonclose" class="oldgisbuttonclose"></div>
    <div id="oldgisbuttonprev" class="oldgisbuttonprev"></div>
    <div id="oldgisbuttonnext" class="oldgisbuttonnext"></div>
  `
  var oldgis = {
    // oldgis.data.json sample
    // "{"fullsize":"https://www.alimentarium.org/en/system/files/thumbnails/image/AL027-01_pomme_de_terre_0.jpg","linkback":"https://www.alimentarium.org/en/knowledge/potato","thumb":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa30eF_kHneZfVuGyY2ppZl-yDNqa6W6_CVPMlZRxPqZQ4CcHM&s","domain":"alimentarium.org","width":"1008","height":"504","title":"Potato | Alimentarium"}"    
    data: {
      thumb: false,
      details: false,
      json: null,
      resizing: {
        count:0,
        timer:null
      }
    },
    jump: (next) => {
      var top = oldgisdetails.getBoundingClientRect().top
      var thumb = document.querySelectorAll("div.fmbrQQxz")[0]
      if (!thumb) {
        return
      }
      var position = Number(thumb.dataset.ri)
      var off = next ? 1 : -1
      var jumpthumb = document.querySelectorAll(`div[jscontroller="${jscontroller}"][data-ri="${position+off}"]`)[0]
      if (!jumpthumb) {
        off = next ? 2 : -2
        jumpthumb = document.querySelectorAll(`div[jscontroller="${jscontroller}"][data-ri="${position+off}"]`)[0]
        if (!jumpthumb) {
          return
        }
      }
      oldgis.thumb.disable()
      oldgis.thumb.enable(jumpthumb)    
      var newtop = oldgisdetails.getBoundingClientRect().top
      var pushdown = newtop - top
      var nowscroll = window.scrollY
      window.scrollTo(0, nowscroll + pushdown)
      return
    },
    resize: (organic) => {
      function routine() {
        calculateoffsets()
        document.getElementById("oldgisbottommargin").remove()
        document.body.insertAdjacentHTML("beforeend", `<style id="oldgisbottommargin">
          html body .fmbrQQxz {margin-bottom:${detailsminheight+50}px!important}
        </style>`)
        document.getElementById("oldgisdetailsspace").remove()
        document.body.insertAdjacentHTML("beforeend", `<style id="oldgisdetailsspace">
          #oldgisdetails {left:0;position:absolute;width:100%;display:block;height:${detailsminheight}px;background:#222;top:0px;z-index:100;display:none}
        </style>`)
        if (!oldgis.data.thumb) {
          return
        }
        oldgis.details.propagate(false)
        var oldgisdetails = document.getElementById("oldgisdetails")
        var xthumb = document.querySelectorAll('.fmbrQQxz')[0]
        var xheight = xthumb.offsetHeight
        var xtop = xthumb.getBoundingClientRect().top
        var xscrolly = window.scrollY
        oldgisdetails.style.top = `${xheight+xtop+xscrolly+realpaddingbottom}px`
      }
      if (organic) {
        clearTimeout(oldgis.data.resizing.timer)
        oldgis.data.resizing.count = 0
        oldgis.resize(false)
      }
      else {
        if (++oldgis.data.resizing.count > 15) {
          clearTimeout(oldgis.data.resizing.timer)
          return
        }
        else {
          oldgis.data.resizing.timer = setTimeout(()=>{
            routine()
            oldgis.resize(false)
          },30)
        }      
      }
    },
    details: {
      override: (uid) => {
        var meta = null
        try {
          var meta = document.querySelectorAll(`.oldgisrelatedthumbdata[data-thumbuid="${uid}"]`)[0]
        }
        catch(e) {
          if (gisdebugmode) {
            console.error("no meta")
          }
        }
        if (!meta) {
          if (gisdebugmode) {
            console.log("couldnt override@@@")
          }
          return
        }
        var json = {
          fullsize: meta.dataset.fullsize,
          linkback: meta.dataset.linkback,
          thumb: meta.dataset.thumb,
          domain: meta.dataset.domain,
          width: meta.dataset.width,
          height: meta.dataset.height,
          title: meta.dataset.title
        }
        if (gisversion > 1 && (meta.dataset.realfullsize === "true" || meta.dataset.realfullsize === true)) {
          json.realfullsize = true
        }
        else if (gisversion > 1 && (meta.dataset.realfullsize === "false" || meta.dataset.realfullsize === false)) {
          json.realfullsize = false
        }
        var swapbox = document.querySelectorAll(".oldgisswapbox")[0]
        swapbox.src = ""
        swapbox.width = "0px"
        swapbox.height = "0px"      
        oldgis.details.propagate(json)
        return
        
      },
      
      related: (jsonid) => {
        
        function propagate(blob) {
          
          var footer = document.querySelectorAll(".moredetailsareafooter")[0]
          var thumb
          
          if (gisversion === 1) {
            thumb = `<div class="oldgisrelatedthumbdata oldgisrelatedcurrentselection" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${oldgis.data.json.thumb})" data-title="${oldgis.data.json.title}" data-domain="${oldgis.data.json.domain}" data-width="${oldgis.data.json.width}" data-height="${oldgis.data.json.height}" data-thumb="${oldgis.data.json.thumb}" data-fullsize="${oldgis.data.json.fullsize}" data-linkback="${oldgis.data.json.linkback}" data-thumbuid="${oldgis.data.json.id}"></div>`
          }
          else if (gisversion > 1) {
            thumb = `<div class="oldgisrelatedthumbdata oldgisrelatedcurrentselection" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${oldgis.data.json.thumb})" data-title="${oldgis.data.json.title}" data-domain="${oldgis.data.json.domain}" data-width="${oldgis.data.json.width}" data-height="${oldgis.data.json.height}" data-thumb="${oldgis.data.json.thumb}" data-fullsize="${oldgis.data.json.fullsize}" data-linkback="${oldgis.data.json.linkback}" data-realfullsize="true" data-thumbuid="${oldgis.data.json.id}"></div>`          
          }
          var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="0"]`)[0]
          insertion.innerHTML = thumb    

          if (gisversion === 1) {
            var container = document.createElement("div")
            container.innerHTML = blob
            var results = container.querySelectorAll(".irc_rimask")        
            if (results.length === 0) {
              var other = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz)`)
              var target = other.length
              target = target > 7 ? 7 : target
              var shuffle = []
              var all = Array.from(Array(other.length).keys())
              function randint(min, max) {
                return ~~(Math.random() * (max - min + 1)) + min
              }
              for (var i=0;i<target;i++) {
                var rand = randint(0,all.length - 1)
                shuffle.push(all[rand])
                all.splice(rand,1)
              }
              for (var i=0;i<shuffle.length;i++) {
                try {
                  var result = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz)`)[shuffle[i]]
                  var meta = result.querySelectorAll(".rg_meta")[0].innerHTML
                  var json = JSON.parse(meta)
                  var title = result.querySelectorAll(".mVDMnf")[0].innerHTML
                  if (gisdebugmode) {
                    console.log("propagating", result)
                  }
                  var domain = json.st || json.isu
                  var thumb = `<div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${json.tu})" data-title="${title}" data-domain="${domain}" data-width="${json.ow}" data-height="${json.oh}" data-thumb="${json.tu}" data-fullsize="${json.ou}" data-linkback="${json.ru}" data-thumbuid="${json.id}"></div>`
                  var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${i+1}"]`)[0]
                  insertion.innerHTML = thumb
                }
                catch(e) {
                  if (gisdebugmode) {
                    console.error(e)
                  }
                }
              }
            }
            else {
              for (var i=0;i<results.length;i++) {
                try {
                  var result = results[i]
                  var meta = result.querySelectorAll(".rg_meta")[0].innerHTML
                  var json = JSON.parse(meta)
                  var title = json.pt.length > 30 ? json.pt.substring(0,30) + " ..." : json.pt
                  var thumb = `<div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${json.tu})" data-title="${title}" data-domain="${json.st}" data-width="${json.ow}" data-height="${json.oh}" data-thumb="${json.tu}" data-fullsize="${json.ou}" data-linkback="${json.ru}" data-thumbuid="${json.id}"></div>`
                  var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${i+1}"]`)[0]
                  if (i === 6) {
                    var seemore = container.querySelectorAll(".ZuJDtb")[0]
                    if (seemore) {
                      var href = seemore.href
                      thumb = `<a class="oldgisseemore" href="${href}"><div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${json.tu})"></div></a>`
                    }
                  }
                  insertion.innerHTML = thumb
                  if (i > 5) {
                    break
                  }
                }
                catch(e) {
                  if (gisdebugmode) {
                    console.error(e)
                  }
                }
              }    
            }
          }
          
          else if (gisversion > 1) {
            
            var related = []
            var seemorelink = false
            
            try {
              
              var usearray = []
              var p = blob

              var pstart = p.indexOf("[[")
              
              if (pstart === -1) {
                throw new Error("less than one indexof [[")
              }
              
              p = p.slice(pstart+1)
              p = p.split("\n")
              
              // change july 9, 2021 - old had ] this has ]]
              p = p[0]
              
              if (p.slice(-2) === "]]") {
                // july 9, 2021 - ]] fix
                p = p.slice(0,-1)
              }
              
              var awfulblob = (JSON.parse(p))[2]
              // november 9, 2022 - JSON parse fail
              
              if (gisdebugmode) {
                // console.log("awfulblob preparse", p)
              }
              
              var newblob = (JSON.parse(awfulblob))[0]
              var newarray = []
              
              let relatedstrategy = 1
              
              for (let i=0;i<newblob.length;i++) {
                // as of 09dec2022, it catches where i = 11
                var thisblob = newblob[i]
                if (typeof thisblob === "object") {
                  if (thisblob !== null) {
                    // 25sep2022 -> thisblob[1]
                    // need to try thisblob[1] if thisblob[0] doesnt contain the string "Related"
                    newarray = thisblob[0]
                    // test to see if newarray contains a string
                    try {
                      let tempstring = JSON.stringify(newarray)
                      if (tempstring.toLowerCase().indexOf("related") === -1) {
                        //                    .............                  
                        // chrome, id is [11][1][0][0][1][0][0][0][0]['444383007'][1][1]
                        newarray =   thisblob[1][0][0][1][0]
                        let stringified = JSON.stringify(newarray)
                        if (stringified.indexOf("http") === -1) {
                          // probably firefox.. at least as of 09dec2022
                          //                     .............
                          // firefox, id is [11][1][0][1][1][0][0][0][0]['444383007'][1][1] 
                          newarray =    thisblob[1][0][1][1][0]                          
                        }
                        relatedstrategy = 2
                      }
                    }
                    catch(e) {
                      if (gisdebugmode) {
                        console.error("error fetching alternate substring")
                        console.error(e)
                      }
                    }
                    break
                  }
                }
              }
              
              var relatedarray = []
              var allarrays = []
              if (relatedstrategy === 1) {
                // keep for now just in case some accounts are still using the pre-25sep2022 version
                for (let i=0;i<newarray.length;i++) {
                  var thisblob = newarray[i]
                  if (typeof thisblob === "object") {
                    if (thisblob !== null && thisblob.length > 3) {
                      relatedarray = thisblob
                      break
                    }
                  }
                }
                for (let i=0;i<relatedarray.length;i++) {
                  var thisblob = relatedarray[i]
                  if (typeof thisblob === "object") {
                    if (thisblob !== null) {
                      var found = true
                      for (let j=0;j<thisblob.length;j++) {
                        let thisblobchild = thisblob[j]
                        if (typeof thisblobchild !== "object") {
                          found = false
                          break
                        }
                      }
                      if (found) {
                        allarrays = thisblob
                        break
                      }
                    }
                  }
                }
              }
              
              else {
                
                
                
                // 25sep2022 version
                // note ~ helpful site: http://jsonselector.com/
                // {  obj   }[  key  ]
                //  i  0  0         
                // [0][0][0]['string'][1][9]['2003']
                // [1][0][0]['string'][1][9]['2003']
                // [2][0][0]['string'][1][9]['2003']
                // [3][0][0]['string'][1][9]['2003']
                try {
                  for (let i=0;i<newarray.length;i++) {
                    let obj = newarray[i][0][0]
                    for (let key in obj) {
                      allarrays.push(obj[key])
                    }
                  }
                }
                catch(e) {
                  if (gisdebugmode) {
                    console.error("error gathering related array")
                  }
                }
              }
              
              
              // 09dec2022
              let twothousandthree = 9
              for (let i=0;i<allarrays.length;i++) {
                for (let z=0;z<80;z++) {
                  let thisarray = allarrays[i][1]
                  if (thisarray[z] && thisarray[z]["2003"]) {
                    twothousandthree = z
                    break                   
                  }
                }
                break
              }
              
              if (gisdebugmode) {
                console.log({twothousandthree})
              }
              
              for (let i=0;i<allarrays.length;i++) {
                var thisarray = allarrays[i][1]
                var json
                json = {
                  realfullsize: true,
                  fullsize: thisarray[3][0],
                  linkback: thisarray[twothousandthree]["2003"][2],
                  thumb: thisarray[2][0],
                  domain: thisarray[twothousandthree]["2003"][12],
                  width: thisarray[3][2],
                  height: thisarray[3][1],
                  title: thisarray[twothousandthree]["2003"][3],
                  id: thisarray[1]
                }
                if (json.title.length > 30) {
                  json.title = json.title.substring(0,30) + "..."
                }
                related.push(json)
              }
              
            }
            
            catch(e) {
              if (gisdebugmode) {
                console.log("fail")
                // typically, this should not reach here if valid JSON
                // has been served by the server. this can catch if
                // there are no related images and there's nothing to do..
                // but if there ARE images, it should not reach here
                // and if it does reach here, there is a bug in the JSON.
                console.log(e)
              }
              related = []
            }
            
            try {
              
              var expglob = ""
              var p = blob
              
              var pstart = p.indexOf(`u003drimg:`)
              
              if (pstart === -1) {
                // november 9, 2022
                if (gisdebugmode) {
                  console.log("less than one error, pstart, full blob:", blob)
                }
                throw new Error("less than one")
              }
              
              p = p.slice(pstart + 10)
              pstart = p.indexOf("\\")
              p = p.substring(0,pstart)
              expglob = p
              var yyqs = (rawquerystringtojson(document.location.href).q).replace(/\+/g,"%20")
              if (yyqs) {
                seemorelink = `https://www.google.com/search?q=${yyqs}&tbm=isch&tbs=rimg%3A${expglob}`
              }
              else {
                throw new Error("no searchword")
              }
            }

            catch(e) {
              if (gisdebugmode) {
                console.error(e)
              }
            }
            
            function appenddummythumb(item, i, thumbtarget) {
              
              try {
                var thumbdomain
                var thumbfullsize
                var thumbthumb
                var thumbtitle
                var thumbid
                var thumbwidth
                var thumbheight
                var thumblinkback
                var thumbdomain
                
                var result = item
                
                if (!result) {
                  return null
                }
                
                thumbwidth = result.dataset.ow
                thumbheight = result.dataset.oh
                thumbid = result.dataset.tbnid || result.dataset.id
                thumblinkback = "http://google.com"
                
                var atarget = result.querySelectorAll("a").length
                var backupinnertext = ""
                
                for (let i=0;i<atarget;i++) {
                  let qtlk = result.querySelectorAll("a")[i]
                  
                  if (qtlk.href) {
                    if (qtlk.dataset && qtlk.dataset.title && qtlk.dataset.title.length > 0) {
                      backupinnertext = qtlk.dataset.title
                    }
                    else if (qtlk.innerText && qtlk.innerText.length > 0) {
                      backupinnertext = qtlk.innerText
                    }
                    else {
                      // nov 10, 2022
                      let tryspan = result.querySelector("a span")
                      if (tryspan) {
                        backupinnertext = tryspan.innerText
                      }
                    }
                    thumblinkback = qtlk.href

                    break
                  }
                }
                
                let ttis = result.querySelector("img")
                thumbthumb = ttis.dataset && ttis.dataset.iurl
                if (!thumbthumb) {
                  thumbthumb = ttis.dataset && ttis.dataset.src
                }
                if (!thumbthumb) {
                  thumbthumb = ttis.src
                }
                thumbfullsize = thumbthumb
                var etmp = document.createElement ('a')
                etmp.href = thumblinkback
                var edomain = etmp.hostname.toString()
                if (edomain.startsWith("www.")) {
                  edomain = edomain.slice(4)
                }
                let fxgd = result.querySelector(".fxgdke")
                if (fxgd) {
                  edomain = fxgd.innerText
                }
                thumbdomain = edomain
                var thumbtitle = backupinnertext
                if (thumbtitle.length === 0) {
                  thumbtitle = edomain
                }
                if (thumbtitle.length > 48) {
                  thumbtitle = thumbtitle.substring(0,44) + " ..."
                }
                var thumb = `<div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${thumbthumb})" data-title="${thumbtitle}" data-domain="${thumbdomain}" data-width="${thumbwidth}" data-height="${thumbheight}" data-thumb="${thumbthumb}" data-fullsize="${thumbfullsize}" data-linkback="${thumblinkback}" data-realfullsize="false" data-thumbuid="${thumbid}"></div>`
                var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${thumbtarget}"]`)[0]
                insertion.innerHTML = thumb
              }
              catch(e) {
                if (gisdebugmode) {
                  console.error(e)
                }
              }
            }
            
            function appendtargetthumb(ntarget, i, thumbtarget) {
              try {
                var result = related[i]
                let {realfullsize, domain, fullsize, height, id, linkback, title, width} = result
                
                var nthumb = result.thumb
                var thumb = `<div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${nthumb})" data-title="${title}" data-domain="${domain}" data-width="${width}" data-height="${height}" data-thumb="${nthumb}" data-fullsize="${fullsize}" data-linkback="${linkback}" data-thumbuid="${id}" data-realfullsize="true"></div>`
                var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${thumbtarget}"]`)[0]
                if (i === 6) {
                  if (seemorelink) {
                    thumb = `<a class="oldgisseemore" href="${seemorelink}"><div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${nthumb})"></div></a>`
                  }
                }
                insertion.innerHTML = thumb
              }
              catch(e) {
                if (gisdebugmode) {
                  console.error(e)
                }
              }
            }
            
            function buildshufflethumbs(seed, max) {
              // deterministic random so the 'related' thumbs are consistent
              var myrng = new Math.seedrandom(seed)
              
              let usablearray = []
              var other = document.querySelectorAll(`[jscontroller="${jscontroller}"].sizepropagated:not(.fmbrQQxz)`)
              for (let i=0;i<other.length;i++) {
                if (other[i].querySelector("a") && other[i].dataset && other[i].dataset.tw) {
                  usablearray.push(other[i])
                }
              }
              other = usablearray
              
              var target = other.length
              target = target > max ? max : target
              let shuffle = []
              
              var all = Array.from(Array(other.length).keys())
              
              function randint(min, max) {
                return ~~(myrng() * (max - min + 1)) + min
              }
              
              for (var i=0;i<target;i++) {
                var rand = randint(0,all.length - 1)
                shuffle.push(all[rand])
                all.splice(rand,1)
              }
              
              let outgoingarray = []
              for (let i=0;i<shuffle.length;i++) {
                let shuffled = shuffle[i]
                let item = other[shuffled]
                outgoingarray.push(item)
              }
              return outgoingarray
            }

            // if NO thumbs, use ONLY dummy thumbs
            if (related.length === 0) {
              if (gisdebugmode) {
                console.log("relatedlengthzero")
              }

              let rand = jsonid
              if (!rand) {
                rand = Math.random()
              }
              // ensure that the shuffled array are only valid thumbs
              let itemarray = buildshufflethumbs(rand, 7)
              
              for (var i=0;i<itemarray.length;i++) {
                appenddummythumb(itemarray[i], i, i+1)
              }
              
            }
            // if SOME or ALL thumbs,
            else {
              var ntarget = related.length
              // if ALL thumbs, (will add a view more link)
              if (ntarget >= 7) {
                ntarget = 7
                for (var i=0;i<ntarget;i++) {
                  appendtargetthumb(ntarget, i, i+1)
                }
              }
              // if SOME thumbs (1-6), first use real
              // then append dummy thumbs (will not add a view more link)
              else {
                for (var i=0;i<ntarget;i++) {
                  appendtargetthumb(ntarget, i, i+1)
                }
                let max = 7 - ntarget
                let itemarray = buildshufflethumbs(rand, max)
                for (var i=0;i<itemarray.length;i++) {
                  appenddummythumb(itemarray[i], i, i+1+ntarget)
                }                
              }
              return
            }
          }
        }
        
        var relatedimages = document.querySelectorAll(`.oldgisrelatedimage`)
        
        for (var i=0;i<8;i++) {
          relatedimages[i].innerHTML = ""
        }
        
        try {
          
          if (gisversion === 1) {
            
            var active = document.querySelectorAll('div.fmbrQQxz a[jsname="hSRGPd"]')[0]
            if (!active) {
              throw new Error("hSRGPd not found")
            }
            var url
            var href = active.href
            var json = querystringtojson(href)
            var {docid, q, tbnid, ved, vet, bih, biw, imgrefurl, imgurl} = json
            var kei = "aaa"
            q = encodeURIComponent(q)
            var eidblock = document.getElementById("rso")
            if (eidblock) {
              kei = eidblock.getAttribute("eid") || kei
            }
            var fullhtml = document.getElementsByTagName("html")[0].innerHTML
            var jsfsindex = fullhtml.indexOf(".jsfs")
            var snippet = fullhtml.substring(jsfsindex,jsfsindex+60)
            var regex = /\.jsfs\=\'(.+)\'/g
            var match = regex.exec(snippet)
            var jsfs = "fff"
            
            if (match) {
              if (match[1]) {
                jsfs = match[1]
              }
            }
            
            url = `
            https://www.google.com/async/imgrc
              ?ei=${kei}
              &yv=3
              &csi=VJS.0,VOS.6
              &ictx=1
              &iact=rc
              &ved=${ved}
              &vet=${vet}
              &imgrt=0
              &imgrmt=2
              &imgurl=${imgurl}
              &imgrefurl=${imgrefurl}
              &tbnid=${tbnid}
              &docid=${docid}
              &uact=3
              &bih=${bih}
              &biw=${biw}
              &q=${q}
              &imgdii=${tbnid}
              &ri=0
              &tbm=isch
              &tbs=
              &imgwo=448
              &land=1
              &async=cidx:1,saved:0,iu:0,lp:0,_fmt:prog,_id:irc_imgrc1,_jsfs:${jsfs}
            `
            
            url = url.replace(/(\r\n|\n|\r| )/gm, "")
            var xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            
            xhr.onload = function() {
              if (this.status >= 200 && this.status < 400) {
                var blob = this.response
                propagate(blob)
              }
            }
            
            xhr.onerror = function() {
              if (gisdebugmode) {
                console.log("error")
              }
              console.log("xhronerror")
            } 
            
            xhr.send()
          }

          else {
            
            function xhrprocess(posturl, params, successcallback, errorcallback) {

              var request = new XMLHttpRequest()
              posturl = posturl.replace(/(\r\n|\n|\r| )/gm, "")
              request.onreadystatechange = function() {
                if (this.readyState == 4) {
                  if (this.status == 200 || this.status === 0) {
                    successcallback(this.responseText)
                  }
                  else {
                    errorcallback(this.status)
                  }
                }
              }
              request.open('POST', posturl, true)
              request.withCredentials = false
              request.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8")
              request.send(params)
            }
            
            function secondpass() {
              
              var dataid = jsonid
              // testing for november 9, 2022
              if (gisdebugmode) {
                console.log("data id", dataid)
              }
              
              var docid = "M"
              // tested on visualfrontendserver20200131
              var p = document.getElementsByTagName("html")[0].innerHTML
              var pstart
              
              try {
                
                pstart = p.indexOf(`,"${dataid}"`)
                
                if (pstart === -1) {
                  throw new Error("less than one")
                }
                p = p.slice(pstart)
                p = p.replace(/(\r\n|\n|\r| )/gm, "")
                pstart = p.indexOf(`],"`)
                if (pstart === -1) {
                  throw new Error("less than one")
                }
                p = p.slice(pstart + 3)
                pstart = p.indexOf(`,"`)
                if (pstart === -1) {
                  throw new Error("less than one")
                }
                p = p.slice(pstart + 2)
                pstart = p.indexOf(`"`)
                if (pstart === -1) {
                  throw new Error("less than one")
                }
                if (pstart > 100) {
                  throw new Error("greater than one hundred")
                }
                
                docid = p.substring(0, pstart)
                
              }
              catch(e) {

              }
              
              var queryid = "a"
              
              try {
                var title = document.title
                var regex = /(.*) (\-|\–) Google .*$/
                var match = regex.exec(title)
                if (!match) {
                  throw new Error("no match")
                }
                title = encodeURIComponent((match[1]).replace(/\\/g, "\\\\\\\\").replace(/"/g, `\\\\\\"`))            
                queryid = title
              }
              catch(e) {

              }
              
              var rpcids = "phEE8d"
              
              function randint(min, max) {
                return ~~(Math.random() * (max - min + 1)) + min
              }
              
              var fsid = "4750123389312908396"
              
              var aaaat = encodeURIComponent("AKEDXo5VdfHLDGNGBU01035Y2cLc:1580626044261")
              
              var fullhtml = document.getElementsByTagName("html")[0].innerHTML
              
              try {
                var p = fullhtml
                var pstart = p.indexOf(`FdrFJe":"`)
                p = p.slice(pstart+9)
                pstart = p.indexOf(`"`)
                p = p.substring(0,pstart)
                fsid = encodeURIComponent(p)    
              }
              
              catch(e) {
                if (gisdebugmode) {
                  console.error("dont use fsid")
                }
              }
              
              try {
                var p = fullhtml
                var pstart = p.indexOf(`SNlM0e":"`)
                p = p.slice(pstart+9)
                pstart = p.indexOf(`"`)
                p = p.substring(0,pstart)
                aaaat = encodeURIComponent(p)    
              }
              catch(e) {
                if (gisdebugmode) {
                  console.error("dont use aaaat")
                }
              }
              
              let defaulthostname = window.location.hostname
              
              var geolang = "en-US"
              
              try {
                let elang = document.getElementsByTagName("html")[0].lang
                if (elang !== "en") {
                  geolang = elang
                }
              }
              
              catch(e) {
                if (gisdebugmode) {
                  console.error("en-US")
                }
                
              }
              
              
              // november 9, 2022
              var url = `
              https://www.google.com/_/VisualFrontendUi/data/batchexecute
                ?rpcids=${rpcids}
                &source-path=%2Fsearch
                &f.sid=${fsid}
                &bl=boq_visualfrontendserver_20221108.07_p0
                &hl=${geolang}
                &authuser
                &soc-app=162
                &soc-platform=1
                &soc-device=1
                &_reqid=${100476 + randint(1,10000)}
                &rt=c
              `
              
              var params = `f.req=%5B%5B%5B%22${rpcids}%22%2C%22%5Bnull%2C%5C%22${dataid}%5C%22%2C%5C%22${docid}%5C%22%2Cnull%2C383%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5C%22${queryid}%5C%22%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5D%5D%2Cnull%2Cnull%2Cfalse%2Cnull%2Cnull%2Cnull%2C%5B%5Bfalse%5D%2Cfalse%2C%5B%5D%2Cnull%2Ctrue%2C%5B%5D%2C%5Btrue%2Ctrue%5D%2Ctrue%5D%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5D%5D%22%2Cnull%2C%221%22%5D%5D%5D&at=${aaaat}&`
              
              // january 24, 2020
              ////  var url = `
              ////  https://${defaulthostname}/_/VisualFrontendUi/data/batchexecute
              ////    ?rpcids=${rpcids}
              ////    &f.sid=${fsid}
              ////    &bl=boq_visualfrontendserver_20200131.02_p0
              ////    &hl=${geolang}
              ////    &authuser
              ////    &soc-app=162
              ////    &soc-platform=1
              ////    &soc-device=1
              ////    &_reqid=${100476 + randint(1,600000)}
              ////    &rt=c
              ////    &at=${aaaat}
              ////  `    
              ////  var params = `f.req=%5B%5B%5B%22${rpcids}%22%2C%22%5Bnull%2C%5C%22${dataid}%5C%22%2C%5C%22${docid}%5C%22%2Cnull%2C433%2Cnull%2Cnull%2Cnull%2Cfalse%2C%5B%5C%22${queryid}%5C%22%5D%2Cnull%2Cnull%2Cfalse%2C0%2Cfalse%5D%22%2Cnull%2C%221%22%5D%5D%5D&`
              
              xhrprocess(
                url, 
                params, 
                function(data) {
                  propagate(data)
                }, 
                function(e) {
                  if (gisdebugmode) {
                    console.log("bad response from server")
                  }
                }
              )
              
            }

            secondpass()
          }

        }
        catch(e) {
          oldgis.power.off()
          if (gisdebugmode) {
            console.error(e)
          }
          return
        }
      },
      propagate: (json) => {
        
        var update
        if (!json) {
          update = false
          json = oldgis.data.json
        }
        else {
          update = true
          oldgis.data.json = json
        }
        var fullsize = json.fullsize || ""
        var linkback = json.linkback || ""
        var thumb = json.thumb || ""
        var domain = json.domain || "https://google.com"
        var width = json.width || 1
        var height = json.height || 1
        var title = json.title || ""
        if (update) {
          document.querySelectorAll(".moredetailsareatitle")[0].innerHTML = title
          document.querySelectorAll(".moredetailsareasubtitle")[0].innerHTML = domain
          document.querySelectorAll(".oldgisrealwidth")[0].innerHTML = width
          document.querySelectorAll(".oldgisrealheight")[0].innerHTML = height
        }
        var boxholder = document.querySelectorAll(".oldgisswapboxholder")[0]
        var swapbox = document.querySelectorAll(".oldgisswapbox")[0]
        var fullsizeimagearea = document.querySelectorAll(".fullsizeimagearea")[0]
        var shrinkwidth = 100
        if (window.innerWidth < 1200) {
          shrinkwidth = ~~(detailsscale(window.innerWidth, 500, 1200, 0, 100))
          if (shrinkwidth < 50) {
            shrinkwidth = 50
          }
        }
        var acceptablewidth = fullsizeimagearea.offsetWidth - shrinkwidth
        var acceptableheight = fullsizeimagearea.offsetHeight - 120
        var destwidth = width
        var destheight = height
        var ratio
        if (width >= height) {
          if (width >= acceptablewidth) {
            destwidth = acceptablewidth
            ratio = acceptablewidth / width
            destheight = ratio * height
          }
          if (destheight >= acceptableheight) {
            ratio = acceptableheight / destheight
            destheight = acceptableheight
            destwidth = destwidth * ratio
          }
        }
        else {
          if (height >= acceptableheight) {
            destheight = acceptableheight
            ratio = acceptableheight / height
            destwidth = ratio * width
          }
          if (destwidth >= acceptablewidth) {
            ratio = acceptablewidth / destwidth
            destheight = destheight * ratio
            destwidth = acceptablewidth
          }        
        }
        boxholder.style.width = `${Math.round(destwidth)}px`
        boxholder.style.height = `${Math.round(destheight)}px`
        boxholder.style.background = "unset"
        boxholder.style.backgroundImage = `url(${thumb})`
        boxholder.style.backgroundSize = "cover"
        swapbox.style.width = `${Math.round(destwidth)}px`
        swapbox.style.height = `${Math.round(destheight)}px`
        swapbox.style.display = "block"
        function resumexatt() {
          try {
            if (swapbox && swapbox.attributes) {
              let xattributes = Object.values(swapbox.attributes)
              for (let rp=0;rp<xattributes.length;rp++) {
                let xattribute = xattributes[rp].localName
                if (![
                  "src", 
                  "class", 
                  "style", 
                  "data-atf", 
                  "data-iml", 
                  "width", 
                  "height"
                ].includes(xattribute)) {
                  swapbox.removeAttribute(xattribute)
                }
              }
            }
          }
          catch(e) {
            if (gisdebugmode) {
              console.error(e)
            }
          }
        }
        // checkerboard 
        swapbox.onload = (e) => {
          boxholder.style.background = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURf///+rq6hX5lggAAAAUSURBVAjXY2Cw/8BADP5/gIEYDAAkgh1NOfT7DQAAAABJRU5ErkJggg==)`
          boxholder.style.backgroundSize = "20px 20px"
          resumexatt()
        }
        swapbox.onerror = () => {
          boxholder.style.background = `url(${json.thumb})`
          boxholder.style.backgroundSize = `${boxholder.style.width} ${boxholder.style.height}`
          swapbox.style.display = "none"
          resumexatt()
        }
        swapbox.src = fullsize
        if (update) {
          var oldgisswapboxlink = document.querySelectorAll(".oldgisswapboxlink")[0]
          oldgisswapboxlink.href = linkback
          var moredetailsareatitlelink = document.querySelectorAll(".moredetailsareatitlelink")[0]
          moredetailsareatitlelink.href = linkback
          var moredetailsareabuttonsviewlink = document.querySelectorAll(".moredetailsareabuttonsviewlink")[0]
          var moredetailsareabuttonsvisitlink = document.querySelectorAll(".moredetailsareabuttonsvisitlink")[0]
          moredetailsareabuttonsviewlink.href = fullsize
          moredetailsareabuttonsvisitlink.href = linkback 
        }
        if (gisversion > 1) {
          function qhunicode(string) {
            string = string.replace(/\\u0026/gm,"&").replace(/\\u003d/gm,"=")
            return string
          }
          var issuewiththumb = false
          var thumb = fullsize
          function gisfullconclusion() {
            oldgis.data.json.realfullsize = true
            oldgis.data.json.fullsize = fullsize
            swapbox.src = fullsize
            if (update) {
              var moredetailsareabuttonsviewlink = document.querySelectorAll(".moredetailsareabuttonsviewlink")[0]
              moredetailsareabuttonsviewlink.href = fullsize            
            }
          }        
          if (thumb.substring(0,4) === "data" && !oldgis.data.json.realfullsize) {
            var jid = null
            try {
              // who knows if they will change things up randomly soon just prepare for whatever
              var jimage = document.querySelector(`img[src="${thumb}"]`)
              if (jimage) {
                if (jimage.parentNode.getAttribute("jscontroller") === jscontroller) {
                  jid = jimage.parentNode.dataset.id
                }
                else if (jimage.parentNode.parentNode.getAttribute("jscontroller") === jscontroller) {
                  jid = jimage.parentNode.parentNode.dataset.id
                }
                else if (jimage.parentNode.parentNode.parentNode.getAttribute("jscontroller") === jscontroller) {
                  jid = jimage.parentNode.parentNode.parentNode.dataset.id
                }
                else if (jimage.parentNode.parentNode.parentNode.parentNode.getAttribute("jscontroller") === jscontroller) {
                  jid = jimage.parentNode.parentNode.parentNode.parentNode.dataset.id
                }
                else if (jimage.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("jscontroller") === jscontroller) {
                  jid = jimage.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.id
                }
              }
            }
            catch(e) {
              if (gisdebugmode) {
                console.error(e)
              }
            }
            if (jid) {
              try {
                var jindex = document.body.innerHTML.indexOf(`${jid}",`)
                var jscrub = document.body.innerHTML.substring(jindex,document.body.innerHTML.length)
                jindex = jscrub.indexOf(`"http`) // thumb url
                jscrub = jscrub.substring(jindex+5, jscrub.length)
                jindex = jscrub.indexOf(`"http`)
                jscrub = jscrub.substring(jindex+1, jscrub.length)
                jindex = jscrub.indexOf(`",`)
                jscrub = jscrub.substring(0,jindex)
                
                if (gisdebugmode) {
                  // sometimes still working, november 9, 2022
                  console.log("24feb2020")
                }
                
                fullsize = qhunicode(jscrub)
                gisfullconclusion()
                return                
              }
              catch(e) {
                if (gisdebugmode) {
                  console.error(e)
                }
              }
            }
          }
          // extended method first try document.body.innerHTML if not found there then use ajaxblob
          // if not found yet try the giant HTML blob before moving forwards
          var revfound = false
          if ( thumb.substring(0,4) !== "data" 
          
            && thumb.indexOf("encrypted-tbn") > -1 
            && !oldgis.data.json.realfullsize) {
              
            try {
              var qhblob = document.body.innerHTML
              var searchlink = `${thumb.split("=tbn")[1].replace(/\&/g, "\\u0026").replace(/\=/g, "\\u003d")}",`
              var index = qhblob.indexOf(searchlink)
              
              if (index === -1) {
                throw new Error("nosearchlink-type-a")
              }
              
              qhblob = qhblob.substring(index,qhblob.length)
              qhblob = qhblob.substring(qhblob.indexOf("http"),qhblob.length)
              var index = qhblob.indexOf(`"`)
              if (index === -1) {
                throw new Error("nosearchlink-type-b")
              }
              qhblob = qhblob.substring(0,index)
              revfound = true
              fullsize = qhunicode(qhblob)
            }
            catch(e) {
              if (gisdebugmode) {
                console.error(e)
              }
            }   
          }
          if (revfound) {
            if (gisdebugmode) {
              console.log("t28feb2020p1")
            }
            gisfullconclusion()
            return
          }
          if ( thumb.substring(0,4) !== "data" 
            && thumb.indexOf("encrypted-tbn") > -1 
            && !oldgis.data.json.realfullsize ) {
            try {
              // april 19 2020
              var qhblob = atobUTF8(document.getElementById("gisipcajaxcontent").innerHTML)
              var searchlink
              let searchlinkfound = false
              try {
                searchlink = `${thumb.split("%3A")[1].split("&")[0]}`
                searchlinkfound = true
              }
              catch(e) {
                if (gisdebugmode) {
                  console.error("no-%3A-searchlink19apr2020")
                }
              }
              if (!searchlinkfound) {
                try {
                  // https://encrypted-tbn0.gstatic.com/images?q=tbn:RANDOMSTRING&usqp=CAU
                  searchlink = `${thumb.split("tbn:")[1].split("&")[0]}`
                  searchlinkfound = true
                }
                catch(e) {
                  if (gisdebugmode) {
                    console.error("no-:-searchlink7jan2021")
                  }                  
                }
              }
              if (!searchlinkfound) {
                throw new Error("nosearchlink-type-e")
              }
              
              var index = qhblob.indexOf(searchlink)
              if (index === -1) {
                throw new Error("nosearchlink-type-c")
              }
              qhblob = qhblob.substring(index,qhblob.length)
              qhblob = qhblob.substring(qhblob.indexOf("http"),qhblob.length)
              var index = qhblob.indexOf(`"`)
              
              if (index === -1) {
                throw new Error("nosearchlink-type-d")
              }
              qhblob = qhblob.substring(0,index-1)
              revfound = true
              fullsize = qhunicode(qhblob)
            }
            catch(e) {
              if (gisdebugmode) {
                console.error(e)   
              }            
            }
          }
          if (revfound) {
            if (gisdebugmode) {
              console.log("t28feb2020p2")
            }
            gisfullconclusion()
            return
          }
          if (thumb.substring(0,4) === "data") {
            if (gisdebugmode) {
              console.log("thumbissue-data-type-a")
            }          
            issuewiththumb = true
          }
          var searchingfor
          function searchforfullsizeandproceed(activegisuniqueid, count) {
            if (count > 200) {
              if (activegisuniqueid === gisuniqueid) {
                gisfullconclusion()
              }
              else {
                if (gisdebugmode) {
                  console.log("gis has changed")
                }
              }
              return
            }
            var found = false
            var gisipcwindowcontext = document.getElementById("gisipcwindowcontext")
            var gissetvalues = JSON.parse(gisipcwindowcontext.innerText)
            if (gissetvalues.gisipcblobid === gisuniqueid) {
              found = true
              if (gissetvalues.gisipcblobfullsize !== "" && gissetvalues.gisipcblobfullsize !== "0") {
                fullsize = gissetvalues.gisipcblobfullsize
              }
              else {
                if (gisdebugmode) {
                  console.log("fullsize didnt match up")
                }
              }
            }            
            if (!found) {
              if (activegisuniqueid === gisuniqueid) {
                setTimeout(()=>{
                  count++
                  searchforfullsizeandproceed(activegisuniqueid, count)
                },10)
              }
            }
            else {
              if (activegisuniqueid === gisuniqueid) {
                gisfullconclusion()
              }
            }
          }
          // this is a backup method and only works right now in chrome
          if (!oldgis.data.json.realfullsize) {
            gisuniqueid = (+ new Date())
            var encurl = thumb
            searchingfor = encurl
            if (!issuewiththumb) {
              findfullsizeimagefromencurl(gisuniqueid, encurl)
            }
            if (!issuewiththumb) {
              setTimeout(()=>{
                searchforfullsizeandproceed(gisuniqueid, 0)
              },0)
              return
            }
            else {
              if (gisdebugmode) {
                console.log("there was an issue fetching the thumb")
              }
              return
            }
          }
        }
        return
      },
      renew: () => {
        
        if (!oldgis.data.thumb) {
          return
        }
        
        var oldgisdetails = document.getElementById("oldgisdetails")
        var thumb = document.querySelectorAll('.fmbrQQxz')[0]
        
        var height = thumb.offsetHeight
        var top = thumb.getBoundingClientRect().top
        var scrolly = window.scrollY
        
        if (!oldgis.data.details) {
          oldgis.data.details = true
          oldgisdetails.style.display = "flex"
        }
        
        oldgisdetails.style.top = `${height+top+scrolly+realpaddingbottom}px`
        return
      },
      destroy: () => {
        oldgis.data.details = false
        var oldgisdetails = document.getElementById("oldgisdetails")
        oldgisdetails.style.display = "none"      
        return
      }
    },
    thumb: {
      disable: () => {
        try {
          var qdivs = document.querySelectorAll(`div[jscontroller="${jscontroller}"]`)
          if (!qdivs) {
            return
          }
          for (var i=0;i<qdivs.length;i++) {
            qdivs[i].classList.remove("fmbrQQxz")
          }
          oldgis.data.thumb = false
          return
        }
        catch(e) {
          if (gisdebugmode) {
            console.error(e)
          }
        }
      },
      enable: function(element) {
        
        var swapbox = document.querySelectorAll(".oldgisswapbox")[0]
        
        swapbox.src = ""
        swapbox.style.width = "0px"
        swapbox.style.height = "0px"
        
        element.classList.add("fmbrQQxz")
        
        oldgis.data.thumb = true
        
        var top = element.getBoundingClientRect().top + element.offsetHeight
        var scrolly = window.scrollY
        var target = scrolly + top - detailsoffsettop
        
        window.scrollTo(0, target)
        
        oldgis.details.renew()
        
        try {
          
          var fullsize
          var linkback
          var thumb
          var domain
          var width
          var height
          var title
          var id   
          let meta
          
          if (gisversion === 1) {
            meta = document.querySelectorAll("div.fmbrQQxz .rg_meta")[0]
            if (meta) {
              meta = meta.innerHTML
            }
            else {
              return
            }
            var details = JSON.parse(meta)
            fullsize = details.ou
            linkback = details.ru
            thumb = details.tu
            domain = details.isu
            width = details.ow
            height = details.oh
            title = details.pt
            id = details.id
            if (document.querySelectorAll("div.fmbrQQxz .mVDMnf")[0]) {
              title = document.querySelectorAll("div.fmbrQQxz .mVDMnf")[0].innerHTML
            }
          }
          
          else {
            
            meta = document.querySelector("div.fmbrQQxz")
            
            var atarget = document.querySelectorAll("div.fmbrQQxz a").length
            var linkbackhref = "http://google.com"
            var classwgvvnb = ".WGvvNb"
            
            // nov 2022
            let tryspan = document.querySelector("div.fmbrQQxz a span")
            let newclasswgvvnb = tryspan && tryspan.classList && tryspan.classList[0] ? tryspan.classList[0] : null
            
            let testclass = document.querySelectorAll('.OztcRd')
            if (testclass.length > 0) {
              classwgvvnb = ".OztcRd"
            }
            // if (newclasswgvvnb !== null) {
            //   // "." + OztcRd (classname .OztcRd)
            //   classwgvvnb = "." + newclasswgvvnb
            // }
            //else {
              for (let i=0;i<atarget;i++) {
                if (document.querySelectorAll("div.fmbrQQxz a")[i].href) {
                  linkbackhref = document.querySelectorAll("div.fmbrQQxz a")[i].href
                  //if (newclasswgvvnb === null) {
                    // try {
                    //   classwgvvnb = `.${document.querySelectorAll("div.fmbrQQxz a")[i].children[0].children[0].classList[0]}`
                    // }
                    // catch(e) {
                    // 
                    // }
                  //}
                  break
                }
              }
            
            //}
            
            let thim = document.querySelector("div.fmbrQQxz img")
            thumb = thim && thim.dataset && thim.dataset.iurl
            
            if (!thumb) {
              thumb = thim && thim.dataset && thim.dataset.src
            }
            
            if (!thumb) {
              thumb = thim.src
            }
            
            fullsize = thumb
            linkback = linkbackhref
            
            var etmp = document.createElement ('a')
            etmp.href = linkbackhref
            
            var edomain = etmp.hostname.toString()
            if (edomain.startsWith("www.")) {
              edomain = edomain.slice(4)
            }
            
            let fxg = document.querySelector("div.fmbrQQxz .fxgdke")
            
            edomain = fxg ? fxg.innerText : ""
            
            domain = edomain
            width = 1
            height = 1
            
            let fq = document.querySelector("div.fmbrQQxz")
            
            width = fq && fq.dataset && fq.dataset.ow ? fq.dataset.ow : 1
            height = fq && fq.dataset && fq.dataset.oh ? fq.dataset.oh : 1
            
            title = edomain
            
            try {
              title = document.querySelector(`div.fmbrQQxz ${classwgvvnb}`).innerText
            }
            catch(e) {
              if (gisdebugmode) {
                console.log("fail on try class wg")
              }
            }
            
            try {
              if (title.length === 0 || title === "" || title === edomain) {
                title = document.querySelector(`div.fmbrQQxz .WGvvNb`).title
              }
            }
            catch(e) {
              title = edomain || "x"
            }
            
            title = title.length > 57 ? title.substring(0,57) + " ..." : title
            
            id = null
            
            try {
              id = document.querySelector("div.fmbrQQxz").dataset.tbnid           
            }
            catch(e) {

            }
            
            try {
              id = document.querySelector("div.fmbrQQxz").dataset.id           
            }
            catch(e) {

            }
            
          }
          
          var realfullsize
          
          domain = domain.replace(`\n · In stock`, "")
          
          var json = {
            fullsize,
            linkback,
            thumb,
            domain,
            width,
            height,
            title,
            id,
            realfullsize: false // v2
          }
          
          if (json.id) {
            oldgis.details.propagate(json)
            oldgis.details.related(json.id)
          }
          else {
            throw new Error(e)
          }
          
          return          
        }

        catch(e) {
          if (gisdebugmode) {
            console.error(e)
          }
          oldgis.power.off()
        } 

        return
      }
      
    },
    power: {
      off: () => {
        oldgis.thumb.disable()
        oldgis.details.destroy()
        return
      }
    }
  }

  document.addEventListener("click", (e) => {
    try {
      let rgbxtarget
      if (gisversion === 1) {
        rgbxtarget = e.target.classList.contains("rg_bx")
      }
      else if (gisversion > 1) {
        rgbxtarget = (e.target.getAttribute("jscontroller") === jscontroller)
      }
      if (rgbxtarget) {
        if (e.target.classList.contains("fmbrQQxz")) {
          oldgis.power.off()
        }
        else {
          if (e.target.getAttribute("jscontroller") === jscontroller) {
            oldgis.thumb.disable()
            oldgis.thumb.enable(e.target)
          }
          else if (e.target.getAttribute("jscontroller") === "KDx8xf") {
            var children = e.target.children
            if (!children) {
              return
            }
            for (var i=0;i<children.length;i++) {
              var element = children[i]
              if (element.getAttribute("jsname") === "kGm0Xb") {
                var href = element.href
                if (href) {
                  window.open(href, '_blank')
                }
                break
              }
            }
          }
        }
      }
      else if (e.target.id === "oldgisbuttonclose") {
        oldgis.power.off()
      }
      else if (e.target.id === "oldgisbuttonprev") {
        oldgis.jump(false)
      }
      else if (e.target.id === "oldgisbuttonnext") {
        oldgis.jump(true)
      }
      else if (e.target.id === "hdtb-tls" || e.target.classList.contains("PNyWAd")) {
        oldgis.resize(true)
      }
      else if (e.target.classList.contains("oldgisrelatedthumbdata")) {
        var oldselection = document.querySelectorAll(".oldgisrelatedcurrentselection")
        if (oldselection && oldselection[0]) {
          oldselection[0].classList.remove("oldgisrelatedcurrentselection")
        }
        e.target.classList.add("oldgisrelatedcurrentselection")
        var thumbuid = e.target.dataset.thumbuid
        oldgis.details.override(thumbuid)
      }
      else if (e.target.id === "isz_ex_a" || e.target.id === "zebidoc" || e.target.id === "zebidob" || e.target.id === "zebidoa") {
        e.stopPropagation()
        e.preventDefault()
        exactlytool.open()
        return
      }
      else if (e.target.id === "xogesb") {
        exactlytool.submit()
        return
      }
      // else if (gisversion > 1 && !appendexactfound) {
      //   setTimeout(()=>{
      //     appendexactly()
      //   },1)
      //   
      // }
      if (exactlyopen && !e.target.classList.contains("exqty")) {
        exactlytool.close()
      }    
    }
    catch(e) {
      if (gisdebugmode) {
        // cannot read properties of length
        // november 9, 2022
        console.error(e)
      }
    }
    return
  })

  window.addEventListener('resize', ()=>{
    oldgis.resize(true)
  })
  window.addEventListener("keydown", function (e) {
    if (e.keyCode && e.keyCode === 27 && exactlyopen) {
      e.stopPropagation()
      exactlytool.close()  
      return
    }  
    if (document.activeElement.tagName.toLowerCase() === "input") {
      if (e.keyCode && e.keyCode === 13 && document.activeElement.classList.contains("exqty")) {
        exactlytool.submit()
      }
      return
    }
    if (oldgis.data.thumb) {
      if (e.keyCode === 38 || e.keyCode === 40) {
        e.stopPropagation()
        return null
      }
      if (e.keyCode === 39) {
        e.stopPropagation()
        oldgis.jump(true)
      }
      else if (e.keyCode === 37) {
        e.stopPropagation()   
        oldgis.jump(false)
      }
      else if (e.keyCode === 27) {
        e.stopPropagation()
        oldgis.power.off()
      }
    }
    else {
      if (e.keyCode >= 37 && e.keyCode <= 40) {
        e.stopPropagation()
        return null
      }
    }
  }, true);

  var expired = 0
  var doubleback = false

  function unloadnativeloop() {
    
    if (++expired > 1000) {
      return
    }
    var activethumb = null
    var shadowtitlelink = null
    let conditiontosatisfy = null
    if (expired > 500) {
      conditiontosatisfy = document.querySelector('.Beeb4e')
    }
    else {
      conditiontosatisfy = document.querySelector('.Beeb4e') && document.querySelector('.YcWSDf')
    }
    if (conditiontosatisfy) {
      shadowtitlelink = document.querySelector('.Beeb4e').textContent
      if (shadowtitlelink.length === 0) {
        shadowtitlelink = document.querySelector('.Beeb4e').innerHTML
      }      
      try {
        if (document.querySelector('.YcWSDf')) {
          var ycwsdf = document.querySelector('.YcWSDf')
          if ( ycwsdf 
            && ycwsdf.parentElement 
            && ycwsdf.parentElement.dataset.ri ) {
            activethumb = ycwsdf.parentElement
          }
          else if ( ycwsdf 
            && ycwsdf.parentElement 
            && ycwsdf.parentElement.parentElement 
            && ycwsdf.parentElement.parentElement.dataset.ri ) {
            activethumb = ycwsdf.parentElement.parentElement
          }
          if (activethumb && ycwsdf) {
            ycwsdf.remove()
          }
        }
        else {
          
        }
      }
      catch(e) {
        console.error(e)
      }
      if (!activethumb) {  
        if (document.querySelector('.isv-r')) {
          activethumb = document.querySelector('.isv-r')
        }
        else if (document.querySelector(`div[data-ri="0"]`)) {
          activethumb = document.querySelector(`div[data-ri="0"]`)
        }
      }
    }
    var closebox = null
    if (gisversion === 1) {
      closebox = document.getElementById("irc_ccbc")
    }
    else if (gisversion > 1) {
      closebox = document.querySelector(".hm60ue")
    }  
    if (shadowtitlelink && closebox) {
      closebox.click()
      doubleback = true
      // unfortunately that added a new history state
      // remmeber this so when a user hits the back button later
      // it will go back twice bypassing that new state
      if (activethumb) {
        setTimeout(()=>{
          oldgis.thumb.enable(activethumb)
          setTimeout(()=>{
            var scrolled = window.scrollY
            var adjust = document.querySelectorAll(".fmbrQQxz")[0].getBoundingClientRect().top + document.querySelectorAll(".fmbrQQxz")[0].offsetHeight
            window.scrollTo(0,adjust+scrolled-detailsoffsettop)
            requestAnimationFrame(unloadnativeloop)
          },0)
        },0)
      }
      return null
    }
    else {
      requestAnimationFrame(unloadnativeloop)
    }
  }
  unloadnativeloop()  

  window.onpopstate = function (event) {
    if (event.state) {
      if (doubleback) {
        window.history.back()
      }
    } 
  }

  var nowhover = false
  var appendexactlycount = 0
  function appendexactlyloop() {
    appendexactly()
    if (appendexactfound || (++appendexactlycount > 1000)) {
      return
    }
    setTimeout(()=>{
      appendexactlyloop()
    },100)
  }

  if (gisversion === 1) {
    appendexactlyloop()
  }
  
  return null
}

function waitforelement(count) {
  count++
  if (count > 1000) {
    console.log("first div never found!")
    googleimagesrestored()
    return null
  }
  let div = document.querySelector('div[data-ved].isv-r')
  if (div) {
    googleimagesrestored()
  }
  else {
    setTimeout(()=>{
      waitforelement(count)
    },10)
  }
}

waitforelement(0);
