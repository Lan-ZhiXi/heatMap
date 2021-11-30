import './style.css';
import {Fill, Stroke,Style} from 'ol/style';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import GeoJSON from 'ol/format/GeoJSON';
import {Heatmap as HeatmapLayer,Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import './data/boundary.json'
import './data/people.json'





const blur = document.getElementById('blur');
const radius = document.getElementById('radius');

let heatMapLayer = new HeatmapLayer({
  source: new VectorSource({
    url: './data/people.json',
    format: new GeoJSON()
  }),
  blur: parseInt(blur.value),
  radius: parseInt(radius.value),
});

const SHILIANG = new TileLayer({
  source:new XYZ({
        crossOrigin: 'Anonymous',
        // 高德矢量地图
        url:'http://webrd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'
    }),
    visible: true
});
const SHIJING = new TileLayer({
  source:new XYZ({   
    crossOrigin: 'Anonymous',
        // 高德实景地图
        url:'http://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
    }),
    visible: false
});

//boundary
const boundary = new VectorLayer({
  source: new VectorSource({
    url: './data/boundary.json',
    format: new GeoJSON(),
  }),
  style:  new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0)',
    }),
    stroke: new Stroke({
      color: '#319FD3',
      width: 3,
    }),
  })
});


const map = new Map({
  target: 'map',
  layers: [SHILIANG,SHIJING,heatMapLayer,boundary],
  view: new View({
    zoom: 16,
    center:fromLonLat([118.7851193423, 32.0515522269])   
  }),
});


  heatMapLayer.getSource().on('addfeature', function(event) {
     var CZRK = event.feature.get('CZRK');
     var ZZRK =event.feature.get('ZZRK');
     var sum=CZRK+ZZRK;
    event.feature.set('weight', sum);  
  });


  
//   heatMapLayer.getSource().on('addfeature', function(event) {
//     var num = event.feature.get('WATER');
//     event.feature.set('weight', num);  
//  });
 
//  heatMapLayer.getSource().on('addfeature', function(event) {
//   var num = event.feature.get('AGE_0_3');
//   event.feature.set('weight', num);  
// });
 

const blurHandler = function () {
  heatMapLayer.setBlur(parseInt(blur.value));
  document.getElementById('blurvalue').innerHTML = blur.value;
};
blur.addEventListener('input', blurHandler);
blur.addEventListener('change', blurHandler);

const radiusHandler = function () {
  heatMapLayer.setRadius(parseInt(radius.value));
  document.getElementById('radiusvalue').innerHTML = radius.value;
};
radius.addEventListener('input', radiusHandler);
radius.addEventListener('change', radiusHandler);

let btn = document.getElementById("btn");
		btn.addEventListener('click',function(){
			map.getLayers().item(1).setVisible(true);
		},false)
