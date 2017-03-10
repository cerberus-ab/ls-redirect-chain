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
