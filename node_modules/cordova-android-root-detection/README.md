# Crodova Android Root Detection Plugin
> Extremely easy plug&play for checking if the device is rooted or not

#### This plugin is uses https://github.com/scottyab/rootbeer

#### Version 0.1.0 (12/07/2018)

## Installation
```Bash
cordova plugin add cordova-android-root-detection

```

## Usage

```javascript

 cordova.exec(function success(rootStatus){
        
      if(rootStatus){
        //Device is rooted, handle the case
      } else {
        //Device is not rooted, proceed to the app
      }

    }, function failure(error){
        alert("Something went wrong");
    }, "RootDetection", "isRooted", []);
```


## License
```
The MIT License

Copyright (c) 2017 Shajeer Ahamed (info4shajeer@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
