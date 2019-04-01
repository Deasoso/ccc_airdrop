/* eslint-disable */
<template>
  <div class='home' @click='addShow=false'>
    <div class='head'>
      <div class='titles'>
      </div>
    </div>
    <MyBanner/>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import MyBanner from './MyBanner.vue';

export default {
  name: 'Home',
  components: { MyBanner },
  created() {
    document.title = '首页 - SmartSignature';
  },
  computed: {
    ...mapState(['scatterAccount']),
    ...mapGetters(['currentUsername']),
    isLogined() {
      return this.scatterAccount !== null;
    },
  },
  data() {
    return {
      visible1: false,
      actions1: [
        {
          text: 'English',
          onClick: () => console.log('action 1'),
        },
        {
          text: '简体中文',
          onClick: () => console.log('action 2'),
        },
        {
          text: '日本語',
          onClick: () => console.log('action 3'),
        },
        {
          theme: 'error',
          text: '取消',
          onClick: () => console.log('action -1'),
        },
      ],
      addShow: false, // 显示新增菜单
    };
  },
  methods: {
    ...mapActions([
      'connectScatterAsync',
      'suggestNetworkAsync',
      'loginScatterAsync',
      'logoutScatterAsync',
    ]),
    cancelCb(reason, event) {
      console.log(reason, event);
    },
    async loginWithWallet() {
      try {
        // await this.connectScatterAsync();
        // Scatter 10.0 need to suggestNetwork, if not, scatter is not working on login
        await this.suggestNetworkAsync();
        await this.loginScatterAsync();
      } catch (e) {
        console.warn('Unable to connect wallets');
        this.$Modal.error({
          title: '无法与你的钱包建立链接',
          content: '请检查钱包是否打开并解锁',
        });
      }
    },
  },
};
</script>

<style scoped>
.head {
  background: #478970;
  color: #fff;
  padding-top: 10px;
  height: 205px;
  text-align: center;
  align-items: center;
  vertical-align: middle;
  margin-bottom: 28px;
}
.titles {
  margin: 63px auto;
}
h1.title {
  font-size: 32px;
  /* padding-top: 101px; */
  font-family: BodoniSvtyTwoSCITCTT-Book;
  font-weight: normal;
  width: 100%;
  color: rgba(255, 255, 255, 1);
  line-height: 27px;
  letter-spacing: 2px;
}
h2.subtitle {
  font-size: 16px;
  font-family: PingFangSC-Light;
  font-weight: 300;
  color: rgba(255, 255, 255, 1);
  line-height: 18px;
  letter-spacing: 1px;
  margin-top: 6px;
}
button.publish {
  background: #478970;
  color: rgb(255, 255, 255);
  float: right;
  width: 27px;
  height: 27px;
  margin-right: 14px;
}
.publish-icon {
  margin: -5px -6px;
  margin-left: -8px;
  line-height: 16px;
}
.MyBanner {
  margin-top: 28px;
}
</style>
