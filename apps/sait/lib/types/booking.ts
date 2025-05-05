export interface Order {
  promocode_name?: string;
  date: string[];
  interval_id: string[];
  seat: string[][];
  name?: string[];
  surname?: string[];
  birth_date?: string[];
  discount_id?: Record<string, string>[];
  baggage?: Record<string, string[]>;
  phone?: string;
  email?: string;
  currency?: string;
  lang?: string;
}

export interface OrderResponse {
  trip_id: number;
  interval_id: string;
  bus_id: string;
  route_id: string;
  trans: string;
  currency: string;
  order_id: number;
  price_total: number;
  promocode_info: {
    promocode_valid: number;
  };
  reservation_until: string;
  reservation_until_min: string;
  security: string;
  status: string;
  user_id: string;
}
