(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5a2e5800","chunk-2dc0d350"],{"0481":function(e,t,a){"use strict";var i=a("23e7"),r=a("a2bf"),n=a("7b0b"),s=a("50c4"),o=a("a691"),c=a("65f0");i({target:"Array",proto:!0},{flat:function(){var e=arguments.length?arguments[0]:void 0,t=n(this),a=s(t.length),i=c(t,0);return i.length=r(i,t,t,a,0,void 0===e?1:o(e)),i}})},1158:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"tb-content"},[a("toast"),a("preload-page"),a("div",{directives:[{name:"show",rawName:"v-show",value:!e.preload,expression:"!preload"}]},[a("div",{staticClass:"header-background",style:{"background-image":"url('"+e.topBackground+"')"}}),a("v-container",{staticClass:"main-container"},[a("div",{staticClass:"top-header relative"},[a("ul",{staticClass:"top-nav"},e._l(e.nav,(function(t,i){return a("li",{key:"nav-"+i},[a("router-link",{staticClass:"to-link",class:{disabled:i==e.nav.length-1},attrs:{to:t.path}},[e._v(" "+e._s(t.text)+" ")]),i<e.nav.length-1?a("v-icon",{attrs:{size:"15"}},[e._v("mdi-chevron-right")]):e._e()],1)})),0),e.detectMobile?e._e():a("v-btn",{staticClass:"top-search",attrs:{fab:"","x-small":"",color:"#000000b3"},on:{click:function(t){return e.controlShowSearch(!0)}}},[a("v-icon",{attrs:{size:"17"}},[e._v("mdi-magnify")])],1)],1),a("div",{staticClass:"tb-dialog",class:{show:e.showSearch}},[a("div",{staticClass:"tb-dialog-overplay",on:{click:function(t){return e.controlShowSearch(!1)}}}),a("v-card",{staticClass:"dialog-search-content"},[a("search-partial")],1)],1),a("div",{attrs:{id:"main-content"}},[a("transition",{attrs:{name:"list",mode:"out-in"},on:{beforeLeave:e.beforeLeave,enter:e.enter,afterEnter:e.afterEnter}},[a("router-view")],1)],1)])],1)],1)},r=[],n=(a("d3b7"),a("ac1f"),a("5319"),a("5530")),s=a("2f62"),o={components:{PreloadPage:function(){return a.e("chunk-2d0dab3e").then(a.bind(null,"6d71"))},SearchPartial:function(){return Promise.all([a.e("chunk-40d4e43c"),a.e("chunk-3da21859")]).then(a.bind(null,"996b"))}},data:function(){return{preload:!0}},watch:{title:function(e){document.title=e}},computed:Object(n["a"])({},Object(s["d"])("app",["topBackground","nav","title","showSearch","detectMobile"])),methods:Object(n["a"])(Object(n["a"])(Object(n["a"])({},Object(s["c"])("app",["setNav","setDetectMobile","setShowSearch"])),Object(s["b"])("app",["updateResponsiveByWidth"])),{},{onResponsiveInverted:function(){this.updateResponsiveByWidth(window.innerWidth),this.setDetectMobile(this.detectMb())},detectMb:function(){var e=!1;return function(t){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0)}(navigator.userAgent||navigator.vendor||window.opera),e},beforeLeave:function(e){this.prevHeight=getComputedStyle(e).height},enter:function(e){var t=getComputedStyle(e);t.height;e.style.height=this.prevHeight},afterEnter:function(e){e.style.height="auto"},checkHttp:function(){/^http:\/\/[^localhost]/.test(location.href)&&(location.href=location.href.replace("http://","https://"))},controlShowSearch:function(e){this.setShowSearch(e)}}),created:function(){var e=this;setTimeout((function(){e.preload=!1}),500),this.checkHttp(),window.imageUrl=function(e){return"https://www.nae.vn/ttv/ttv/public/images/story/".concat(e,".jpg")},window.change_alias=function(e){return e=e.toLowerCase(),e=e.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/gi,"a"),e=e.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/gi,"e"),e=e.replace(/ì|í|ị|ỉ|ĩ/gi,"i"),e=e.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/gi,"o"),e=e.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/gi,"u"),e=e.replace(/ỳ|ý|ỵ|ỷ|ỹ/gi,"y"),e=e.replace(/đ/gi,"d"),e=e.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g,""),e=e.replace(/\u02C6|\u0306|\u031B/g,""),e}},mounted:function(){this.onResponsiveInverted(),window.addEventListener("resize",this.onResponsiveInverted)}},c=o,l=a("2877"),d=a("6544"),u=a.n(d),h=a("8336"),p=a("b0af"),g=a("a523"),v=a("132d"),f=Object(l["a"])(c,i,r,!1,null,null,null);t["default"]=f.exports;u()(f,{VBtn:h["a"],VCard:p["a"],VContainer:g["a"],VIcon:v["a"]})},"20f6":function(e,t,a){},"297c":function(e,t,a){"use strict";a("a9e3");var i=a("2b0e"),r=a("37c6");t["a"]=i["a"].extend().extend({name:"loadable",props:{loading:{type:[Boolean,String],default:!1},loaderHeight:{type:[Number,String],default:2}},methods:{genProgress:function(){return!1===this.loading?null:this.$slots.progress||this.$createElement(r["a"],{props:{absolute:!0,color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,height:this.loaderHeight,indeterminate:!0}})}}})},"37c6":function(e,t,a){"use strict";a("a9e3"),a("c7cd");var i=a("5530"),r=a("ade3"),n=(a("6ece"),a("0789")),s=a("a9ad"),o=a("fe6c"),c=a("a452"),l=a("7560"),d=a("80d2"),u=a("58df"),h=Object(u["a"])(s["a"],Object(o["b"])(["absolute","fixed","top","bottom"]),c["a"],l["a"]),p=h.extend({name:"v-progress-linear",props:{active:{type:Boolean,default:!0},backgroundColor:{type:String,default:null},backgroundOpacity:{type:[Number,String],default:null},bufferValue:{type:[Number,String],default:100},color:{type:String,default:"primary"},height:{type:[Number,String],default:4},indeterminate:Boolean,query:Boolean,reverse:Boolean,rounded:Boolean,stream:Boolean,striped:Boolean,value:{type:[Number,String],default:0}},data:function(){return{internalLazyValue:this.value||0}},computed:{__cachedBackground:function(){return this.$createElement("div",this.setBackgroundColor(this.backgroundColor||this.color,{staticClass:"v-progress-linear__background",style:this.backgroundStyle}))},__cachedBar:function(){return this.$createElement(this.computedTransition,[this.__cachedBarType])},__cachedBarType:function(){return this.indeterminate?this.__cachedIndeterminate:this.__cachedDeterminate},__cachedBuffer:function(){return this.$createElement("div",{staticClass:"v-progress-linear__buffer",style:this.styles})},__cachedDeterminate:function(){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__determinate",style:{width:Object(d["e"])(this.normalizedValue,"%")}}))},__cachedIndeterminate:function(){return this.$createElement("div",{staticClass:"v-progress-linear__indeterminate",class:{"v-progress-linear__indeterminate--active":this.active}},[this.genProgressBar("long"),this.genProgressBar("short")])},__cachedStream:function(){return this.stream?this.$createElement("div",this.setTextColor(this.color,{staticClass:"v-progress-linear__stream",style:{width:Object(d["e"])(100-this.normalizedBuffer,"%")}})):null},backgroundStyle:function(){var e,t=null==this.backgroundOpacity?this.backgroundColor?1:.3:parseFloat(this.backgroundOpacity);return e={opacity:t},Object(r["a"])(e,this.isReversed?"right":"left",Object(d["e"])(this.normalizedValue,"%")),Object(r["a"])(e,"width",Object(d["e"])(this.normalizedBuffer-this.normalizedValue,"%")),e},classes:function(){return Object(i["a"])({"v-progress-linear--absolute":this.absolute,"v-progress-linear--fixed":this.fixed,"v-progress-linear--query":this.query,"v-progress-linear--reactive":this.reactive,"v-progress-linear--reverse":this.isReversed,"v-progress-linear--rounded":this.rounded,"v-progress-linear--striped":this.striped},this.themeClasses)},computedTransition:function(){return this.indeterminate?n["b"]:n["d"]},isReversed:function(){return this.$vuetify.rtl!==this.reverse},normalizedBuffer:function(){return this.normalize(this.bufferValue)},normalizedValue:function(){return this.normalize(this.internalLazyValue)},reactive:function(){return Boolean(this.$listeners.change)},styles:function(){var e={};return this.active||(e.height=0),this.indeterminate||100===parseFloat(this.normalizedBuffer)||(e.width=Object(d["e"])(this.normalizedBuffer,"%")),e}},methods:{genContent:function(){var e=Object(d["l"])(this,"default",{value:this.internalLazyValue});return e?this.$createElement("div",{staticClass:"v-progress-linear__content"},e):null},genListeners:function(){var e=this.$listeners;return this.reactive&&(e.click=this.onClick),e},genProgressBar:function(e){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__indeterminate",class:Object(r["a"])({},e,!0)}))},onClick:function(e){if(this.reactive){var t=this.$el.getBoundingClientRect(),a=t.width;this.internalValue=e.offsetX/a*100}},normalize:function(e){return e<0?0:e>100?100:parseFloat(e)}},render:function(e){var t={staticClass:"v-progress-linear",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":this.normalizedBuffer,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,style:{bottom:this.bottom?0:void 0,height:this.active?Object(d["e"])(this.height):0,top:this.top?0:void 0},on:this.genListeners()};return e("div",t,[this.__cachedStream,this.__cachedBackground,this.__cachedBuffer,this.__cachedBar,this.genContent()])}});t["a"]=p},4069:function(e,t,a){var i=a("44d2");i("flat")},"615b":function(e,t,a){},"6ece":function(e,t,a){},a2bf:function(e,t,a){"use strict";var i=a("e8b5"),r=a("50c4"),n=a("0366"),s=function(e,t,a,o,c,l,d,u){var h,p=c,g=0,v=!!d&&n(d,u,3);while(g<o){if(g in a){if(h=v?v(a[g],g,t):a[g],l>0&&i(h))p=s(e,t,h,r(h.length),p,l-1)-1;else{if(p>=9007199254740991)throw TypeError("Exceed the acceptable array length");e[p]=h}p++}g++}return p};e.exports=s},a523:function(e,t,a){"use strict";a("99af"),a("4de4"),a("b64b"),a("2ca0"),a("20f6"),a("4b85"),a("a15b"),a("498a");var i=a("2b0e");function r(e){return i["a"].extend({name:"v-".concat(e),functional:!0,props:{id:String,tag:{type:String,default:"div"}},render:function(t,a){var i=a.props,r=a.data,n=a.children;r.staticClass="".concat(e," ").concat(r.staticClass||"").trim();var s=r.attrs;if(s){r.attrs={};var o=Object.keys(s).filter((function(e){if("slot"===e)return!1;var t=s[e];return e.startsWith("data-")?(r.attrs[e]=t,!1):t||"string"===typeof t}));o.length&&(r.staticClass+=" ".concat(o.join(" ")))}return i.id&&(r.domProps=r.domProps||{},r.domProps.id=i.id),t(i.tag,r,n)}})}var n=a("d9f7");t["a"]=r("container").extend({name:"v-container",functional:!0,props:{id:String,tag:{type:String,default:"div"},fluid:{type:Boolean,default:!1}},render:function(e,t){var a,i=t.props,r=t.data,s=t.children,o=r.attrs;return o&&(r.attrs={},a=Object.keys(o).filter((function(e){if("slot"===e)return!1;var t=o[e];return e.startsWith("data-")?(r.attrs[e]=t,!1):t||"string"===typeof t}))),i.id&&(r.domProps=r.domProps||{},r.domProps.id=i.id),e(i.tag,Object(n["a"])(r,{staticClass:"container",class:Array({"container--fluid":i.fluid}).concat(a||[])}),s)}})},b0af:function(e,t,a){"use strict";a("0481"),a("4069"),a("a9e3");var i=a("5530"),r=(a("615b"),a("10d2")),n=a("297c"),s=a("1c87"),o=a("58df");t["a"]=Object(o["a"])(n["a"],s["a"],r["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes:function(){return Object(i["a"])(Object(i["a"])({"v-card":!0},s["a"].options.computed.classes.call(this)),{},{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised},r["a"].options.computed.classes.call(this))},styles:function(){var e=Object(i["a"])({},r["a"].options.computed.styles.call(this));return this.img&&(e.background='url("'.concat(this.img,'") center center / cover no-repeat')),e}},methods:{genProgress:function(){var e=n["a"].options.methods.genProgress.call(this);return e?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[e]):null}},render:function(e){var t=this.generateRouteLink(),a=t.tag,i=t.data;return i.style=this.styles,this.isClickable&&(i.attrs=i.attrs||{},i.attrs.tabindex=0),e(a,this.setBackgroundColor(this.color,i),[this.genProgress(),this.$slots.default])}})}}]);
//# sourceMappingURL=chunk-5a2e5800.f9af6174.js.map