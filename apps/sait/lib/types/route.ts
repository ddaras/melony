export type Station = {
  lat: string;
  lon: string;
  point_id: string;
  point_name: string;
  station_id: string;
  station_name: string;
  time: string;
  price?: Array<{
    station_id: string;
    price_one_way: number;
  }>;
};

export type Stations = {
  arrival: Station[];
  departure: Station[];
};

export type FreeSeatsInfo = {
  count: {
    sitting: number;
    standing: number;
    current_free_seats_typ: string;
    description: string;
  };
};

export type Route = {
  trans: string;
  trans_type: string;
  interval_id: string;
  route_id: string;
  bus_id: string;
  carrier: string;
  carrier_id: string;
  route_name: string;
  point_from: string;
  point_to: string;
  station_from: string;
  station_to: string;
  date_from: string;
  date_to: string;
  time_from: string;
  time_to: string;
  time_in_way: string;
  price_one_way: number;
  price_two_way: number;
  free_seats: number[];
  free_seats_info: FreeSeatsInfo;
  stations: Stations;
  dispatcher_phone: string;
  need_orderdata: string;
  eticket: string;
  currency: string;
};
