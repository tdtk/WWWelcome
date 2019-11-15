// Hot Pepper API ( https://webservice.recruit.co.jp/hotpepper/reference.html )

export type HotPepperQuery = {
  lat?: number,
  lng?: number,
  range?: number,
  order?: number
};

export type HotPepperResult = {
  results: {
    api_version: string;
    results_available: number;
    results_returned: number;
    results_start: number;
    shop: Shop[];
  }
};

type Shop = {
  id: string,
  name: string;
  logo_image: string,
  name_kana: string,
  address: string,
  station_name: string,
  ktai_coupon: number,
  lat: number;
  lng: number;
  catch: string;
  photo: {pc: {l: string, m:string, s: string}}
};

export const fetchHotPepper = (query: HotPepperQuery, callbuck: (json: HotPepperResult) => void) => {
  const query_str = Object.keys(query).reduce((pre:string, key: string) => `${pre}&${key}=${query[key as keyof HotPepperQuery]}`, '');
  (window as any)['HotPepperCallBack'] = callbuck;
  const sc = document.createElement("script");
  sc.type = 'text/javascript';
  sc.src = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${process.env['REACT_APP_HOTPEPPER_API_KEY']}${query_str}&format=jsonp&callback=HotPepperCallBack`;
  const parent = document.getElementsByTagName("script")[0];
  parent!.parentNode!.insertBefore(sc, parent);
};