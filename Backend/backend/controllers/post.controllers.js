const PostModel = require("../models/post.model");

module.exports.getPosts = async (req, res) => {
    const posts = await PostModel.find();
    res.status(200).json(posts);
}

module.exports.setPosts = async (req, res) => {
    if (!req.body.message) {
        res.status(400).json({ message: "Add a message" })
    }

    const post = await PostModel.create({
        message: req.body.message,
        author: req.user.username
    });

    res.status(200).json(post)
};

module.exports.editPost = async (req, res) => {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
        res.status(400).json({ message: "This post does not exist" });
    }

    const updatePosts = await PostModel.findByIdAndUpdate(post, req.body, {new: true});
    res.status(200).json(updatePosts);
};

module.exports.deletePost = async (req, res) => {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
        res.status(400).json({ message: "This post does not exist" });
    }

    await post.remove();
    res.status(200).json("post deleted" + post);
};

module.exports.likePost = async (req, res) => {
    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: {likers: req.body.userId }},
            { new: true }
        ).then((data) => res.status(200).send(data));
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports.dislikePost = async (req, res) => {
    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            { $pull: {likers: req.body.userId }},
            { new: true }
        ).then((data) => res.status(200).send(data));
    } catch (err) {
        res.status(400).json(err);
    }
};