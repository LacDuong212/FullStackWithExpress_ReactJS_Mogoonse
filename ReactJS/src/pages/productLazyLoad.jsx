import { useEffect, useState } from "react";
import { notification, Card, Spin, Select, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { searchProductsApi } from "../utils/api.js";

const { Option } = Select;

const ProductLazyLoad = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortPrice, setSortPrice] = useState("");

  const PAGE_SIZE = 5;

  const fetchProducts = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await searchProductsApi({
        keyword: keyword || "",
        category,
        priceRange,
        sortPrice,
        page: reset ? 1 : page,
        limit: PAGE_SIZE,
      });

      if (res.success) {
        const data = res.data.products || [];
        if (reset) {
          setProducts(data);
          setPage(2);
        } else {
          setProducts((prev) => [...prev, ...data]);
          setPage((prev) => prev + 1);
        }

        // nếu ít hơn PAGE_SIZE thì hết sản phẩm
        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        notification.error({
          message: "Error",
          description: res.message || "Không tải được sản phẩm",
        });
      }
    } catch (e) {
      notification.error({
        message: "Error",
        description: e.message,
      });
    }
    setLoading(false);
  };

  // gọi lại khi filter/search thay đổi
  useEffect(() => {
    fetchProducts(true);
  }, [category, keyword, priceRange, sortPrice]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts(true);
  };

  const handleProductClick = (product) => {
    const productId = product._id || product.id;
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sản phẩm (Lazy Loading + Search + Filter)</h2>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
        <div>
          <Input
            placeholder="Tìm sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ width: 200 }}
            onPressEnter={handleSearch}
          />
          <Button type="primary" onClick={() => setKeyword(searchInput)} style={{ marginLeft: 8 }}>
            Tìm
          </Button>
        </div>

        <div>
          <span>Chọn category: </span>
          <Select value={category} style={{ width: 200 }} onChange={setCategory}>
            <Option value="">Tất cả</Option>
            <Option value="Quần áo">Quần áo</Option>
            <Option value="Giày dép">Giày dép</Option>
            <Option value="Phụ kiện">Phụ kiện</Option>
          </Select>
        </div>

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

        <div>
          <span>Sắp xếp giá: </span>
          <Select value={sortPrice} style={{ width: 150 }} onChange={setSortPrice}>
            <Option value="">Mặc định</Option>
            <Option value="asc">Thấp → Cao</Option>
            <Option value="desc">Cao → Thấp</Option>
          </Select>
        </div>
      </div>

      {/* Infinite scroll */}
      <InfiniteScroll
        dataLength={products.length}
        next={() => fetchProducts(false)}
        hasMore={hasMore}
        loader={
          <div style={{ textAlign: "center", margin: 20 }}>
            <Spin size="large" />
          </div>
        }
        endMessage={<p style={{ textAlign: "center" }}>Hết sản phẩm</p>}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {products.map((p) => (
            <Card
              key={p.id || p._id}
              cover={
                <img src={p.image} alt={p.name} style={{ height: 200, objectFit: "cover" }} />
              }
              bordered
              hoverable
              style={{ width: "90%", maxWidth: 400, cursor: "pointer" }}
              onClick={() => handleProductClick(p)}
            >
              <Card.Meta
                title={p.name}
                description={`${Number(p.price).toLocaleString()} VND`}
              />
            </Card>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ProductLazyLoad;
