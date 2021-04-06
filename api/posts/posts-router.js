const Post = require('./posts-model');

const express = require("express");
const e = require('express');
const router = express.Router()

//[GET] /
router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({message: "The posts information could not be retrieved"})
        })
})
//[GET] /:id
router.get('/:id', (req, res) => {
    const {id} = req.params
    Post.findById(id)
        .then(post => {
            if(!post){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            } else{
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({message: "The post information could not be retrieved"})
        })
})
// posts /
router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else {
        Post.insert(req.body)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({message: "There was an error while saving the post to the database"})
            })
    }
})
//put /:id
router.put('/:id', async (req, res) => {
    const post = req.body
    try{
        if(!post.title || !post.contents){
            res.status(400).json({message: "Please provide title and contents for the post"})
        } else {
            const updatedPost = await Post.update(req.params.id, post)
            if(!updatedPost){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            } else {
                res.status(200).json(updatedPost)
            }
        }
    }
    catch(err){
        res.status(500).json({message: "The post information could not be modifie"})
    }
})

// delete /:id
router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params
        const deletedUser = await Post.remove(id)
        if(!deletedUser){
            res.status(404).json({message: "The post with the specified ID does not exist"})
        } else {
            res.status(200).json(deletedUser)
        }
    }
    catch(err) {
        res.status(500).json({message: "The post could not be removed"})
    }
})

// [GET] /:id/comments
router.get('/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id)
        .then(posts => {
            if(!posts){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            } else {
                res.status(200).json(posts)
            }
        })
        .catch(err => {
            res.status(500).json({message: "The comments information could not be retrieved"})
        })
})

module.exports = router