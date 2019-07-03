 <template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{payData.price}}</span>
      </div>
      <div class="pay-main">
        <h2>微信支付</h2>
        <el-row type="flex" justify="space-between" align="middle">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>
 <script>
import QRCode from "qrcode";
import { async } from "q";
export default {
  data() {
    return {
      payData: {},
      timeId: null
    };
  },
  methods: {
    isPay() {
        // axios是一个promise对象，返回该对象，并且在.then成功的回调函数里，res返回一个结果，
        // 方便在定时器那里进行判断
      return this.$axios({
        method: "POST",
        url: "airorders/checkpay",
        data: {
          id: this.$route.query.id,
          nonce_str: this.payData.price,
          out_trade_no: this.payData.orderNo
        },
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        if (res.data.statusTxt === "支付完成") {
          this.$confirm("订单支付成功", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "success"
          });
          return true;
        } else {
          return false;
        }
      });
    }
  },
  destroyed() {
    clearInterval(this.timeId);
    // 在组件销毁的时候，清除该定时器
  },
  mounted() {
    // 获取当前订单的信息
    // 这里必须要设置一秒以后，在页面结构生成后在请求数据
    setTimeout(() => {
      this.$axios({
        url: `/airorders/${this.$route.query.id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        this.payData = res.data;
        this.payData.price = Number(res.data.price).toFixed(2); //保留两位小数
        const { payInfo, price } = res.data;
        // 生成二维码到canvas
        // 调用qrcode包生成二维码
        // stage: canvas的dom元素
        // url: 付款的链接
        // 配置：配置宽高
        const stage = document.querySelector("#qrcode-stage");
        QRCode.toCanvas(stage, payInfo.code_url, {
          width: 200
        });

        this.timeId = setInterval(() => {
          this.isPay(this.payData).then(res => {
            if (res) {
              clearInterval(this.timeId);
              return;
            }
          });
        }, 3000);
      });
    }, 200);
  }
};
</script>
<style lang="less" scoped>
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>
