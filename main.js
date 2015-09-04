const CLOCK_MANIFEST_URL = 'app://clock.gaiamobile.org/manifest.webapp';
const CLOCK_QUERY_SELECTOR = `.icon[data-identifier="${CLOCK_MANIFEST_URL}"]`;
const PHONE_MANIFEST_URL = 'app://communications.gaiamobile.org/manifest.webapp-dialer';
const PHONE_QUERY_SELECTOR = `.icon[data-identifier="${PHONE_MANIFEST_URL}"]`;
const GALLERY_MANIFEST_URL = 'app://gallery.gaiamobile.org/manifest.webapp';
const GALLERY_QUERY_SELECTOR = `.icon[data-identifier="${GALLERY_MANIFEST_URL}"]`;

const RADIUS = 150;

const GRADIENT_START_COLOR = '#232933';
const GRADIENT_END_COLOR   = '#203642';

const HOUR_HAND_COLOR   = '#eeeeee';
const MINUTE_HAND_COLOR = '#eeeeee';
const SECOND_HAND_COLOR = '#00caf2';

const SECOND_HAND_POINTS = [[-30, -30], [-30, 30], [30, 30], [30, -30]];
const MINUTE_HAND_POINTS = [[-1, -RADIUS * 0.9], [1, -RADIUS * 0.9], [6, 0], [-6, 0]];
const HOUR_HAND_POINTS   = [[-3, -RADIUS * 0.7], [3, -RADIUS * 0.7], [6, 0], [-6, 0]];

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

canvas.id = 'live-clock-icon';
canvas.width = canvas.height = RADIUS * 2;
canvas.style.display = 'none';

var gradient = ctx.createLinearGradient(0, 0, 0, RADIUS * 2);
gradient.addColorStop(0, GRADIENT_START_COLOR);
gradient.addColorStop(1, GRADIENT_END_COLOR);

var icon;

function initIcon() {
  //if (!(icon = document.querySelector(CLOCK_QUERY_SELECTOR))) {
  if (!(icon = document.querySelector(PHONE_QUERY_SELECTOR))) {
    return;
  }
  
  document.body.appendChild(canvas);
  icon.style.backgroundImage = '-moz-element(#live-clock-icon)';
  return icon;
}

function drawBackground() {
  ctx.arc(RADIUS, RADIUS, RADIUS * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawHand(rotation, points, color) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(RADIUS, RADIUS);
  ctx.rotate(rotation);
  ctx.moveTo(points[0][0], points[0][1]);
  ctx.lineTo(points[1][0], points[1][1]);
  ctx.lineTo(points[2][0], points[2][1]);
  ctx.lineTo(points[3][0], points[3][1]);
  ctx.lineTo(points[0][0], points[0][1]);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawUnreadIcon(app_selector, number){
  //TODO: check if icon exist
  var icon = document.createElement('div');
  icon.style.width = "30px"
  icon.style.height= "30px"
  icon.style.backgroundColor = "red"
  document.querySelector(app_selector).appendChild(icon)
}
console.log("[UNREAD]I am running in ")
console.log(window.location)
console.log("[UNREAD] is in system :", window.location.toString().indexOf('system.gaiamobile.org') > 0) 
console.log("[UNREAD] is in homescreen:", window.location.toString().indexOf('verticalhome.gaiamobile.org') > 0) 
if (window.location.toString().indexOf('system.gaiamobile.org') > 0) {
  window.addEventListener('mozChromeNotificationEvent', function(evt){
    console.log(evt.detail)
    console.log(evt.detail.type)
    console.log(evt.detail.title)
    var lock = navigator.mozSettings.createLock();
    //TODO: change this to { "title": count }
    var result = lock.set({
        'unreads': evt.detail.title
    });
  })
   
  result.onsuccess = function () {
      console.log("[UNREAD]the settings has been changed");
  }
   
  result.onerror = function () {
      console.log("[UNREAD]An error occure, the settings remain unchanged");
  }
  
}

if (window.location.toString().indexOf('verticalhome.gaiamobile.org') > 0) {
  setInterval(function() {
    var lock    = navigator.mozSettings.createLock();
    var setting = lock.get('unreads');

    setting.onsuccess = function () {
        console.log('[UNREAD]unreads: ' + setting.result);
        console.log('[UNREAD]unreads: ' + setting.result.unreads);
        //TODO: change data structure
        if (setting.result.unreads == "Device logs saved"){
          drawUnreadIcon(GALLERY_QUERY_SELECTOR, 1);
        }
    }

    setting.onerror = function () {
        console.warn('[UNREAD]An error occured: ' + setting.error);

    }
  }, 1000);
  
}
setInterval(function() {
  if (!initIcon()) {
    return;
  }

  var currentTime = new Date();
  var hour = currentTime.getHours();
  var minute = currentTime.getMinutes();
  var second = currentTime.getSeconds();

  //drawBackground();

  drawHand(Math.PI * 2 / 60 * second, SECOND_HAND_POINTS, "#ff0000");
  //drawHand(Math.PI * 2 / 60 * second, SECOND_HAND_POINTS, SECOND_HAND_COLOR);
  //drawHand(Math.PI * 2 / 60 * minute, MINUTE_HAND_POINTS, MINUTE_HAND_COLOR);
  //drawHand(Math.PI * 2 / 12 * hour, HOUR_HAND_POINTS, HOUR_HAND_COLOR);
}, 1000);
