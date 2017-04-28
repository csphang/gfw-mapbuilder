import layerKeys from 'constants/LayerConstants';
import React, {PropTypes, Component} from 'react';
import mapActions from 'actions/MapActions';
import Legend from 'esri/dijit/Legend';
import text from 'js/languages';

const closeSymbolCode = 9660,
    openSymbolCode = 9650;

let legend;

export default class LegendPanel extends Component {

  static contextTypes = {
    webmapInfo: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    map: PropTypes.object.isRequired
  };

  componentDidMount() {
    if (window && window.innerWidth > 950) {
      mapActions.toggleLegendVisible();
    }
  }

  componentDidUpdate() {
    const {map} = this.context;
    if (map.loaded && !legend) {
      legend = new Legend({
        map: map,
        layerInfos: this.getLayersForLegend()
      }, this.refs.legendNode);
      legend.startup();
    } else if (legend) {
      legend.refresh(this.getLayersForLegend());
    }
  }

  getLayersForLegend () {
    const {map, webmapInfo} = this.context;
    const {basemapLayerIds, graphicsLayerIds} = map;
    let {layerIds = []} = map;
    const legendInfos = [];
    let ids = [];
    // Loop through layer ids and if those layers exist, add them to the legend
    // Add any layers we want to exclude from the legend to ignores, including basemapLayerIds
    // If a layer has a legendLayerId configured in the resources.js, you will probably want to add it here to prevent
    // two legends from the same service from showing up
    let ignores = [
      layerKeys.MASK,
      layerKeys.TREE_COVER,
      layerKeys.AG_BIOMASS,
      layerKeys.USER_FEATURES,
      layerKeys.TREE_COVER_GAIN,
      layerKeys.TREE_COVER_LOSS
    ];

    //- Add basemap layers and graphics layers
    if (basemapLayerIds) {
      ignores = ignores.concat(basemapLayerIds);
    }

    if (graphicsLayerIds) {
      layerIds = layerIds.concat(graphicsLayerIds);
    }

    // //- Get layers from the webmap, we could comment out this block but may miss any layers added from
    // //- the webmap as graphics or feature layers since those won't be in layerIds
    // legendInfos = webmapInfo.operationalLayers.filter((item) => {
    //   //- Add them to ignores so they do not show up twice
    //   if (item.layerObject) { ignores.push(item.id); }
    //   return item.layerObject;
    // }).map((layer) => {
    //   return {
    //     layer: layer.layerObject,
    //     title: 'lucas' // layer.layerObject.name
    //   };
    // });

    if (layerIds) {
      //- Remove layers to ignore
      ids = layerIds.filter(id => ignores.indexOf(id) === -1);
      ids.forEach((layerId) => {
        const layer = map.getLayer(layerId);
        if (layer) {
          if(layer.url !== null) {
            if(layer.url.startsWith('http://gis-gfw.wri.org'))
            {
              legendInfos.push({ layer, title: ' ' });
            } else {
              if(layer.arcgisProps === undefined) {
                // debugger;
                legendInfos.push({ layer, title: '' });
              } else {
                legendInfos.push({ layer, title: layer.arcgisProps.title });
              }
            }
          }
        }
      });
    }
    return legendInfos;
  }

  // if(layer.arcgisProps == undefined) {
  //           let str = layer.url
  //           console.log(str);
  //           if(str != null) {
  //             if(str.startsWith("http://gis-gfw.wri.org")) {
  //                console.log("YES: ", layer.url);
  //               legendInfos.push({ layer, title: ' ' });
  //             } else {
  //               legendInfos.push({ layer, title: layer.arcgisProps.title });
  //             }
  //           }
  //         }

  render () {
    const {tableOfContentsVisible, legendOpen} = this.props;
    const {language} = this.context;

    let rootClasses = legendOpen ? 'legend-panel map-component shadow' : 'legend-panel map-component shadow legend-collapsed';

    //- Hide the legend if the TOC is not visible (eye button)
    if (!tableOfContentsVisible) {
      rootClasses += ' hidden';
    }

    return (
      <div className={rootClasses}>

        <div className='legend-title mobile-hide' onClick={mapActions.toggleLegendVisible}>
          <span>
            {text[language].LEGEND}
          </span>
          <span className='layer-category-caret' onClick={mapActions.toggleLegendVisible}>
            {String.fromCharCode(legendOpen ? closeSymbolCode : openSymbolCode)}
          </span>
        </div>

        <div title='close' className='legend-close close-icon pointer mobile-show' onClick={mapActions.toggleLegendVisible}>
          <svg className='svg-icon'>
            <use xlinkHref="#shape-close" />
          </svg>
        </div>

        <div className='legend-layers'>
          <div id='legend' ref='legendNode' className={`${legendOpen ? '' : 'hidden'}`}></div>
        </div>
      </div>
    );
  }

}
