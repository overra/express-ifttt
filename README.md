express-ifttt
=============

An IFTTT WordPress XML-RPC proxy middleware for express

Usage
-----

```js
var express = require('express');
var ifttt = require('express-ifttt');
var app = express();

app.post('/xmlrpc.php', ifttt, function (req, res) {
  console.log(req.body);
  /* req.body should look something like the object below.
  {
    username: 'username',
    password: 'password',
    title: 'article title',
    description: 'article content',
    categories: [ 'category1', 'category2' ],
    mt_keywords: [ 'keyword1', 'keyword2' ],
    post_status: 'publish'
  }
  */  
  res.send(200);
});

// Note: This web server should be accessible from port 80
app.listen(3000);
```
