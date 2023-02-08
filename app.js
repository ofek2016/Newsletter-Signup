const express = require("express");
const request = require('request');
require("dotenv").config();
const client = require("@mailchimp/mailchimp_marketing");
const PORT = 3000;
const app = express();

app.listen(PORT, () => { console.log("server is running on port " + PORT) });

app.use(express.static("public"));
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', (req, res) => {
    const firtName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;


    client.setConfig({
        apiKey: process.env.KEY,
        server: "us21",
    });

    const run = async () => {
        const response = await client.lists.batchListMembers(process.env.LIST_ID, {
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firtName,
                        LNAME: lastName
                    }

                }
            ],
        });
        //If all goes well logging the contact's id
        res.sendFile(__dirname + "/success.html")
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id
            }.`
        );
    };


    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})


