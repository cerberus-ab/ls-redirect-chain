const cls = {
    http: require('http'),
    https: require('https')
};
const url = require('url');
const print = msg => process.stdout.write(msg.toString());

// common client singleton
const client = {
    // send request using native clients
    request: (pageUrl, opts) => {
        return new Promise((resolve, reject) => {
            // prepare options for sent request
            let options = Object.assign(url.parse(pageUrl), opts || {});
            // choose native client in depending on using protocol
            cls[options.protocol.slice(0, -1)]
                .request(options, res => resolve(res))
                .on('error', e => reject(Error(`The page is unreachable`)))
                .end()
            ;
        });
    },
    // resolve a target url relative to a base url
    resolveUrl: (from, to) => url.resolve(from, to)
};

// Redirect chain wanderer class
class RedirectChainWanderer {
    // public subclass for result structure
    Result(path, message) {
        return { path, message, depth: path.length -1 };
    }
    constructor(opts) {
        this.options = Object.assign({
            max: 10,
            method: 'HEAD',
            statuses: [301, 302]

        }, opts || {});
    }
    pass(originUrl) {
        let that = this;
        let i = 0;
        let path = [];

        return new Promise((resolve, reject) => {
            // recursive named self-invoking function
            !function next(pageUrl) {
                client.request(pageUrl, { method: that.options.method }).then(res => {
                    path.push({
                        url: pageUrl,
                        status: res.statusCode
                    });
                    // check status code for redirect
                    if (~that.options.statuses.indexOf(res.statusCode)) {
                        if (res.headers.location !== undefined) {
                            // check max count
                            if (++i > that.options.max) {
                                resolve(that.Result(path, `Redirect chain is too long (${i} redirects)`));
                            }
                            else {
                                let nextUrl = client.resolveUrl(pageUrl, res.headers.location);
                                // check for a redirect loop
                                if (~path.indexOf(nextUrl)) {
                                    resolve(that.Result(path, `It seems there is a redirect loop`));
                                }
                                else next(nextUrl);
                            }
                        }
                        else resolve(that.Result(path, `Response does not have location header`));
                    }
                    // else successful resolving
                    else resolve(that.Result(path));

                }, error => resolve(that.Result(path, error.message)));
            }(originUrl);
        });
    }
}
class RedirectChainWandererReport {
    // uses RedirectChainWanderer.Result
    constructor(result) {
        Object.assign(this, result || {});
    }
    toString() {
        return this.path.map((page, i) => `${i !== this.depth ? (i + 1) : ''}\t${page.status}\t${page.url}\n`).join('')
            + (this.message ? this.message + '\n' : '');
    }
}


let wanderer = new RedirectChainWanderer;

// pass through and print report
wanderer.pass(process.argv[2])
    .then(result => print(new RedirectChainWandererReport(result)))
    .catch(error => print(error + '\n'))
;
