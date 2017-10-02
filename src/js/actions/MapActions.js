import dispatcher from 'js/dispatcher';
import layerFactory from 'utils/layerFactory';
import layerKeys from 'constants/LayerConstants';
// import CartoLayer from 'js/layers/CartoLayer';
import esriConfig from 'esri/config';
import appActions from 'actions/AppActions';
import resources from 'resources';
import Point from 'esri/geometry/Point';

class MapActions {
  //- Action to notify the store the map has changed so we can rerender UI changes
  //- if necessary
  mapUpdated () { return {}; }

  infoWindowUpdated ({target}) {
    return (target && target.getSelectedFeature && target.getSelectedFeature()) || false;
  }

  changeActiveTab (tabId) {
    return {
      id: tabId
    };
  }

  setAnalysisType (evt) {
    return {
      type: evt.target.value
    };
  }

  centerAndZoomLatLng (lat, lng) {
    brApp.map.centerAndZoom(new Point(lng, lat), 9);
  }

  //- Straight through dispatches, all have the following format
  /**
  * @param {object} - data
  * @param {boolean} - data.visible
  * @return {object} - data
  */
  toggleAnalysisModal = (data) => data;
  togglePrintModal = (data) => data;
  toggleSearchModal = (data) => data;
  toggleCanopyModal = (data) => data;
  toggleLayerModal = (data) => data;
  toggleTOCVisible = (data) => data;
  showLayerInfo = (layer) => layer;
  updateTimeExtent = (timeExtent) => timeExtent;
  toggleLegendVisible = () => { return {}; };
  toggleMobileTimeWidgetVisible = () => { return {}; };

  updateImazonAlertSettings (type, value) {
    return { type, value };
  }

  changeBasemap (basemap) {
    return basemap;
  }

  updateCanopyDensity (density) {
    return { density };
  }

  updateActiveSlopeClass (classValue) {
    return classValue;
  }

  openTOCAccordion (groupKey) {
    return groupKey;
  }

  createLayers (map, layerPanel, activeLayers, language) {
    //- Organize and order the layers before adding them to the map
    let layers = layerPanel.filter(group => {
      //- remove basemaps and extra layers, extra layers will be added later and basemaps
      //- handled differently elsewhere
      return group.groupId !== layerKeys.GROUP_BASEMAP && group.groupId !== layerKeys.EXTRA_LAYERS;
    }).sort((a, b) => {
      //- Sort the groups based on their order property
      return a.order < b.order;
    }).reduce((list, group) => {
      //- Flatten them into a single list but before that,
      //- Multiple the order by 100 so I can sort them more easily below, this is because there
      //- order numbers start at 0 for each group, so group 0, layer 1 would have order of 1
      //- while group 1 layer 1 would have order of 100, and I need to integrate with webmap layers
      return list.concat(group.layers.map((layer, index) => {
        layer.order = ((10 - group.order) * 100) - (layer.order || index);
        return layer;
      }));
    }, []);

    //- Add the extra layers now that all the others have been sorted
    const extraLayersGroup = layerPanel.filter(g => g.groupId === 'extraLayers')[0];
    layers = layers.concat(extraLayersGroup.layers);

    //- make sure there's only one entry for each dynamic layer
    let uniqueLayers = [];
    const existingIds = [];
    layers.forEach(layer => {
      if (existingIds.indexOf(layer.id) === -1) {
        uniqueLayers.push(layer);
        existingIds.push(layer.id);
      }
    });
    //- If we are changing webmaps, and any layer is active, we want to make sure it shows up as active in the new map
    //- Make those updates here to the config as this will trickle down
    uniqueLayers.forEach(layer => {
      layer.visible = activeLayers.indexOf(layer.id) > -1 || layer.visible;
    });

    const landMapLayerIds = [
      'comm_ind_Documented_8219',
      'comm_ind_NotDocumented_2683',
      'comm_ind_FormalLandClaim_2392',
      'comm_ind_CustomaryTenure_8127',
      'comm_comm_Documented_4717',
      'comm_comm_NotDocumented_9336',
      'comm_comm_FormalLandClaim_5585',
      'comm_comm_CustomaryTenure_6877'
    ];

    const landMapLayers = [];
    landMapLayerIds.forEach(id => landMapLayers.push(brApp.map.getLayer(id)));

    const getVisibleLayers = id => {
      return landMapLayers.filter(l => l.id === id)[0].visible || false;
    };

    const convertToFeatureLayers = [
      {
        id: 'indigenous_FormalClaimFeature0',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_ind_FormalLandClaim/MapServer/0',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_ind_FormalLandClaim_2392'),
        type: 'feature'
      },
      {
        id: 'indigenous_FormalClaimFeature1',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_ind_FormalLandClaim/MapServer/1',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_ind_FormalLandClaim_2392'),
        type: 'feature'
      },
      {
        id: 'indigenous_CustomaryFeature0',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_ind_CustomaryTenure/MapServer/0',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_ind_CustomaryTenure_8127'),
        type: 'feature'
      },
      {
        id: 'indigenous_CustomaryFeature1',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_ind_CustomaryTenure/MapServer/1',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_ind_CustomaryTenure_8127'),
        type: 'feature'
      },
      {
        id: 'indigenous_DocumentedFeature0',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_ind_Documented/MapServer/0',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_ind_Documented_8219'),
        type: 'feature'
      },
      {
        id: 'indigenous_DocumentedFeature1',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_ind_Documented/MapServer/1',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_ind_Documented_8219'),
        type: 'feature'
      },
      {
        id: 'indigenous_NotDocumentedFeature0',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_ind_NotDocumented/MapServer/0',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_NotDocumented_9336'),
        type: 'feature'
      },
      {
        id: 'indigenous_NotDocumentedFeature1',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_ind_NotDocumented/MapServer/1',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_NotDocumented_9336'),
        type: 'feature'
      },
      {
        id: 'community_FormalClaimFeature0',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_comm_FormalLandClaim/MapServer/0',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_FormalLandClaim_5585'),
        type: 'feature'
      },
      {
        id: 'community_FormalClaimFeature1',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_comm_FormalLandClaim/MapServer/1',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_FormalLandClaim_5585'),
        type: 'feature'
      },
      {
        id: 'community_CustomaryFeature0',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_comm_CustomaryTenure/MapServer/0',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_CustomaryTenure_6877'),
        type: 'feature'
      },
      {
        id: 'community_CustomaryFeature1',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_comm_CustomaryTenure/MapServer/1',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_CustomaryTenure_6877'),
        type: 'feature'
      },
      {
        id: 'community_DocumentedFeature0',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_comm_Documented/MapServer/0',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_Documented_4717'),
        type: 'feature'
      },
      {
        id: 'community_DocumentedFeature1',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_comm_Documented/MapServer/1',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_Documented_4717'),
        type: 'feature'
      },
      {
        id: 'community_NotDocumentedFeature0',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_comm_NotDocumented/MapServer/0',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_NotDocumented_9336'),
        type: 'feature'
      },
      {
        id: 'community_NotDocumentedFeature1',
        url: 'http://gis.wri.org/server/rest/services/LandMark/comm_comm_NotDocumented/MapServer/1',
        minScale: 4600000,
        maxScale: 0,
        visible: getVisibleLayers('comm_comm_NotDocumented_9336'),
        type: 'feature'
      }
    ];

    uniqueLayers = uniqueLayers.concat(convertToFeatureLayers);

    //- remove layers from config that have no url unless they are of type graphic(which have no url)
    //- sort by order from the layer config
    //- return an arcgis layer for each config object
    const esriLayers = uniqueLayers.filter(layer => layer && (layer.url || layer.type === 'graphic')).map((layer) => {
      return layerFactory(layer, language);
    });
    map.addLayers(esriLayers);
    // If there is an error with a particular layer, handle that here
    map.on('layers-add-result', result => {

      const addedLayers = result.layers;
      // Prepare the carto layer
      var cartoLayers = addedLayers.filter(layer => layer.layer.cartoUser);
      cartoLayers.forEach((cartoLayer) => {
        cartoLayer.layer.on('onCartoLayerAdd', evt => {
          const tempResources = resources;
          tempResources.layerPanel.GROUP_CARTO.layers = evt.target.cartoLayers;
          appActions.applySettings(tempResources);
        });
      });

      // Check for Errors
      var layerErrors = addedLayers.filter(layer => layer.error);
      if (layerErrors.length > 0) { console.error(layerErrors); }
      //- Sort the layers, Webmap layers need to be ordered, unfortunately graphics/feature
      //- layers wont be sorted, they always show on top
      uniqueLayers.forEach((layer) => {
        if (map.getLayer(layer.id) && layer.order) {
          map.reorderLayer(map.getLayer(layer.id), layer.order);
        }
      });
      if (map.getLayer('labels')) {
        map.reorderLayer(map.getLayer('labels'), 200);
      }
      // Appending the mask to the end of the parent div to make sure mask is always on top of all layers
      var mask = document.getElementById('esri.Map_0_MASK');
      if(mask && mask.parentNode) {
        mask.parentNode.appendChild(mask);
      }
    });
    //- Return the layers through the dispatcher so the mapstore can update visible layers
    return {
      layers,
      map
    };
  }

}

export default dispatcher.createActions(MapActions);
