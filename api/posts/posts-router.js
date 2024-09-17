const Post = require('./posts-model');
const express = require("express");
const router = express.Router()

//[GET] /
router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.json(posts)
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
    const {title, contents} = req.body
    if(!title || !contents){
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else {
        Post.insert({title, contents})
            .then(({id}) => {
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({message: "There was an error while saving the post to the database"})
            })
    }
})
//put /:id
router.put('/:id', (req, res) => {
    const {title, contents} = req.body
    if(!title || !contents){
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else {
        Post.findById(req.params.id)
        .then(stuff => {
            if(!stuff){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            } else {
                return Post.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if(data){
                return Post.findById(req.params.id, req.body)
            }
        })
        .then(post => {
            if(post){
                res.json(post)
            }
        })
        .catch(err =>{
            res.status(500).json({message: "The post information could not be retrieved"})
        })
}

})

// delete /:id
router.delete('/:id', async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(!post){
            res.status(404).json({message: "The post with the specified ID does not exist"})
        } else {
            await Post.remove(req.params.id)
            res.json(post)
        }
    }
    catch(err) {
        res.status(500).json({message: "The post could not be removed"})
    }
})

// [GET] /:id/comments
router.get('/:id/comments', async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(!post){
            res.status(404).json({message: "The post with the specified ID does not exist"})
        } else {
            const messages = await Post.findPostComments(req.params.id)
            res.json(messages)
        }
    }
    catch(err){
        res.status(500).json({message: "The comments information could not be retrieved"})
    }
})

module.exports = router