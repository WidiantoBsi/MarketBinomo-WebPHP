// 12/05/2021 - mr.config
$("head").append('<style type="text/css">table.dataTable.hover tbody tr:hover,table.dataTable.display tbody tr:hover{background-color:#c9c9c9}.high_market{padding:10px;box-sizing:border-box}.high_market:nth-child(odd){background-color:#fff}.high_market:nth-child(even){background-color:#fafafa}.high_market.increased{animation:1s increased}.high_market.decreased{animation:1s decreased}@keyframes increased{0%{background:initial}50%{background:#a2ffa9}100%{background:initial}}@keyframes decreased{0%{background:initial}50%{background:#ff6f6f}100%{background:initial}}</style>');
            var columns = [];
            var scrollPosition;
            var rowIndex;
            $(document).ready(function() {
                var response;
                var remote = $('#example').DataTable({
                    "processing": true,
                    'bProcessing': false,
                    'bServerSide': false,
                    "sAjaxSource" : "https://indodax.com/api/summaries",
                    "fnServerData" : function(sSource, aoData, fnCallback) {
                        $.getJSON( sSource, aoData, function (data) { 
                            columnNames = Object.keys(data.tickers);
                            var combie = [];
                            for (var i in columnNames) {
                                var prices_24h  = data.prices_24h[columnNames[i].replace("_","")];
                                var namecur     = columnNames[i];
                                var coinname    = data.tickers[columnNames[i]]['name'];
                                var tickers     = data.tickers[columnNames[i]]['last'];
                                var percent     = ((prices_24h - tickers) / prices_24h * 100).toFixed(2);
                                
                                combie[i] = {
                                        // prices_24h,
                                        namecur,
                                        coinname,
                                        tickers,
                                        percent
                                };

                            }
                            console.log( JSON.parse('{"data":'+JSON.stringify(combie)+'}') );
                            fnCallback( JSON.parse('{"data":'+JSON.stringify(combie)+'}') );
                        } );
                    },
                    "ordering": false,
                    "columns": [
                        { 
                            "data": "nomer",
                            "render": function ( data, type, full, meta ) {
                                return '';
                            },
                        },
                        { 
                            "data": "namecur",
                            "render": function ( data, type, full, meta ) {
                                return '<div id="#'+data.split("_")[0]+'" class="logo_svg-22 '+ data.split("_")[0] +'-color"></div> '+data.replace("_","/").toUpperCase();
                            },
                        },
                        { 
                            "data": "coinname",
                        },
                        // { 
                        //     "data": "prices_24h",
                        //     render: $.fn.dataTable.render.number( '.', '', 0, 'Rp ' ) 
                        // },
                        { 
                            "data": "tickers",
                            render: $.fn.dataTable.render.number( '.', '', 0, 'Rp. ' ) 
                        },
                        { 
                            "data": "percent",
                            "render": function ( data, type, full, meta ) {
                                return +data+'%';
                            }
                        },
                    ],
                    "preDrawCallback": function( settings ) {
                        scrollPosition = $(".dataTables_scrollBody").scrollTop();
                    },
                    "drawCallback": function( settings ) {
                        $(".dataTables_scrollBody").scrollTop(scrollPosition);
                        if(typeof rowIndex != 'undefined') {
                            table.row(rowIndex).nodes().to$().addClass('row_selected');                       
                        }
                    },
                    "paging":         false,
                    "rowCallback": function (row, data, index) {
                        node = this.api().row(row).nodes().to$();
                        if (data['namecur'].split("_")[1] == 'usdt') {
                            $(row).hide();
                        }
                        if(data['percent'] < 0){
                            // set 5 if used prices_24h
                            $('td:eq(4)', row).css({
                                'color': 'green',
                            }).html(data['percent'].replace("-","")+'&#37;<i id="arrow-up" style="font-size:13px;margin-left:5px;">&#9650;</i>');
                            node.addClass('high_market increased');
                            
                        }
                        else if(data['percent'] > 0){
                            // set 5 if used prices_24h
                            $('td:eq(4)', row).css({
                                'color': 'red',
                            }).html(data['percent']+'&#37;<i id="arrow-down" style="font-size:13px;margin-left:5px;">&#9660;</i>');
                            node.addClass('high_market decreased');
                        }
                        else {
                            // set 5 if used prices_24h
                            $('td:eq(4)', row).css({
                                'color': 'grey',
                                'max-width':'20px'
                            }).html(data['percent']+'&#37;<i id="arrow-same" style="font-size:20px;margin-left:5px;">-</i>');
                        }
                            // set 5 if used prices_24h
                        $('td:eq(4)', row).css({
                            'text-align': 'right',
                            'margin': '0 auto',
                            'font-weight':'800',
                            'text-transform':'uppercase'
                        })
                        // set td:eq(0), td:eq(1), td:eq(3), td:eq(4) if used prices_24h
                        $('td:eq(0), td:eq(1), td:eq(3)', row).css({
                            'color': 'black',
                            'text-transform':'uppercase'
                        })
                        $('td:eq(2)', row).css({
                            'color': 'black',
                            'text-transform':'capitalize'
                        })
                    },

                });

                remote.on( 'order.dt search.dt', function () {
                    remote.column(0, {
                        search:'applied', 
                        order:'applied'
                    }).nodes().each( function (cell, i) {
                        cell.innerHTML = i+1+'.';
                    } );
                } ).draw();



                // remote.order.listener('#example th:eq(1)', 0);
                $("#example tbody tr").ready(function(e) {
                    let UPDATE = 30000;
                    var timer2 = "30";
                    var interval = setInterval(function() {
                        // var timer = timer2.split(':');
                        //by parsing integer, I avoid all extra string processing
                        // var minutes = parseInt(timer[0], 10);
                        var seconds = parseInt(timer2, 10);
                        --seconds;
                        // minutes = (seconds < 0) ? --minutes : minutes;
                        // if (minutes < 0) clearInterval(interval);
                        seconds = (seconds < 0) ? 29 : seconds;
                        seconds = (seconds < 10) ? '0' + seconds : seconds;
                        //minutes = (minutes < 10) ?  minutes : minutes;
                        $('.countdown').html(seconds);
                        timer2 = seconds;
                    }, 1000);

                    setInterval( function () {
                        
                        
                        remote.ajax.reload( null, false );
                        
                    }, UPDATE );
                });
            });