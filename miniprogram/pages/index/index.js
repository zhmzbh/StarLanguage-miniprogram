// pages/index/index.js
Page({
  data: {
    events: []
  },

  onLoad() {
    this.loadEvents();
  },

  loadEvents() {
    // 模拟天象数据（实际可替换为云函数调用）
    const mockEvents = [
      {
        id: 1,
        name: "金星合月",
        date: "2026-06-10",
        time: "19:30",
        type: "行星合月",
        desc: "金星与月亮相距仅2度，黄昏可见，适合肉眼观测。",
        remindSet: false
      },
      {
        id: 2,
        name: "英仙座流星雨极大",
        date: "2026-06-12",
        time: "22:00",
        type: "流星雨",
        desc: "ZHR~100，后半夜无月光干扰，观测条件极佳。",
        remindSet: false
      },
      {
        id: 3,
        name: "夏至",
        date: "2026-06-21",
        time: "全天",
        type: "节气",
        desc: "北半球白昼最长的一天，太阳直射北回归线。",
        remindSet: false
      }
    ];
    this.setData({ events: mockEvents });
  },

  subscribeEvent(e) {
  const { id, name, date, time } = e.currentTarget.dataset;
  const templateId = 'RoZyBBDSr_yG3kp_1JUljuctRiER7BIaRGICjZPTlq4';   

  wx.requestSubscribeMessage({
    tmplIds: [templateId],
    success: (res) => {
      if (res[templateId] === 'accept') {
        // 用户同意订阅，调用云函数发送消息
        wx.cloud.callFunction({
          name: 'sendSubscribe',
          data: {
            eventName: name,
            eventDate: `${date} ${time}`
          },
          success: () => {
            wx.showToast({ title: '订阅成功，将提前提醒您', icon: 'success' });
            // 更新本地按钮状态为已提醒
            const events = this.data.events;
            const idx = events.findIndex(item => item.id === id);
            if (idx !== -1) {
              events[idx].remindSet = true;
              this.setData({ events });
            }
          },
          fail: (err) => {
            console.error(err);
            wx.showToast({ title: '发送失败，请稍后重试', icon: 'none' });
          }
        });
      } else {
        wx.showToast({ title: '您拒绝了消息权限', icon: 'none' });
      }
    },
    fail: (err) => {
      console.error(err);
      wx.showToast({ title: '订阅失败', icon: 'error' });
    }
  });
}
});