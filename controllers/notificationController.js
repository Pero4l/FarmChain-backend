const {Notifications} = require("../models");

async function getNotification(req, res){

    const id = req.user?.userId;

    const notification = await Notifications.findAll({
        where: {user_id: id},
        order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
        "success": true,
        "message": "Gotten users notification successfully",
        "data": notification
    })
};

