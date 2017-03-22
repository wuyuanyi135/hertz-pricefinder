const _ = require('lodash');

module.exports = {
    "locationList": [
        {
            'name': 'London Downtown',
            'internalName': 'London - 460 York Street',
            'EOAG': 'YXUC03'
        }, 
        {
            'name': 'London Airport',
            'internalName': 'London Airport',
            'EOAG': 'YXUT02'
        },
        {
            'name': 'Toronto bay store',
            'internalName': 'Toronto - The Bay Store',
            'EOAG': 'YTOC01'
        },
        {
            'name': 'Toronto - brookfield',
            'internalName': 'Toronto - Brookfield Place',
            'EOAG': 'YTOX38'
        }
    ],

    "getNameList": function() {
        return _.map(this.locationList, 'name');
    },

    "getLocationObject": function(name) {
        return _.find(this.locationList, {name: name});
    }
}