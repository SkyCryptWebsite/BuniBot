exports.getBazaarProduct = (query, products) => {
  let resultMatch;
  let itemResults = [];
  for (const key in products) {
    itemResults.push({...products[key]});
  }
  for (const product of itemResults) {
    if(product.name.toLowerCase() == query) {
      resultMatch = product;
    }
    product.tagMatches = 0;
    product.distance = distance(product.name, query, { caseSensitive: false });
    for(const part of query.split(" ")) {
      for(const tag of product.tag) {
        if(tag == part) {
          product.tagMatches++;
        }
      }
    }
  }
  itemResults = itemResults.sort((a, b) => {
      if(a.tagMatches > b.tagMatches) return -1;
      if(a.tagMatches < b.tagMatches) return 1;
      if(a.distance > b.distance) return -1;
      if(a.distance < b.distance) return 1;
  });
  if(!resultMatch) {
    resultMatch = itemResults[0];
  }
  return resultMatch;
}