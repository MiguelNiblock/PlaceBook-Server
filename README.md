This Express.js server app provides the backend functionality for [RN-Tracks-App](https://github.com/MiguelNiblock/RN-Tracks-App). 

Deployed at https://rn-tracks-server.glitch.me . Send requests here.

Glitch Online IDE: https://glitch.com/edit/#!/rn-tracks-server

## Endpoints

### POST /signin

`{email,password} = req.body;`

returns token

### POST /signup

`{email, password} = req.body;`

returns token

### GET /tracks

`const {authorization} = req.headers;` ('Bearer sdfasdflkasfdlj')

### POST /tracks

`{name, locations} = req.body` 

+

`const {authorization} = req.headers;`

