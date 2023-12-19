const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://doctorNazrul:nazrul012@cluster0.6u8iq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointment");
  const doctors = client.db("doctorsPortal").collection("doctors");
  // perform actions on the collection object
  app.post('/addAppointment',(req,res)=>{
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
    .then(result => {
      res.send(result.acknowledged)
    })
  })


  app.post('/getAllAppointments',(req,res)=>{
    const date = req.body;
    appointmentCollection.find({date:date.date})
    .toArray((err,allAppointments)=>{
      res.send(allAppointments)
    })
  })


  app.get('/getPatients',(req,res)=>{
    appointmentCollection.find({})
    .toArray((err,patients)=>{
      res.send(patients)
    })
  })

  app.post('/getAppointmentByCurrentDate',(req,res)=>{
    const currentDate = req.body;
    appointmentCollection.find({currentDate:currentDate.currentDate})
    .toArray((err,appointments)=>{
      res.send(appointments)
    })
    
  })


  app.patch('/updateAppointment/:id',(req,res)=>{
    const appointment = req.body;
    const {date,schedule,FullNameRequired,PhoneRequired} = appointment;
    appointmentCollection.updateOne(
      {_id:ObjectId(req.params.id)},
      {$set:{
              date:date,
              schedule:schedule,
              FullNameRequired:FullNameRequired,
              PhoneRequired:PhoneRequired
      }}
    )
    .then(result=>{
      res.send(result.acknowledged)
    })
  })

  app.delete('/deleteAppointment/:id',(req,res)=>{
    appointmentCollection.deleteOne(
      {_id:ObjectId(req.params.id)}
    )
    .then(result => {
      res.send(result.acknowledged)
    })
  })

  app.post('/addDoctor',(req,res)=>{
    const doctorData = req.body;
    doctors.insertOne(doctorData)
    .then(result =>{
      res.send(result.acknowledged)
    })
  })

  app.get('/getDoctors',(req,res) => {
    doctors.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })


});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
