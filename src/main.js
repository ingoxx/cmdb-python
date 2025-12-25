import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './router/router-guard'
import Nprogress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入
import VuePageTransition from 'vue-page-transition'
import VueClipboard from 'vue-clipboard2'
import VueCodeMirror from 'vue-codemirror'
import VueGoogleCharts from 'vue-google-charts'
import VueApexCharts from 'vue-apexcharts'
import 'codemirror/lib/codemirror.css'
// import { Button } from 'element-ui'
// import { Row } from 'element-ui'
// import { Col } from 'element-ui'
// import { Table } from 'element-ui'
// import { Link } from 'element-ui'
// import { Card } from 'element-ui'
// import { Select } from 'element-ui'
// import { Option } from "element-ui";
// import { Loading } from 'element-ui'
// import { Upload } from 'element-ui'
// import { DatePicker } from 'element-ui'
// import { TableColumn } from 'element-ui'
// import { Pagination } from 'element-ui'
// import {Dialog } from 'element-ui'
// import {Divider } from 'element-ui'
// import { Input } from 'element-ui'
// import { Menu } from 'element-ui'
// import { MenuItem } from 'element-ui'
// import { Submenu } from 'element-ui'
// import { Aside } from 'element-ui'
// import { Container } from 'element-ui'
// import { Header } from 'element-ui'
// import { Breadcrumb } from "element-ui";
// import { Dropdown } from "element-ui";
// import { DropdownMenu } from "element-ui";
// import { DropdownItem } from "element-ui";
// import { Tag } from "element-ui";
// import { Tabs } from "element-ui";
// import { TabPane } from "element-ui";
// import { Main } from "element-ui";
// import { BreadcrumbItem } from "element-ui";
// import { Tree } from "element-ui";
// import { Form } from "element-ui";
// import { FormItem } from "element-ui";
// import { Timeline } from "element-ui";
// import { Radio } from "element-ui";
// import { RadioGroup } from "element-ui";
// import { TimelineItem } from "element-ui";
// import { Switch } from "element-ui";
// import { Progress } from "element-ui";
// import { Message } from "element-ui";
// import { Popover } from "element-ui";
// import { Slider } from "element-ui";
// import { Calendar } from "element-ui";
// import { MessageBox } from "element-ui";
// import { Cascader } from "element-ui";
// import { Tooltip } from "element-ui";


Vue.config.productionTip = true;

// 全局使用element-ui
Vue.use(Nprogress);
Vue.use(ElementUI);
// Vue.use(Button);
// Vue.use(Col);
// Vue.use(Table);
// Vue.use(Link);
// Vue.use(Card);
// Vue.use(Select);
// Vue.use(Option);
// Vue.use(Loading);
// Vue.use(Upload);
// Vue.use(TableColumn);
// Vue.use(Pagination);
// Vue.use(Dialog);
// Vue.use(Divider);
// Vue.use(DatePicker);
// Vue.use(Input);
// Vue.use(Menu);
// Vue.use(MenuItem);
// Vue.use(Submenu);
// Vue.use(Aside);
// Vue.use(Header);
// Vue.use(Container);
// Vue.use(Breadcrumb);
// Vue.use(Tag);
// Vue.use(Tabs);
// Vue.use(TabPane);
// Vue.use(Main);
// Vue.use(Dropdown);
// Vue.use(DropdownMenu);
// Vue.use(BreadcrumbItem);
// Vue.use(DropdownItem);
// Vue.use(Tree);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Timeline);
// Vue.use(TimelineItem);
// Vue.use(Radio);
// Vue.use(RadioGroup);
// Vue.use(Switch);
// Vue.use(Progress);
// Vue.use(Message);
// Vue.use(MessageBox);
// Vue.use(Popover);
// Vue.use(Slider);
// Vue.use(Calendar);
// Vue.use(Cascader);
// Vue.use(Tooltip);


Vue.use(VuePageTransition);
Vue.use(VueClipboard);
Vue.use(VueCodeMirror);
Vue.use(VueApexCharts);
Vue.use(VueGoogleCharts);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
