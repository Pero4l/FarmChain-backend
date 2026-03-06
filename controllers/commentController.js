const { Comments, Posts, Notifications, Profile, Users } = require("../models");

async function addComment(req, res) {
    try {
        const { postId, content } = req.body;
        const userId = req.user.userId;

        if (!content) {
            return res.status(400).json({ success: false, message: "Comment content is required" });
        }

        // 1. Check if post exists
        const post = await Posts.findOne({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // 2. Create comment
        const newComment = await Comments.create({
            user_id: userId,
            post_id: postId,
            content: content
        });

        // 3. Increment comment count on post
        post.comments = (post.comments || 0) + 1;
        await post.save();

        // 4. Create notification for post owner
        if (post.user_id !== userId) {
            await Notifications.create({
                user_id: post.user_id,
                type: "comment",
                notification: `${req.user.currentUser} commented on your post`,
                is_read: false,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        });

    } catch (error) {
        console.error("ADD COMMENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}

async function getPostComments(req, res) {
    try {
        const { postId } = req.params;

        const comments = await Comments.findAll({
            where: { post_id: postId },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ["id", "first_name", "last_name"],
                    include: [
                        {
                            model: Profile,
                            attributes: ["avatar", "verified"]
                        }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json({
            success: true,
            comments: comments
        });

    } catch (error) {
        console.error("GET COMMENTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const userId = req.user.userId;

        const comment = await Comments.findOne({ where: { id: commentId } });

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Only the commenter or the post owner can delete a comment
        const post = await Posts.findOne({ where: { id: comment.post_id } });

        if (comment.user_id !== userId && post.user_id !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
        }

        await comment.destroy();

        // Decrement comment count on post
        if (post) {
            post.comments = Math.max(0, (post.comments || 1) - 1);
            await post.save();
        }

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("DELETE COMMENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = { addComment, getPostComments, deleteComment };
