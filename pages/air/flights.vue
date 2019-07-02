<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->

      <div class="flights-content">
        <!-- 航班过滤组件 -->
        <div>
          <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList"></FlightsFilters>
        </div>

        <!-- 航班头部布局 -->
        <div>
          <FlightsListHead></FlightsListHead>
        </div>

        <!-- 航班列表渲染组件 -->
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
        <FlightsAside></FlightsAside>
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>
<script>
import FlightsAside from "@/components/air/flightsAside.vue"
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
    FlightsItem,
    FlightsAside
  },
  methods:{
    // 子组件的自定义的事件触发后，会自定该函数，并且传递子组件发过来的数据
    setDataList(arr){
      if(arr){
        // 如果子组件有传筛选过来的数据
        this.flightsData.flights=arr

        this.pageIndex=1
        this.total=arr.length //当前的页码数是数组的长度
        
      }
      this.dataList=this.flightsData.flights.slice((this.pageIndex-1)*this.pageSize,this.pageIndex*this.pageSize)
    },
    // 切换条数触发
    handleSizeChange(value){
      this.pageSize=value
      this.setDataList()
    },
    // 切换页数触发
    handleCurrentChange(value){
      this.pageIndex=value
      this.setDataList()
    },
    getData(){
      // 获取当前的机票数据列表
    this.$axios({
      url:"airs",
      params:this.$route.query
    }).then((res)=>{
      this.flightsData=res.data
      this.dataList=this.flightsData.flights.slice(0,5) //初始化页码时候，显示的数据
      this.cacheFlightsData={...res.data} //重新制作一份没有筛选过的数据，传过
      this.total=this.flightsData.total
      console.log(res.data)
    })
    }
  },
  mounted(){
    this.getData()
  },
  watch:{
    // 监听路由变化
    $route(){
      this.getData()
    }
  }
}
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
