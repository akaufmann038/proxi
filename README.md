# proxi
To run the app do the following:
- run "npm install"
- shell into the ios directory and run "pod install"
- open up an ios simulator phone
- open up an ios simulator phone, then run "npx react-native start". This will open up Metro.
- open up a new terminal, shell back into the project, and then run npx react-native run-ios

The app should start up; however, I did take down our redis database hosted in the cloud, so unfortunately no data will show up. The Node JS server for this app is here: https://github.com/akaufmann038/proxiWebServer 
This server communicates with a redis database.

The Bluetooth Low Energy Mesh Network is implemented here: https://github.com/akaufmann038/proxi/blob/main/proxiApp/ios/ProximityDetection.swift 
It is very buggy, as we did stopped development to focus more on market research (which we should have done more of before I even started coding), 
but I got it to work between several phones. It is able to detect other phones in it's radius, and even can determine how far away they are.
