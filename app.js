import express from "express";
const app = express();

import {fileURLToPath} from "url";
import {dirname} from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import https from "https";

import * as dotenv from "dotenv";
dotenv.config({path: path.resolve(__dirname,"./important/.env")});  // loads .env file contents into process.env

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+"/"));     // to be able to use static files such as css and images
 
app.post("/", (req, res) => {
    var fname = req.body.firstName;
    var lname = req.body.lastName;
    var email = req.body.email;
    // console.lof(fname, lname, email); 

    const data = {     // data we want to post as json
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }          // this data is in javascript form we want it in json form
    const jsonData = JSON.stringify(data);      // now converted into a json file

    const listId = process.env.AUDIENCE_ID;
    const apiKey = process.env.API_KEY;

    const url = `https://us17.api.mailchimp.com/3.0/lists/${listId}`;
    const options = {
        method: "POST",
        auth: "sreya1:"+apiKey
    }

    const request = https.request(url, options, (response) => {     // making a post request to the api

        if(response.statusCode == 200) {
            res.sendFile(__dirname+"/success.html")
        } else {
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data", (d) => {
            var parsedData = JSON.parse(d);
            console.log(parsedData);
        })
    })
    request.write(jsonData);
    request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "signUp.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("sever started at port 3000")
});













