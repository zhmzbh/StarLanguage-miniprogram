// pages/profile/profile.js
Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    tempAvatarUrl: '',
    tempNickname: ''
  },

  onLoad() {
    // 从本地存储读取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
    }
  },

  // 用户选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      tempAvatarUrl: avatarUrl
    });
  },

  // 用户输入昵称
  onNicknameInput(e) {
    this.setData({
      tempNickname: e.detail.value
    });
  },

  // 保存用户信息
  saveUserInfo() {
    if (!this.data.tempAvatarUrl) {
      wx.showToast({ title: '请先选择头像', icon: 'none' });
      return;
    }
    if (!this.data.tempNickname) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    const userInfo = {
      avatarUrl: this.data.tempAvatarUrl,
      nickName: this.data.tempNickname
    };

    // 保存到本地存储
    wx.setStorageSync('userInfo', userInfo);

    this.setData({
      userInfo: userInfo,
      hasUserInfo: true,
      tempAvatarUrl: '',
      tempNickname: ''
    });

    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  // 关于我们
  about() {
    wx.showModal({
      title: '关于星语天文',
      content: '一个为天文爱好者打造的科普小程序。\n版本 1.0.0\n开发者：zhmzbh',
      showCancel: false
    });
  }
});