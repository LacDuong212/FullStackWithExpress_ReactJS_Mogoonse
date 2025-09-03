import { useEffect, useState } from "react";
import { notification, Card, Spin, Select } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { getProductsApi } from "../utils/api.js";

const { Option } = Select;

const ProductLazyLoad = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(5);

  const fetchProducts = async (pageNum = 1, pageSize = limit) => {
    setLoading(true);
    try {
      const res = await getProductsApi(category || null, pageNum, pageSize);
      if (res.success) {
        if (pageNum === 1) {
          setProducts(res.data.products);
        } else {
          setProducts((prev) => [...prev, ...res.data.products]);
        }
        setTotalPages(res.data.pagination.totalPages);
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

  useEffect(() => {
    setPage(1);
    fetchProducts(1, limit);
  }, [category, limit]);

  useEffect(() => {
    if (page > 1) fetchProducts(page, limit);
  }, [page]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Sản phẩm (Lazy Loading)</h2>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
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
          <span>Số sản phẩm mỗi lần tải: </span>
          <Select value={limit} style={{ width: 100 }} onChange={setLimit}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
          </Select>
        </div>
      </div>

      <InfiniteScroll
        dataLength={products.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={page < totalPages}
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
              key={p._id}
              cover={<img src={p.image} alt={p.name} style={{ height: 200, objectFit: "cover" }} />}
              bordered
              style={{ width: "90%", maxWidth: 400 }}
            >
              <Card.Meta title={p.name} description={`${Number(p.price).toLocaleString()} VND`} />
            </Card>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ProductLazyLoad;
