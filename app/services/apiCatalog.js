import { apiModels, abortFetch } from './apiModels';

export async function getCategories() {
  return apiModels('catalog/categories', 'GET', {
    showChilds: true,
  });
}

export async function getCategoryDetails({ categoryId }) {
  return apiModels('catalog/categories', 'GET', {
    parentCategory: categoryId,
    showChilds: true,
  });
}

export async function getDeliveryMethods({ categoryId }) {
  return apiModels('catalog/deliveryMethods', 'GET', {
    category: categoryId,
  });
}

export async function getSearchTextSuggestions({ searchText }) {
  return apiModels(`catalog/posts/recommendations/${searchText}`, 'GET', {
    page: 1,
    perPage: 10,
  });
}

export async function getMaxPricePerCategory({ categoryId }) {
  return apiModels('catalog/posts/getMaxPrice', 'GET', {
    categories: categoryId,
  });
}

export async function getCustomFilterOptionsList({ url }) {
  return apiModels(`catalog${url}`, 'GET');
}

export async function abortFecth() {
  return abortFetch();
}

export async function getMakeList({ categoryName }) {
  return apiModels('catalog/categoryCatalog', 'GET', {
    categoryName,
    property: 'make',
    showChilds: true,
  });
}

export async function getModelsByMake({ makeId }) {
  return apiModels(`catalog/categoryCatalog/${makeId}`, 'GET');
}

export async function getSupplierDataApi({ userId }) {
  return apiModels(`accounts/users/${userId}`, 'GET', {
    light: 'true',
  });
}

export async function getSupplierProductListApi({ sellerId, page, perPage }) {
  return apiModels(`catalog/v2/posts?page=${page}&perPage=${perPage}&postStatus=active&sellerId=${sellerId}`, 'GET');
}

export async function getCatalogListApi({ userId, page, perPage }) {
  return apiModels('catalog/catalogReseller', 'GET', {
    userId,
    page,
    perPage,
  });
}

export async function getProductsPerCatalogApi({ catalogId }) {
  return apiModels(`catalog/catalogReseller/${catalogId}`, 'GET');
}
