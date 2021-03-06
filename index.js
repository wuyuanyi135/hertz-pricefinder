
const rp = require("request-promise-native");
const delay = require("async-delay").default;
const fs = require('fs');
const _ = require('lodash');
const Table = require('cli-table');
const moment = require('moment');
var inquirer = require("inquirer");
const location = require('./location');

function offsetDate(originDate, offsetDays) {
    var newDate = new Date(originDate);
    newDate.setDate(newDate.getDate() + offsetDays);
    return newDate;
}
function extract(obj, matchField, extractionField, matches) {
    var result = matches.map((match) => {
        var filtered = _.filter(obj, [matchField, match]);
        return filtered ? filtered[0][extractionField] : null;
    })
    return result;
}
function numberValidator(value) {
    const validate = !Number.isNaN(parseInt(value));
    if (validate) {
        return true;
    }
    else {
        return "Invalid number format!";
    }
}

var defaultDate = () => {
    dt = new Date();
    dt.setDate(dt.getDate() + 1);
    return dt;
}
var questions = [
    {
        type: "input",
        name: "startDate",
        message: "Search start date?",
        default: defaultDate().toDateString(),
        validate: function (value) {
            if (new Date(value) == "Invalid Date") {
                return "Please enter a valid date";
            }
            else {
                return true;
            }
        },
        filter: function (value) {
            return new Date(value);
        }
    }, 
    {
        type: "list",
        name: "location",
        message: "pickup location?",
        choices: location.getNameList(),
        filter: function (value) {
            return location.getLocationObject(value);
        }
    },
    {
        type: "input",
        name: "time",
        message: "When to rent and return?",
        default: "15:00",
        validate: function (value) {
            return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(value) ? true : "Invalid time!"
        }
    },
    {
        type: "input",
        name: "rentDays",
        message: "How many days to rent?",
        validate: numberValidator,
        default: 7,
        filter: function (value) {
            return parseInt(value);
        }
    },
    {
        type: "input",
        name: "searchDays",
        message: "How many days afterwards to search?",
        default: 7,
        validate: numberValidator,
        filter: function (value) {
            return parseInt(value);
        }
    }
];

let result = [];
let answers;
var requestBody = { "lastName": "", "showRentalAgreement": false, "goldAnytimeRes": false, "forceResHomePage": "", "href": "/rentacar/rest/home/form", "confirmationNumber": "", "arrivingUpdate": "", "defaultTab": "", "militaryClock": 0, "majorAirport": "", "returnAtDifferentLocationCheckbox": "", "pickupLocation": "London - 460 York Street", "dropoffLocation": "", "inpPickupAutoFill": "", "inpPickupStateCode": "", "inpPickupCountryCode": "", "inpPickupSearchType": "", "inpPickupIsServedBy": "N", "inpPickupHasSpecialInstruction": "N", "inpDropoffAutoFill": "", "inpDropoffStateCode": "", "inpDropoffCountryCode": "", "inpDropoffSearchType": "", "pickupHiddenEOAG": "YXUC03", "dropoffHiddenEOAG": "", "memberOtherCdpField": "", "cdpField": "1826991", "corporateRate": "", "officialTravel": "", "pcNumber": "", "typeInRateQuote": "", "cvNumber": "", "itNumber": "", "originalRqCheckBox": "", "checkDiscount": "on", "pickupDay": "03/17/2017", "pickupTime": "17:00", "dropoffDay": "03/24/2017", "dropoffTime": "17:00", "no1ClubNumber": "", "selectedCarType": "ACAR", "ageSelector": "23", "redeemPoints": "", "fromLocationSearch": false, "pickupDayStandard": "2017/03/16", "dropoffDayStandard": "2017/03/23", "memberSelectedCdp": "", "cdpRadioButton": "" };
(async function () {
    answers = await inquirer.prompt(questions);
    loc = answers.location;
    requestBody.pickupLocation = loc.internalName;
    requestBody.pickupHiddenEOAG = loc.EOAG;

    for (let i = 0; i < answers.searchDays; i++) {
        let pickupDate = moment(new Date(answers.startDate));
        pickupDate.add(i, 'day');
        
        console.log(`Processing ${pickupDate.format('M/D/YYYY')}`);
        requestBody.pickupDayStandard = pickupDate.format('M/D/YYYY');
        requestBody.pickupDay = pickupDate.format('M/D/YYYY');

        let dropOffDate = moment(pickupDate);
        dropOffDate.add(answers.rentDays, 'days');
        requestBody.dropoffDayStandard = dropOffDate.format('M/D/YYYY');
        requestBody.dropoffDay = dropOffDate.format('M/D/YYYY');

        requestBody.pickupTime = answers.time;
        requestBody.dropoffTime = answers.time;

        try {
            const response = await rp("http://www.hertz.ca/rentacar/rest/hertz/v2/itinerary/vehicles", {
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Origin": "https://www.hertz.ca",
                    "X-Requested-With": "XMLHttpRequest",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
                    "Content-Type": "application/json",
                    "Referer": "https://www.hertz.ca/rentacar/reservation/",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "en-US,en;q=0.8,zh;q=0.6"
                },
                encoding: "utf-8",
                method: "POST",
                body: requestBody,
                json: true,
                gzip: true
            });
            vehicleList = response.data.model.vehicles;
            fs.appendFileSync('output.txt', response);
            if(vehicleList) {
                result.push(vehicleList);
            }
        } catch (error) {
            fs.writeFileSync('error.txt', error.toString());
        }

        await delay(1000);
    }


    var resultObject =
        result.map((carList, index) => {

            let dailyCarPrice = carList.map(car => {
                let quotes = car.quotes.filter((el) => el);
                let price = quotes.reduce((acc, val) => val.approxTotalPrice < acc ? val.approxTotalPrice : acc, 99999);
                let startDate = offsetDate(answers.startDate, index);
                return { type: car.carTypeDisplay, price: price, startDate: startDate.toLocaleDateString("en-us") };
            });
            return dailyCarPrice;
        })
    var flt = _.flatten(resultObject);

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
    console.log(`Pickup location: ${answers.location.name}`);
    console.log(table.toString());
})();
