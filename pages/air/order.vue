<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
        <OrderForm :insuinfo="insuinfoData" @sendPrice="sendPrice" :price="price"></OrderForm>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <OrderAside :airList="airData" :priceNum="priceNum"></OrderAside>
      </div>
    </el-row>
  </div>
</template>

<script>
import OrderAside from "@/components/air/orderAside.vue";
import OrderForm from "@/components/air/orderForm.vue";
export default {
  data() {
    return {
      airData: {},
      insuinfoData: [],
      priceNum:0,
      price: {
        money: 0,
        oil: 0
      }
    };
  },
  components: {
    OrderForm,
    OrderAside
  },
  methods: {
    sendPrice(str) {
      this.priceNum = str;
    }
  },
  mounted() {
    this.$axios({
      url: `/airs/${this.$route.query.id}`,
      params: {
        seat_xid: this.$route.query.seat_xid
      }
    }).then(res => {
      console.log(res);
      this.insuinfoData = res.data.insurances;
      this.airData = res.data;
      let data={...res.data}
      this.price.money = data.seat_infos.org_settle_price;
      this.price.oil =data.airport_tax_audlet
    });
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>