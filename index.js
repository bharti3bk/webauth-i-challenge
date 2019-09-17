const server = require("./API/server.js");
const port = 1000;
server.listen(port, () => {
  console.log(`Server Listening On Port: ${port}`);
})  

