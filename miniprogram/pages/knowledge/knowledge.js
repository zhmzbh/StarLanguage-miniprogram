// pages/knowledge/knowledge.js
Page({
  data: {
    articles: [],
    loading: true
  },

  onLoad() {
    this.fetchKnowledge();
  },

  fetchKnowledge() {
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getKnowledge',
      success: res => {
        console.log('云函数返回', res);
        if (res.result && res.result.success) {
          this.setData({ articles: res.result.data, loading: false });
        } else {
          this.setData({ articles: [], loading: false });
          wx.showToast({ title: '暂无数据', icon: 'none' });
        }
      },
      fail: err => {
        console.error(err);
        this.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'error' });
        // 可选：显示一条默认错误提示
        this.setData({ articles: [{ title: '提示', content: '请检查云函数是否部署' }] });
      }
    });
  }
});