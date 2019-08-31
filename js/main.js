var sheet = (function() {
  var style = document.createElement("style")
  style.appendChild(document.createTextNode(""))
  document.head.appendChild(style)
  return style.sheet
})()

var detailsscale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
} 

// some global screen sizes to keep track of later
var detailsminheight = window.innerHeight - 240
var detailsoffsettop

// i don't remember exactly how google images looked on tall monitors, this is my best guess for now
function calculateoffsets() { 
  //if (window.innerHeight > 1161) {
  //  detailsoffsettop = 120
  //}
  //else if (window.innerHeight < 777) {
  //  detailsoffsettop = 150
  //}
  //else {
  detailsoffsettop = ~~(detailsscale(window.innerHeight, 777, 1161, 120, 150))
  //}
  detailsminheight = window.innerHeight - 240
  detailsminheight = detailsminheight < 500 ? 500 : detailsminheight
  return
}

// extra space below the image before the shadowbox
var realpaddingbottom = 30

// set up environment based on screen height
calculateoffsets()

// native styling
sheet.insertRule('.rg_ilmbg, .rg_anbg {width: 100%!important;border-radius: 0!important;height: 15px!important;font-size: 11px!important;line-height: 15px!important;margin: 0!important;color: #f3efef!important; background: rgba(51,51,51,0.8)!important;padding: 0!important;padding-left: 4px!important}', 0)
sheet.insertRule('.rg_anbg * {color:#f3efef!important}', 0)
sheet.insertRule('div[jscontroller="Q7Rsec"]:not(.nowhover):hover .rg_l {box-shadow: 0 2px 12px 0 rgba(0,0,0,0.35)}', 0)
sheet.insertRule('div[jscontroller="Q7Rsec"]:not(.nowhover):hover .rg_ilmbg {pointer-events:none!important;display:block!important}',0)
sheet.insertRule('div[jscontroller="Q7Rsec"]:not(.nowhover):hover .rg_anbg {display:none!important}',0)
sheet.insertRule('html {overflow-x:hidden!important}',0)
sheet.insertRule('.nJGrxf span, .nJGrxf {pointer-events:none!important}',0)
sheet.insertRule('g-loading-icon {display:none!important}',0)
sheet.insertRule('#rg {min-width: 95vw!important}',0)

// disable native grid image functionality
sheet.insertRule('a.rg_l {pointer-events: none!important;-moz-pointer-events:none!important}',0)
// give illusion the q7rsec divs are clickable
sheet.insertRule('div[jscontroller="Q7Rsec"] {cursor: pointer;-moz-user-select:none!important;user-select:none!important}',0)
document.body.insertAdjacentHTML("beforeend", `
  <style id="oldgisbottommargin">
    html body #rg .fmbrQQxz {margin-bottom:${detailsminheight+50}px}
  </style>
`)
document.body.insertAdjacentHTML("beforeend", `
  <style id="oldgisdetailsspace">
    #oldgisdetails {left:0;position:absolute;width:100%;display:block;height:${detailsminheight}px;background:#222;top:0px;z-index:100;display:none}
  </style>
`)   

sheet.insertRule('.eJXyZe {display:none!important}',0)
sheet.insertRule(`.fmbrQQxz::before {content:'';z-index:999999999;position: absolute;text-align: center;margin: 0 auto;height: 0px;left: calc(50% - 10px);width: 0;height: 0;background: transparent;bottom: -32px;border-bottom: 17px solid #222;border-left: 16px solid transparent;border-right: 16px solid transparent;}`,0)

// build the shadowbox
var oldgisdetails = document.createElement("div")
oldgisdetails.id = "oldgisdetails"
document.body.appendChild(oldgisdetails)

// some styling for the shadowbox
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
      cursor:pointer;
      width:85px;
      margin-right:10px;
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

// main app functions
var oldgis = {
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
    var jumpthumb = document.querySelectorAll(`#rg_s > div[jscontroller="Q7Rsec"][data-ri="${position+off}"]`)[0]
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
  // timer function to quickly re-perform this event 20 times after 
  // resizing has stopped to 'catch up' for google's latent native grid ui algo
  resize: (organic) => {
    function routine() {
      calculateoffsets()
      document.getElementById("oldgisbottommargin").remove()
      document.body.insertAdjacentHTML("beforeend", `<style id="oldgisbottommargin">
        html body #rg .fmbrQQxz {margin-bottom:${detailsminheight+50}px}
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
      var fulltop = document.querySelectorAll(`[jscontroller="Q7Rsec"][data-ri="0"]`)[0].getBoundingClientRect().top + window.scrollY
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
      var meta = document.querySelectorAll(`.oldgisrelatedthumbdata[data-thumbuid="${uid}"]`)[0]
      var json = {
        fullsize: meta.dataset.fullsize,
        linkback: meta.dataset.linkback,
        thumb: meta.dataset.thumb,
        domain: meta.dataset.domain,
        width: meta.dataset.width,
        height: meta.dataset.height,
        title: meta.dataset.title
      }
      var swapbox = document.querySelectorAll(".oldgisswapbox")[0]
      swapbox.src = ""
      swapbox.width = "0px"
      swapbox.height = "0px"      
      oldgis.details.propagate(json)
      return
    },
    // request and handle related thumbnails
    related: () => {
      function propagate(blob) {
        var container = document.createElement("div")
        container.innerHTML = blob
        var results = container.querySelectorAll(".irc_rimask")
        var footer = document.querySelectorAll(".moredetailsareafooter")[0]
        // two strategies depending on what google provides for related images
        if (results.length === 0) {
          // if no native related images .. 
          // gather some random images from the page and populate the thumbnails
          var other = document.querySelectorAll('[jscontroller="Q7Rsec"]')
          var target = other.length
          target = target > 8 ? 8 : target
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
            var result = document.querySelectorAll('[jscontroller="Q7Rsec"]')[i]
            var meta = result.querySelectorAll(".rg_meta")[0].innerHTML
            var json = JSON.parse(meta)
            var title = result.querySelectorAll(".mVDMnf")[0].innerHTML
            var domain = json.st || json.isu
            var thumb = `<div class="oldgisrelatedthumbdata" style="width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${json.tu})" data-title="${title}" data-domain="${domain}" data-width="${json.ow}" data-height="${json.oh}" data-thumb="${json.tu}" data-fullsize="${json.ou}" data-linkback="${json.ru}" data-thumbuid="${json.id}"></div>`
            var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${i}"]`)[0]
            insertion.innerHTML = thumb
          }
        }
        else {
          for (var i=0;i<results.length;i++) {
            var result = results[i]
            var meta = result.querySelectorAll(".rg_meta")[0].innerHTML
            var json = JSON.parse(meta)
            var title = json.pt.length > 30 ? json.pt.substring(0,30) + " ..." : json.pt
            var thumb = `<div class="oldgisrelatedthumbdata" style="width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${json.tu})" data-title="${title}" data-domain="${json.st}" data-width="${json.ow}" data-height="${json.oh}" data-thumb="${json.tu}" data-fullsize="${json.ou}" data-linkback="${json.ru}" data-thumbuid="${json.id}"></div>`
            var insertion = document.querySelectorAll(`.oldgisrelatedimage[data-gisthumbrelid="${i}"]`)[0]
            // if this is the last one
            // and 'see more' is available
            // make the last link a 'View more' link
            if (i === 7) {
              var seemore = container.querySelectorAll(".ZuJDtb")[0]
              if (seemore) {
                var href = seemore.href
                thumb = `<a class="oldgisseemore" href="${href}"><div class="oldgisrelatedthumbdata" style="width:85px; height:85px; background-size:cover; background-position:center center; background-color:rgba(255,255,255,.07); background-image:url(${json.tu})"></div></a>`
              }
            }
            insertion.innerHTML = thumb
            if (i > 6) {
              break
            }
          }    
        }
      }
      var relatedimages = document.querySelectorAll(`.oldgisrelatedimage`)
      for (var i=0;i<8;i++) {
        relatedimages[i].innerHTML = ""
      }
      try {
        var active = document.querySelectorAll('div.fmbrQQxz a[jsname="hSRGPd"]')[0]
        var href = active.href
        function querystringtojson(e) {            
          var pairs = e.split("?").slice(1).join().split("&")
          var result = {}
            pairs.forEach(function(pair) {
            pair = pair.split('=')
            result[pair[0]] = decodeURIComponent(pair[1] || '')
          })
          return JSON.parse(JSON.stringify(result))
        }
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
        var url = `
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
      catch(e) {
        console.error(e)
      }
    },
    // load details from the json provided
    propagate: (json) => {
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
      return
    },
    // update the image details
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
      if (oldgis.data.thumb) {
        var qdivs = document.querySelectorAll(`div[jscontroller="Q7Rsec"]`)
        for (var i=0;i<qdivs.length;i++) {
          qdivs[i].classList.remove("fmbrQQxz")
        }
        oldgis.data.thumb = false
      }
      return
    },
    // make an image active
    enable: function(element) {
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
        var meta = document.querySelectorAll("div.fmbrQQxz .rg_meta")[0].innerHTML
        var details = JSON.parse(meta)
        var fullsize = details.ou
        var linkback = details.ru
        var thumb = details.tu
        var domain = details.isu
        var width = details.ow
        var height = details.oh
        var title = details.pt
        // more accurate if this exists
        title = document.querySelectorAll("div.fmbrQQxz .mVDMnf")[0].innerHTML
        var json = {
          fullsize,
          linkback,
          thumb,
          domain,
          width,
          height,
          title
        }
        oldgis.details.propagate(json)
        oldgis.details.related()
      }
      catch(e) {
        
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
    if (e.target.classList.contains("rg_bx")) {
      if (e.target.classList.contains("fmbrQQxz")) {
        oldgis.power.off()
      }
      else {
        oldgis.thumb.disable()
        oldgis.thumb.enable(e.target)
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
    else if (e.target.id === "hdtb-tls") {
      oldgis.resize(true)
    }
    else if (e.target.classList.contains("oldgisrelatedthumbdata")) {
      var thumbuid = e.target.dataset.thumbuid
      oldgis.details.override(thumbuid)
    }
    
  }
  catch(e) {
    console.error(e)
  }
  return
})

// window.addEventListener("mousemove", (e)=>{
//   console.log(e)
// })
// resizing scheme triggered by resizing of the browser - will run in a loop
// for a second after the resizing event stops to compensate for any original google page lag
window.addEventListener('resize', ()=>{
  oldgis.resize(true)
})
// remove original arrowkey listeners
window.addEventListener("keydown", function (e) {
  
  if (document.activeElement.tagName.toLowerCase() === "input") {
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
    return
  }
  // the page was loaded with an image open in the side shadowbow - close it and open it in the new format
  var activethumb = document.getElementsByClassName('irc-s')[0]
  if (activethumb) {
    var closebox = document.getElementById("irc_ccbc")
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
          // nowhover only applicable to rg_bx
          if (e.target.parentNode.classList.contains("rg_bx")) {
            e.target.parentNode.classList.add("nowhover")
          }
        }
      }
    }  
  }
  catch(e) {
    
  }
}

document.addEventListener("mousemove", oldgismouseevents, false)
