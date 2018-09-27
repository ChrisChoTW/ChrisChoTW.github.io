var vm = new Vue({
    el: '#app',
    data: {
        ubikeStops: [],
        searchWord:"",
        searchFactors:[
            {"value": "sno", "text": "站點代號"},
            {"value": "ar", "text": "地(中文)"},
            {"value": "aren", "text": "地址(英文)"},
            {"value": "sna", "text": "場站名稱(中文)"},
            {"value": "snaen", "text": "場站名稱(英文)"},
            {"value": "sarea", "text": "場站區域(中文)"},
            {"value": "sareaen", "text": "場站區域(英文)"},
        ],
        selectedFactors:[],
        fields:[
            {"value": "sno", "text": "站點代號", "isShow":true, "required":true},
            {"value": "ar", "text": "地(中文)", "isShow":true, "required":true},
            {"value": "aren", "text": "地址(英文)", "isShow":false, "required":false},
            {"value": "sna", "text": "場站名稱(中文)", "isShow":true, "required":true},
            {"value": "snaen", "text": "場站名稱(英文)", "isShow":false, "required":false},
            {"value": "sarea", "text": "場站區域(中文)", "isShow":false, "required":false},
            {"value": "sareaen", "text": "場站區域(英文)", "isShow":false, "required":false},
            {"value": "bemp", "text": "空位數量", "isShow":true, "required":false},
            {"value": "sbi", "text": "場站目前車輛數量", "isShow":true, "required":false},
            {"value": "tot", "text": "場站總停車格", "isShow":true, "required":false},
            {"value": "lat", "text": "緯度", "isShow":false, "required":false},
            {"value": "lng", "text": "經度", "isShow":false, "required":false},
            {"value": "act", "text": "全站禁用狀態", "isShow":false, "required":false},
            {"value": "mday", "text": "資料更新時間", "isShow":true, "required":false}
        ],
        illegalRegeExp:false,
        opRelation:"&&",
        opSpaceRelation:"&&",
        opTot:"",
        valTot:"",
        checkedTot:false,
        opSbi:"",
        valSbi:"",
        checkedSbi:false,
        opBemp:"",
        valBemp:"",
        checkedBemp:false
    },
    watch:{
        checkedTot:function(val){
            if (val == false){
                this.valTot = '';
                this.opTot  = '';
            }
        },
        checkedSbi:function(val){
            if (val == false){
                this.valSbi = '';
                this.opSbi  = '';
            }
        },
        checkedBemp:function(val){
            if (val == false){
                this.valBemp = '';
                this.opBemp  = '';
            }
        }
    },
    filters: {
      timeFormat(t){

        var date = [], time = [];

        date.push(t.substr(0, 4));
        date.push(t.substr(4, 2));
        date.push(t.substr(6, 2));
        time.push(t.substr(8, 2));
        time.push(t.substr(10, 2));
        time.push(t.substr(12, 2));

        return date.join("/") + ' ' + time.join(":");
      }
    },
    methods:{
        addFactor: function(factor){
            this.selectedFactors.push(factor);
            this.searchFactors.splice(this.searchFactors.findIndex(function(re){return re.value == factor.value;}),1);
        },
        removeFactor: function(factor){
            this.searchFactors.push(factor);
            this.selectedFactors.splice(this.selectedFactors.findIndex(function(re){return re.value == factor.value;}),1);

            if (this.selectedFactors.length == 0){
                this.searchWord = "";
            }
        }
    },
    computed: {
        filteredFields(){
            return this.fields.filter(function(field){
                return field.isShow;
            });
        },
        filteredStops(){
            var _this = this;
            if (this.searchWord == ''
            && this.checkedTot == false
            && this.checkedSbi == false
            && this.checkedBemp == false){
                return this.ubikeStops;
            }

            try{
                var regexp = new RegExp("(" + this.searchWord + ")", 'ig');
            } catch (e) {
                this.illegalRegeExp = true;
                return this.ubikeStops;
            }
            this.illegalRegeExp = false;

            var newStop = JSON.parse(JSON.stringify(this.ubikeStops));

            return newStop.filter(function(stop){

                var arrFound = [];
                if (_this.selectedFactors.length && _this.searchWord != ''){
                    regFound = false;
                    // regexp
                    for (var i = 0; i < _this.selectedFactors.length ; i++){
                        var key = _this.selectedFactors[i].value;
                        if (regexp.test(stop[key])){
                            stop[key] = stop[key].replace(regexp,"<span class=\"found\">$1</span>");
                            regFound = true;
                            //break;
                        }
                    }
                    arrFound.push(regFound);
                }

                var arrStopkey = ["tot", "sbi", "bemp"];
                var arrSpaceFound = [];
                for (var i = 0 ; i < arrStopkey.length ; i++){
                    var stopKey     = arrStopkey[i];
                    var stopKey_cap = stopKey.charAt(0).toUpperCase() + stopKey.slice(1)
                    var checkedKey  = 'checked' + stopKey_cap;
                    var opKey       = 'op' + stopKey_cap;
                    var valKey      = 'val' + stopKey_cap;

                    if (_this[checkedKey] == true){
                        var spaceFound = false ;
                        if (eval(stop[stopKey] + _this[opKey] + _this[valKey]) == true){
                            stop[stopKey] = '<span class="foundspace">' + stop[stopKey] + '</span>';
                            spaceFound = true;
                        }
                        // arrFound.push(spaceFound);
                        arrSpaceFound.push(spaceFound);
                    }

                    // Last One
                    if (arrSpaceFound.length > 0 && i == arrStopkey.length - 1){
                        arrFound.push(eval(arrSpaceFound.join(_this.opSpaceRelation)));
                    }
                }
                return eval(arrFound.join(_this.opRelation));
            })
        }
    },
    created() {

        // 欄位說明請參照:
        // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

        // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
        // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
        // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
        // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態

        axios.get('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz')
            .then(res => {
                // 將 json 轉陣列後存入 this.ubikeStops
                this.ubikeStops = Object.keys(res.data.retVal).map(key => res.data.retVal[key]);

            });

    }
});