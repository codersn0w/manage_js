function get_weather(args){
    if (! args[0]){
        return "地点IDが設定されていません";
    }
    if (! args[1] ){
        return "日時が設定されていません";
    }
    if (! args[2] || args[2] != "1"){
        args[2] = "0";
    }
    return new Promise((resolve, reject) => {
        const city = args[0];
        const day = args[1];
        const type = args[2] ;
        getWeather.getWeather( city, day, type).then(( result )=>{
            resolve(result);
        })
    })
}
get_weather(args);