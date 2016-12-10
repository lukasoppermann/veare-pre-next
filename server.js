'use strict';

const express = require('express');
const path = require('path');
// Constants
const PORT = 8080;

// App
const app = express();

app.use(express.static('public'));

app.get(/^\/(home|contact)?$/, function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.get(/^\/([\w-]+)\/?$/, function (req, res) {
    res.sendFile(path.join(__dirname + '/public/'+req.params[0]+'.html'), {},function (err) {
        if (err) {
            res.redirect('/');
        }
    });
});
app.get(/^\/portfolio\/([\w-]+)$/, function (req, res) {
        res.sendFile(path.join(__dirname + '/public/portfolio/'+req.params[0]+'.html'), {},function (err) {
            if (err) {
                res.redirect('/portfolio');
            }
        });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
