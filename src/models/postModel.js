const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postId: Number,
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  body: {
    type: String,
    required: true,
    minlength: 5,
  },
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
