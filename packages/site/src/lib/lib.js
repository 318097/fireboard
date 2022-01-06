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

const formatPromotionalProducts = (products = [], appId) => {
  if (!appId) return;
  return {
    current: products.find((product) => product.id === appId),
    others: products.filter(
      (product) => product.id !== appId && product.visibility?.promotion
    ),
  };
};

const getAndFormatPromotionalProducts = async (appId) => {
  const products = await getProducts();
  return formatPromotionalProducts(products, appId);
};

export {
  formatPromotionalProducts,
  getProducts,
  getAndFormatPromotionalProducts,
};
