var areaspline = function(rooms, room_i, mod_i) {
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
    // console.log("1");
    // console.log(arr_to_be_sum);
    if (room_i == 0){
        console.log('   Areaspline for Home');
        for (var i = 1; i < rooms.length; i++){
            room = rooms[i];   //not the Home, but other rooms
            arr_to_be_sum = [];
            for (var j = 0; j < room.data.length; j++){
                time_period = room.data[j].time; //.filter(function(n){ return n != undefined })
                arr_to_be_sum.push(room.data[j].data.map(function (x) {
                    return x/60;
                }));
                // console.log(room.data[j].data);
            }
            // console.log("2");
            // console.log(arr_to_be_sum);
            data_series.push({
                name: room.name,
                data: sumArrayElements(arr_to_be_sum)
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
            data_series.push({
                name: room.data[i].device.capitalize(),
                data: room.data[i].data.map(function (x) {
                    return x/60;
                }),
            });
            arr_to_be_sum.push(room.data[i].data.map(function (x) {
                    return x/60;
                }));
        }
        data_series.push({
            name: room.name+ ' Total Usage',
            data: sumArrayElements(arr_to_be_sum),
        });
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

    // $("#" + room.modules[mod_i].el_id).highcharts({
    room.modules[mod_i].chart = Highcharts.chart(room.modules[mod_i].el_id, {
        chart: {
            type: 'areaspline',
            height: 500,
        },
        title: {
            text: ''
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 0,
            y: 0,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: time_period,
            plotBands: [{ // visualize the weekend
                from: 4.5,
                to: 6.5,
                color: 'white'
            }],
            max : time_period.length-1,
        },
        yAxis: {
            title: {
                text: 'hours'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' h'
        },
        credits: {
            enabled: true
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.8
            }
        },
        series: data_series,
    });
};
