README
====

Download internet resources given a list of URLs. Downloaded files are saved to `downloads` directory as default.
**wget** is the preferred too! :P

Example
----
Let us try downloading some heavy pix from Flickr and one bogus link
    
    node main.js http://farm8.staticflickr.com/7022/13249371043_8fbfdc5274.jpg http://farm4.staticflickr.com/3717/13248116193_b0bf63ff73_n.jpg http://farm8.staticflickr.com/7217/13251311773_77eb8a4c85_n.jpg http://bogus.bogus.morebogus

Synopsis
----
`node main.js URL_1 [URL_2 [URL_3]]`

URL_*:	well-formed URL to resource to download. No file will be created in case of an malformed URL.

Feature highlights
----
1. Parallel downloads
2. Live progress report
3. Automatic file naming
