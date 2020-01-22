import Vue from "vue";
import axios from "axios";
import { Component,  Watch, Prop } from "vue-property-decorator";
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
//@ts-ignore
import JsonCSV from "vue-json-csv";
import EventTrap from "../../components/EventTrap.vue";
import DataTable from "../../components/DataTable.vue";
import LinePlot from "../../components/LinePlot.vue";
import MaxLine from "../../components/MaxLine.vue";
import MinLine from "../../components/MinLine.vue";

Vue.component("downloadCsv", JsonCSV);

@Component({
  components: {
    VuePlotly,
    EventTrap,
    DataTable,
    LinePlot,
    MaxLine,
    MinLine
  }
})


export default class Statistics extends Vue {
  // @ts-ignore
  @Prop() clickBar;
  clickBarValue:any = "";

  @Watch('clickBar', {immediate: true, deep: true})
  barClick(){
    this.clickBarValue = parseInt(this.clickBar.slice(0,-2))
    console.log(this.clickBar.slice(0,-2));
  }

  @Watch('$route', { immediate: true, deep: true })
  async onUrlChange(routeName: any) {
    this.fakeDetail = true;
    this.showTab = false;
    this.stat = "";
    this.threshold = "";
    this.quickTime = "";
    this.toDate = "";
    this.toHourMinutes = "";
    this.fromDate = "";
    this.fromHourMinutes = "";
    // this.timeZone = "";

    console.log(routeName.params.name);
    if(!routeName.params.name){
      console.log("No changing route")
    }else{
      this.machine = routeName.params.name;
      console.log("route changing");
      this.thresHoldShow = false;
      this.disabledInput = false;
      let thresholdRes:any = await axios.get('http://52.142.17.219:5000/getThreshold?id='+routeName.params.id);
      // console.log(thresHoldRes.data[0].groupName);
      this.thresHoldRes = thresholdRes.data.groupName;
      console.log(thresholdRes);
      console.log(this.thresHoldRes)
      this.machineId = routeName.params.id;
      // console.log(this.machineId);
    }
  }

  // only for show and hide the tab
  thresHoldShow?:boolean = false;
  disabledInput?:boolean= true;
  fakeDetail = true;
  showTab = false;
  // calender
  menu1 = false;
  menu2 = false;
  date = new Date().toISOString().substr(0, 10);
  // calender end
  time1 = false;
  time1menu = false;
  time2menu = false;
  time1modal = false;

  // max min logic
  maxMin?:boolean;
  normal?:boolean;
  noEventTab?: boolean;

  formData!: any;

  // tab section
  tab: any = 0;
  machineList = [];
  statList:string[] = [
    "Voltage(L-N)","Voltage(L-L)", "Current-3 phase", "PF-3 phase", "Neutral current",                          
    "Step Current Change (A)", "Voltage variation (%)","Voltage Total Harmonic Distortion (%)", 
    "Current Total Harmonic Distortion (%)", "Frequency Variation (%)"
  ];
  quicktimeList = [
    {name: "5 Minutes", value: "5m"},{name: "10 Minutes", value: "10m"}, {name: "15 Minutes", value: "15m"}, 
    {name: "30 Minutes", value: "30m"}, {name: "1 Hours", value: "1h"}, {name: "3 Hours", value: "3h"},
    {name: "6 Hours", value: "6h"}, {name: "12 Hours", value: "12h"}, {name: "24 Hours", value: "24h"}, {name: "2 Days", value: "2d"}, 
    {name: "3 Days", value: "3d"}    
  ]
  timeZoneList = ["IST", "UTC", "EST"];
  items = ["Line Plot", "Max", "Min","Event Trap", "Data Table"]; 
  // tab section end


  async created() {
    // let statList = await axios.get('http://52.142.17.219:5000/fetchStats'); 
    // this.statList = statList.data;
    console.log(this.timeZone);
    this.timeZone = "IST"
    console.log("hi")
  }


  // ==========================================
  // dialog form for input start from here
  machine = "";
  group = "";
  stat = "";
  threshold:any = "";
  toDate = "";
  toHourMinutes = "";
  fromDate = "";
  fromHourMinutes = "";
  quickTime  = "";
  timeZone = "";

  toHours = "";
  toMinutes = "";
  formHours = "";
  formMinutes = "";
  valid = ""


  thresHoldRes:any; //getting threshold name
  machineId:any; //getting machine id

  allData:any = {};

  dialog = false;

  // number = [
  //   (v:any) => !!v || 'data is required',
  // ]

  clickTime(){
    // if(this.stat){
      let data = {
        machine: this.machine,
        stat: this.stat,
        threshold: this.threshold,
        quickTime: this.quickTime,
        fromDate: this.fromDate,
        fromHourMinutes: this.formHours+":"+this.formMinutes,
        toDate: this.toDate,
        toHourMinutes: this.toHours+":"+this.toMinutes,
        timeZone: this.timeZone
      }
      this.allData = data;
    // }
  }
  clickQuickTime(){
    let data = {
      machine: this.machine,
      stat: this.stat,
      threshold: this.threshold,
      quickTime: this.quickTime,
      fromDate: "",
      fromHourMinutes: "",
      toDate: "",
      toHourMinutes: "",
      timeZone: this.timeZone
    }
    this.allData = data;
    this.fakeDetail = false;
    this.showTab = true;

    console.log(data)
  }

  submitTimeInput(){
    this.dialog = false;
    let data = {
      machine: this.machine,
      stat: this.stat,
      threshold: this.threshold,
      quickTime: "",
      fromDate: this.fromDate,
      fromHourMinutes: this.formHours+":"+this.formMinutes,
      toDate: this.toDate,
      toHourMinutes: this.toHours+":"+this.toMinutes,
      timeZone: this.timeZone
    }

    this.allData = data;
    console.log(this.allData)
    console.log(data)
    this.fakeDetail = false;
    this.showTab = true;
    this.quickTime = ""
    
  }

  clearInput(){
    this.dialog = true;
    //@ts-ignore
    // this.$refs.formQuickTime.reset();
    //@ts-ignore
    this.$refs.formCustomTime.reset()
  }

  
  async clickStat(data:any){

    if(data === "Voltage(L-N)" || data === "Voltage(L-L)" || data === "Current-3 phase"){
      this.items = ["Line Plot", "Max", "Min", "Data Table"];
      this.maxMin = true;
      this.normal = false;
      this.noEventTab = false;
      this.tab = 0;
      this.threshold = "";
      this.thresHoldShow = false;
    }
    else if(data === "PF-3 phase" || data === "Neutral current"){
      this.items = ["Line Plot", "Data Table"];
      this.maxMin = false;
      this.normal = false;
      this.noEventTab = true;
      this.tab = 0;
      this.threshold = "";
      this.thresHoldShow = false;
    }
    else{
      this.thresHoldShow = true;
      if( data === "Step Current Change (A)"){
        // console.log(this.thresHoldRes.scc);
        this.threshold = this.thresHoldRes.scc;
        // this.thresHoldShow = true;
      }else if(data === "Voltage variation (%)"){
        // console.log(this.thresHoldRes.vf)
        this.threshold = this.thresHoldRes.vf;
        // this.thresHoldShow = true;
      }else if(data === "Voltage Total Harmonic Distortion (%)"){
        // console.log(this.thresHoldRes.vthd)
        this.threshold = this.thresHoldRes.vthd;
        // this.thresHoldShow = true;
      }else if(data === "Current Total Harmonic Distortion (%)"){
        // console.log(this.thresHoldRes.ithd)
        this.threshold = this.thresHoldRes.ithd;
        // this.thresHoldShow = true;
      }
      else if(data === "Frequency Variation (%)"){
        // console.log(this.thresHoldRes.ff)
        this.threshold = this.thresHoldRes.ff;
        // this.thresHoldShow = true;
      }
      this.items = ["Line Plot", "Event Trap", "Data Table"];
      this.maxMin = false;
      this.normal = true;
      this.noEventTab = false;
      this.tab = 0;
    }

    if(this.quickTime === "" && this.toDate === ""){
      this.fakeDetail = true;
      this.showTab = false;
      console.log("both blank")
    }
    else{
      let data = {
        machine: this.machine,
        stat: this.stat,
        threshold: this.threshold,
        quickTime: this.quickTime,
        fromDate: this.fromDate,
        fromHourMinutes: this.formHours+":"+this.formMinutes,
        toDate: this.toDate,
        toHourMinutes: this.toHours+":"+this.toMinutes,
        timeZone: this.timeZone
      }
      this.allData = data;
      console.log(data)
    }
  }

  async thresHoldClick(statName:any, thres:any){
  
    if(statName === "Frequency Variation (%)"){
      let postThreshold = await axios.put('http://52.142.17.219:5000/putThreshold?id='+this.machineId, { "ff":  parseInt(thres) });      
    }else if(statName === "Current Total Harmonic Distortion (%)"){
      let postThreshold = await axios.put('http://52.142.17.219:5000/putThreshold?id='+this.machineId, { "ithd":  parseInt(thres) });      
    }else if(statName === "Voltage Total Harmonic Distortion (%)"){
      let postThreshold = await axios.put('http://52.142.17.219:5000/putThreshold?id='+this.machineId, { "vthd":  parseInt(thres) });
    }else if(statName === "Voltage variation (%)"){
      let postThreshold = await axios.put('http://52.142.17.219:5000/putThreshold?id='+this.machineId, { "vf":  parseInt(thres) });      
    }else if(statName === "Step Current Change (A)"){
      let postThreshold = await axios.put('http://52.142.17.219:5000/putThreshold?id='+this.machineId, { "scc":  parseInt(thres) });            
    }
    let data = {
      machine: this.machine,
      stat: this.stat,
      threshold: parseInt(thres),
      quickTime: this.quickTime,
      fromDate: this.fromDate,
      fromHourMinutes: this.formHours+":"+this.formMinutes,
      toDate: this.toDate,
      toHourMinutes: this.toHours+":"+this.toMinutes,
      timeZone: this.timeZone
    }
    this.allData = data;
    let thresholdRes:any = await axios.get('http://52.142.17.219:5000/getThreshold?id='+this.machineId);
      // console.log(thresHoldRes.data[0].groupName);
      this.thresHoldRes = thresholdRes.data.groupName;
    
    // console.log(data)
  }

  minutesRule = [
    (v:any) => !!v || "Item is required",
    (v:any) => v < 60 || "Must be (00-59)" 
  ]

  hoursRule = [
    (v:any) => !!v || "Item is required",
    (v:any) =>(v >= 1 && v <= 24) || "Must be (1-24)" 
  ]
}                                                                                                                                                                                                                                                                              