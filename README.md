
# Express JS Mod

This is a express like package for working in the [Moddable SDK](https://www.moddable.com/).

This is not meant to be a 1-1 port, but it attempts to maintain the same interface

we know from [express](https://expressjs.com/).

## Installation
`git clone https://github.com/dashcraft/express-js-mod.git` or `git clone git@github.com:dashcraft/express-js-mod.git`
`cd express-js-mod && yarn install`
`yarn build`

Copy the `/express-js-mod` folder into your moddable sdk project,
then make sure to add the module for the contents of the folder as follows:

    manifest.json
    {
	    "include": [
		    ... other files
		    "./express-js-mod/manifest.json"
	    ],
	    "preload": [
		    ... other files
		    "express-js-mod/*"
	    ],
	    "modules": {
		    "*": [
				... other files
			    "./express-js-mod/*"
			 ],
			 "express-js-mod/*": "./express-js-mod/*"
		}
	   }

## Usage
First import the primary package
`import  Express  from  'express-js-mod'`
Afterwards, when the moddable sdk server has been created...
`import { Server } from  "http";`

We can add routes and callbacks like...

    let  express = new Express(Server)
    express.get('/home', function(req,res) {
		res.status(200)
	    res.json({test:  'test'})
    })
    let port = 80 // 80 is the default anyways
    express.listen(port)

## Todo

 - [ ] Tests, tests, more tests
 - [ ] Query Params
 - [ ] Inbound Data Handling
 - [ ] Post route test
 - [ ] Put/Patch route test
 - [ ] Delete route test
 - [ ] Chunked Buffer handling
 - [ ] res.file()
	 - [ ] mime-types
	 - [ ] buffers
 - [ ] Event Streams
