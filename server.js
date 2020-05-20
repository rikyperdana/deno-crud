import {createApp, serveStatic, contentTypeFilter} from 'https://servestjs.org/@v1.0.0/mod.ts'
import {init, MongoClient} from 'https://deno.land/x/mongo@v0.6.0/mod.ts'
import 'https://deno.land/x/dotenv/load.ts'

await init()
var client = new MongoClient()
client.connectWithUri(Deno.env.get('MONGO'))

const responder = obj => ({
  headers: new Headers({"content-type": "text/plain"}),
  status: 200, body: JSON.stringify(obj)
}),

app = createApp()
app.use(serveStatic('./public'))
app.post('/dbAdd', async req => {
  var text = await req.text(), obj = JSON.parse(text),
  db = client.database(obj.dbName),
  coll = db.collection(obj.collName)
  await coll.insertOne(obj.doc)
  req.respond(responder({status: true}))
})
app.post('/dbGet', async req => {
  var text = await req.text(), obj = JSON.parse(text),
  db = client.database(obj.dbName),
  coll = db.collection(obj.collName),
  list = await coll.find({})
  req.respond(responder({data: list}))
})
app.post('/dbUpdate', async req => {
  var text = await req.text(), obj = JSON.parse(text),
  db = client.database(obj.dbName),
  coll = db.collection(obj.collName)
  await coll.updateOne({_id: obj.doc._id}, obj.doc)
  req.respond(responder({status: true}))
})
app.post('/dbDelete', async req => {
  var text = await req.text(), obj = JSON.parse(text),
  db = client.database(obj.dbName),
  coll = db.collection(obj.collName)
  await coll.deleteOne({_id: obj._id})
  req.respond(responder({status: true}))
})

app.listen({port: 3000})
