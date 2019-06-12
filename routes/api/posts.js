const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Posts');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Create a post
router.post('/', [ auth, [ check('text', 'Text is required').not().isEmpty() ] ], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await User.findById(req.user.id).select('-password');

		const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		});

		const post = await newPost.save();

		res.json(post);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// Get all posts
router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({
			date: -1,
		});

		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// Get single post by id
router.get('/post/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			res.status(404).json({ msg: 'Post not found' });
		}

		res.json(post);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server error');
	}
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			res.status(404).json({ msg: 'Post not found' });
		}

		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorised' });
		}

		await Post.remove();

		res.json({ msg: 'Post successfully removed' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// Add likes to a comment
router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
			return res.status(400).json({ msg: 'Post already liked' });
		}

		post.likes.unshift({ user: req.user.id });

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// Remove a like to a comment
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
			return res.status(400).json({ msg: 'Post has not yet been liked' });
		}

		const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id);

		post.likes.splice(removeIndex, 1);

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// Add comment to a post
router.post('/comment/:id', [ auth, [ check('text', 'Text is required').not().isEmpty() ] ], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await User.findById(req.user.id).select('-password');

		const post = await Post.findById(req.params.id);

		const newComment = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		});

		post.comments.unshift(newComment);

		await post.save();

		res.json(post.comment);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// Delete user comment
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		const comment = post.comments.find((comment) => comment.id === req.params.comment_id);

		if (!comment) {
			return res.status(404).json({ msg: 'Comment not found' });
		}

		if (comment.user.toString() !== req.user.id) {
			return res.status(404).json({ msg: 'User not authorised' });
		}

		const removeIndex = post.comments.map((comment) => comment.user.toString()).indexOf(req.user.id);

		post.comments.splice(removeIndex, 1);

		await post.save();

		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});
module.exports = router;
