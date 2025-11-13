const express=require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const connectDB=require('./config/db')
const authRoutes=require('./routes/auth')
const port=8080

dotenv.config();
const app=express()

// Middleware
app.use(cors());
app.use(express.json());

//database connection
connectDB();

//routes
app.use('/auth',authRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})