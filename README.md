# Deno CRUD
This is a CRUD (Create, Read, Update, Delete) built on top of DenoJS.

## Preparation
`git clone https://github.com/rikyperdana/deno-crud`

Create a file named `.env` inside the folder that contain this line:

`MONGO="your mongo connection string"`

Ex: I got my connection string from Atlas connect menu

## Start
`deno run -A --unstable server.js`

Get to http://localhost:3000

## How to Use
- Click 'Get Collection' button and fill the database and collection name as target
- Use 'Refresh' button to reload the collection from source
- Use 'Add' to insert a new object into the collection
- Double click a row to display the 'Update' and 'Delete' function
- Use Export button to get the csv of the loaded collection
- Use Import button to insert all the contents of the Exported csv

You can also use the REST API programmatically through browser console, like:
```
poster('dbCall', {
  method: 'get', dbName: 'yourDb', collName: 'yourCollection'
}, res => console.log(res))
```

## Dependencies
### Server Side
- ServestJS
- Deno Mongo
- Deno dotenv
### Client Side
- Lodash
- Mithril
- Bulma CSS
- Papa Parse

## Screenshots
upcoming
