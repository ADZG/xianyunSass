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
        options: {}
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
  methods:{
    // 当切换当前页码的时候触发
    handleSizeChange(v){
      this.pageSize=v
      this.setDataList()
    },
    //当切换每页显示的数量时触发
    handleCurrentChange(v){
      this.pageIndex=v
      this.setDataList()
    },
    // 该函数是子组件发送事件和数据，接受触发的函数
    setDataList(arr){
      if(arr){
        // 如果子组件有传过来被筛选的数据，则重新覆盖掉航班信息的数据
        this.flightsData.flights=arr
        
        // 当筛选数据后,跳到第一页，改变分页器的数量
        // 初始化分页的数据
        this.total=arr.length
        this.pageIndex=1
      }
      // 当前航班列表信息数据
      this.dataList=this.flightsData.flights.slice(
        // 该数据方法，会返回一个切过的新数组
        (this.pageIndex-1)*this.pageSize,
        this.pageIndex*this.pageSize
      )
    }
  },
  mounted(){
    this.$axios({
      url:"/airs",
      params:this.$route.query
    }).then(res=>{
      this.flightsData=res.data
      this.dataList=this.flightsData.flights.slice(0,5)
      this.cacheFlightsData={...res.data} //缓存一份新的数据
      this.total=this.flightsData.total
    })
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
