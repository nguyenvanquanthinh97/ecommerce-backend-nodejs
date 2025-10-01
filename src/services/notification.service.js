"use strict";

const NotificationModel = require("../models/notification.model");

class NotificationService {
  static pushNotiToSystem = async ({
    type = "SHOP-001",
    receivedId = 1,
    senderId = 1,
    options = {},
  }) => {
    let noti_content = "";

    if (type === "SHOP-001") {
      noti_content = `@@@ just added a new product: @@@@`;
    } else if (type === "PROMOTION-001") {
      noti_content = `@@@ just added a new voucher: @@@@`;
    }

    const newNoti = await NotificationModel.create({
      noti_type: type,
      noti_content,
      noti_senderId: senderId,
      noti_receiverId: receivedId,
      noti_options: options,
    });

    return newNoti;
  };

  static listNotiByUser = async ({ userId = 1, type= 'ALL', isRead = 0 }) => {
    const match = { noti_receiverId: userId }
    if (type !== 'ALL') match.noti_type = type;

    return await NotificationModel.aggregate([
      {
        $match: match
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receiverId: 1,
          noti_content: 1,
          noti_options: 1,
          createdAt: 1
        }
      }
    ])
  };
}

module.exports = NotificationService;
