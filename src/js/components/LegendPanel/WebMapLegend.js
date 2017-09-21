import Request from 'utils/request';
import React from 'react';

export default class WebMapLegend extends React.Component {

  constructor (props) {
    super(props);
    this.state = { legendInfos: [], visible: this.props.visibility };
  }

  componentDidUpdate(prevProps) {

    // console.log('innn', this.props);
    if (this.props.visibleLayers.indexOf(this.props.layerId) > -1 && prevProps.visibleLayers.indexOf(this.props.layerId) === -1) {

      if (this.props.url === 'http://gis.wri.org/server/rest/services/LandMark/indicators_legal_security/MapServer') {
        const indicatorsLayer = brApp.map.getLayer('indicators_legal_security_8140');
        if (indicatorsLayer.visible && indicatorsLayer.visibleLayers !== [-1]) {
          this.setState({ visible: true });
        }
      } else {
        this.setState({ visible: true });
      }
    } else if (this.props.visibleLayers.indexOf(this.props.layerId) === -1 && prevProps.visibleLayers.indexOf(this.props.layerId) > -1) {
      this.setState({ visible: false });
    } else if (this.props.visibility === true && prevProps.visibility === false && !this.props.layerId) {
      this.setState({ visible: true });
    } else if (this.props.visibility === false && prevProps.visibility === true && !this.props.layerId) {
      this.setState({ visible: false });
    }
  }

  componentDidMount() {
    console.log(this.props.url);
    console.log(this.props.layerSubIndex);
    Request.getLegendInfos(this.props.url, [this.props.layerSubIndex]).then(legendInfos => {
      if(this.refs.myRef) {
        console.log('ge;efsdf', legendInfos);
        this.setState({ legendInfos: legendInfos });
      }
    });
  }

  itemMapper (item, index) {
    return (
      <div className='legend-row' key={index + item.url}>
        <img className='legend-icon' title={item.label} src={`data:image/png;base64,${item.imageData}`} />
        <div className='legend-label'>{item.label}</div>
      </div>
    );
  }

  render () {
    let bool = '';
    let label;

    if(this.state.visible === false) {
      bool = 'hidden';
    } else {
      label = this.props.labels;
    }

    return (
      <div className={`parent-legend-container ${bool}`} ref="myRef">
        <div className='label-container'>{label}</div>
        <div className={`legend-container ${bool}`}>
          {this.state.legendInfos.length === 0 ? '' :
            <div className='crowdsource-legend'>
              {this.state.legendInfos.map(this.itemMapper, this)}
            </div>
          }
        </div>
      </div>
    );
  }
}
