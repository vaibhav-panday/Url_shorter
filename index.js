const express = require("express");
const path = require ("path");
const cookieParser = require("cookie-parser");
const{ checkForAuthentication, restrinctTo} = require("./middlewares/auth");

const { connectToMongoDB } = require("./connection"); // Remove if not needed
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user")


const PORT = 8002;
const app = express();


// Connect to MongoDB (Use either `connectToMongoDB` or `mongoose.connect`)
connectToMongoDB("mongodb://127.0.0.1:27017/url", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
//middle ware
app.use(express.json());//for json
app.use(express.urlencoded({extended: false}));//for form data
app.use(cookieParser());
app.use(checkForAuthentication);



app.use("/url", restrinctTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/test", async (req, res) =>{
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls,
    });
});

app.get('/url/:shortId', async (req, res) => { //async to use await
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
    {
        shortId,
    },
    {
        $push:{
            visitHistory: {
                timestamp: Date.now(),
            }
        },
    }
);
res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
