<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->

      <div class="flights-content">
        <!-- 过滤条件 -->
        <div>
          <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList"></FlightsFilters>
        </div>

        <!-- 航班头部布局 -->
        <div>
          <FlightsListHead></FlightsListHead>
        </div>

        <!-- 航班信息 -->
        <div>
          <!-- 这里是一块数据，但是遍历出了多个 -->
          <FlightsItem v-for="(item, index) in dataList" :key="index" :data="item"></FlightsItem>
          <el-row type="flex" justify="center" style="margin-top:10px;">
            <!-- size-change：切换条数时候触发 -->
            <!-- current-change：选择页数时候触发 -->
            <!-- current-page: 当前页数 -->
            <!-- page-size：当前条数 -->
            <!-- total：总条数 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :background="true"
            ></el-pagination>
          </el-row>
        </div>
      </div>
      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>
<script>
import FlightsFilters from "@/components/air/flightsFilters.vue";
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsListHead from "@/components/air/flightsListHead.vue";
export default {
  data() {
    return {
      pageIndex: 1, //当前的页码
      pageSize: 5, //每页显示的条数
      total:0,
      flightsData: {
        // 航班总数据
        //由于数据请求是异步的，需要先给子组件一个空数据，不至于报错，
        flights: [],
        info: {},
        options: {},
      }, //航班的总数据  这里总数据其他的组件会用得到，比如顶部搜索的历史等等
      dataList: [], //航班列表数据
      cacheFlightsData: {
        // 缓存一份数据，只会修改一次
        flights: [],
        info: {},
        options: {},
      }
    };
  },
  components: {
    FlightsListHead,
    FlightsFilters,
    FlightsItem
  },
  methods: {
    // 分割数据数组，形成新的筛选过的数组，子组件去显示
    setDataList(arr) {
      if (arr) {
        //  如果筛选后有数据传输进来
        // 设置当前当前的页码
        // 将当前显示的数据，替换成筛选过的arr数据
        // 将数据条数，替换成筛选过后的数组的长度
        this.flightsData.flights=arr
        this.pageIndex = 1;
        this.total= arr.length;
      }
      // 这里在子组件发射了一个事件，并且事件里有数组数据，监听自定义事件，只要子组件上该事件一触发，则这个事件也触发
      // 只是名称一样
      //   搜索之后，服务器将所有的数据全部返回来，要自己进行筛选
      let start = (this.pageIndex - 1) * this.pageSize; //分页是从1开始，而数组分隔是从索引0开始, 得到分割开始的索引
      let end =this.pageIndex* this.pageSize; //得到分割结束的索引
      this.dataList = this.flightsData.flights.slice(start, end); //找到当前机票数据列表,切割后返回一个新的数组
    },
    //    切换条数触发
    handleSizeChange(v) {
      this.pageSize = v;
      // this.pageIndex = 1;
      this.setDataList();
      //   在当前页码或者每页显示的条数改变的时候，都重新切割一份新的数组，在页面显示
    },
    //   当前页码改变触发
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.setDataList();
    }
  },
  mounted() {
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      this.flightsData = res.data;
      this.dataList = this.flightsData.flights;
      // this.setDataList();
      this.cacheFlightsData={...res.data}
      //   console.log(res.data);
      this.total=this.flightsData.total
    });
  }
};
</script>
<style lang="less" scoped>
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>
