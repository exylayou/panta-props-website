const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const matches = content.match(/src="uploads\/attached_.*?\.(jpg|png)(\?v=\d+)?"/g);
console.log(matches);
