const Imap = require('imap'),
    inspect = require('util').inspect;
const fs = require('fs'), fileStream;

var imap = new Imap({
    user: 'siapduna2020@gmail.com',
    password: 'Perroloco123!',
    host: 'imap.gmail.com',
    port: 993,
    tls: true
});

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}
imap.once('ready', function() {
    openInbox(function(err, box) {
        if (err) throw err;
        imap.search([ 'UNSEEN', ['SINCE', 'June 15, 2018'] ], function(err, results) {
            if (err) throw err;
            var f = imap.fetch(results, { bodies: '' });
            f.on('message', function(msg, seqno) {

                console.log('Message #%d', seqno);
                var prefix = '(#' + seqno + ') ';

                msg.on('body', function(stream, info) {
                    console.log(prefix + 'Body');
                    stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
                });
                msg.once('attributes', function(attrs) {
                    console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                });
                msg.once('end', function() {
                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', function(err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function() {
                console.log('Done fetching all messages!');
                imap.end();
            });
        });
    });
});
imap.once('error', function(err) {
    console.log(err);
});
imap.once('end', function() {
    console.log('Connection ended');
});
imap.connect();