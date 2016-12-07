var bar = function(rooms, room_i, mod_i, cost) {
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
    // console.log("1");
    // console.log(arr_to_be_sum);
    if (room_i == 0){
        console.log('   Bar for Home');
        for (var i = 1; i < rooms.length; i++){
            room = rooms[i];   //not the Home, but other rooms
            arr_to_be_sum = [];
            for (var j = 0; j < room.data.length; j++){
                for (var k = 0; k < cost.length; k++){
                    if(cost[k].device == room.data[j].device){
                        cost_per_h = cost[k].cost_per_h;
                        // console.log(cost[k].device + " : " + String(cost_per_h));
                        break;
                    }
                }
                time_period = room.data[j].time; //.filter(function(n){ return n != undefined })
                arr_to_be_sum.push(room.data[j].data.map(function (x) {
                    return Math.round(x/60 * cost_per_h);
                }));
                // console.log(room.data[j].data);
            }
            // console.log("2");
            // console.log(arr_to_be_sum);
            data_series.push({
                pointWidth: 8,
                name: room.name,
                data: sumArrayElements(arr_to_be_sum),
            });
            // console.log("3");
            // console.log(arr_to_be_sum);
        }
        // console.log(time_period);
        // console.log(arr_to_be_sum);
        // data_series.sort(function (a,b) {
        //     // console.log('   sorting data_series');
        //     return b.data.reduce(function(a, b) { return a + b; }) - a.data.reduce(function(a, b) { return a + b; });
        // });
        // console.log(data_series);
    } else {
        console.log('   Areaspline for '+room.name);
        for (var i = 0; i < room.data.length; i++){
            time_period = room.data[i].time;
            for (var k = 0; k < cost.length; k++){
                if(cost[k].device == room.data[i].device){
                    cost_per_h = cost[k].cost_per_h;
                    // console.log(cost[k].device + " : " + String(cost_per_h));
                    break;
                }
            }
            data_series.push({
                pointWidth: 8,
                name: room.data[i].device.capitalize(),
                data: room.data[i].data.map(function (x) {
                    return Math.round(x/60 * cost_per_h);
                }),
            });
            arr_to_be_sum.push(room.data[i].data.map(function (x) {
                    return Math.round(x/60 * cost_per_h);
                }));
        }
        // data_series.push({
        //     name: room.name+ ' Total Usage',
        //     data: sumArrayElements(arr_to_be_sum),
        // });
    }
    data_series.sort(function (a,b) {
        // console.log('   sorting data_series');
        return b.data.reduce(function(a, b) { return a + b; }) - a.data.reduce(function(a, b) { return a + b; });
    });

    time_period = time_period.map(function (x) {
        return x.substring(5, 10);
    });
    // // var tmp = [data1, data2];
    // var room = rooms[1];
    // if (room.data[0]) {
    //     var data = room.data[0];
    //     console.log('here');
    //     console.log(data.device);
    //     console.log(data.data);
    //     var data3 = {
    //         name: data.device,
    //         data: data.data,
    //     };
    //     data_series.push(data3);
    //     // console.log(tmp);
    // }
    // var data = room.data[0];
    // var cat = data.time;
    room = rooms[room_i];

    console.log()
    // $("#" + room.modules[mod_i].el_id).highcharts({
    room.modules[mod_i].chart = Highcharts.chart(room.modules[mod_i].el_id, {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Energy Consumption'
        },
        xAxis: {
            categories: time_period,
            crosshair: true,
            max : time_period.length-1,
        },
        yAxis: {
            title: {
                text: 'Cents'
            }
        },
        rangeSelector: {
                selected: 1
            },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} cents</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        credits: {
            enabled: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: data_series,
        exporting: {
            buttons: {
                customButton: {
                    x: 0,
                    onclick: function() {
                        this.update({
                            chart: {
                                inverted: false,
                                polar: false,
                            },
                            subtitle: {}
                        });
                    },
                    symbol: 'circle',
                    text: 'Standard',
                },
                customButton1: {
                    x: 0,
                    y: 30,
                    onclick: function() {
                        this.update({
                            chart: {
                                inverted: true,
                                polar: false,
                            },
                            subtitle: {}
                        });
                    },
                    symbol: 'circle',
                    text: 'Inverted',
                },
                // customButton2: {
                //     x: 0,
                //     y: 60,
                //     onclick: function() {
                //         this.update({
                //             chart: {
                //                 inverted: false,
                //                 polar: true,
                //             },
                //             subtitle: {}
                //         });
                //     },
                //     symbol: 'circle',
                //     text: 'Polar',
                // },
            }

        }
    });
};
