var flt = [{"type":"Midsize","price":"163.85","startDate":"3/17/2017"},{"type":"Fullsize","price":"174.59","startDate":"3/17/2017"},{"type":"SUV Small","price":"461.72","startDate":"3/17/2017"},{"type":"SUV Large","price":"596.44","startDate":"3/17/2017"},{"type":"Economy","price":"147.74","startDate":"3/17/2017"},{"type":"Compact","price":"147.74","startDate":"3/17/2017"},{"type":"Standard","price":"174.59","startDate":"3/17/2017"},{"type":"Minivan","price":99999,"startDate":"3/17/2017"},{"type":"Midsize","price":"229.62","startDate":"3/18/2017"},{"type":"Fullsize","price":"233.14","startDate":"3/18/2017"},{"type":"SUV Small","price":"337.91","startDate":"3/18/2017"},{"type":"Minivan","price":"482.72","startDate":"3/18/2017"},{"type":"SUV Large","price":"438.01","startDate":"3/18/2017"},{"type":"Economy","price":"210.44","startDate":"3/18/2017"},{"type":"Compact","price":"210.44","startDate":"3/18/2017"},{"type":"Standard","price":"233.14","startDate":"3/18/2017"},{"type":"Midsize","price":"232.83","startDate":"3/19/2017"},{"type":"Fullsize","price":"226.38","startDate":"3/19/2017"},{"type":"SUV Small","price":"337.91","startDate":"3/19/2017"},{"type":"Minivan","price":"482.72","startDate":"3/19/2017"},{"type":"SUV Large","price":"441.23","startDate":"3/19/2017"},{"type":"Economy","price":"213.29","startDate":"3/19/2017"},{"type":"Compact","price":"213.29","startDate":"3/19/2017"},{"type":"Standard","price":"226.38","startDate":"3/19/2017"},{"type":"Midsize","price":"229.62","startDate":"3/20/2017"},{"type":"Fullsize","price":"233.14","startDate":"3/20/2017"},{"type":"SUV Small","price":"337.91","startDate":"3/20/2017"},{"type":"Minivan","price":"482.72","startDate":"3/20/2017"},{"type":"SUV Large","price":"438.01","startDate":"3/20/2017"},{"type":"Economy","price":"210.44","startDate":"3/20/2017"},{"type":"Compact","price":"210.44","startDate":"3/20/2017"},{"type":"Standard","price":"233.14","startDate":"3/20/2017"},{"type":"SUV Small","price":"337.91","startDate":"3/21/2017"},{"type":"Minivan","price":"482.72","startDate":"3/21/2017"},{"type":"SUV Large","price":"445.96","startDate":"3/21/2017"},{"type":"Midsize","price":"146.68","startDate":"3/21/2017"},{"type":"Fullsize","price":"157.53","startDate":"3/21/2017"},{"type":"Economy","price":"135.83","startDate":"3/21/2017"},{"type":"Compact","price":"135.83","startDate":"3/21/2017"},{"type":"Standard","price":"157.53","startDate":"3/21/2017"}];

function extract(obj, matchField, extractionField, matches) {
    var result = matches.map((match) => {
        var filtered = _.filter(obj, [matchField, match]);
        return filtered ? filtered[0][extractionField] : null;
    })
    return result;
}

const _ = require('lodash');
const Table = require('cli-table');

var head = _(flt).map((v) => v.type).uniq().value();
var headWithDate = head.slice(0);
headWithDate.unshift('Date');

var table = new Table({head: headWithDate});

var pt = _.values(_.groupBy(flt, 'startDate'));
var tabular = pt.map( (val) => {
    var retObj = {};

    retObj[val[0].startDate] = extract(val, 'type', 'price', head);
    table.push(retObj);
    return retObj;
});

console.log(table.toString());