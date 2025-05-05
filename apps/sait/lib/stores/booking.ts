import { create } from "zustand";
import { Route } from "../types/route";
import { Passenger } from "../types/passenger";
import { OrderResponse } from "../types/booking";

// define types for state values and actions separately
type State = {
  route?: Route;
  passengers: Passenger[];
  contacts: {
    email: string;
    phone: string;
  };
  orderResponse: OrderResponse | null;
};

type Actions = {
  reset: () => void;
  setRoute: (route: Route) => void;
  setPassengers: (passengers: Passenger[]) => void;
  setContacts: (contacts: { email: string; phone: string }) => void;
  setOrderResponse: (orderResponse: OrderResponse) => void;
};

// define the initial state
const initialState: State = {
  route: undefined,
  passengers: [],
  contacts: {
    email: "",
    phone: "",
  },
  orderResponse: null,
};

// create store
export const useBookingStore = create<State & Actions>()((set, get) => ({
  ...initialState,
  setRoute: (route: Route) => {
    set({ route });
  },
  setPassengers: (passengers: Passenger[]) => {
    set({ passengers });
  },
  setContacts: (contacts: { email: string; phone: string }) => {
    set({ contacts });
  },
  setOrderResponse: (orderResponse: OrderResponse) => {
    set({ orderResponse });
  },
  reset: () => {
    set(initialState);
  },
}));
