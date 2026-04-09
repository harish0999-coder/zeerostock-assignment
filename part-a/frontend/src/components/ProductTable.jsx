function ProductTable({ results, searched }) {
  if (!searched) return null;

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <h3>No products found</h3>
        <p>Sorry, we couldn't find any products matching your criteria. Try adjusting the filters.</p>
      </div>
    );
  }

  return (
    <div className="results-wrap">
      <p className="results-count">
        {results.length} product{results.length !== 1 ? "s" : ""} found
      </p>
      <div className="table-wrap">
        <table className="product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            {results.map((product) => (
              <tr key={product.id}>
                <td className="id-col">{product.id}</td>
                <td className="name-col">{product.productName}</td>
                <td>
                  <span className="badge">{product.category}</span>
                </td>
                <td className="price-col">${product.price.toFixed(2)}</td>
                <td className="supplier-col">{product.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
