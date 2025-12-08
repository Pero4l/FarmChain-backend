const {Notifications} = require("../models");

async function getNotification(req, res) {
  const id = req.user?.userId;

  try {
    const notification = await Notifications.findAll({
      where: { user_id: id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Gotten user's notifications successfully",
      data: notification, // <-- notifications are inside `data`
    });
  } catch (err) {
    console.error("Error getting user notifications", err);
    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      data: [],
    });
  }
}

// DELETE /user/notification/:id
async function deleteNotification(req, res) {
  const userId = req.user?.userId;
  const notificationId = req.params.id;

  try {
    const notification = await Notifications.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
}

async function markNotificationAsRead(req, res) {
  const userId = req.user?.userId;
  const notificationId = req.params.id;

  try {
    const notification = await Notifications.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read successfully",
    });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
}



module.exports = {getNotification, deleteNotification, markNotificationAsRead};