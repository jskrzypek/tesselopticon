var tessel = require('tessel'),
    camera = require('camera-vc0706').use(tessel.port['B']),
    servolib = require('servo-pca9685');
    
var servo = servolib.use(tessel.port['A']);
var servo1 = 1; // We have a servo plugged in at position 1
var snapShotDuration = 1000;
var counter = 0;

var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture

// Wait for the camera module to say it's ready
camera.on('ready', function () {
   //notificationLED.high();
   // Take the picture

   setInterval(function(){snapShot();}, snapShotDuration);    
});


camera.on('error', function (err) {
   console.error(err);
});

var snapShot = function () {
   camera.takePicture(function (err, image) {
       if (err) {
           console.log('error taking image', err);
       } else {
           //notificationLED.low();
           // Name the image
           var name = 'picture-' + counter + '.jpg';
           // Save the image
           console.log('Picture saving as', name, '...');
           process.sendfile(name, image);
           console.log('done.');
           counter = counter + 0.001;
           // // Turn the camera off to end the script
           // camera.disable();
       }     
   });
};

servo.on('ready', function () {
 var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

 //  Set the minimum and maximum duty cycle for servo 1.
 //  If the servo doesn't move to its full extent or stalls out
 //  and gets hot, try tuning these values (0.05 and 0.12).
 //  Moving them towards each other = less movement range
 //  Moving them apart = more range, more likely to stall and burn out
 servo.configure(servo1, 0.05, 0.12, function () {
   setInterval(function () {
     console.log('Position (in range 0-1):', position);
     //  Set servo #1 to position pos.
     servo.move(servo1, position);

     // Increment by 10% (~18 deg for a normal servo)
     position += 0.005;
     if (position > 1) {
       position-=0.005; // Reset servo position
     }
   }, 1000); // Every 500 milliseconds
 });
});
