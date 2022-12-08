const express= require('express');
const app= express()
const router= require('./routes/routes.js')
const {default:mongoose} = require('mongoose');
app.use(express.json());

mongoose.set('strictQuery', true)
mongoose.connect("mongodb+srv://mamtag644:mamtagupta644@cluster0.0qw83.mongodb.net/bitcoin", {
    useNewUrlParser: true
})

.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )






app.use('/',router)

app.listen(3000,()=>console.log('Express app running on port ' + (process.env.PORT || 3000))
);