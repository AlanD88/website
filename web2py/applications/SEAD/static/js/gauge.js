var gauge = function(rooms, room_i, mod_i, cost, isInit) {
        var house = 40;
        var room1 = {
            name: 'loading',
            data: 50,
        };
        var room2 = {
            name: 'loading',
            data: 80,
        };
        // console.log(today);


    // 1. all rooms
    // 2. room to add graph (Home)
    // 3. module to add graph (0 in Home)
    //needs to be change here

    //     //Home
    // var room = rooms[room_i];
    // var data_series = [];
    // var time_period = [];

    //Home
    var room = rooms[room_i];
    var data_series = [];
    var time_period = [];
    var arr_to_be_sum = [];
    var cost_per_h = 0;
    // var ratio = 50/rooms.length-1;
    var home_sum = 0;
    var sum_list = [];

    // console.log('Room:');
    // console.log(room_i);
    if (room_i == 0){
        console.log('   Gauge for Home');
        // console.log(rooms.length);
        for (var i = 1; i < rooms.length; i++){
            // console.log('in loop');
            room = rooms[i];   //not the Home, but other rooms
            arr_to_be_sum = [];
            for (var j = 0; j < room.data.length; j++){
                for (var k = 0; k < cost.length; k++){
                    if(cost[k].device == room.data[j].device){
                        cost_per_h = cost[k].cost_per_h;
                        break;
                    }
                }
                // time_period = room.data[j].time; //.filter(function(n){ return n != undefined })
                arr_to_be_sum.push(room.data[j].data.map(function (x) {
                    return Math.round(x/60 * cost_per_h);
                }));
            }
            var sum_per_day = sumArrayElements(arr_to_be_sum);
            var sum = sum_per_day.reduce(function (a,b) {
                    return a+b;
                });
            sum_list.push({
                data: sum,
                name: room.name,
            });
            home_sum += sum;
            // console.log('before push');
            // console.log(sum);
            // data_series.push({
            //     name: room.name,
            //     data: [{
            //             color: Highcharts.getOptions().colors[i],
            //             radius: String((100-ratio*i)) + '%',
            //             innerRadius: String((100-ratio*i)) + '%',
            //             y: sum
            //         }]
            // });
        }
        // data_series.unshift({
        //         name: 'Home',
        //         data: [{
        //                 color: Highcharts.getOptions().colors[0],
        //                 radius: '100%',
        //                 innerRadius: '100%',
        //                 y: home_sum
        //             }]
        //     });
        // console.log('home_sum:');
        // console.log(home_sum);
        // console.log(data_series);
        house = home_sum/100;

        sum_list.sort(function (a,b) {
            // console.log('   sorting data_series');
            return b.data - a.data;
        });
        if(isInit){
            room1 = sum_list[0];
            room2 = sum_list[1];
        }
    }
    else {
        // return;
        console.log('   Gauge for '+room.name);
        for (var i = 0; i < room.data.length; i++){
            // time_period = room.data[i].time;
            for (var k = 0; k < cost.length; k++){
                if(cost[k].device == room.data[i].device){
                    cost_per_h = cost[k].cost_per_h;
                    // console.log(cost[k].device + " : " + String(cost_per_h));
                    break;
                }
            }
            // data_series.push({
            //     name: room.data[i].device.capitalize(),
            //     data: room.data[i].data.map(function (x) {
            //         return Math.round(x/60 * cost_per_h);
            //     }),
            // });
            arr_to_be_sum.push(room.data[i].data.map(function (x) {
                    return Math.round(x/60 * cost_per_h);
                }));
            var sum_per_day = sumArrayElements(arr_to_be_sum);
            var sum = sum_per_day.reduce(function (a,b) {
                    return a+b;
                });
            sum_list.push({
                data: sum,
                name: room.data[i].device.capitalize(),
            });
            home_sum += sum;
        }
        house = home_sum/100;

        sum_list.sort(function (a,b) {
            // console.log('   sorting data_series');
            return b.data - a.data;
        });
        if(isInit){
            room1 = sum_list[0];
            room2 = sum_list[1];
        }
    }
    room = rooms[room_i];




        room.modules[mod_i].chart = Highcharts.chart(room.modules[mod_i].el_id , {
        // $("#" + room.modules[mod_i].el_id).highcharts({


                chart: {
                    type: 'solidgauge',
                    marginTop: 50
                },

                title: {
                    text: 'Electricy Consumption',
                    style: {
                        fontSize: '24px'
                    }
                },

                tooltip: {
                    borderWidth: 0,
                    backgroundColor: 'none',
                    shadow: false,
                    style: {
                        fontSize: '16px'
                    },
                    pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">${point.y}</span>',
                    positioner: function(labelWidth) {
                        return {
                            x: $("#" + room.modules[mod_i].el_id).width() / 2 - labelWidth / 2,
                            y: $("#" + room.modules[mod_i].el_id).height() / 2 - 17
                        };
                    }
                },

                pane: {
                    startAngle: 0,
                    endAngle: 360,
                    background: [{ // Track for Move
                        outerRadius: '112%',
                        innerRadius: '88%',
                        backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0.3).get(),
                        borderWidth: 0
                    }, { // Track for Exercise
                        outerRadius: '87%',
                        innerRadius: '63%',
                        backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                        borderWidth: 0
                    }, { // Track for Stand
                        outerRadius: '62%',
                        innerRadius: '38%',
                        backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.3).get(),
                        borderWidth: 0
                    }]
                },

                yAxis: {
                    min: 0,
                    max: home_sum/100,
                    lineWidth: 0,
                    tickPositions: []
                },

                plotOptions: {
                    solidgauge: {
                        borderWidth: '34px',
                        dataLabels: {
                            enabled: false
                        },
                        linecap: 'round',
                        stickyTracking: false
                    }
                },

                series:
                    [{
                    name: 'Total',
                    borderColor: Highcharts.getOptions().colors[3],
                    data: [{
                        color: Highcharts.getOptions().colors[3],
                        radius: '100%',
                        innerRadius: '100%',
                        y: house
                    }]
                }, {
                    name: room1.name,
                    borderColor: Highcharts.getOptions().colors[0],
                    data: [{
                        color: Highcharts.getOptions().colors[0],
                        radius: '75%',
                        innerRadius: '75%',
                        y: room1.data/100
                    }]
                }, {
                    name: room2.name,
                    borderColor: Highcharts.getOptions().colors[2],
                    data: [{
                        color: Highcharts.getOptions().colors[2],
                        radius: '50%',
                        innerRadius: '50%',
                        y: room2.data/100
                    }]
                }]
            },

            /**
             * In the chart load callback, add icons on top of the circular shapes
             */
            function callback() {

                // Move icon
                this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])

                .translate(190, 26)
                    .add(this.series[2].group);

                // Exercise icon
                this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8, 'M', 8, -8, 'L', 16, 0, 8, 8])

                .translate(190, 61)
                    .add(this.series[2].group);

                // Stand icon
                this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])

                .translate(190, 96)
                    .add(this.series[2].group);
            });

    }
    //just hook up the values here
