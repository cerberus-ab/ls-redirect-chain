# List redirect chain
Simple nodejs script for testing some URL for HTTP/HTTPS redirect chain.

### About
The script uses native http/https nodejs clients in depends on location protocol and lists redirect chain. By default sends HEAD request and passes no more than 10 redirects (301, 302); does not pass javascript redirects and does not detect redirect loop yet. Be careful, this is not a production-ready code.. just for fun.

### Instruction
Be sure you have nodejs `>=6.0.0`, and then:
```
$ node lsrech.js URL
```
will list http/https redirect chain for your URL.

### Examples
Single 301 redirect on https site main page:
```
$ node lsrech.js https://apple.com
1       301     https://apple.com
        200     https://www.apple.com/
```

Redirect chain by some http url:
```
$ node lsrech.js http://3.ly/DNMd
1       301     http://3.ly/DNMd
2       302     http://www.3.ly/DNMd
        200     http://www.3.ly/
```

Redirect chain is too long (max value has been set to 1):
```
$ node lsrech.js http://3.ly/DNMd
1       301     http://3.ly/DNMd
        302     http://www.3.ly/DNMd
Redirect chain is too long (2 redirects)
```

### See also
[Get mixed content](https://github.com/cerberus-ab/get-mixed-content)
