const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Post = require('../models/postModel');

// Validation rules
const postValidationRules = [
  body('title')
    .trim() 
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('body')
    .trim()
    .notEmpty()
    .withMessage('Body is required')
    .isLength({ min: 5 })
    .withMessage('Body must be at least 5 characters long'),
];

// Error handling middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find(); 
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new post
router.post('/posts', postValidationRules, validate, async (req, res) => {
  const posts = await Post.find();
  const id = (posts[posts.length - 1]?.postId || 0) + 1

  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    postId: id
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing post
router.put('/posts/:id', postValidationRules, validate, async (req, res) => {
  try {
    const updatedPost = await Post.findOne({postId: req.params.id}); 

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    updatedPost.title = req.body.title

    updatedPost.body = req.body.body
  
    await updatedPost.save()

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a post
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.deleteOne({postId: req.params.id});

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
