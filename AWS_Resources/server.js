const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5500;

http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const filePath = parsedUrl.pathname === '/' ? '/home/ec2-user/Hybrid-Haven-Web/index.html' : `/home/ec2-user/Hybrid-Haven-Web${parsedUrl.pathname}`;
  const queryParams = parsedUrl.query;

  // Access query parameters
  console.log('Query Parameters:', queryParams);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  }[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

