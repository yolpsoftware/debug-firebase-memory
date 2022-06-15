This repository demonstrates a memory leak in the Firebase Javascript (NPM) client.

To reproduce the problem:

* Check out this repo
* Run `yarn` in the project root
* Run `expo start` to start the Expo runner (you need `expo-cli`, `yarn global add expo-cli`)
* Open the project on the iOS simulator (by pressing the "i" key in the console where `expo start` runs) or on a device (by downloading the "Expo Go" app and then scanning the QR code in the `expo start` browser with the camera)
* Shake the device to turn on the Performance Monitor
* Memory usage on startup will be around 450 MB
* Press "Load Pages" to load 1'000 documents of 100 kB each from Firestore
* Memory usage will go to 2.5 - 3 GB
* Shut down the app (by swiping it up in the app-switcher, or by killing the "Expo Go" process in MacOS Activity Monitor)
* Start the app again
* Press "Load Pages" again. This time the documents are loaded from AsyncStorage
* Note the much lower memory consumption

Conclusion: to load 100 MB of documents from Firestore, the Firebase client needs more than 2 GB of memory. This memory is not released, it cannot be garbage collected after the data load has finished.
