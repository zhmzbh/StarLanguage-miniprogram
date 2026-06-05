// cloudfunctions/sendSubscribe/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { eventName, eventDate } = event;

  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      templateId: 'RoZyBBDSr_yG3kp_1JUljuctRiER7BIaRGICjZPTlq4',   // 替换为步骤32中获得的模板ID
      page: 'pages/index/index',   // 点击消息后跳转的页面
      data: {
        thing1: { value: eventName },
        time2: { value: eventDate }
      }
    });
    return { success: true, result };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.errMsg };
  }
};