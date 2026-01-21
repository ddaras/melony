/**
 * Menu item type
 */
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
};


/**
 * Restaurant menu data
 */
export const MENU: MenuItem[] = [
  {
    id: "1",
    name: "Classic Burger",
    price: 12.99,
    description: "Juicy beef patty with lettuce, tomato, and our special sauce.",
  },
  {
    id: "2",
    name: "Margherita Pizza",
    price: 14.5,
    description: "Fresh mozzarella, basil, and tomato sauce on a thin crust.",
  },
  {
    id: "3",
    name: "Caesar Salad",
    price: 10.99,
    description:
      "Crisp romaine lettuce, croutons, and parmesan cheese with Caesar dressing.",
  },
  {
    id: "4",
    name: "Sushi Platter",
    price: 22.0,
    description: "Assorted fresh sushi and sashimi (12 pieces).",
  },
  {
    id: "5",
    name: "Pasta Carbonara",
    price: 15.99,
    description:
      "Spaghetti with creamy sauce, guanciale, and pecorino romano.",
  },
];
