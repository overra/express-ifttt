var xml2js = require('xml2js');
var xmlParser = new xml2js.Parser();
var xmlBuilder = new xml2js.Builder();

exports = module.exports = ifttt;

var xmlResponse = function (response) { 
  response = {methodResponse:{params:{param:{value: response||''}}}};
  return xmlBuilder.buildObject(response);
};

function ifttt(req, res, next) {
  var content = '';
  req.on('data', function (chunk) { content += chunk; });
  req.on('end', function () { 
    xmlParser.parseString(content, function (err, xml) {
      var method = xml.methodCall.methodName[0];
      var response;
      if (method === 'mt.supportedMethods') {
        response = xmlResponse('metaWeblog.getRecentPosts');
      } else if (method === 'metaWeblog.getCategories') {
        response = xmlResponse({array: {data: {}}});
      } else if (method === 'metaWeblog.getRecentPosts') {
        response = xmlResponse({array: {data: {}}});
      } else if (method === 'wp.newCategory') {
        response = xmlResponse('');
      } else if (method === 'metaWeblog.newPost') {
        var params = xml.methodCall.params[0].param.slice(1);
        var data = {
          username: params[0].value[0].string[0],
	  password: params[1].value[0].string[0]
        };
	params[2].value[0].struct[0].member.forEach(function (item) {
          var name = item['name'][0];
          var value = item['value'][0];
          if (value.string !== undefined) { value = value.string[0]; }
          if (value.array !== undefined) {
            value = value.array[0].data[0].value.map(function (item) {
              return item.string[0];
            });
          }
          data[name] = value;
        });
        req.body = data;
      } else {
        console.log(method, xml);
      }
      if (response === undefined) { next(); }
      else {
        res.set({
          'Connection': 'close',
          'Content-Length': response.length,
          'Content-Type': 'text/xml',
          'Date': Date()
        });
        res.send(response);
      }
    });    
  });
}
