function get_amedas(args){
    const time = args[0];
    const point = args[1];
    const number = args[2];
    if( ["1","3","6","12","24","48","72"].indexOf( time ) < 0 ){
        return time + "時間指定が間違っています";
    }
    return new Promise((resolve, reject) => {
        const options = {
            url: 'http://www.data.jma.go.jp/obd/stats/data/mdrr/pre_rct/alltable/pre' + time + 'h00_rct.csv',
            method: 'GET',
            encoding: null
        };
        request(options, function (error, response, body) {
        if (!error) {
            const converter = new iconv.Iconv('SJIS', 'UTF-8//IGNORE');
            const lines = converter.convert(body).toString().split("
");
            var result = {};
            var tmp;
            for( var i = 1; i < lines.length; i ++){
                tmp = lines[i].split(",");
                result[ tmp[0] ] = tmp;
            }
            if( ! result[point]   ){
                resolve("指定の地点が見つかりません")
            }else if( ! result[point][number] ){
                resolve("取得するデータが見つかりません")
            }else{
                resolve( result[point][number] );
            }
        } else {
            resolve("失敗")
        }
        });
    })
}
get_amedas(args);