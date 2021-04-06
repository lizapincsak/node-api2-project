const express = require("express");

const postRouter = require("./posts/posts-router");

const server = express();

server.use(express.json());
server.use("/api/posts", postRouter)

server.use("*", (req, res) => {
    res.status(404).json({message: "Not working"})
})

module.exports = server