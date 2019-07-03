export const state = () => ({
  userInfo: {},
  token: ""
});
export const mutations = {
  // 将登录后的数据保存在state中
  setUserInfo(state, data) {
    state.userInfo = data;
  },
  //退出登录，重置数据对象
  clearLoginInfo(state) {
    localStorage.removeItem("store");
    //清除浏览器的token值
    state.userInfo = {};
  },
  setNewAccount(state, data) {
    // let newstate=JSON.parse(JSON.stringify(state))
    state.userInfo = data.user;
    state.token = data.token;
  }
};
export const actions = {
  // 登录验证
  login({ commit }, data) {
    return this.$axios({
      method: "post",
      url: "/accounts/login",
      data
    }).then(res => {
      //   登录完成后调用mutations里的方法，并且传递过去返回的数据
      commit("setUserInfo", res.data);
      Promise.resolve();
    });
  },
  register({ commit }, props) {
    return this.$axios({
      method: "post",
      url: "/accounts/register",
      data: props
    }).then(res => {
      commit("setNewAccount", res.data);
      Promise.resolve();
    });
  },
  authCode({ commit }, phoneNumber) {
    return this.$axios({
      method: "post",
      url: "/captchas",
      data: { tel: phoneNumber }
    }).then(res => {
      Promise.resolve();
    });
  }
};
