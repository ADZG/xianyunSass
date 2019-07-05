<template>
    <div>
        <SelectHotel></SelectHotel>
        <Map></Map>
    </div>
</template>
<script>
import Map from "@/components/hotel/map.vue"
import SelectHotel from "@/components/hotel/selectHotel.vue"
export default {
    data() {
        return {
            
        }
    },
    components:{
        SelectHotel,
        Map
    }
}
</script>
<style lang="less" scoped>

</style>
