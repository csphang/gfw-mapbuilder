import NestedCheckbox from './NestedCheckbox';
import React, {
  Component,
  PropTypes
} from 'react';

export default class NestedGroup extends Component {

  static contextTypes = {
    language: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired
  };

  renderGroups = (groups, layers, activeLayers) => {
    return groups.map((group, idx) => {

      const groupLayers = [];

      group.layers.forEach(id => {
        groupLayers.push(layers.filter(layer => layer.esriLayer.id = id)[0]);
      });

      return <NestedCheckbox key={idx} groupLabel={group.title} layers={groupLayers} activeLayers={activeLayers} checked={groupLayers.some(l => activeLayers.indexOf(l.id) > -1)} />;
    });
  }

  render() {

    const {groups, layers, activeLayers} = this.props;

    return (
      <div>
        {this.renderGroups(groups, layers, activeLayers)}
      </div>
    );

    // return (
    //   <div>
    //     <span>Indigenous Lands &mdash; traditional or customary rights</span>
    //     <NestedCheckbox groupLabel={'Acknowledged by government'} layers={this.indigenousAcknowledged} activeLayers={activeLayers} checked={IAChecked} />
    //     <NestedCheckbox groupLabel={'Not acknowledged by government'} layers={this.indigenousNotAcknowledged} activeLayers={activeLayers} checked={INAChecked} />
    //     <span>Community Lands &mdash; traditional or customary rights</span>
    //     <NestedCheckbox groupLabel={'Acknowledged by government'} layers={this.communityAcknowledged} activeLayers={activeLayers} checked={CAChecked} />
    //     <NestedCheckbox groupLabel={'Not acknowledged by government'} layers={this.communityNotAcknowledged} activeLayers={activeLayers} checked={CNAChecked} />
    //   </div>
    // );
  }
}

NestedGroup.propTypes = {
  layers: React.PropTypes.array.isRequired
};
