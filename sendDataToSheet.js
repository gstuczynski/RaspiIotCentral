var google = require('googleapis');
var sheets = google.sheets('v4');
var v;
function sendDataToSheet(auth, id, temp, hum) {
  d = dn = new Date()
  var spreadsheetId = id

  console.log(spreadsheetId)
  if (d.getDay() == 7 || !spreadsheetId) {
    dn.setDate(dn.getDate() + 7)
    title = d.toLocaleDateString() + "-" + dn.toLocaleDateString()
    addSheet(auth, title).then(id => {
      instertData(auth, "Temperature", "Humidity ", id);
    }).then(id => {
      v = instertData(auth, temp, hum, id, d);
      console.log("d="+v)
    })
  } else {
    console.log(v)
    v =  instertData(auth, temp, hum, spreadsheetId, d)
console.log("c="+v)
  }

}
module.exports = sendDataToSheet;

function addSheet(auth, title) {

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
        return;
      }
      return response.spreadsheetId
    });
}

function instertData(auth, temp, hum, id, d) {
  var spreadsheetId = id;
  if (!d) {
    d = "Date"
  } else {
    d = d.toLocaleDateString() + " " + d.toLocaleTimeString('pl-PL')
  }
  var request = {
    spreadsheetId: spreadsheetId,
    range: 'Arkusz1!A1:B14',
    valueInputOption: 'RAW',

    resource: {
      "range": "Arkusz1!A1:B14",
      "values": [
        [d, temp, hum]
      ],
    },
    auth: auth
  };

  sheets.spreadsheets.values.append(request, function (err, response) {
    if (err) {
      return;
    }
  });
  console.log("xxx="+spreadsheetId)
  return spreadsheetId;
}