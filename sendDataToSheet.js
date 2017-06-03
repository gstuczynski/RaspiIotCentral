var google = require('googleapis');
var sheets = google.sheets('v4');

function sendDataToSheet(auth, spreadsheetId, temp, hum, title) {
  d = new Date(), dn = new Date()
  return new Promise((resolve) => {
    if ((d.getDay() == 5 && title.indexOf(d.toLocaleDateString()) < 0) || !spreadsheetId) {
      dn.setDate(dn.getDate() + 7)
      title = d.toLocaleDateString() + "-" + dn.toLocaleDateString()
      resolve(addSheet(auth, title).then(id => {
        return insertData(auth, "Temperature", "Humidity ", id, null, "Arkusz1!A1:C1").then(() => [id, title]);
      }))
    } else {
      resolve([spreadsheetId, title]);
    }
  }).then((arg) => {
    return insertData(auth, temp, hum, arg[0], d, "Arkusz1!A2:C14").then(() => arg);
  })
}
module.exports = sendDataToSheet;

function addSheet(auth, title) {
  return new Promise((resolve, reject) => {
    var request = {
      resource: {
        "properties": {
          "title": title
        }
      },
      auth: auth
    }
    sheets.spreadsheets.create(request, function (err, response) {
      if (err) {
        console.log(err);
        reject('The API returned an error: ' + err);
      }
      resolve(response.spreadsheetId);
    });
  })
}

function insertData(auth, temp, hum, id, d, range) {
  return new Promise((resolve, reject) => {
    var spreadsheetId = id;
    if (!d) {
      d = "Date"
    } else {
      d = d.toLocaleDateString() + " " + d.toLocaleTimeString('pl-PL')
    }
    var request = {
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'RAW',
      resource: {
        "range": range,
        "values": [
          [d, temp, hum]
        ],
      },
      auth: auth
    };

    sheets.spreadsheets.values.append(request, function (err, response) {
      if (err) {
        reject(err)
      }
    });
    resolve(spreadsheetId);
  })
}