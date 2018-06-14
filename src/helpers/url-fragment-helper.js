const getAllParameters = () => {
  let query = document.location.hash.substring(1);
  return query.split('&').reduce((result, item) => {
    let parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});
};
const getParameter = (key) => getAllParameters()[key];

export const UrlFragmentHelper = {getAllParameters, getParameter};
