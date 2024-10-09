import Replicate from 'replicate'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser';
dotenv.config();
import cors from "cors"

const app = express();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb",  extended: true, parameterLimit: 9000000 }));
app.use(cors())
app.use(express.json());

app.get('/',async(req,res)=>{
  res.json({
    message:"server running home page"
  })
})

app.post('/age-transform',async(req,res)=>{
  // const {image,target_age} = req.body;
  let image = req.body.image;
  const target_age = req.body.target_age;
  // console.log(image,target_age)
  // image = `data:application/octet-stream;base64,${image}`;
  const imagebase64 = `data:application/octet-stream;base64,${image}`;
  // console.log(imagebase64,'image base 64 data')
  if(!image || !target_age){
    res.status(400).json({
      status:"error",
      messaage:"please select age or image"
    });
    return
  }

  try {

    const output = await replicate.run(
      "yuval-alaluf/sam:9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
      {
        input: {
        image:image, //image
        target_age:target_age
      }
    }
  );
  
  res.status(200).json({url:output}); 

  } catch (error) {
    res.status(400).json({
      status:"error",
      message:"Somethings wents wrong"
    })
  }

})

app.listen(3001,(err)=>{
  console.log('server running')
})