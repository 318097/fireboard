const DATA_URL =
  "https://raw.githubusercontent.com/318097/bubblegum/master/PRODUCTS.json";

const getProducts = async (url = DATA_URL) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const { products = [] } = data || {};
    return products;
  } catch (error) {}
};

export { getProducts };
