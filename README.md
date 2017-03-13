# List redirect chain
Simple nodejs script for testing some URL for HTTP/HTTPS redirect chain.

### About
The script uses native HTTP/HTTPS nodejs clients in depends on location protocol and lists redirect chain. By default sends HEAD request and passes no more than 10 redirects (301, 302); does not pass javascript redirects. Be careful, this is not a production-ready code.. just for fun.

### Instruction
Be sure you have nodejs `>=6.0.0`, and then:
```
$ node lsrech.js URL
```
will list HTTP/HTTPS redirect chain for your URL.

### Examples
Single 301 redirect on HTTPS website main page:
```
$ node lsrech.js https://apple.com
1       301     https://apple.com
        200     https://www.apple.com/
```

Redirect chain by some HTTP to HTTPS URL:
```
$ node lsrech.js http://addvisits.com/
1       301     http://addvisits.com/
2       301     http://www.addvisits.com/
        200     https://www.addvisits.com/
```

Redirect chain with relative URLs in location:
```
$ node lsrech.js http://evaxtampax.es/
1       301     http://evaxtampax.es/
2       301     http://www.evaxtampax.es//
        200     http://www.evaxtampax.es/es-es
```

Redirect chain is too long (max value has been set to 1):
```
$ node lsrech.js http://evaxtampax.es/
1       301     http://evaxtampax.es/
        301     http://www.evaxtampax.es//
Redirect chain is too long (2 redirects)
```

### See also
[Get mixed content](https://github.com/cerberus-ab/get-mixed-content)
