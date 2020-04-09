var request = require('request');

var getData = (url, callback) => {
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (!err && res.status == 200) {
                callback({ body });
            }
        })

    })
}

getData('http://127.0.0.1:3000/activity').then((something) => { console.log(something)});


// getData('http://127.0.0.1:3000/activity').then((something) => { do something })

// request('http://127.0.0.1:3000/activity', (err, res, body) => { 
// })