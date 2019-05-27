<template>
    <div class="my-banner">
      <div class="my-stat">
        <div class="logined" v-if="isLogined">
          <p class="username">{{currentUsername}}</p>
          <Input v-model="input_name" placeholder="增发目标"/>
          <Input v-model="input_amount" placeholder="增发数量"/>
          <Button type="success" long @click="issue">增发</Button>
        </div>
        <br/>
        <div class="logined" v-if="isLogined">
          <Input v-model="input_coin_number" placeholder="解锁币编号"/>
          <Button type="success" :loading="cantunfreeze" long @click="unfreeze" ref="unlockbutton">解锁</Button>
        </div>
        <div class="not-login-yet" v-else>
         <Row>
            <Col span="14"><p class="login-notification">请使用chainbankeos<br/>账号登录。</p></Col>
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
    ...mapState(['existcoins', 'scatterAccount', 'balances', 'isScatterConnected']),
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
    var self = this;
    this.cantunfreeze = true;
    this.getCoins().then(() => {
      const allcoins = this.existcoins;
      for(const coinid in allcoins){
        const coin = allcoins[coinid];
        if(coin.coinnumber == "ADAA628"){
          console.log('founded');
        }
      }
      console.log(self.$refs.unlockbutton);
      self.cantunfreeze = false;
    });
  },
  methods: {
    ...mapActions([
      'connectScatterAsync',
      'suggestNetworkAsync',
      'loginScatterAsync',
      'logoutScatterAsync',
      'getCoins']),
    toUserPage(username) {
      this.$router.push({ name: 'User', params: { username } });
    },
    async issue(){
      try{
        await API.issue({name: this.input_name, amount: this.input_amount});
      } catch (error) {
        console.error(error);
        let msg;
        if (error.message === undefined) {
          msg = JSON.parse(error).error.details[0].message;
        } else {
          msg = error.message;
        }
        this.$Modal.error({
          title: '增发错误',
          content: `Transaction failed: ${msg}`,
        });
      }
      console.log(this.input_name + this.input_amount);
    },
    async unfreeze(){
      var frozenid = 0;
      const allcoins = this.existcoins;
      for(const coinid in allcoins){
        const coin = allcoins[coinid];
        if(coin.coinnumber == this.input_coin_number){
          frozenid = coin.id;
          console.log('founded' + coin.id);
        }
      }
      try{
        await API.unfreeze({coinid: frozenid});
      } catch (error) {
        console.error(error);
        let msg;
        if (error.message === undefined) {
          msg = JSON.parse(error).error.details[0].message;
        } else {
          msg = error.message;
        }
        this.$Modal.error({
          title: '解冻错误',
          content: `Transaction failed: ${msg}`,
        });
      }
      console.log(this.input_name + this.input_amount);
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
    input_name: '',
    input_coin_number: '',
    cantunfreeze: true
  }),
};
</script>

<style scoped>
.my-banner { 
  margin: auto;
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
