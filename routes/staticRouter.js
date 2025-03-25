const express = require("express"); 
const URL = require("../models/url");
const { restrinctTo } = require("../middlewares/auth");
const route = express.Router();

route.get('/admin/urls', restrinctTo(["ADMIN"]), async (req, res) => {
    const allurls = await URL.find({});
    return res.render("home", {
        urls: allurls,
    });
});

route.get("/", restrinctTo(["NORMAL","ADMIN"]), async (req, res) => {
    const allurls = await URL.find({createdBy: req.user._id});
    return res.render("home", {
        urls: allurls,
    });
})

route.get("/signup", (req, res)=>{
    return res.render("signup");
});

route.get("/login", (req, res)=>{
    return res.render("login");
});

module.exports = route;