
function GeoPoint(latitude, longitude) {
  this.latitude = latitude;
  this.longitude = longitude;
  this.toSvgX = function(){
      // console.log(this.x);
    return (this.latitude - -126.5) * 13.2;
  };
  this.toSvgY = function(){
      // console.log(this.longitude);
    return -(this.longitude - 53.3) * 16.5;
  };
}

function City(name, long_, lat_){
    this.name = name;
    this.pos = new GeoPoint(long_, lat_);
}

Date.prototype.yyyymmdd = function() {
  var mm = this.getUTCMonth() + 1; // getMonth() is zero-based
  var dd = this.getUTCDate();
  var yyyy = this.getUTCFullYear();

  return [yyyy,
      (mm>9 ? '' : '0') + mm,
      (dd>9 ? '' : '0') + dd
  ].join('-');
};

Date.prototype.mmddyyyy = function(){
    var mm = this.getUTCMonth() + 1; // getMonth() is zero-based
    var dd = this.getUTCDate();
    var yyyy = this.getUTCFullYear();
    return ['' + mm, '' + dd, yyyy].join('/');
};

Date.prototype.mmddyy = function(){
    var mm = this.getUTCMonth() + 1; // getMonth() is zero-based
    var dd = this.getUTCDate();
    var yy = this.getUTCFullYear().toString().substr(-2);
    return ['' + mm, '' + dd, yy].join('/');
};

Date.prototype.addDays = function(days) {
    this.setUTCDate(this.getUTCDate() + days);
    console.log(this);
    return this;
};


var page = {
    rawData : null,
    dataNodes : [],
    width : 800, height : 500,     // window size
    date_txt_pos : new GeoPoint(680, 500),
    endDateString : '2020-05-12',
    startDateString : "2020-02-22",
    svg : null,
    imgs : null,
    circles : null,
    minSize : 1,

    init : function(){
        document.addEventListener('DOMContentLoaded', function(){

            // Apply date function to button 'apply'
            const startButton = document.getElementById('apply');
            startButton.addEventListener('click', page.applyDate);

            // Add run function to button #run.
            const runButton = document.getElementById('run');
            runButton.addEventListener('click', page.run);

            // Add apply setting function to button #apply.
            const applyButton = document.getElementById('stop');
            applyButton.addEventListener('click', page.stop);

            // Set default end date to today
            document.getElementById('cur_date').value = page.startDateString;

            // load data
            page.loadDataXhr();
        });
    },

    run : function(){
        console.log(" *********** Run! ************");
        interval = 1100;
        endDate = new Date(page.endDateString);

        page.runningEvent = setInterval(function(){

            // change date
            var newDate = page.getCurDate();
            newDate.addDays(1);

            // stop transition
            if(newDate > endDate) {
                page.stop();
                return;
            }

            // change
            document.getElementById('cur_date').value = newDate.yyyymmdd();

            // click apply function
            page.applyDate();

        }, interval);
    },

    stop: function (){
        console.log('Stop interval!!!', page.runningEvent);
        clearInterval(page.runningEvent);
    },

    applyDate : function(){
        page.curDate = page.getCurDate();

        var date_key = page.curDate.mmddyy();
        console.log(date_key);
        page.circles
            .transition()
            .duration(1000)
            .attr('r', function(city){
                var n_confirmed = page.rawData[date_key][city.id];
                if (n_confirmed > 0){
                    return page.minSize + Math.sqrt(n_confirmed) / 7;
                }else{
                    return 0
                }
            })
            .attr('fill', 'red')
            .attr('fill-opacity', '0.5')
        ;

        page.dateText = page.setText(page.curDate);

    },

    loadDataXhr : function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", './load_covid_data', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status == 0) {
                    // Set data.
                    page.rawData = page.parsingRecievedData(xhr);

                    page.svg = page.makeSvg();
                    var svg = page.svg;

                    page.imgs = page.makeMapImg(svg);
                    page.dataNodes = page.initNodes();

                    page.circles = page.makeCircle(svg);
                    page.textObj = page.getDateTextObj(svg);
                }
            }
        };
        xhr.send(null);
    },

    parsingRecievedData : function(rawFile){
            var allText = rawFile.responseText;
            const returnedObject = JSON.parse(allText);

            console.log("result length : " + Object.keys(returnedObject).length);
            console.log('result :', Object.keys(returnedObject));
            // console.log(returnedObject['Combined_Key']);
            return returnedObject;
    },

    getCurDate: function(){
        var date_val = document.getElementById('cur_date').value;
        var date = new Date(date_val);
        console.log("Date_val", date);
        return date
    },

    initNodes : function(){
        var dataNodes = [];
        var data = page.rawData;
        console.log("input data: " + data.length);
        console.log("input data: " + data[0]);

        for (i in data['Combined_Key']) {
            city_name = data['Combined_Key'][i];
            longitude = data['Long_'][i];
            latitude = data['Lat_'][i];

            city = new City(city_name, longitude, latitude);
            city.id = i;
            // console.log(i, city);
            dataNodes.push(city);
        }
        return dataNodes;
    },

    makeCircle : function(svg){
        var circles = svg.selectAll("circle").data(page.dataNodes).enter().append("circle")
            .attr("class", "city")
            .attr('cx', function(d) {
                return d.pos.toSvgX();
            })
            .attr('cy', function(d) {
                return d.pos.toSvgY();
            });

        console.log("Circles are made. ", circles.length);
        return circles;
    },

    makeSvg: function(){
        var contentWrapperDiv = document.getElementById("content_wrapper").innerHTML = '';
        var svg = d3.select("div#content_wrapper").append("svg")
            .attr("width", page.width)
            .attr("height", page.height+30);
        console.log('Make SVG...', svg);
        return svg;
    },

    makeMapImg : function(svg){
        console.log("Make Map img");
        var imgs = svg.selectAll("image").data([0]);

        imgs.enter()
            .append("svg:image")
            // .attr("preserveAspectRatio" , "none")
            .attr("xlink:href", "../static/us.png")
            .attr("x", "0")
            .attr("y", "0")
            .attr("opacity", "0.5")
            .attr("width", page.width)
            .attr("height", page.height);

        return imgs;
    },


    getDateTextObj: function(svg){
        var textObj = svg.selectAll('DateText');
        console.log("Text Ojb:", textObj.size());
        if (textObj.size() == 0){
            textObj = svg.append("text");
        }
        return textObj
    },
    setText: function(dateObj){
        page.textObj
            .attr("class", "DateText")
            .attr("x", page.date_txt_pos.latitude)
            .attr("y", page.date_txt_pos.longitude)
            .text(dateObj.mmddyyyy())
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "black");
    },

};

page.init();


