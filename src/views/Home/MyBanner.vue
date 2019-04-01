<template>
    <div class="my-banner">
      <div class="my-stat">
        <div class="logined" v-if="isLogined">
          <p class="username">{{currentUsername}}</p>
          <p class="my-balance">
            {{eosBalance}}
            <span class="coin-symbol">EOS</span>
          </p>
          <p class="my-balance">
            {{coinBalance}}
            <span class="coin-symbol">游戏币</span>
          </p>
          <Input v-model="input_amount" placeholder="充值数量(1ccc = 1游戏币)"/>
          <Button type="success" long @click="recharge">充值</Button>
        </div>
        <div class="not-login-yet" v-else>
         <Row>
            <Col span="14"><p class="login-notification">即刻登录，<br/>使用ccc充值游戏币！</p></Col>
            <Col span="10">
              <Button class="login-btn" ghost type="text"
              @click="loginWithWallet"
              style="float: right">立即登录</Button>
            </Col>
          </Row>
        </div>

      </div>

    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import API, { currentEOSAccount } from '../../api/scatter';

export default {
  name: 'My-Banner',
  computed: {
    ...mapState(['scatterAccount', 'balances', 'isScatterConnected']),
    ...mapGetters(['currentUsername']),
    eosBalance() {
      return this.balances.eos.slice(0, -4);
    },
    coinBalance() {
      return this.balances.coin;
    },
    isLogined() {
      return this.scatterAccount !== null;
    },
  },
  created() {

  },
  methods: {
    ...mapActions([
      'connectScatterAsync',
      'suggestNetworkAsync',
      'loginScatterAsync',
      'logoutScatterAsync']),
    toUserPage(username) {
      this.$router.push({ name: 'User', params: { username } });
    },
    async recharge(){
      console.log(this.input_amount);
      await API.recharge({amount: this.input_amount});
    },
    async loginWithWallet() {
      if (!this.isScatterConnected) {
        this.$Modal.error({
          title: '无法与你的钱包建立链接',
          content: '请检查钱包是否打开并解锁',
        });
        return;
      }
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  data: () => ({
    input_amount: '',
  }),
};
</script>

<style scoped>
.my-banner {
  margin: auto;
  margin-top: -32px;
  text-align: center;
  max-width: 335px;
  /* max-height: 76px; */
  /* margin: -32px 20px 0 20px; */
  padding: 8px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 5px 0px rgba(213, 213, 213, 0.5);
  border-radius: 4px;
}

.my-stat {
  text-align: left;
  /* float: left; */
  margin-left: 12px;
  margin-top: 16px;
  margin-bottom: 19px;
}
Button.my-user-page {
  background-color: #000;
  float: right;
  margin-right: 18px;
}
.coin-symbol {
  color: #999999;
}
.username {
  margin-left: 12px;
  font-size: 12px;
  font-weight: bold;
}
.my-balance {
  margin-left: 12px;
  font-size: 16px;
  font-family: PingFang SC, STHeitiSC-Light, Helvetica-Light, arial, sans-serif;
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
  line-height: 22px;
  letter-spacing: 1px;
}

.login-notification {
  font-size: 14px;
  font-weight:bold;
  /* line-height:10px; */
  color:rgba(39,39,39,1);
}
.login-btn, .login-btn:focus, .login-btn:hover {
  color: #FFF;
  background-color: #000;
  border-radius: 2px;
  font-size:16px;
  letter-spacing: 2px;
}
</style>
