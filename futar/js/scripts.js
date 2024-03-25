function dataRefresh() {
    var stopID = $('#stopID').val();
    $.ajax({
        type: 'POST',
        url: './status_ajax.php',
        dataType: "json",
        data: {
            'refresh': 'yes',
            'stopID': stopID
        },
        success: function(valasz){
            var jaratszam = 'NULL';
            var celallomas = 'NULL';
            var indulas = 'NULL';
            var tipus = 'NULL';
            var hatterszin = 'NULL';
            var betuszin = 'NULL';
            var i = 0;
            var ts = Math.round((new Date()).getTime() / 1000);
            var temp = 0;
            var pontosindul = 'NULL';
            var h = 0;
            var m = 0;

            $.each(valasz, function(index, item) {
                jaratszam = item['jaratszam'];
                celallomas = item['irany'];
                //celallomas = "EGYEMKETTŐMHÁRMAMNÉGYEMÖTÖM" 26
                
                indulas = item['indulas'];
                tipus = item['jarattipus'];
                hatterszin = item['hatterszin'];
                betuszin = item['betuszin'];
                
                //Pontos indulási idő kimentése - óra:perc
                h = new Date(indulas * 1000).getHours();
                m = new Date(indulas * 1000).getMinutes();
                h = (h<10) ? '0' + h : h;
                m = (m<10) ? '0' + m : m;
                pontosindul = h + ':' + m;
                //-------------------------------------
                temp = indulas - ts;
                indulas = Math.floor(temp/60);
                //kép kiválasztása
                switch(tipus) {
                    case 'bus':
                        $('#ct' + i + '0').html('<img class="jaratkep" alt="jaratkep" src="./assets/img/bus.png">');
                    break;
                    case 'night-bus':
                        $('#ct' + i + '0').html('<img class="jaratkep" alt="jaratkep" src="./assets/img/night-bus.png">');
                        hatterszin = '000000'
                        break;
                    case 'tram':
                        $('#ct' + i + '0').html('<img class="jaratkep" alt="jaratkep" src="./assets/img/tram.png">');
                        break;
                    case 'trolleybus':
                        $('#ct' + i + '0').html('<img class="jaratkep" alt="jaratkep" src="./assets/img/trolleybus.png">');
                        break;
                    case 'rail':
                        $('#ct' + i + '0').html('<img class="jaratkep" alt="jaratkep" src="./assets/img/rail.png">');
                        break;
                    case 'suburban-railway':
                        $('#ct' + i + '0').html('<img class="jaratkep" alt="jaratkep" src="./assets/img/suburban-railway.png">');
                        break;
                    default:
                        $('#ct' + i + '0').html('&nbsp;');
                        $('#ct' + i + '1').html('&nbsp;');
                }
                if(jaratszam == 'empty'){
                    $('#ct' + i + '0').html('&nbsp;');
                }
                else {
                    $('#ct' + i + '1').html('<div class=jaratszam style="background-color:#' + hatterszin + ';color:#' + betuszin + ';">' + jaratszam + '</div>');
                }
                if(jaratszam == '231B'){
                    $('#ct' + i + '2').html('<div class="celallomas kicsitfeljebb">' + celallomas + '</div>');
                } else {
                    $('#ct' + i + '2').html('<div class=celallomas>' + celallomas + '</div>');
                }
                //EZittenni
                if(indulas < 1){
                    $('#ct' + i + '3').html('&nbsp;');
                }
                else {
                    $('#ct' + i + '3').html("<div class=pontosindul>"  + pontosindul + "</div>");
                }
                //----------
                if(indulas < 1){
                    $('#ct' + i + '4').html("<div class=csakkozep><img src='./assets/img/departure.gif' class='indulasjelzo' alt='indulasjelzo'></div>");
                }
                else {
                    $('#ct' + i + '4').html("<div class=indulasiido>"  + indulas + "'" + "</div>");
                }
                switch(stopID) {
                    case 'BKK_F03062':
                        $('#ct' + i + '5').html("<div class=megallofix><img src='./assets/img/bezeredj.png' class='megallojelzo' alt='fazekas'></div>");
                        break;
                    case 'BKK_F03063':
                        $('#ct' + i + '5').html("<div class=megallofix><img src='./assets/img/fazekas.png' class='megallojelzo' alt='fazekas'></div>");
                        break;
                    default:
                        $('#ct' + i + '5').html('&nbsp;');
                }
                i++;
            })
            if (i < 10) {
                for (; i < 10; i++) {
                    $('#ct' + i + '0').html('&nbsp;');
                    $('#ct' + i + '1').html('&nbsp;');
                    $('#ct' + i + '2').html('&nbsp;');
                    $('#ct' + i + '3').html('&nbsp;');
                    $('#ct' + i + '4').html('&nbsp;');
                    $('#ct' + i + '5').html('&nbsp;');
                }
            }


        },
        error: function(valasz) {
            console.log('Valami hiba van.')
            console.log('stopID');
        }
    });
}
setInterval(dataRefresh, 10000);

var span = document.getElementById('clock');

function time() {
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    if(m < 10) {
        m = '0' + m;
    }
    if(s < 10) {
        s = '0' + s;
    }
    if(h < 10) {
        h = '0' + h;
    }
    span.textContent = h + ":" + m;
}
setInterval(time, 1000);
