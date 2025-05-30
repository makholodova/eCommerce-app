export type FilterOption = {
  key: string;
  name: string;
};

export const productFilters: Record<string, FilterOption[]> = {
  brand: [
    { key: "apple", name: "Apple" },
    { key: "huawei", name: "Huawei" },
    { key: "xiaomi", name: "Xiaomi" },
  ],
  color: [
    { key: "black", name: "Черный" },
    { key: "white", name: "Белый" },
    { key: "gray", name: "Серый" },
    { key: "green", name: "Зеленый" },
  ],
  rom: [
    { key: "rom-512gb", name: "512 ГБ" },
    { key: "rom-256gb", name: "256 ГБ" },
    { key: "rom-128gb", name: "128 ГБ" },
    { key: "rom-64gb", name: "64 ГБ" },
  ],
  ram: [
    { key: "ram-6gb", name: "6 ГБ" },
    { key: "ram-8gb", name: "8 ГБ" },
    { key: "ram-12gb", name: "12 ГБ" },
    { key: "ram-16gb", name: "16 ГБ" },
  ],
};

export const filterLabels: Record<string, string> = {
  brand: "Бренд",
  color: "Цвет",
  rom: "Встроенная память",
  ram: "Оперативная память",
};
