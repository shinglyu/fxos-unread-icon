/*
const CLOCK_MANIFEST_URL = 'app://clock.gaiamobile.org/manifest.webapp';
const CLOCK_QUERY_SELECTOR = `.icon[data-identifier="${CLOCK_MANIFEST_URL}"]`;
const PHONE_MANIFEST_URL = 'app://communications.gaiamobile.org/manifest.webapp-dialer';
const PHONE_QUERY_SELECTOR = `.icon[data-identifier="${PHONE_MANIFEST_URL}"]`;
const GALLERY_MANIFEST_URL = 'app://gallery.gaiamobile.org/manifest.webapp';
const GALLERY_QUERY_SELECTOR = `.icon[data-identifier="${GALLERY_MANIFEST_URL}"]`;
//FIXME: bad selector
const BZLITE_MANIFEST_URL= 'https://www.bzlite.com/manifest.webapp';
const BZLITE_QUERY_SELECTOR = `.icon[data-identifier="${GALLERY_MANIFEST_URL}"]`;
*/

const POLLINTV = 5000; //ms

const ActionToAppMapping = {
  "Screenshot saved to Gallery": 'app://gallery.gaiamobile.org/manifest.webapp',
  "Device logs saved": 'https://www.bzlite.com/manifest.webapp'
}

function appUrlToQuerySelector(appUrl){
  return '.icon[data-identifier="' + appUrl + '"]';
}

function drawUnreadIcon(app_selector, number){
  var unread = document.getElementById(app_selector+"-unread");
  if (unread != null){
    unread.innerHTML = number;
  }
  else {
    unread = document.createElement('div');
    unread.id = app_selector + "-unread";
    unread.style.width = "30px";
    unread.style.height= "30px";
    unread.style.backgroundColor = "red";
    unread.style.color = "white";
    unread.style.position = "fixed";
    unread.style.top= "0px";
    unread.style.right= "0px";
    unread.style.borderRadius = "100%";
    unread.style.fontSize= "2rem";
    unread.style.lineHeight= "150%";
    unread.appendChild(document.createTextNode(number));
    console.log(app_selector)
    console.log(document.querySelector(app_selector))
    if (document.querySelector(app_selector) != null){// in case the unreads is corrupted, but we should have some cleanup method
      document.querySelector(app_selector).appendChild(unread);
    }
  }
}
console.log("[UNREAD]I am running in ")
console.log(window.location)
console.log("[UNREAD] is in system :", window.location.toString().indexOf('system.gaiamobile.org') > 0) 
console.log("[UNREAD] is in homescreen:", window.location.toString().indexOf('verticalhome.gaiamobile.org') > 0) 
if (window.location.toString().indexOf('system.gaiamobile.org') > 0) {
  window.addEventListener('mozChromeNotificationEvent', function(evt){
    //console.log(evt.detail)
    //console.log(evt.detail.type)
    //console.log(evt.detail.title)
    function setUnreads(unreads){
      var lock = navigator.mozSettings.createLock();
      //TODO: change this to { "title": count }
      var setting_set = lock.set({
          'unreads': unreads
      });
      setting_set.onsuccess = function () {
          console.log("[UNREAD]the settings has been changed");
      }
       
      setting_set.onerror = function () {
          console.log("[UNREAD]An error occure, the settings remain unchanged");
      }
    }
    var unreads = {}
    var lock = navigator.mozSettings.createLock();
    var setting_get = lock.get('unreads');

    setting_get.onsuccess = function () {
      //console.log("[UNREAD] ", setting_get.result)
      //console.log("[UNREAD] ", setting_get.result.unreads)
      if (typeof setting_get.result.unreads === "undefined"){
        unreads[ActionToAppMapping[evt.detail.title]] = 1
      }
      else {
        unreads = setting_get.result.unreads;
        //console.log(unreads)
        //console.log(unreads[evt.detail.title])
        if (evt.detail.title in unreads){
          unreads[ActionToAppMapping[evt.detail.title]] += 1;
          setUnreads(unreads);
        }
        else {
          unreads[ActionToAppMapping[evt.detail.title]] = 1;
          setUnreads(unreads);
        }
      }
    }
    setting_get.onerror = function () {
        console.log("[UNREAD]An error occure, the settings remain unchanged");
    }
  })
}

if (window.location.toString().indexOf('verticalhome.gaiamobile.org') > 0) {
  //TODO: use navigator.mozSettings.addObserver('wifi.enabled', handleWifi);
  //TODO: if app opened, clean up the unreads
  setInterval(function() {
    var lock    = navigator.mozSettings.createLock();
    var setting = lock.get('unreads');

    setting.onsuccess = function () {
        //console.log('[UNREAD]unreads: ' + setting.result);
        //console.log('[UNREAD]unreads: ' + setting.result.unreads);
        for (appUrl in setting.result.unreads){
          console.log("[UNREAD] ", "icon to be drawn ", appUrl)
          console.log("[UNREAD] ", "icon count to be drawn ", setting.result.unreads[appUrl])
          drawUnreadIcon(appUrlToQuerySelector(appUrl), setting.result.unreads[appUrl]);
        }
    }

    setting.onerror = function () {
        console.warn('[UNREAD]An error occured: ' + setting.error);

    }
  }, POLLINTV);
  
}
