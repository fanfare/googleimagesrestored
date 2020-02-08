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

preloadipc( chrome.extension.getURL('js/ipc.js'), 'body')

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

console.log(`frontend gisversion ${gisversion}`)

var detailsscale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
} 

var appendexactfound = false

function appendexactly() {
  
  try {
    
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
    </div>`
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
            console.error("exact size already exists")
          }
        }
      }
    }
    else if (gisversion > 1) {
      var largeli = document.querySelector(`[aria-label="Large"]`)
      if (largeli) {
          // var ul = largeli.parentElement
          // if (ul && ul.tagName && ul.tagName.toLowerCase() === "ul") {
          // var elems = document.querySelectorAll("li")
          // // if for some reason it already exists, e.g. google adds it back, dont append it here
          // var res = Array.from(elems).find(v => v.textContent.toLowerCase().includes('exact'))
          // if (!res) {
          var iconsize = document.querySelector(`[aria-label="Icon"]`) // <a href="/search?q=%22ji&amp;tbm=isch&amp;tbs=isz%3Am&amp;bih=783&amp;biw=1196&amp;hl=en&amp;ved=0CAIQpwVqFwoTCKCwz8bNsucCFQAAAAAdAAAAABAC" jslog="679" aria-label="Medium" data-navigation="server" class="MfLWbb"><div class="Hm7Qac "><span class="igM9Le">Medium</span></div></a>
          appendexactfound = true
          iconsize.insertAdjacentHTML("afterend", `<a class="MfLWbb" id="zebidoa"><div class="Hm7Qac" id="zebidob"><span class="igM9Le zebragis" id="zebidoc">Exactly..</span></div></a>${exactfloatboxdom}`)
          //}
          //else {
          //  console.error("exact size already exists")
          //}
        // }
      }      
    }
    
    
    
  }
  catch(e) {
    console.error(e)
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

// some global screen sizes to keep track of later
var detailsminheight = window.innerHeight - 240
var detailsoffsettop

function calculateoffsets() { 
  detailsoffsettop = ~~(detailsscale(window.innerHeight, 777, 1161, 120, 150))
  detailsminheight = window.innerHeight - 240
  detailsminheight = detailsminheight < 500 ? 500 : detailsminheight
  return
}

// extra space below the image before the shadowbox
var realpaddingbottom = 30

// set up environment based on screen height
calculateoffsets()

// native styling

// *** TODO ***

// DONE the Q7Rsec controller needs to be replaced.
// WORKING the sub rg_l divs etc all need to be replaced with a more specific selector that contains old relevant data.
// UNKNOWN the .nJGrxf element needs to be replaced
// the #rg element needs to be replaced
// DONE the a.rg_l element needs to be replaced
// DONE RGL NOT KDx8 which is AD.. the KDx8xf controller must be found and replaced.. as well as .rg_ilmbg
// UNKNOWN the .eJXyZe element must be replaced


// DONE --------------
// jscontroller
var jscontroller = "Q7Rsec"
try {
  jscontroller = document.querySelectorAll(`div[data-ri="0"]`)[0].getAttribute("jscontroller")
}
catch(e) {
  
}
// ---------------DONE

// DONE --------------
// rgl
var classrgl = ".rg_l"
if (gisversion > 1) {
  // find rgl for new class
  try {
    if (gisversion === 2) {
      classrgl = ".wXeWr"
    }
    // january 20, 2020
    if (document.querySelectorAll(`div[jscontroller="${jscontroller}"]`)[0]) {
      var alinks = document.querySelectorAll(`div[jscontroller="${jscontroller}"]:first-of-type a`)
      for (let i=0;i<alinks.length;i++) {
        // using 'data-nav' as the unique feature to look for
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
// -------------- DONE

// DONE --------------
var classilmbg = ".rg_ilmbg"
if (gisversion > 1) {
  try {
    if (gisversion === 2) {
      classilmbg = ".h312td"
    }
  }
  catch(e) {
    
  }
}
// --------------- DONE


// DONE
sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover ${classrgl} {box-shadow: 0 2px 12px 0 rgba(0,0,0,0.35)!important}`, 0)

// DONE
if (gisversion === 1) {
  sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover .rg_ilmbg {pointer-events:none!important;display:block!important}`,0)
}

// DONE
// all 800 x 800 inline spans aka rgilmbg
if (gisversion > 1) {
  sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover span {pointer-events:none!important;display:block!important}`,0)  
  sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover ${classilmbg} {pointer-events:none!important;display:block!important}`,0)  
}

if (gisversion > 1) {
  // Refinements-3
  sheet.insertRule(`div[data-id^="Refinements"] {display:none}`,0)   
  sheet.insertRule(`.MSM1fd:hover .RtIwE {display:none}`,0)   
}

sheet.insertRule(`.MSM1fd:hover .wXeWr {box-shadow:none}`,0)
sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover .rg_anbg {display:none!important}`,0)
//sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover .RtIwE {display:none!important}`,0)
//sheet.insertRule(`div[jscontroller="${jscontroller}"]:not(.nowhover):hover .h312td {display:none!important}`,0)


// here
// this was breaking new items from loading.. possibly an issue..
// invesitgate
// sheet.insertRule(`html {overflow-x:hidden!important}`,0)


// DONE not sure what this even was
sheet.insertRule(`.nJGrxf span, .nJGrxf {pointer-events:none!important}`,0)
// DONE
sheet.insertRule(`g-loading-icon {display:none!important}`,0)

// TODO find native #rg min width
sheet.insertRule(`#rg {min-width: 95vw!important}`,0)


// DONE
sheet.insertRule(`a${classrgl} {pointer-events: none!important;-moz-pointer-events:none!important}`,0)

// DONE give illusion the q7rsec divs are clickable
sheet.insertRule(`div[jscontroller="${jscontroller}"] {cursor: pointer;-moz-user-select:none!important;user-select:none!important}`,0)

// DONT UNKNOWN ADS likely depreciated or A/B testing
sheet.insertRule(`div[jscontroller="KDx8xf"] {cursor: pointer;-moz-user-select:none!important;user-select:none!important}`,0)
if (gisversion > 1) {
  sheet.insertRule(`span.MfLWbb.itb-st.Wlq9kf {display: none!important}`,0)
}
// DONE
if (gisversion === 1) {
  sheet.insertRule(`div[jscontroller="KDx8xf"]:hover .rg_ilmbg {display:block!important;height:100%!important;pointer-events:none!important}`,0)
}
if (gisversion > 1) {
  sheet.insertRule(`div[jscontroller="KDx8xf"]:hover span {display:block!important;height:100%!important;pointer-events:none!important}`,0)
  sheet.insertRule(`div[jscontroller="KDx8xf"]:hover ${classilmbg} {display:block!important;height:100%!important;pointer-events:none!important}`,0)
}

// DxONE
document.body.insertAdjacentHTML("beforeend", `
  <style id="oldgisbottommargin">
    html body .fmbrQQxz {margin-bottom:${detailsminheight+50}px!important}
  </style>
`)

// DONE
document.body.insertAdjacentHTML("beforeend", `
  <style id="oldgisdetailsspace">
    #oldgisdetails {left:0;position:absolute;width:100%;display:block;height:${detailsminheight}px;background:#222;top:0px;z-index:100;display:none}
  </style>
`)   

// SEE IF THESE ARE THOSE STUPID BLOCKS AND REMOVE THEM IN NEW VERSION
sheet.insertRule('.eJXyZe {display:none!important}',0)




// MAKE SURE THIS STILL WORKS WHEN LIVE
sheet.insertRule(`.fmbrQQxz::before {content:'';z-index:999999999;position: absolute;text-align: center;margin: 0 auto;height: 0px;left: calc(50% - 10px);width: 0;height: 0;background: transparent;bottom: -32px;border-bottom: 17px solid #222;border-left: 16px solid transparent;border-right: 16px solid transparent;}`,0)


// TODO part of the exactly tool
var urlsizeparamswap = (append) => {
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

// NOT FINISHED BUT LOW PRIORITY DO THIS LAST EXACT IMAGE SIZE JAN 2020
var exactlyopen = false
var exactlytool = {
  open: () => {
    var oldgisexactsizecloak = document.getElementById("oldgisexactsizecloak")
    var oldgisexactsize = document.getElementById("oldgisexactsize")
    oldgisexactsizecloak.classList.remove("oldgisexacthide")
    oldgisexactsize.classList.remove("oldgisexacthide")
    exactlyopen = true
    return
  },
  close: () => {
    var oldgisexactsizecloak = document.getElementById("oldgisexactsizecloak")
    var oldgisexactsize = document.getElementById("oldgisexactsize")
    var oldgisexactlywidth = document.getElementById("oldgisexactlywidth")
    var oldgisexactlyheight = document.getElementById("oldgisexactlyheight")
    oldgisexactsizecloak.classList.add("oldgisexacthide")
    oldgisexactsize.classList.add("oldgisexacthide")
    oldgisexactlywidth.value = ""
    oldgisexactlyheight.value = ""
    exactlyopen = false
    document.activeElement.blur()
    return
  },
  submit: () => {
    //
    try {
      var oldgisexactlywidth = document.getElementById("oldgisexactlywidth")
      var oldgisexactlyheight = document.getElementById("oldgisexactlyheight")
      
      // get value of width and height
      var append = null
      var width = oldgisexactlywidth.value
      var height = oldgisexactlyheight.value
      if (width && !isNaN(width) && width > 0 && height && !isNaN(height) && height > 0) {
        append = `tbs=isz:ex,iszw:${~~(width)},iszh:${~~(height)}`
      }
      else if (width && !isNaN(width) && width > 0) {
        append = `tbs=isz:ex,iszw:${~~(width)},iszh:${~~(width)}`
      }
      else if (height && !isNaN(height) && height > 0) {
        append = `tbs=isz:ex,iszw:${~~(height)},iszh:${~~(height)}`
      }
      var target = urlsizeparamswap(append)
      window.location.href = target
    }
    catch(e) {
      console.error("exact size error")
      console.error(e)
    }
    return
  }
}

// DONE build the shadowbox
var oldgisdetails = document.createElement("div")
oldgisdetails.id = "oldgisdetails"
document.body.appendChild(oldgisdetails)

// DONE some styling for the shadowbox
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
      display:inline-block
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
      background-size:cover
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

// IN PROGRESS main app functions
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
  
  // prev/next navigation
  jump: (next) => {
    
    
    var top = oldgisdetails.getBoundingClientRect().top
    var thumb = document.querySelectorAll("div.fmbrQQxz")[0]
    if (!thumb) {
      return
    }
    var position = Number(thumb.dataset.ri)
    var off = next ? 1 : -1
    
    // DONE jan 15
    // can probably easily swap out the jscontroller here for the new global controller..
    // but be careful, find the select item for #rg_s or just eliminate that entirely? investigate
    
    var jumpthumb = document.querySelectorAll(`div[jscontroller="${jscontroller}"][data-ri="${position+off}"]`)[0]
    if (!jumpthumb) {
      return
    }
    oldgis.thumb.disable()
    oldgis.thumb.enable(jumpthumb)    
    var newtop = oldgisdetails.getBoundingClientRect().top
    var pushdown = newtop - top
    var nowscroll = window.scrollY
    window.scrollTo(0, nowscroll + pushdown)
    return
  },
  
  // SEEMS OKAY
  
  // timer function to quickly re-perform this event 20 times after 
  // resizing has stopped to 'catch up' for google's latent native grid ui algo
  resize: (organic) => {
    
    function routine() {
      calculateoffsets()
      document.getElementById("oldgisbottommargin").remove()
      
      // DONE jan 15
      // the #rg might not be required here.. investigate
      
      document.body.insertAdjacentHTML("beforeend", `<style id="oldgisbottommargin">
        html body .fmbrQQxz {margin-bottom:${detailsminheight+50}px!important}
      </style>`)
      document.getElementById("oldgisdetailsspace").remove()
      document.body.insertAdjacentHTML("beforeend", `<style id="oldgisdetailsspace">
        #oldgisdetails {left:0;position:absolute;width:100%;display:block;height:${detailsminheight}px;background:#222;top:0px;z-index:100;display:none}
      </style>`)
      
      // nothing to reposition
      if (!oldgis.data.thumb) {
        return
      }
      // do not provide new json blob - it will use the last good json
      oldgis.details.propagate(false)

      // INVESTIGATE
      // can probably easily swap out the jscontroller here for the new global controller..
      
      var fulltop = document.querySelectorAll(`[jscontroller="${jscontroller}"][data-ri="0"]`)[0].getBoundingClientRect().top + window.scrollY
      var thistop = document.querySelectorAll('div.fmbrQQxz')[0].offsetTop
      var thisheight = document.querySelectorAll('div.fmbrQQxz')[0].offsetHeight
      var absolutetop = fulltop + thistop + thisheight + realpaddingbottom
      var oldgisdetails = document.getElementById("oldgisdetails")
      oldgisdetails.style.top = `${absolutetop}px`
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
  
  // functions for the shadowbox that opens up
  details: {
    
    // replace the current image data with one from a related thumbnail
    override: (uid) => {
      
      // console.log(uid)
      
      var meta = null
      
      try {
        var meta = document.querySelectorAll(`.oldgisrelatedthumbdata[data-thumbuid="${uid}"]`)[0]
      }
      catch(e) {
        console.error("no meta")
      }
      // if not provided then provide supplement based off of fetch
      
      if (!meta) {
        console.error("couldnt override@@@")
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
    
    // request and handle related thumbnails
    
    related: (jsonid) => {
      
      function propagate(blob) {
        
        var footer = document.querySelectorAll(".moredetailsareafooter")[0]
        // two strategies depending on what google provides for related images
        // for both strategies, ensure the first image is the primary thumbnail image
        var thumb
        if (gisversion === 1) {
        // set it up here and mark it to ensure it isnt re-used again later
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
            
            // console.log("zero results length!!!")
            
            // if no native related images .. 
            // gather some random images from the page and populate the thumbnails
            // check to ensure this doesn't re-add the primary image 
            
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
                var domain = json.st || json.isu
                var thumb = `<div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${json.tu})" data-title="${title}" data-domain="${domain}" data-width="${json.ow}" data-height="${json.oh}" data-thumb="${json.tu}" data-fullsize="${json.ou}" data-linkback="${json.ru}" data-thumbuid="${json.id}"></div>`
                var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${i+1}"]`)[0]
                insertion.innerHTML = thumb
              }
              catch(e) {
                console.error(e)
              }
            }
          }
          else {
            for (var i=0;i<results.length;i++) {
              try {
                var result = results[i]
                var meta = result.querySelectorAll(".rg_meta")[0].innerHTML
                // console.log(meta)
                var json = JSON.parse(meta)
                // console.log(json)
                var title = json.pt.length > 30 ? json.pt.substring(0,30) + " ..." : json.pt
                var thumb = `<div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${json.tu})" data-title="${title}" data-domain="${json.st}" data-width="${json.ow}" data-height="${json.oh}" data-thumb="${json.tu}" data-fullsize="${json.ou}" data-linkback="${json.ru}" data-thumbuid="${json.id}"></div>`
                
                var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${i+1}"]`)[0]
                // if this is the last one
                // and 'see more' is available
                // make the last link a 'View more' link
                if (i === 6) {
                  // finished
                  // THIS IS SUPER LIKELY DIFFERENT NOW..
                  // GET THE ABSOLUTE IN A CLASSZUJDTB VALUE
                  var seemore = container.querySelectorAll(".ZuJDtb")[0]
                  // console.log(seemore)
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
                console.error(e)
              }
            }    
            
          }
          
        }
        
        else if (gisversion > 1) {
          // console.log("propagate gisversion greater than one")
          // using strategy for json esque blob returned from 'visualfrontendserver'
          var related = []
          var seemorelink = false
          try {
            var usearray = []
            var p = blob
            var pstart = p.indexOf("[[")
            if (pstart === -1) {
              throw new Error("less than one")
            }            
            p = p.slice(pstart+1)
            p = p.split("\n")
            p = p[0]
            var awfulblob = (JSON.parse(p))[2]
            var newblob = (JSON.parse(awfulblob))[0]
            var newarray = []
            for (let i=0;i<newblob.length;i++) {
              var thisblob = newblob[i]
              if (typeof thisblob === "object") {
                if (thisblob !== null) {
                  newarray = thisblob[0]
                  break
                }
              }
            }
            // console.log("newarray")
            // console.log(newarray)
            var relatedarray = []
            for (let i=0;i<newarray.length;i++) {
              var thisblob = newarray[i]
              if (typeof thisblob === "object") {
                if (thisblob !== null && thisblob.length > 3) {
                  relatedarray = thisblob
                  break
                }
              }
            }
            // console.log("relatedarray")
            // console.log(relatedarray)
            var allarrays = []
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
            for (let i=0;i<allarrays.length;i++) {
              var thisarray = allarrays[i][1]
              var json = {
                realfullsize: true,
                fullsize: thisarray[3][0],
                linkback: thisarray[9]["2003"][2],
                thumb: thisarray[2][0],
                domain: thisarray[9]["2003"][12],
                width: thisarray[3][2],
                height: thisarray[3][1],
                title: thisarray[9]["2003"][3],
                id: thisarray[1]
              }
              if (json.title.length > 30) {
                json.title = json.title.substring(0,30) + "..."
              }
              related.push(json)
            }
            // console.log(related)
            if (related.length === 0) {
              // console.log("no matches maybe try different strategy")
            }
          }
          catch(e) {
            // console.log("diff strategy needed")
            console.error(e)
            //return
            related = []
          }
          try {
            
            var expglob = ""
            var p = blob
            var pstart = p.indexOf(`u003drimg:`)
            if (pstart === -1) {
              throw new Error("less than one")
            }                   
            p = p.slice(pstart + 10)
            pstart = p.indexOf("\\")
            p = p.substring(0,pstart)
            expglob = p
            // qs
            var yyqs = (rawquerystringtojson(document.location.href).q).replace(/\+/g,"%20")
            if (yyqs) {
              seemorelink = `https://www.google.com/search?q=${yyqs}&tbm=isch&tbs=rimg%3A${expglob}`
            }
            // else if ((rawquerystringtojson(document.location.href).oq).replace(/\+/g,"%20")) {
            //   yyqs = (rawquerystringtojson(document.location.href).oq).replace(/\+/g,"%20")
            //   seemorelink = `https://www.google.com/search?q=${yyqs}&tbm=isch&tbs=rimg%3A${expglob}`
            // }
            else {
              throw new Error("no searchword")
            }
          }
          catch(e) {
            // console.error(e)
            // console.log("coudlnt get seemore link but it might have not even provided one")
          }
          // reusing some code, gis version two no results very simliar to previous
          if (related.length === 0) {
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
                
                var shuffled = shuffle[i]
                
                var thumbdomain
                var thumbfullsize
                var thumbthumb
                var thumbtitle
                var thumbid
                var thumbwidth
                var thumbheight
                var thumblinkback
                var thumbdomain
                
                // the element messing with from within the shuffle
                var result = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1})`)[0]
                
                if (!result) {
                  shuffled--
                  result = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1})`)[0]
                  if (!result) {
                    shuffled++
                    shuffled++
                    result = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1})`)[0]
                    if (!result) {
                      shuffled++
                      result = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(1)`)[0]
                      if (!result) {
                        console.log("still no result")
                        console.log(shuffled)
                        continue
                      }
                    }
                  }
                }
                // document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(3)`)[0]
                thumbwidth = result.dataset.ow
                thumbheight = result.dataset.oh
                thumbid = result.dataset.tbnid || result.dataset.id
                // console.log(thumbid, thumbwidth, thumbheight)
                // linkback has the href
                thumblinkback = "http://google.com"
                var atarget = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) a`).length
                var classwgvvnb = ".WGvvNb"
                for (let i=0;i<atarget;i++) {
                  // console.log(i)
                  if (document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) a`)[i].href) {
                    // console.log("thres an href")
                    thumblinkback = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) a`)[i].href          
                    try {
                      var gmevne = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) a`)[i].children[0].children[0].classList[0]
                      classwgvvnb = `.${gmevne}`
                      // console.log(classwgvvnb)
                    }
                    catch(e) {
                      // console.log("couldnt get but no problem")
                    }
                    break
                  }
                  else {
                    // console.log("no href")
                  }
                }
                // console.log(shuffled)
                thumbthumb = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) img`)[0].dataset.iurl
                if (!thumbthumb) {
                  thumbthumb = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) img`)[0].dataset.src
                }
                if (!thumbthumb) {
                  thumbthumb = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) img`)[0].src
                }
                
                thumbfullsize = thumbthumb
                // domain currently residing on .fxgdke
                var etmp = document.createElement ('a')
                etmp.href = thumblinkback
                var edomain = etmp.hostname.toString()
                if (edomain.startsWith("www.")) {
                  edomain = edomain.slice(4)
                }
                // console.log(edomain)
                if (document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) .fxgdke`)[0]) {
                  // console.log("better one found")
                  edomain = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) .fxgdke`)[0].innerText
                  // console.log(edomain)
                }
                thumbdomain = edomain
                // console.log(thumbdomain)
                // real title currently residing on .WGvvNb
                var thumbtitle = edomain
                try {
                  thumbtitle = document.querySelectorAll(`[jscontroller="${jscontroller}"]:not(.fmbrQQxz):nth-of-type(${shuffled+1}) ${classwgvvnb}`)[0].innerText
                }
                catch(e) {
                  // console.log("couldnt find the title")
                }
                var thumb = `<div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${thumbthumb})" data-title="${thumbtitle}" data-domain="${thumbdomain}" data-width="${thumbwidth}" data-height="${thumbheight}" data-thumb="${thumbthumb}" data-fullsize="${thumbfullsize}" data-linkback="${thumblinkback}" data-realfullsize="false" data-thumbuid="${thumbid}"></div>`
                
                var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${i+1}"]`)[0]
                insertion.innerHTML = thumb
                
              }
              catch(e) {
                console.error(e)
              }
            }
            
          }      
          else {
            
            // console.log("there were results that need to be appened")
            // console.log(related)
            
            var ntarget = related.length
            if (ntarget > 7) {
              ntarget = 7
            }
            
            for (var i=0;i<ntarget;i++) {
              try {
                var result = related[i]
                
                let {realfullsize, domain, fullsize, height, id, linkback, title, width} = result
                var nthumb = result.thumb

                //var title = json.pt.length > 30 ? json.pt.substring(0,30) + " ..." : json.pt
                var thumb = `<div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${nthumb})" data-title="${title}" data-domain="${domain}" data-width="${width}" data-height="${height}" data-thumb="${nthumb}" data-fullsize="${fullsize}" data-linkback="${linkback}" data-thumbuid="${id}" data-realfullsize="true"></div>`
                
                var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${i+1}"]`)[0]
                // if this is the last one
                // and 'see more' is available
                // make the last link a 'View more' link
                
                if (i === 6) {
                  
                  if (seemorelink) {
                    
                    thumb = `<a class="oldgisseemore" href="${seemorelink}"><div class="oldgisrelatedthumbdata" style="cursor:pointer; width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${nthumb})"></div></a>`
                  }
                }
                insertion.innerHTML = thumb
                if (i > 5) {
                  break
                }
              }
              catch(e) {
                console.error(e)
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
            console.error("error")
          } 
          
          xhr.send()

        }
        
        else {
          
          function xhrprocess(posturl, params, successcallback, errorcallback) {
            
            var request = new XMLHttpRequest()
            posturl = posturl.replace(/(\r\n|\n|\r| )/gm, "")
            request.onreadystatechange = function() {
              if (this.readyState == 4) {
                if (this.status == 200) {
                  successcallback(this.responseText)
                }
                else {
                  console.error(posturl)
                  console.error(params)
                  errorcallback(this.status)
                }
              }
            }
            request.open('POST', posturl, true)
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8")
            request.send(params)
          }
          
          // image request
          function secondpass() {
            
            var dataid = jsonid
            var docid = "M"
            // insane way to find docid
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
              // console.log("couldnt get the variable correctly, use default")
              // console.log(dataid)
            }
            
            var queryid = "a"
            
            try {
              var title = document.title
              var regex = /(.*) \- Google Search$/
              var match = regex.exec(title)
              if (!match) {
                throw new Error("no match")
              }
              title = encodeURIComponent((match[1]).replace(/\\/g, "\\\\\\\\").replace(/"/g, `\\\\\\"`))            
              queryid = title

            }
            catch(e) {
              // console.log("coulndt get the queryid correctly maybe just use default")
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
              console.error("dont use fsid")
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
              console.error("dont use aaaat")
            }
            
            // console.log(fsid)
            
            var url = `
            https://www.google.com/_/VisualFrontendUi/data/batchexecute
              ?rpcids=${rpcids}
              &f.sid=${fsid}
              &bl=boq_visualfrontendserver_20200131.02_p0
              &hl=en-US
              &authuser
              &soc-app=162
              &soc-platform=1
              &soc-device=1
              &_reqid=${100476 + randint(1,600000)}
              &rt=c
              &at=${aaaat}
            `    
            var params = `f.req=%5B%5B%5B%22${rpcids}%22%2C%22%5Bnull%2C%5C%22${dataid}%5C%22%2C%5C%22${docid}%5C%22%2Cnull%2C433%2Cnull%2Cnull%2Cnull%2Cfalse%2C%5B%5C%22${queryid}%5C%22%5D%2Cnull%2Cnull%2Cfalse%2C0%2Cfalse%5D%22%2Cnull%2C%221%22%5D%5D%5D&`
            
            xhrprocess(
              url, 
              params, 
              function(data) {
                propagate(data)
              }, 
              function(e) {
                console.log("error")
                console.log("bad response from server shut down")
              }
            )
            
          }
          
          // possible log request
          function firstpass() {
            // var url = 'https://www.google.com/log?format=json&hasfast=true&authuser=0'
            // var params = `[[1,null,null,null,null,null,null,null,null,null,[null,null,null,null,"en",null,"boq_visualfrontendserver_20200131.02_p0"]],704,[["1580537279483",null,[],null,null,null,null,"[null,[null,\"12ahUKEwil75KV2K_nAhUSzawKHdifCMoQMygAegUIARCGAg..i\"],null,null,[[],[[24]],[]]]",null,null,5,null,null,null,null,null,null,null,null,[],1,null,null,"[[[1580537279481000,0,0],2],[[6985,null,null,[1]],[3593,null,null,[]]],[[1580537271859109,179096850,3389562840]],[null,null,null,null,null,null,null,null,null,null,null,null,null,[]]]",null,null,[]],["1580537279501",null,[],null,null,null,null,"[null,[\"2ahUKEwil75KV2K_nAhUSzawKHdifCMoQMygAegUIARCGAg\",\"12ahUKEwil75KV2K_nAhUSzawKHdifCMoQMygAegUIARCGAg..i\"],null,null,[[],[[24]],[]]]",null,null,null,null,null,null,null,null,null,null,null,[],2,null,null,"[[[1580537279481000,0,0],3],[[8467,null,null,[1,3,4,5,6,9,10,11,12]],[8187,null,null,[2]],[3597,null,null,[]],[3724,null,null,[]],[17628,null,null,[]],[8168,null,null,[]],[8164,null,null,[7,8],null,1],[36715,null,null,[]],[5877,null,null,[]],[3598,null,null,[]],[52885,null,null,[]],[8152,null,null,[]],[12678,null,null,[]]],null,[null,null,3,null,null,1,null,null,\"https://www.alimentarium.org/en/system/files/thumbnails/image/AL027-01_pomme_de_terre_0.jpg\",\"https://www.alimentarium.org/en/knowledge/potato\",null,\"hVA5Vk6tlrllEM\",\"MVIBc3JIcfYynM\",[]]]",null,null,[]]],"1580537279501",[],null,null,null,null,null,null,null,null,0]`
          }
                    
          secondpass()
          
        }

      }
      catch(e) {
        oldgis.power.off()
        console.error(e)
        return
      }
    },
    
    // load details from the json provided
    propagate: (json) => {
      
      // console.log("propagate")
      // console.log(json)
      
      var update
      // last good json - can use this in the event of window resizing
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
      
      // drop background size drop background drop backgroundimage
      boxholder.style.width = `${Math.round(destwidth)}px`
      boxholder.style.height = `${Math.round(destheight)}px`
      boxholder.style.background = "unset"
      boxholder.style.backgroundImage = `url(${thumb})`
      boxholder.style.backgroundSize = "cover"
      
      swapbox.style.width = `${Math.round(destwidth)}px`
      swapbox.style.height = `${Math.round(destheight)}px`
      swapbox.style.display = "block"

      // checkerboard 
      swapbox.onload = () => {
        boxholder.style.background = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURf///+rq6hX5lggAAAAUSURBVAjXY2Cw/8BADP5/gIEYDAAkgh1NOfT7DQAAAABJRU5ErkJggg==)`
        boxholder.style.backgroundSize = "20px 20px"
      }
      swapbox.onerror = () => {
        swapbox.style.display = "none"
      }
      
      // here you can update the fullsize      
      
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
        
        // console.log("append larger image based on fullsize")
        var issuewiththumb = false
        
        var thumb = fullsize
        
        if (thumb.substring(0,4) === "data") {
          issuewiththumb = true
        }     
        
        function gisfullconclusion() {
          oldgis.data.json.realfullsize = true
          oldgis.data.json.fullsize = fullsize
          // console.log("do necessary updating with the full size src here")
          swapbox.src = fullsize
          if (update) {
            var moredetailsareabuttonsviewlink = document.querySelectorAll(".moredetailsareabuttonsviewlink")[0]
            moredetailsareabuttonsviewlink.href = fullsize            
          }
        }
        
        var searchingfor
        function searchforfullsizeandproceed(activegisuniqueid, count) {
          // console.log(searchingfor)
          // if count is greater than 2 seconds
          if (count > 200) {
            // console.log("giving up looking for full size!")
            // console.log("full size will just have to be the thumb unfortunately")
            if (activegisuniqueid === gisuniqueid) {
              gisfullconclusion()
            }
            else {
              // console.log("gis has changed")
            }
            return
          }
          
          var found = false
          var gisipcwindowcontext = document.getElementById("gisipcwindowcontext")
          var gissetvalues = JSON.parse(gisipcwindowcontext.innerText)
          // console.log(gissetvalues)
          // only for absolute most current
          if (gissetvalues.gisipcblobid === gisuniqueid) {
            found = true
            // console.log("MATCH")
            if (gissetvalues.gisipcblobfullsize !== "" && gissetvalues.gisipcblobfullsize !== "0") {
              fullsize = gissetvalues.gisipcblobfullsize
            }
            else {
              console.log("fullsize didnt match up")
            }
          }            
          // only proceed if the uniqueid is the same
          if (!found) {
            if (activegisuniqueid === gisuniqueid) {
              // console.log("stil the same but not found yet continuing rapidly..")
              setTimeout(()=>{
                // console.log(`trying ${count}`)
                // console.log(`for ${activegisuniqueid}`)
                count++
                searchforfullsizeandproceed(activegisuniqueid, count)
              },10)
            }
            else {
              // console.log("gis unique uid changed dont continue!!")
              // console.log(`${activegisuniqueid} ${gisuniqueid}`)
            }
          }
          else {
            // console.log("found and finished!")
            if (activegisuniqueid === gisuniqueid) {
              gisfullconclusion()
            }
            else {
              // console.log("found but gis has changed")
            }
          }
        }
        
        // this is a backup method and only works right now in chrome
        
        if (!oldgis.data.json.realfullsize) {
          
          
          // console.log("not yet full size need to find it")
          gisuniqueid = (+ new Date())
          var encurl = thumb
          searchingfor = encurl
          // console.log(gisuniqueid, encurl)
          // async DOM crawl.. try simple time-based callback
          if (!issuewiththumb) {
            // console.log("no issue with thumba")
            findfullsizeimagefromencurl(gisuniqueid, encurl)
          }
          
          if (!issuewiththumb) {
            // console.log("no issuewiththumbb")
            setTimeout(()=>{
              // console.log("search for full size and proceed from null timeout")
              searchforfullsizeandproceed(gisuniqueid, 0)
            },0)
            return
          }
          else {
            console.log("there was an issue fetching the thumb")
            console.log(thumb)
            return
          }
        
        }
        else {
          // console.log("already full size")
        }

      }
      
      // console.log("made it here ok")
      return
    },
    // update the image details
    renew: () => {
      
      // console.log("renewing")
      
      if (!oldgis.data.thumb) {
        return
      }
      var oldgisdetails = document.getElementById("oldgisdetails")
      
      // *** TODO ***
      
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
    
    // close the shadowbox
    destroy: () => {
      oldgis.data.details = false
      var oldgisdetails = document.getElementById("oldgisdetails")
      oldgisdetails.style.display = "none"      
      return
    }
  },
  
  // functions for the main image grid
  thumb: {
    // make inactive
    disable: () => {
      try {
        
        // DONE
        var qdivs = document.querySelectorAll(`div[jscontroller="${jscontroller}"]`)
        if (!qdivs) {
          // console.log("no qdivs found error halt")
          return
        }
        for (var i=0;i<qdivs.length;i++) {
          qdivs[i].classList.remove("fmbrQQxz")
        }
        oldgis.data.thumb = false
        return
      }
      catch(e) {
        console.error(e)
      }
    },
    // make an image active
    enable: function(element) {
      
      // console.log("likely reclassified for version 2")
      // console.log("element triggered")
      
      var swapbox = document.querySelectorAll(".oldgisswapbox")[0]
      swapbox.src = ""
      swapbox.style.width = "0px"
      swapbox.style.height = "0px"
      
      element.classList.add("fmbrQQxz")
      // deploy needs to be automatically applied for shift+click listeners
      // per original div so if shift clicked it will open that url in a new window
      // left-right listener
      oldgis.data.thumb = true
      var top = element.getBoundingClientRect().top + element.offsetHeight
      var scrolly = window.scrollY
      // TODO: maybe tween from current position to this ease-in-out
      //var target = scrolly + top + detailsoffsettop
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
            // good working object for version 1
            meta = meta.innerHTML
          }
          else {
            // console.log("no meta, halt")
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
          else {
            // console.log("mvdmnf not found.. something else needed..")
            // console.log("the title wasnt able to be propagated")
          }

        }
        else {

          // version 2
          // console.log("version two")
          // meta is merely the active element.. need heurestics to find specific details
          meta = document.querySelectorAll("div.fmbrQQxz")[0]
          
          // possibly provide graceful fallbacks in case these options become unavailable in the future
          // version two no longer provides full size inline, so use thumb until real size is fetched
          // linkback has the href
          var atarget = document.querySelectorAll("div.fmbrQQxz a").length
          var linkbackhref = "http://google.com"
          
          // attempt to find controller for WGvvNb
          var classwgvvnb = ".WGvvNb"
          
          for (let i=0;i<atarget;i++) {
            if (document.querySelectorAll("div.fmbrQQxz a")[i].href) {
              linkbackhref = document.querySelectorAll("div.fmbrQQxz a")[i].href          
              try {
                classwgvvnb = `.${document.querySelectorAll("div.fmbrQQxz a")[i].children[0].children[0].classList[0]}`
              }
              catch(e) {
                // console.log("no problem")
              }
              break
            }
          }
          
          thumb = document.querySelectorAll("div.fmbrQQxz img")[0].dataset.iurl
          if (!thumb) {
            thumb = document.querySelectorAll("div.fmbrQQxz img")[0].dataset.src
          }
          if (!thumb) {
            thumb = document.querySelectorAll("div.fmbrQQxz img")[0].src
          }
          
          fullsize = thumb
          linkback = linkbackhref
          
          // domain currently residing on .fxgdke
          var etmp = document.createElement ('a')
          etmp.href = linkbackhref
          var edomain = etmp.hostname.toString()
          if (edomain.startsWith("www.")) {
            edomain = edomain.slice(4)
          }
          // console.log(edomain)
          if (document.querySelectorAll("div.fmbrQQxz .fxgdke")[0]) {
            // console.log("better one found")
            edomain = document.querySelectorAll("div.fmbrQQxz .fxgdke")[0].innerText
            // console.log(edomain)
          }
          
          domain = edomain
          width = document.querySelectorAll("div.fmbrQQxz")[0].dataset.ow
          height = document.querySelectorAll("div.fmbrQQxz")[0].dataset.oh
          
          // real title currently residing on .WGvvNb
          title = edomain
          try {
            title = document.querySelectorAll(`div.fmbrQQxz ${classwgvvnb}`)[0].innerText
          }
          catch(e) {
            // console.log("couldnt find the title")
          }
          
          id = null
          try {
            id = document.querySelectorAll("div.fmbrQQxz")[0].dataset.tbnid           
          }
          catch(e) {

          }
          try {
            id = document.querySelectorAll("div.fmbrQQxz")[0].dataset.id           
          }
          catch(e) {

          }            
         
        }
        
        var realfullsize
        
        if (gisversion > 1) {
          
        }
        
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
          // console.log("able to propagate because json id was found")
          // console.log("if version two json full size isnt rendered yet so this is more seamless to show the thumb first")
          oldgis.details.propagate(json)
          oldgis.details.related(json.id)
        }
        else {
          // console.log("halt everything now because json id not found")
          throw new Error(e)
        }
        
        return          
          
      }
      catch(e) {
        console.error(e)
        oldgis.power.off()
      } 
      return
    }
  },
  // close the shadowbox
  power: {
    off: () => {
      oldgis.thumb.disable()
      oldgis.details.destroy()
      return
    }
  }
}

// wait for a click events
document.addEventListener("click", (e) => {
  try {
    // grid images
    // no longer rg_bx
    // rg_bx good for version 1
    
    // replace 
    let rgbxtarget
    if (gisversion === 1) {
      rgbxtarget = e.target.classList.contains("rg_bx")
    }
    else if (gisversion > 1) {
      // console.log("target greater than one")
      rgbxtarget = (e.target.getAttribute("jscontroller") === jscontroller)
      // console.log(rgbxtarget)
    }
    if (rgbxtarget) {
      // console.log("rgbxtarget")
      if (e.target.classList.contains("fmbrQQxz")) {
        oldgis.power.off()
      }
      else {
        // console.log("else")
        if (e.target.getAttribute("jscontroller") === jscontroller) {
          // console.log("jscontroller triggered")
          oldgis.thumb.disable()
          oldgis.thumb.enable(e.target)
        }
        else if (e.target.getAttribute("jscontroller") === "KDx8xf") {
          // console.log("ad")
          // console.log("some kind of ad but need to make sure this class is definitely an ad")
          // its some kind of ad.. make it external hyperlinkable
          // loop through children
          var children = e.target.children
          if (!children) {
            // console.log("no children found")
            return
          }
          for (var i=0;i<children.length;i++) {
            // console.log(children[i])
            var element = children[i]
            // this is different
            if (element.getAttribute("jsname") === "kGm0Xb") {
              var href = element.href
              if (href) {
                window.open(href, '_blank')
              }
              break
            }
          }
        }
        else {
          // console.log("not avail")
          // console.log(e.target)
        }
      }
    }
    
    // these are all okay 
    // close preview button
    else if (e.target.id === "oldgisbuttonclose") {
      oldgis.power.off()
    }
    // previous button
    else if (e.target.id === "oldgisbuttonprev") {
      oldgis.jump(false)
    }
    // next button
    else if (e.target.id === "oldgisbuttonnext") {
      oldgis.jump(true)
    }
    
    // more tools button
    
    // *** TODO ***
    // find this target id
    else if (e.target.id === "hdtb-tls" || e.target.classList.contains("PNyWAd")) {
      oldgis.resize(true)
    }
    // related images
    else if (e.target.classList.contains("oldgisrelatedthumbdata")) {
      var oldselection = document.querySelectorAll(".oldgisrelatedcurrentselection")
      if (oldselection && oldselection[0]) {
        oldselection[0].classList.remove("oldgisrelatedcurrentselection")
      }
      e.target.classList.add("oldgisrelatedcurrentselection")
      var thumbuid = e.target.dataset.thumbuid
      oldgis.details.override(thumbuid)
    }
    
    // exact size
    // get equivelent for isz_ex_a in version 2
    else if (e.target.id === "isz_ex_a" || e.target.id === "zebidoc" || e.target.id === "zebidob" || e.target.id === "zebidoa") {
      e.stopPropagation()
      e.preventDefault()
      exactlytool.open()
      return
    }
    // exact size submit
    else if (e.target.id === "xogesb") {
      exactlytool.submit()
      return
    }
    else {
      //console.log("noclicktarget")
    }
    // if cloak or close then also close the size selector
    if (e.target.id === "oldgisexactsizecloak" || e.target.id === "closeexactsize") {
      try {
        // attempt click if fail continue
        // console.log("need new target to click for hdtb-mn-hd")
        document.querySelectorAll('.hdtb-mn-hd')[0].click()
      }
      catch(e) {
        console.error(e)
      }
    }
    if (exactlyopen && !e.target.classList.contains("exqty")) {
      // console.log("good exqty value")
      exactlytool.close()
    }    
  }
  catch(e) {
    console.error(e)
  }
  return
})

// resizing scheme triggered by resizing of the browser - will run in a loop
// for a second after the resizing event stops to compensate for any original google page lag

window.addEventListener('resize', ()=>{
  oldgis.resize(true)
})

// remove original arrowkey listeners
window.addEventListener("keydown", function (e) {
  
  if (e.keyCode && e.keyCode === 27 && exactlyopen) {
    e.stopPropagation()
    exactlytool.close()
    try {
      // attempt click if fail continue
      document.querySelectorAll('.hdtb-mn-hd')[0].click()
    }
    catch(e) {
      console.error(e)
    }    
    return
  }  
  
  // *** TODO ***
  // main query input class:
  // document.querySelectorAll(`header form input[spellcheck="false"]`)[0].classList.value
  
  if (document.activeElement.tagName.toLowerCase() === "input") {
    // handle submission of exact size request
    if (e.keyCode && e.keyCode === 13 && document.activeElement.classList.contains("exqty")) {
      exactlytool.submit()
    }
    return
  }
  
  
  e.stopPropagation()
  if (!oldgis.data.thumb) {
    return
  }
  
  
  // next
  if (e.keyCode === 39) {
    e.stopPropagation()
    oldgis.jump(true)
  }
  
  
  // prev
  else if (e.keyCode === 37) {
    e.stopPropagation()   
    oldgis.jump(false)
  }
  
  
  // close
  else if (e.keyCode === 27) {
    e.stopPropagation()
    oldgis.power.off()
  }
  
  
}, true)

var expired = 0
var doubleback = false

function unloadnativeloop() {
  if (++expired > 1000) {
    // done looking
    // console.log("giveupclosebox")
    return
  }
  // the page was loaded with an image open in the side shadowbow - close it and open it in the new format
  
  var activethumb
  if (gisversion === 1) {
    activethumb = document.getElementsByClassName('irc-s')[0]
  }
  else if (gisversion > 1) {
    activethumb = document.querySelector(".IpBtuf")
  }
  
  if (activethumb) {
    if (gisversion > 1) {
      activethumb = document.querySelector(".IpBtuf").parentElement.parentElement
    }
    console.log("activethumbfound")
    console.log(activethumb)
    var closebox
    if (gisversion === 1) {
      closebox = document.getElementById("irc_ccbc")
    }
    else if (gisversion > 1) {
      closebox = document.querySelector(".hm60ue")
    }
    
    // document.querySelector(".hm60ue").click()
    if (closebox) {
      closebox.click()
      doubleback = true
      // unfortunately that added a new history state
      // remmeber this so when a user hits the back button later it will go back twice bypassing that new state
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
    return
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

// thumbnail hovering, careful to preserve pointer-events:none on old listeners
// while disabling thumbnail hovering when hovering over external hyperlinks

var nowhover = false

function oldgismouseevents(e) {
  try {
    
    if (gisversion === 1) {
      
      // not hovering over an external hyperlink
      if (!e.target.classList.contains("iKjWAf")) {
        // not hovering over a thumbnail 
        if (nowhover) {
          document.querySelectorAll(".nowhover")[0].classList.remove("nowhover")
          nowhover = false
          return
        }
      }
      else {
        // hovering over a thumbnail..
        // was it already active? if so return
        // otherwise drop nowhover class and add it to this one
        if (e.target.parentNode) {
          if (e.target.parentNode.classList.contains("nowhover")) {
            return
          }
          else {
            if (nowhover) {
              // remnant
              document.querySelectorAll(".nowhover")[0].classList.remove("nowhover")
            }
            nowhover = true
            // find updated rg_bx
            // nowhover only applicable to rg_bx
            if (e.target.parentNode.classList.contains("rg_bx")) {
              e.target.parentNode.classList.add("nowhover")
            }
          }
        }
      }  
    }
    else if (gisversion > 1) {
      
      var nsize = 0
      if (e.target.getAttribute("jscontroller") === jscontroller) {
        nsize = e.target.offsetHeight
      }
      
      if (e.target.getAttribute("jscontroller") === jscontroller && nsize !== 0 && nsize - e.layerY < 45) {
        if (nowhover) {
          document.querySelectorAll(".nowhover")[0].classList.remove("nowhover")
        }
        nowhover = true
        e.target.classList.add("nowhover")
        return

      }      
      
      // not hovering over an external hyperlink
      if (!e.target.classList.contains("fxgdke") && !e.target.classList.contains("WGvvNb") && !e.target.classList.contains("sMi44c")) {
        
        // not hovering over a thumbnail 
        if (nowhover) {
          // console.log("nowhover")
          document.querySelectorAll(".nowhover")[0].classList.remove("nowhover")
          nowhover = false
        }
        
      }
      else {
        // the new gis handles hovering over the link poorly try and fix it a little bit
        // 
        // hovering over a link..
        // was it already active? if so return
        // otherwise drop nowhover class and add it to this one
        if (e.target.parentNode && e.target.parentNode.parentNode && e.target.parentNode.parentNode.parentNode) {
          if (e.target.parentNode.parentNode.parentNode.classList.contains("nowhover")) {
            return
          }
          else if (e.target.parentNode.parentNode.classList.contains("nowhover")) {
            return
          }
          else {
            if (nowhover) {
              // remnant
              document.querySelectorAll(".nowhover")[0].classList.remove("nowhover")
            }
            nowhover = true
            // find updated rg_bx
            // nowhover only applicable to rg_bx
            if (e.target.parentNode.parentNode.parentNode.getAttribute("jscontroller") === jscontroller) {
              e.target.parentNode.parentNode.parentNode.classList.add("nowhover")
            }
            else if (e.target.parentNode.parentNode.getAttribute("jscontroller") === jscontroller) {
              e.target.parentNode.parentNode.parentNode.classList.add("nowhover")
            }
          }
        }
      }  
    }
  }
  catch(e) {
    console.error(e)
  }
}

// flaky in firefox and also chrome because of some 'in stock' thing .. dont use right now
// document.addEventListener("mousemove", oldgismouseevents, false)

// 'exact size' feature went missing, append below but if it returns then use native
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

// something is messed up with the exact search
// when it is used it overrides the other buttons
// figure something out later
if (gisversion === 1) {
  appendexactlyloop();
}

