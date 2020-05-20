import {createApp, serveStatic, contentTypeFilter} from 'https://servestjs.org/@v1.0.0/mod.ts'
import {init, MongoClient} from 'https://deno.land/x/mongo@v0.6.0/mod.ts'
import 'https://deno.land/x/dotenv/load.ts'

await init()
var client = new MongoClient()
client.connectWithUri(Deno.env.get('MONGO'))
var db = client.database('test'),
people = db.collection('users')
// people.find({}).then(res => console.log(res))

const responder = obj => ({
  headers: new Headers({"content-type": "text/plain"}),
  status: 200, body: JSON.stringify(obj)
}),

app = createApp()
app.use(serveStatic('./public'))
app.post('/test', async req => {
  var text = await req.text()
  req.respond(responder({a: 1}))
})

app.listen({port: 3000})
