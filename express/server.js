'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

require('encoding');

const fetch = require('node-fetch').default;
const cheerio = require('cheerio');
var fs = require('fs');

const router = express.Router();
const port = process.env.PORT || 3000;

function padLeadingZeros(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

router.get('/', (req, res) => {
  var raw
  if (!req.query.date) {
    req.query.date = padLeadingZeros(new Date().getDate(), 2) + '' + padLeadingZeros((new Date().getMonth() + 1), 2) + '' + (new Date().getFullYear() + 543)
    raw = JSON.stringify({
      date: padLeadingZeros(new Date().getDate(), 2),
      month: padLeadingZeros((new Date().getMonth() + 1), 2),
      year: new Date().getFullYear()
    });
  } else {
    raw = JSON.stringify({
      date: req.query.date.substr(0, 2),
      month: req.query.date.substr(2, 2),
      year: parseInt(req.query.date.substr(4, 4)) - 543
    });
  }
  var date = new Date(parseInt(req.query.date.substr(4, 4)) - 543, parseInt(req.query.date.substr(2, 2)) - 1, parseInt(req.query.date.substr(0, 2)) + 1);
  var today = new Date();
  //if (req.query.date.substring(4, 8) == new Date().getFullYear() + 543) {
  if (date.getTime() === today.getTime() || date > today) {
    if (req.query.from !== undefined) {
      fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/index3?date=' + req.query.date + '&from')
        .then(res => res.json())
        .then((body) => {
          res.send(body)
        })
    } else {
      fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/index3?date=' + req.query.date)
        .then(res => res.json())
        .then((body) => {
          res.send(body)
        })
    }
  } else {
    var requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: 'follow'
    };

    fetch("https://www.glo.or.th/api/lottery/getLotteryAward", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result["response"] != null) {
          let data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
          data[0][1] = result["response"]["data"]["first"]["number"][0]["value"]
          for (let [index, val] of result["response"]["data"]["last3f"]["number"].entries()) {
            data[1][index + 1] = val["value"]
          }
          for (let [index, val] of result["response"]["data"]["last3b"]["number"].entries()) {
            data[2][index + 1] = val["value"]
          }
          data[3][1] = result["response"]["data"]["last2"]["number"][0]["value"]
          for (let [index, val] of result["response"]["data"]["near1"]["number"].entries()) {
            data[4][index + 1] = val["value"]
          }
          for (let [index, val] of result["response"]["data"]["second"]["number"].entries()) {
            data[5][index + 1] = val["value"]
          }
          for (let [index, val] of result["response"]["data"]["third"]["number"].entries()) {
            data[6][index + 1] = val["value"]
          }
          for (let [index, val] of result["response"]["data"]["fourth"]["number"].entries()) {
            data[7][index + 1] = val["value"]
          }
          for (let [index, val] of result["response"]["data"]["fifth"]["number"].entries()) {
            data[8][index + 1] = val["value"]
          }
          if (req.query.from !== undefined) {
            switch (req.query.date.substr(2, 2)) {
              case '01':
                monthtext = "มกราคม";
                break;
              case '02':
                monthtext = "กุมภาพันธ์";
                break;
              case '03':
                monthtext = "มีนาคม";
                break;
              case '04':
                monthtext = "เมษายน";
                break;
              case '05':
                monthtext = "พฤษภาคม";
                break;
              case '06':
                monthtext = "มิถุนายน";
                break;
              case '07':
                monthtext = "กรกฎาคม";
                break;
              case '08':
                monthtext = "สิงหาคม";
                break;
              case '09':
                monthtext = "กันยายน";
                break;
              case '10':
                monthtext = "ตุลาคม";
                break;
              case '11':
                monthtext = "พฤศจิกายน";
                break;
              case '12':
                monthtext = "ธันวาคม";
                break;
            }

            data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
          }
          res.send(data)
        } else {
          var date = new Date(parseInt(req.query.date.substr(4, 4)) - 543, parseInt(req.query.date.substr(2, 2)) - 1, parseInt(req.query.date.substr(0, 2)) + 1);
          var thatdate = new Date(2010, 02 - 1, 16 + 1);
          if (date.getTime() === thatdate.getTime() || date < thatdate) {
            if (req.query.from !== undefined) {
              fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/index2?date=' + req.query.date + '&from')
                .then(res => res.json())
                .then((body) => {
                  res.send(body)
                })
            } else {
              fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/index2?date=' + req.query.date)
                .then(res => res.json())
                .then((body) => {
                  res.send(body)
                })
            }
          } else {
            let data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
            res.send(data)
          }
        }
      })
      .catch(error => {
        /*let data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        res.send(data)*/
        if (req.query.from !== undefined) {
          fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/index3?date=' + req.query.date + '&from')
            .then(res => res.json())
            .then((body) => {
              res.send(body)
            })
        } else {
          fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/index3?date=' + req.query.date)
            .then(res => res.json())
            .then((body) => {
              res.send(body)
            })
        }
      });
  }
});

router.get('/index2', (req, res) => {
  if (!req.query.date) {
    req.query.date = padLeadingZeros(new Date().getDate(), 2) + '' + padLeadingZeros((new Date().getMonth() + 1), 2) + '' + (new Date().getFullYear() + 543)
  }
  if (req.query.date.substring(4, 8) == new Date().getFullYear() + 543) {
    if (req.query.from !== undefined) {
      fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/index3?date=' + req.query.date + '&from')
        .then(res => res.json())
        .then((body) => {
          res.send(body)
        })
    } else {
      fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/index3?date=' + req.query.date)
        .then(res => res.json())
        .then((body) => {
          res.send(body)
        })
    }
  } else {
    let data = ""
    let monthtext
    switch (req.query.date.substring(2, 4)) {
      case '01': monthtext = "มกราคม"; break;
      case '02': monthtext = "กุมภาพันธ์"; break;
      case '03': monthtext = "มีนาคม"; break;
      case '04': monthtext = "เมษายน"; break;
      case '05': monthtext = "พฤษภาคม"; break;
      case '06': monthtext = "มิถุนายน"; break;
      case '07': monthtext = "กรกฎาคม"; break;
      case '08': monthtext = "สิงหาคม"; break;
      case '09': monthtext = "กันยายน"; break;
      case '10': monthtext = "ตุลาคม"; break;
      case '11': monthtext = "พฤศจิกายน"; break;
      case '12': monthtext = "ธันวาคม"; break;
    }
    try {
      if (req.query.fresh !== undefined) {
        fs.unlinkSync('/tmp/' + req.query.date + '.txt');
      }
    } catch (err) {

    }
    var fileContents = null;
    try {
      fileContents = fs.readFileSync('/tmp/' + req.query.date + '.txt');
    } catch (err) {

    }
    if (fileContents) {
      data = JSON.parse(fileContents)
      if (req.query.from !== undefined) {
        data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
      }
      //res.send(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(data));
      res.end();
    } else {
      fetch('https://www.myhora.com/%E0%B8%AB%E0%B8%A7%E0%B8%A2/%E0%B8%87%E0%B8%A7%E0%B8%94-' + req.query.date.substring(0, 2) + '-' + encodeURI(monthtext) + '-' + req.query.date.substring(4, 8) + '.aspx', { redirect: 'error' })
        .then(res => res.text())
        .then((body) => {
          data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
          let $ = cheerio.load(body)

          let numberpush = []

          $('.lot-dc').toArray().forEach(element => {
            try {
              //console.log(element.firstChild.data)
              numberpush.push(element.firstChild.data)
            } catch (error) {

            }
          });

          if ($('div').toArray()[2] == null) {
            //res.send(data)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data));
            res.end();
            return
          }

          let threefirst = []
          let threeend = []

          data[0][1] = numberpush[0]
          numberpush.shift()
          if (numberpush[0].split(" ").length > 2) {
            threeend = numberpush[0].split(" ")
            data[2][1] = threeend[0].replace(/\xc2\xa0/, '');
            data[2][2] = threeend[1].replace(/\xc2\xa0/, '');
            data[2][3] = threeend[2].replace(/\xc2\xa0/, '');
            data[2][4] = threeend[3].replace(/\xc2\xa0/, '');
          } else {
            threefirst = numberpush[0].split(" ")
            data[1][1] = threefirst[0].replace(/\xc2\xa0/, '');
            data[1][2] = threefirst[1].replace(/\xc2\xa0/, '');
          }
          numberpush.shift()
          if (numberpush[0].length == 2) {
            data[3][1] = numberpush[0]
            numberpush.shift()
          } else {
            threeend = numberpush[0].split(" ")
            data[2][1] = threeend[0].replace(/\xc2\xa0/, '');
            data[2][2] = threeend[1].replace(/\xc2\xa0/, '');
            numberpush.shift()
            data[3][1] = numberpush[0]
            numberpush.shift()
          }
          data[4][1] = padLeadingZeros((data[0][1] - 1), 6);
          data[4][2] = padLeadingZeros((data[0][1] + 1), 6);

          let wave = 5;
          let minwave = 0;
          let maxwave = 5;

          for (const type of numberpush) {
            if (wave >= 5) {
              if (minwave < maxwave) {
                minwave++;
                data[wave][minwave] = type
              }
            }
            if (minwave == maxwave && wave == 5) {
              minwave = 0;
              maxwave = 10;
              wave = 6;
            }
            if (minwave == maxwave && wave == 6) {
              minwave = 0;
              maxwave = 50;
              wave = 7;
            }
            if (minwave == maxwave && wave == 7) {
              minwave = 0;
              maxwave = 100;
              wave = 8;
            }
          }

          if ($('div').toArray()[2].firstChild.data != null && $('div').toArray()[2].firstChild.data != ' เวลา 14:30-16:00น.') {
            fs.appendFile('/tmp/' + req.query.date + '.txt', JSON.stringify(data), function (err) {
              if (err) throw err;
              //console.log('Saved!');
              if (req.query.from !== undefined) {
                data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
              }
              //res.send(data)
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify(data));
              res.end();
            });
          } else {
            if (req.query.from !== undefined) {
              data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
            }
            //res.send(data)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data));
            res.end();
          }
        }).catch(error => {
          //console.log(error);
          data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(data));
          res.end();
        });
    }
  }

  /*res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();*/
});

router.get('/index3', (req, res) => {
  if (!req.query.date) {
    req.query.date = padLeadingZeros(new Date().getDate(), 2) + '' + padLeadingZeros((new Date().getMonth() + 1), 2) + '' + (new Date().getFullYear() + 543)
  }
  try {
    if (req.query.fresh !== undefined) {
      fs.unlinkSync('/tmp/' + req.query.date + '.txt');
    }
  } catch (err) {

  }
  let monthtext
  var fileContents = null;
  try {
    fileContents = fs.readFileSync('/tmp/' + req.query.date + '.txt');
  } catch (err) {

  }
  if (fileContents) {
    data = JSON.parse(fileContents)
    if (req.query.from !== undefined) {
      switch (req.query.date.substr(2, 2)) {
        case '01': monthtext = "มกราคม"; break;
        case '02': monthtext = "กุมภาพันธ์"; break;
        case '03': monthtext = "มีนาคม"; break;
        case '04': monthtext = "เมษายน"; break;
        case '05': monthtext = "พฤษภาคม"; break;
        case '06': monthtext = "มิถุนายน"; break;
        case '07': monthtext = "กรกฎาคม"; break;
        case '08': monthtext = "สิงหาคม"; break;
        case '09': monthtext = "กันยายน"; break;
        case '10': monthtext = "ตุลาคม"; break;
        case '11': monthtext = "พฤศจิกายน"; break;
        case '12': monthtext = "ธันวาคม"; break;
      }

      data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
    }
    //res.send(data);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(data));
    res.end();
  } else {
    fetch('https://news.sanook.com/lotto/check/' + req.query.date + '/', { redirect: 'error' })
      .then(res => res.text())
      .then((body) => {
        let data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        let $ = cheerio.load(body)

        data[0][1] = $('strong').toArray()[0].firstChild.data
        data[1][1] = $('strong').toArray()[1].firstChild.data
        data[1][2] = $('strong').toArray()[2].firstChild.data
        data[2][1] = $('strong').toArray()[3].firstChild.data
        data[2][2] = $('strong').toArray()[4].firstChild.data
        data[3][1] = $('strong').toArray()[5].firstChild.data
        data[4][1] = $('strong').toArray()[6].firstChild.data
        data[4][2] = $('strong').toArray()[7].firstChild.data

        let k = 5
        let i = 1
        for (const type of $('span').toArray()) {
          var arrit = type.attribs.class + ''
          if (!arrit.search('lotto__number')) {
            if (k == 5 && i <= 5) {
              data[k][i] = type.firstChild.data
              i++
            } else if (k == 5 && i > 5) {
              k++
              i = 1
            }
            if (k == 6 && i <= 10) {
              data[k][i] = type.firstChild.data
              i++
            } else if (k == 6 && i > 10) {
              k++
              i = 1
            }
            if (k == 7 && i <= 50) {
              data[k][i] = type.firstChild.data
              i++
            } else if (k == 7 && i > 50) {
              k++
              i = 1
            }
            if (k == 8 && i <= 100) {
              data[k][i] = type.firstChild.data
              i++
            }
          }
        }
        if ($('div').toArray()[2].firstChild.data.match('~[0-9]+~')) {
          fs.writeFile('/tmp/' + req.query.date + '.txt', JSON.stringify(data), function (err) {
            if (err) throw err;
            //console.log('Saved!');
            if (req.query.from !== undefined) {
              switch (req.query.date.substr(2, 2)) {
                case '01': monthtext = "มกราคม"; break;
                case '02': monthtext = "กุมภาพันธ์"; break;
                case '03': monthtext = "มีนาคม"; break;
                case '04': monthtext = "เมษายน"; break;
                case '05': monthtext = "พฤษภาคม"; break;
                case '06': monthtext = "มิถุนายน"; break;
                case '07': monthtext = "กรกฎาคม"; break;
                case '08': monthtext = "สิงหาคม"; break;
                case '09': monthtext = "กันยายน"; break;
                case '10': monthtext = "ตุลาคม"; break;
                case '11': monthtext = "พฤศจิกายน"; break;
                case '12': monthtext = "ธันวาคม"; break;
              }

              data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
            }
            //res.send(data)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data));
            res.end();
          });
        } else {
          if (req.query.from !== undefined) {
            switch (req.query.date.substr(2, 2)) {
              case '01': monthtext = "มกราคม"; break;
              case '02': monthtext = "กุมภาพันธ์"; break;
              case '03': monthtext = "มีนาคม"; break;
              case '04': monthtext = "เมษายน"; break;
              case '05': monthtext = "พฤษภาคม"; break;
              case '06': monthtext = "มิถุนายน"; break;
              case '07': monthtext = "กรกฎาคม"; break;
              case '08': monthtext = "สิงหาคม"; break;
              case '09': monthtext = "กันยายน"; break;
              case '10': monthtext = "ตุลาคม"; break;
              case '11': monthtext = "พฤศจิกายน"; break;
              case '12': monthtext = "ธันวาคม"; break;
            }

            data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
          }
          //res.send(data)
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(data));
          res.end();
        }
      })
      .catch((err) => {
        let data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        //res.send(data)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(data));
        res.end();
        console.log(err)
      });
  }

  /*res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('<h1>Hello from Express.js! 2</h1>');
  res.end();*/
});

router.get('/reto', (req, res) => {
  fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/?date=' + padLeadingZeros(new Date().getDate(), 2) + '' + padLeadingZeros((new Date().getMonth() + 1), 2) + '' + (new Date().getFullYear() + 543))
    .then(res => res.json())
    .then((body) => {
      if (body[0][1] === "XXXXXX" || body[0][1] === "xxxxxx") {
        //res.send('yes')
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('yes');
        res.end();
      } else {
        //res.send('no')
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('no');
        res.end();
      }
    })
});

router.get('/god', async (req, res) => {
  /*let year = 2533;
  let preyearlist = [];
  let preyearsuperlist = [];
  let yearlist = [];
  let nextyear = new Date().getFullYear() + 543;
  let channel = [];
  //let jdata
  let countloveme = 0
  var fileContents = null;
  try {
    fileContents = fs.readFileSync('/tmp/cache.txt');
  } catch (err) {
  }
  if (fileContents) {
    yearlist = JSON.parse(fileContents);
    if (
      yearlist[yearlist.length - 1].substring(4, 8) ==
      new Date().getFullYear() + 543
    ) {
      year = new Date().getFullYear() + 543;
    } else {
      year = yearlist[yearlist.length - 1].substring(4, 8)
    }
    yearlist.forEach(function (value, i) {
      if (
        value.substring(4, 8) ==
        year
      ) {
        countloveme--;
      }
    });
    yearlist.splice(countloveme);
  }
  let day
  while (year <= nextyear) {
    channel = []
    for (let i = 0; i < 10; i++) {
      preyearsuperlist = [];
      preyearlist = [];
      let peryear = [];
      let ayear = year + i
      if (ayear > nextyear) {
        break
      }
      await fetch('https://www.myhora.com/%E0%B8%AB%E0%B8%A7%E0%B8%A2/%E0%B8%9B%E0%B8%B5-' + ayear + '.aspx')
        .then(res => res.text())
        .then((body) => {
          var $ = cheerio.load(body);
          for (const val of $('font').toArray()) {
            if (val.firstChild.data.indexOf('ตรวจสลากกินแบ่งรัฐบาล') > -1) {
              day = val.firstChild.data.split(" ").splice(2)
              let monthnum
              switch (day[2]) {
                case 'มกราคม': monthnum = "01"; break;
                case 'กุมภาพันธ์': monthnum = "02"; break;
                case 'มีนาคม': monthnum = "03"; break;
                case 'เมษายน': monthnum = "04"; break;
                case 'พฤษภาคม': monthnum = "05"; break;
                case 'มิถุนายน': monthnum = "06"; break;
                case 'กรกฎาคม': monthnum = "07"; break;
                case 'สิงหาคม': monthnum = "08"; break;
                case 'กันยายน': monthnum = "09"; break;
                case 'ตุลาคม': monthnum = "10"; break;
                case 'พฤศจิกายน': monthnum = "11"; break;
                case 'ธันวาคม': monthnum = "12"; break;
              }
              peryear.unshift(padLeadingZeros(day[0], 2) + monthnum + day[3])
              preyearsuperlist.unshift(padLeadingZeros(day[0], 2) + monthnum + day[3])
            }
          }
          for (const val of peryear) {
            yearlist.push(val)
          }
          for (const val of preyearsuperlist) {
            preyearlist.push(val)
            try {
              if (day[3] == new Date().getFullYear() + 543) {
                fs.unlinkSync('/tmp/' + req.query.date + '.txt');
                console.log('yes this year')
              }
            } catch (err) {

            }
            fs.writeFile('/tmp/' + day[3] + '.txt', JSON.stringify(preyearlist), function (err) {
              if (err) throw err;
            });
          }
        })
    }
    year += 10
  }
  fs.writeFile('/tmp/cache.txt', JSON.stringify(yearlist), function (err) {
    if (err) throw err;
    //res.send(yearlist)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(yearlist));
    res.end();
  });*/
  if (req.query.format == "thtext") {
    fetch('https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/godthtext')
      .then(res => res.json())
      .then((body) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(body));
        res.end();
      })
  } else if (req.query.format == "combothtext") {
    fetch('https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/godcombothtext')
      .then(res => res.json())
      .then((body) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(body));
        res.end();
      })
  } else {
    fetch('https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/god')
      .then(res => res.json())
      .then((body) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(body));
        res.end();
      })
  }
  /*fetch('https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/god')
    .then(res => res.json())
    .then((body) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(body));
      res.end();
    })*/
});

router.get('/gdpy', (req, res) => {
  let peryear = []
  let yearlist = []
  var fileContents = null;
  try {
    if (req.query.year == new Date().getFullYear() + 543) {
      fs.unlinkSync('/tmp/' + req.query.year + '.txt');
      console.log('yes this year')
    }
    fileContents = fs.readFileSync('/tmp/' + req.query.year + '.txt');
  } catch (err) {

  }
  if (fileContents) {
    res.send(JSON.parse(fileContents));
  } else {
    fetch('https://www.myhora.com/%E0%B8%AB%E0%B8%A7%E0%B8%A2/%E0%B8%9B%E0%B8%B5-' + req.query.year + '.aspx')
      .then(res => res.text())
      .then((body) => {
        var $ = cheerio.load(body);
        for (const val of $('font').toArray()) {
          if (val.firstChild.data.indexOf("ตรวจสลากกินแบ่งรัฐบาล") > -1) {
            let day = val.firstChild.data.split(" ").splice(2)
            let monthnum
            switch (day[2]) {
              case 'มกราคม': monthnum = "01"; break;
              case 'กุมภาพันธ์': monthnum = "02"; break;
              case 'มีนาคม': monthnum = "03"; break;
              case 'เมษายน': monthnum = "04"; break;
              case 'พฤษภาคม': monthnum = "05"; break;
              case 'มิถุนายน': monthnum = "06"; break;
              case 'กรกฎาคม': monthnum = "07"; break;
              case 'สิงหาคม': monthnum = "08"; break;
              case 'กันยายน': monthnum = "09"; break;
              case 'ตุลาคม': monthnum = "10"; break;
              case 'พฤศจิกายน': monthnum = "11"; break;
              case 'ธันวาคม': monthnum = "12"; break;
            }
            peryear.unshift(padLeadingZeros(day[0], 2) + monthnum + day[3])
          }
        }
        for (const val of peryear) {
          yearlist.push(val)
        }
        fs.writeFile('/tmp/' + req.query.year + '.txt', JSON.stringify(yearlist), function (err) {
          if (err) throw err;
          //res.send(yearlist)
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(yearlist));
          res.end();
        });
      })
  }
});

router.get('/checklottery', (req, res) => {
  let result = ""
  fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/?date=' + req.query.by)
    .then(res => res.json())
    .then((body) => {
      body.forEach(function (val, x) {
        val.forEach(function (superval, y) {
          if (superval == req.query.search || superval == req.query.search.substr(0, 3) || superval == req.query.search.substr(3, 6) || superval == req.query.search.substr(4, 6) && y != 0) {
            if (x == 0) {
              result = result + "111111,";
            }
            if (x == 1) {
              result = result + "333000,";
            }
            if (x == 2) {
              result = result + "000333,";
            }
            if (x == 3) {
              result = result + "000022,";
            }
            if (x == 4) {
              result = result + "111112,";
            }
            if (x == 5) {
              result = result + "222222,";
            }
            if (x == 6) {
              result = result + "333333,";
            }
            if (x == 7) {
              result = result + "444444,";
            }
            if (x == 8) {
              result = result + "555555,";
            }
          }
        })
      })
      //res.send(result.substring(0, result.length - 1))
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(result.substring(0, result.length - 1));
      res.end();
    })
});

router.get('/lastlot', async (req, res) => {
  let lastdate
  let viewer
  await fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/gdpy?year=' + (new Date().getFullYear() + 543))
    .then(res => res.json())
    .then((body) => {
      lastdate = body[body.length - 1]
    })
  await fetch('https://practical-haibt-8f85b1.netlify.app/.netlify/functions/server/?date=' + lastdate)
    .then(res => res.json())
    .then((body) => {
      if (req.query.info !== undefined) {
        viewer = {
          info: {
            date: lastdate
          },
          win: body[0][1],
          threefirst: body[1][1] + ',' + body[1][2],
          threeend: body[2][1] + ',' + body[2][2],
          twoend: body[3][1]
        }
      } else {
        viewer = {
          win: body[0][1],
          threefirst: body[1][1] + ',' + body[1][2],
          threeend: body[2][1] + ',' + body[2][2],
          twoend: body[3][1]
        }
      }
      //res.send(viewer)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(viewer));
      res.end();
    })
});

router.get('/getchit', (req, res) => {
  let a = []
  fetch('https://www.huayvips.com/luckynumber/')
    .then(res => res.text())
    .then((body) => {
      let $ = cheerio.load(body)
      for (const val of $('img').toArray()) {
        if (val.attribs.src.indexOf('TL') > -1) {
          a.push(val.attribs.src)
        }
        if (val.attribs.src.indexOf('DN') > -1) {
          a.push(val.attribs.src)
        }
        if (val.attribs.src.indexOf('BT') > -1) {
          a.push(val.attribs.src)
        }
        if (a.length == 3) {
          //res.send(a)
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(a));
          res.end();
          return
        }
      }
    })
});

router.get('/finddol', async (req, res) => {
  let channels
  let allwin = []
  if (req.query.search.length > 3) {
    await fetch('https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/tmp/' + req.query.search.toString())
      .then(res => res.json())
      .then((body) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(body));
        res.end();
      }).catch((err) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('[]');
        res.end();
        console.log(err)
        var https = require('follow-redirects').https;

        var options = {
          'method': 'POST',
          'hostname': 'api.github.com',
          'path': '/repos/boyphongsakorn/testrepo/actions/workflows/blank.yml/dispatches',
          'headers': {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + process.env.gtoken,
            'Content-Type': 'application/json',
            'User-Agent': 'PostmanRuntime/7.28.4'
          },
          'maxRedirects': 20
        };

        var reqtwo = https.request(options, function (res) {
          var chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
          });

          res.on("error", function (error) {
            console.error(error);
          });
        });

        var postData = JSON.stringify({
          "inputs": {
            "number": req.query.search.toString()
          },
          "ref": "refs/heads/main"
        });

        reqtwo.write(postData);

        reqtwo.end();
      });
  } else {
    fetch('https://astro.meemodel.com/%E0%B8%A7%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%B0%E0%B8%AB%E0%B9%8C%E0%B9%80%E0%B8%A5%E0%B8%82%E0%B8%AB%E0%B8%A7%E0%B8%A2/' + req.query.search, { redirect: 'error' })
      .then(res => res.text())
      .then((body) => {
        let $ = cheerio.load(body)
        $('td').toArray().forEach(element => {
          let sl = element.firstChild.data
          if (sl != null && sl.split(" ").length == 3 && sl.split(" ")[2] >= 2550) {
            allwin.unshift(sl)
          }

        });
        //res.send(allwin)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(allwin));
        res.end();
      });
  }
});

router.get('/lotnews', async (req, res) => {
  let arrayofnews = [0, 0, 0]
  let check = req.query.count % 3
  if (check != 0) {
    if (check == 1) {
      //ceil number
      arrayofnews[0] = Math.floor(req.query.count / 3)
      arrayofnews[1] = Math.ceil(req.query.count / 3)
      //floor number
      arrayofnews[2] = Math.floor(req.query.count / 3)
    } else {
      //ceil number
      arrayofnews[0] = Math.floor(req.query.count / 3)
      arrayofnews[1] = Math.ceil(req.query.count / 3)
      //floor number
      arrayofnews[2] = Math.floor(req.query.count / 3) + 1
    }
  } else {
    arrayofnews[0] = req.query.count / 3
    arrayofnews[1] = req.query.count / 3
    arrayofnews[2] = req.query.count / 3
  }
  let array = [];
  let response = await fetch('https://www.brighttv.co.th/tag/%e0%b9%80%e0%b8%a5%e0%b8%82%e0%b9%80%e0%b8%94%e0%b9%87%e0%b8%94/feed')
  let xml = await response.text()
  let $ = cheerio.load(xml)
  let news = $('item')
  //loop news 5 time and push to array
  console.log(arrayofnews)
  for (let i = 0; i < arrayofnews[0]; i++) {
    const title = news.eq(i).find('title').text()
    const link = news.eq(i).find('link')[0].next.data
    const description = news.eq(i).find('description').text()
    const pubDate = news.eq(i).find('pubDate').text()
    /*const date = pubDate.slice(0, 10)
    const time = pubDate.slice(11, 19)
    const dateTime = date + ' ' + time*/
    const json = {
      title: title,
      //remove \n and \t in string
      link: link.replace(/\n|\t/g, ''),
      description: description.substring(0, 100) + '...',
      pubDate: pubDate,
    }
    array.push(json)
  }

  response = await fetch('https://www.khaosod.co.th/tag/%e0%b9%80%e0%b8%a5%e0%b8%82%e0%b9%80%e0%b8%94%e0%b9%87%e0%b8%94/feed')
  xml = await response.text()
  $ = cheerio.load(xml)
  news = $('item')
  //loop news 5 time and push to array
  for (let i = 0; i < arrayofnews[1]; i++) {
    const title = news.eq(i).find('title').text()
    const link = news.eq(i).find('link')[0].next.data
    const description = news.eq(i).find('description').text()
    const pubDate = news.eq(i).find('pubDate').text()
    // image
    const image = news.eq(i).find('media\\:thumbnail').attr('url')
    /*const date = pubDate.slice(0, 10)
    const time = pubDate.slice(11, 19)
    const dateTime = date + ' ' + time*/
    const json = {
      title: title,
      //remove \n and \t in string
      link: link.replace(/\n|\t/g, ''),
      description: description.substring(0, 100) + '...',
      image: image,
      pubDate: pubDate,
    }
    array.push(json)
  }

  response = await fetch('https://www.brighttv.co.th/tag/%E0%B8%AB%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%B6%E0%B9%88%E0%B8%87/feed')
  xml = await response.text()
  $ = cheerio.load(xml)
  news = $('item')
  //loop news 5 time and push to array
  for (let i = 0; i < arrayofnews[2]; i++) {
    const title = news.eq(i).find('title').text()
    const link = news.eq(i).find('link')[0].next.data
    const description = news.eq(i).find('description').text()
    const pubDate = news.eq(i).find('pubDate').text()
    /*const date = pubDate.slice(0, 10)
    const time = pubDate.slice(11, 19)
    const dateTime = date + ' ' + time*/
    const json = {
      title: title,
      //remove \n and \t in string
      link: link.replace(/\n|\t/g, ''),
      description: description.substring(0, 100) + '...',
      pubDate: pubDate,
    }
    array.push(json)
  }

  res.send(array)
})

/*router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));*/

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.use('/index2', (req, res) => res.sendFile(path.join(__dirname, '../index2.html')));
app.use('/reto', (req, res) => res.sendFile(path.join(__dirname, '../reto.html')));

module.exports = app;
module.exports.handler = serverless(app);
