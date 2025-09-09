import { useEffect, useState } from "react";
import { notification, Card, Spin, Select, Pagination, Input, Button } from "antd";
import { getProductsApi, searchProductsApi } from "../utils/api.js";

const { Option } = Select;

const ProductPagination = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortPrice, setSortPrice] = useState("");

  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
        const res = await searchProductsApi({
        keyword: keyword || "", // để trống nếu chưa search
        category,
        priceRange,
        sortPrice,
        page: pageNum,
        limit,
      });

      if (res.success) {
        const data = res.data;
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || (data.products?.length || 0));
      } else {
        notification.error({ message: "Error", description: res.message || "Không tải được sản phẩm" });
      }
    } catch (e) {
      notification.error({ message: "Error", description: e.message });
    }
    setLoading(false);
  };

  // Khi thay đổi filter/search/limit → reset page 1
  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [category, limit, keyword, priceRange, sortPrice]);

  // Khi đổi page
  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleSearch = () => setKeyword(searchInput);

  return (
    <div style={{ padding: 20 }}>
      <h2>Sản phẩm (Pagination + Search + Filter)</h2>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
        {/* Search input */}
        <div>
          <Input
            placeholder="Tìm sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ width: 200 }}
            onPressEnter={handleSearch}
          />
          <Button type="primary" onClick={handleSearch} style={{ marginLeft: 8 }}>
            Tìm
          </Button>
        </div>

        {/* Category filter */}
        <div>
          <span>Chọn category: </span>
          <Select value={category} style={{ width: 200 }} onChange={setCategory}>
            <Option value="">Tất cả</Option>
            <Option value="Quần áo">Quần áo</Option>
            <Option value="Giày dép">Giày dép</Option>
            <Option value="Phụ kiện">Phụ kiện</Option>
          </Select>
        </div>

        {/* Price filter */}
        <div>
          <span>Lọc theo giá: </span>
          <Select value={priceRange} style={{ width: 150 }} onChange={setPriceRange}>
            <Option value="">Tất cả</Option>
            <Option value="100">Dưới 100.000</Option>
            <Option value="200">Dưới 200.000</Option>
            <Option value="500">Dưới 500.000</Option>
            <Option value="1000">Dưới 1.000.000</Option>
            <Option value="2000">Dưới 2.000.000</Option>
          </Select>
        </div>

        {/* Sort price */}
        <div>
          <span>Sắp xếp giá: </span>
          <Select value={sortPrice} style={{ width: 150 }} onChange={setSortPrice}>
            <Option value="">Mặc định</Option>
            <Option value="asc">Thấp → Cao</Option>
            <Option value="desc">Cao → Thấp</Option>
          </Select>
        </div>

        {/* Limit per page */}
        <div>
          <span>Số sản phẩm mỗi trang: </span>
          <Select value={limit} style={{ width: 100 }} onChange={setLimit}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
          </Select>
        </div>
      </div>

      {/* Product list */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        {products.length > 0 ? (
          products.map((p) => (
            <Card
              key={p.id || p._id}
              cover={<img src={p.image} alt={p.name} style={{ height: 200, objectFit: "cover" }} />}
              bordered
              style={{ width: "90%", maxWidth: 400 }}
            >
              <Card.Meta title={p.name} description={`${Number(p.price).toLocaleString()} VND`} />
            </Card>
          ))
        ) : (
          !loading && <p>Không có sản phẩm nào</p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Spin size="large" />
        </div>
      )}

      {/* Pagination */}
      <Pagination
        style={{ marginTop: 20, textAlign: "center" }}
        current={page}
        total={totalItems}
        pageSize={limit}
        onChange={setPage}
        showSizeChanger={false}
      />
    </div>
  );
};

export default ProductPagination;
