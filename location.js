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
        }
    ],

    "getNameList": function() {
        return _.map(this.locationList, 'name');
    },

    "getLocationObject": function(name) {
        return _.find(this.locationList, {name: name});
    }
}