export default
[
  {
    title: 'Pressures',
    order: 6,
    isRadio: false,
    layerIds: [
      'mining_cached_8843',
      'land_use_1483',
      'land_use_5422',
      'Major dams'
    ],
    layers: []
  },
  {
    title: 'Indicators of the Legal Security of Indigenous Lands',
    order: 3,
    isRadio: true,
    layerIds: [
      'indicators_legal_security_8140'
    ],
    layers: [],
    subLayersToInclude: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    title: 'Indicators of the Legal Security of Community Lands',
    order: 4,
    isRadio: true,
    layerIds: [
      'indicators_legal_security_8140'
    ],
    layers: [],
    subLayersToInclude: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
  },
  {
    title: 'Percent of Country Held by Indigenous Peoples and Communities',
    order: 2,
    isRadio: true,
    layerIds: [
      'percent_IP_community_lands_1264'
    ],
    layers: []
  },
  {
    title: 'New Group',
    order: 1,
    isNested: true,
    layers: [],
    layerIds: [
      'comm_comm_CustomaryTenure_6877',
      'comm_comm_NotDocumented_9336',
      'comm_comm_Documented_4717',
      'comm_comm_FormalLandClaim_5585',
      'comm_ind_CustomaryTenure_8127',
      'comm_ind_FormalLandClaim_2392',
      'comm_ind_NotDocumented_2683',
      'comm_ind_Documented_8219'
    ],
    nestedGroups: [
      {
        title: 'Acknowledged by government',
        layers: [
          'comm_ind_Documented_8219',
          'comm_ind_NotDocumented_2683'
        ]
      },
      {
        title: 'Not acknowledged by government',
        layers: [
          'comm_ind_FormalLandClaim_2392',
          'comm_ind_CustomaryTenure_8127'
        ]
      },
      {
        title: 'Acknowledged by government',
        layers: [
          'comm_comm_Documented_4717',
          'comm_comm_NotDocumented_9336'
        ]
      },
      {
        title: 'Not acknowledged by government',
        layers: [
          'comm_comm_FormalLandClaim_5585',
          'comm_comm_CustomaryTenure_6877'
        ]
      }
    ]
  }
];
