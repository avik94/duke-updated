<template>
  <v-app>
    <v-navigation-drawer app dark class="blue-grey darken-3" v-model="drawer" :width="230">
      <div class="text-center headerSidebar">
        <v-img
        class="sidebarHeader"
          src="./assets/msense.png"
          alt
        ></v-img>
      </div>
      <v-list height="5" shaped dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.url" color="white">
          <v-list-item-icon>
            <v-icon v-bind:style="{ color: item.status  }">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content style="font-size: 13px">
            {{ item.title }}            
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark class="amber darken-3" height="50" elevation="3">
      <v-app-bar-nav-icon @click="drawerClick()"></v-app-bar-nav-icon>
      <h3 style="padding-left:30px;color: #ffffff;">Expert Power Quality Analyzer</h3>
    </v-app-bar>

    <v-content class="contentBackground" ref="dashboard" id="dasboard">
      <router-view v-bind:clickBar="sidebarSize" />
    </v-content>
  </v-app>
</template>

<style lang="scss">
.headerSidebar {
  background: #263238;
  padding: 42px 13px;
}
.navbarHeader{
  // background-image: linear-gradient(to left, red , #ff9800 );
}
.leftSidebar{
  // background-image: linear-gradient(to bottom, #090d11 , #0c1469 );
  // background: #1A237E;
}
.contentBackground{
  background: #e6edf0;
}
</style>
<script lang="ts">
import Vue from "vue";
import axios from "axios";

import {Component} from "vue-property-decorator"
@Component
export default class App extends Vue {
  drawer:any = null;
  sidebarSize = "";
  items:any =  [
    // { title: "MDB", icon: "mdi-adjust", url: "/MDB", status: "green" },
    // { title: "MACHINE-2", icon: "mdi-adjust", url: "/machine2", status: "red" },
    // { title: "MACHINE-3", icon: "mdi-adjust", url: "/machine3", status: "red" },
    // { title: "MACHINE-4", icon: "mdi-adjust", url: "/machine4", status: "red" },
    // { title: "MACHINE-5", icon: "mdi-adjust", url: "/machine5", status: "red" },
    // { title: "MACHINE-6", icon: "mdi-adjust", url: "/machine6", status: "red" },
    // { title: "MACHINE-7", icon: "mdi-adjust", url: "/machine7", status: "red" },
    // { title: "MACHINE-8", icon: "mdi-adjust", url: "/machine8", status: "red" }
  ];
  drawerClick(){
    this.drawer = !this.drawer;
    // console.log(this.$refs.dashboard.$refs.content.offsetWidth)
    // @ts-ignore 230px 0px
    // console.log(this.$refs.dashboard.styles.paddingLeft);
    this.sidebarSize = this.$refs.dashboard.styles.paddingLeft;

  }

  async created(){
    console.log(this.$route.params.companyId)
    let x = await axios.get('http://52.142.17.219:5000/fetchMachines?id='+this.$route.params.companyId);
    // console.log(x);
    let machineList = [];
    for (let i of x.data){
      if(i.machines.length != 0){ 
        for(let machineData of i.machines){
          let statusRes = await axios.get('http://52.142.17.219:5000/getStatus?id='+machineData.id);
          console.log(machineData.name);
          console.log(machineData.id);
          
          machineList.push({ title: machineData.name, icon: "mdi-adjust", url: "/"+machineData.name+"/"+machineData.id, status: statusRes.data.color });
        } 
      }
    }
    this.items = machineList
    console.log(machineList)
  }
}
</script>
