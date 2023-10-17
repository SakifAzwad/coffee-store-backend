const express = require('express');
const cors =require('cors');
const app=express();
require('dotenv').config();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


// mongodb+srv://coffee-store:HEgih1HxxR4jCNEu@cluster0.gp9ypzc.mongodb.net/?retryWrites=true&w=majority
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gp9ypzc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
     const coffeeCollection=client.db('coffeedb').collection('coffee');
     const userCol=client.db('coffeedb').collection('user');

     app.get('/coffee',async(req,res)=>
     {
        const cursor = coffeeCollection.find();
        const rest= await cursor.toArray();
        res.send(rest);
     })

     app.get('/coffee/:id',async(req,res)=>
     {
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await coffeeCollection.findOne(query);
        res.send(result);
     })


    app.post('/coffee',async(req,res)=>
    {
      const ne=req.body;
      console.log(ne);
      const result=await coffeeCollection.insertOne(ne);
      res.send(result);
    })

    app.put('/coffee/:id',async(req,res)=>
     {
      const id=req.params.id;
      const filter={_id: new ObjectId(id)};
      const options = {upsert : true};
      const update=req.body;
      const coffee = 
      {
        $set:
        {
          name:update.name, 
          quantity:update.quantity, 
          supplier:update.supplier, 
          taste:update.taste, 
          category:update.category, 
          details:update.details, 
          photo:update.photo
        }
      }
      const result=await coffeeCollection.updateOne(filter,coffee,options);
        res.send(result);
     })
    
    app.delete('/coffee/:id',async(req,res)=>
    {
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const rest=await coffeeCollection.deleteOne(query);
      res.send(rest);
    })

    app.get('/user',async(req,res)=>
    {
       const cursor = userCol.find();
       const rest= await cursor.toArray();
       res.send(rest);
    })


    app.post('/user',async(req,res)=>
    {
      const ne=req.body;
      console.log(ne);
      const result=await userCol.insertOne(ne);
      res.send(result);
    })

    app.delete('/user/:id',async(req,res)=>
    {
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const rest=await userCol.deleteOne(query);
      res.send(rest);
    })

    app.patch('/user',async(req,res)=>
     {
      const update=req.body;
      const filter={email: update.email};
      const upuser = 
      {
        $set:
        {
          lastAt:update.lastAt
        }
      }
      const result=await userCol.updateOne(filter,upuser);
        res.send(result);
     })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>
{
    res.send("server running");
})

app.listen(port,()=>
{
    console.log(`Coffee server is running on port:${port}`);
})
