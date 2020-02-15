document.body.insertAdjacentHTML("afterbegin", `
  <div id="gisipcwindowcontext" style="display:none">${JSON.stringify({gisipcblobid:0, gisipcblobfullsize:""})}</div>
`)

// gisipcprocess(391, "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRwoVCofjadFKP2kZYbTTMtiaHE1Ts-N_J-NQXullw0dwg_dZR1")

function gisipcprocess(gisipcblobid, gisipcblobdata) {
  
  // new method via jscontrol (for firefox since ff throws permission error when converting circular json to string)
  
  // 
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
    console.error("primary fullsize method not found.. onward")
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
    
    var dogpile = () => {
      return 
    }
    
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
      // console.log("updated")
      // console.log(document.getElementById("gisipcwindowcontext").innerText)
      return
    }
    catch(e) {
      console.error(e)
      // console.log("couldnt find the real url with this scheme.. try the other scheme")
      throw new Error(e)
    }

  }
  catch(e) {
    // console.error(e)
    // console.log("cross origin blocked trying workaround")
    var startlogging = false
    var fullsizematch = "0"
    try {
      var getCircularReplacer = () => {
        var seen = new WeakSet()
        return (key, value) => {
          if (startlogging && typeof value === "string" && value.startsWith("http")) {
            // console.log(value)
            fullsizematch = value
            // absurd workaround
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
      // console.log("finished normally")
      // console.log(fullsizematch)
      document.getElementById("gisipcwindowcontext").innerText = JSON.stringify({gisipcblobid:gisipcblobid, gisipcblobfullsize:fullsizematch})
    }    
  }
}

function gisipcreceivemessage(e) {
  try {
    if (e && e.data) {
      let blob = JSON.parse(e.data)
      if (blob.gisipcblob) {
        // console.log("IPC BLOB")
        // console.log(blob.gisipcblob)
        // {
        //   gisipcblob: {
        //     id: int, // random number, used as uuid
        //     data: string // http://encrypted.googleetc/thumbnailurl
        //   }
        // }
        gisipcprocess(blob.gisipcblob.id, blob.gisipcblob.data)
        return
      }
    }
  }
  catch(e) {
    
  }
}

window.addEventListener("message", gisipcreceivemessage, false);
