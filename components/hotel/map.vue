<template>
  <div class="main">
    <div id="container"></div>
    <div>
      <select name id v-model="city">
        <option value="广州">广州</option>
        <option value="深圳">深圳</option>
      </select>
      出发点:
      <input type="text" v-model="start" />
      目的地:
      <input type="text" v-model="end" />
      开始规划路线:
      <input type="button" value="搜索" @click="handleclick" />
    </div>
    <div id="panel"></div>
  </div>
  
</template>
<script>
export default {
  data() {
    return {
      map: null,
      start: "",
      end: "",
      city: ""
    };
  },
  methods: {
    handleclick() {
      // 每次调用会重新生成一个地图对象。覆盖之前的地图
      this.map = new AMap.Map("container", {
        zoom: 11, //级别
        // center: [118.871, 31.328], //地图初始化中心点的位置
        viewMode: "3D" //使用3D视图
      });
      // 启用路径导航
      var driving = new AMap.Driving({
        // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
        policy: AMap.DrivingPolicy.LEAST_TIME,
        panel: "panel",
        map: this.map //这里需要添加一个map地图对象
      });
    // this.map.addControl(driving); //添加路径导航组件
      var points = [
        { keyword: this.start, city: this.city },
        { keyword: this.end, city: this.city }
      ];
      driving.search(points, function(status, result) {
        // 未出错时，result即是对应的路线规划方案
        //这里是成功的后的回调函数，可以得到请求后的数据result ，status是状态码
      });
    }
  },

  mounted() {
    window.onLoad = function() {
      //将当前的地图绑定到Vue上，
      this.map = new AMap.Map("container", {
        zoom: 11, //级别
        center: [118.871, 31.328], //地图初始化中心点的位置
        viewMode: "3D" //使用3D视图
      });
      var toolbar = new AMap.ToolBar(); //声明拖动条插件
      this.map.addControl(toolbar); //加入放大镜插件

      // 创建maker实例，点标记
        var marker = new AMap.Marker({
          content:
            "<span class='iconfont icon-dingwei' style='color:deeppink;fontSize:20px'></span>",
          position: new AMap.LngLat(118.872, 31.328), //基点,经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          //第一个是维度。第二个数经度,
          offset: new AMap.Pixel(-17, -42), // 相对于基点的偏移位置
          title:"北京"
        });
        // 将创建的点标记添加到已有的地图实例：
       this.map.add(marker); //可以创建多个marker
    };
    const key = "8a150eccffa8b038bd2294c4a0a8ddb7";
    var url = `https://webapi.amap.com/maps?v=1.4.15&key=${key}&callback=onLoad&plugin=AMap.ToolBar,AMap.Driving,AMap.MarkerClusterer`;
    // 在url后面加上插件名称 用逗号隔开可以添加多个
    var jsapi = document.createElement("script");
    jsapi.charset = "utf-8";
    jsapi.src = url;
    document.head.appendChild(jsapi);
  }
};
</script>
<style lang="less" scoped>
.main {
  width: 1000px;
  margin: 0 auto;
}
#container {
  width: 500px;
  height: 400px;
}
#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
</style>
