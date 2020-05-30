import {createApp, serveStatic} from 'https://servestjs.org/@v1.0.0/mod.ts'
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
app.post('/dbCall', async req => {
  var text = await req.text(),
  obj = JSON.parse(text),
  db = client.database(obj.dbName),
  coll = db.collection(obj.collName),
  data = await ({
    get: async () => await coll.find(JSON.parse(obj.filter || '{}')),
    add: async () => await coll.insertOne(obj.doc),
    update: async () => await coll.updateOne({_id: obj.doc._id}, obj.doc),
    remove: async () => await coll.deleteOne({_id: obj._id}),
    insertMany: async () => await coll.insertMany(obj.documents),
    updateMany: async () => await coll.updateMany(obj.filter, obj.update),
    deleteMany: async () => await coll.deleteMany({})
  })[obj.method]()
  req.respond(responder({data}))
})

app.listen({port: 3000})
