
function yahoo(latitude, longitude, distance = 0, count = 10, category) {
    var gcs = "0";
    switch (category) {
        case 'JPFood':
            gcs = "0101,0106,0107001,0108,0109";
            break;
        case 'ForFood':
            gcs = "0102,0104,0105,0107002,0107003,0107004,0107005";
            break;
        case 'drink':
            gcs = "0110,0119,0120,0121,0122";
            break;
        case 'cafe':
            gcs = "0114,0115,0116,0117,0118,0123";
            break;
        case 'department':
            gcs = "0204";
            break;
        case 'commbinence':
            gcs = "0205001";
            break;
        case 'fashion':
            gcs = "0209,0419";
            break;
        case 'sports':
            gcs = "0301";
            break;
        case 'hotspring':
            gcs = "0418";
            break;
        case 'activity':
            gcs = "0303,0305,0424";
            break;
        case 'transportation':
            gcs = "0306";
            break;
        case 'hospital':
            gcs = "0401";
            break; case 'school':
            gcs = "0406";
            break;
        case 'gov':
            gcs = "0422,0423";
            break;
        case 'shelter':
            gcs = "0425";
            break;
    }
    const fetch = require("node-fetch");
    const APIKey = (`dj00aiZpPVh6OE83a0VCQnhRUCZzPWNvbnN1bWVyc2VjcmV0Jng9NzQ-`);
    var query = `https://map.yahooapis.jp/search/local/V1/localSearch?appid=${APIKey}&output=json
&lat=${String(latitude)}
&lon=${String(longitude)}
&dist=${String(distance)}&sort=geo&results=${String(count)}&gc=${gcs}`;
    console.log(query)
    var hoge = fetch(query)
        .then(response => {
            console.log(response.status); // => 200
            return response.json();
        });
    return hoge;
}