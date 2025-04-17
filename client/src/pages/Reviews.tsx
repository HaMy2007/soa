import React, { useState, useEffect } from "react";
import axios from "axios";
import MainHeadingTitle from "../components/MainHeadingTitle";

interface IMeal {
  name: string;
  note?: string;
  quantity: number;
  price: number;
  status: string;
}

interface IOrder {
  _id: string;
  tableID: string;
  tableNumber?: number;
  totalPrice: number;
  createdTime: string;
  endTime: string;
  orderStatus: string;
  shiftID?: string;
  listMeal?: IMeal[];
}

interface IRevenueResponse {
  total_orders: number;
  total_revenue: number;
  detail_orders: IOrder[];
}

const Reviews: React.FC = () => {
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [revenueData, setRevenueData] = useState<IRevenueResponse | null>(null);
  const [errorRevenue, setErrorRevenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [defaultRevenueData, setDefaultRevenueData] = useState<IRevenueResponse | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);

  useEffect(() => {
    fetchRevenueData({}, true); 
  }, []);

  const fetchRevenueData = async (filters: any = {}, isDefault = false) => {
    setLoading(true);
    setErrorRevenue("");
    try {
      const res = await axios.get<IRevenueResponse>("http://localhost:3001/api/revenue", { params: filters });
      if(isDefault){
        setDefaultRevenueData(res.data);
      }else{
        setRevenueData(res.data);
      }
    } catch (err: any) {
      setErrorRevenue(err?.response?.data?.error || "Lỗi khi lấy doanh thu");
    } finally {
      setLoading(false);
    }
  };

  const handleGetRevenue = async (e: React.FormEvent) => {
    e.preventDefault();
    const filters: any = {};
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    if (shiftId) filters.shift_id = shiftId;
    fetchRevenueData(filters);
  }

  const toggleExpand = (id: string) => {
    setExpandedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const displayData = startDate || endDate || shiftId ? revenueData : defaultRevenueData;

  return (
    <div className="min-h-screen bg-section-hero font-sans p-6 mr-5">
      <div className="flex justify-center mb-5 ">
        <MainHeadingTitle title="Revenue statistics" />
      </div>

      <section className="mb-12 bg-white shadow-lg rounded-lg p-6 ">
        <h2 className="text-2xl font-semibold text-menu-title mb-4">Lịch sử hóa đơn</h2>
        <form
          onSubmit={handleGetRevenue}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Ngày bắt đầu (start_date):</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Ngày kết thúc (end_date):</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
          </div>

          <div className="flex flex-col w-40">
            <label className="mb-1 font-medium">Ca trực:</label>
            <select
              value={shiftId}
              onChange={(e) => setShiftId(e.target.value)}
              className="border border-gray-300 rounded text-sm p-2 h-10"
            >
              <option value="">Chọn ca trực</option>
              <option value="CA1">CA1</option>
              <option value="CA2">CA2</option>
              <option value="CA3">CA3</option>
              <option value="CA4">CA4</option>
              <option value="CA5">CA5</option>
              <option value="Overtime">Overtime</option>
            </select>
          </div>

          <div className="flex flex-col w-40">
            <label className="mb-1 font-medium">&nbsp;</label>
            <button
              type="submit"
              className="bg-orange-400 text-white text-sm rounded hover:bg-orange-600 transition w-full h-10"
            >
              Xem Lịch sử 
            </button>
          </div>
        </form>

        {loading && <p className="mt-2">Đang tải doanh thu...</p>}
        {errorRevenue && <p className="text-red-500 mt-2">{errorRevenue}</p>}

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Kết quả</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center justify-center w-40 h-20 bg-rose-200 text-rose-800 rounded-lg shadow-md">
                <div className="text-center">
                  <p className="font-bold">Tổng số đơn hàng</p>
                  <p className="text-2xl">{displayData?.total_orders ?? 0}</p>
                </div>
              </div>

              <div className="flex items-center justify-center w-40 h-20 bg-rose-200 text-rose-800 rounded-lg shadow-md">
                <div className="text-center">
                  <p className="font-bold">Tổng doanh thu</p>
                  <p className="text-2xl">{displayData?.total_revenue ?? 0}</p>
                </div>
              </div>
            </div>

            {displayData?.detail_orders.length ? (
              <div className="space-y-4">
                {displayData.detail_orders.map((order) => {
                  const isExpanded = expandedOrderIds.includes(order._id);
                  return (
                    <div
                      key={order._id}
                      className="bg-rose-100 rounded-lg p-4 shadow-md"
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-bold text-lg">Order ID: {order._id}</h4>
                        <span className="font-semibold">
                          Trạng thái: {order.orderStatus} 
                        </span>
                      </div>
                      <p className="mb-1">
                        <span className="font-medium">Table Number:</span>{" "}
                        {order.tableNumber ?? "N/A"}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Shift ID:</span>{" "}
                        {order.shiftID ?? "N/A"}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Tổng tiền:</span>{" "}
                        {order.totalPrice}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Thời gian tạo:</span>{" "}
                        {new Date(order.createdTime).toLocaleString()}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Thời gian kết thúc:</span>{" "}
                        {new Date(order.endTime).toLocaleString()}
                      </p>

                      {order.listMeal && order.listMeal.length > 0 && (
                        <button
                          onClick={() => toggleExpand(order._id)}
                          className="mt-3 px-3 py-1 rounded bg-rose-200 hover:bg-rose-300"
                        >
                          {isExpanded ? "Ẩn chi tiết món" : "Xem chi tiết món"}
                        </button>
                      )}

                      {isExpanded && order.listMeal && (
                        <div className="mt-3 bg-white p-3 rounded shadow-inner">
                          <h5 className="font-semibold mb-2">Chi tiết món</h5>
                          {order.listMeal.map((meal, idx) => (
                            <div key={idx} className="mb-1 border-b pb-1">
                              <p>
                                <span className="font-medium">Tên món:</span> {meal.name}
                              </p>
                              <p>
                                <span className="font-medium">Số lượng:</span> {meal.quantity}
                              </p>
                              <p>
                                <span className="font-medium">Giá:</span> {meal.price}
                              </p>
                              {meal.note && (
                                <p>
                                  <span className="font-medium">Ghi chú:</span> {meal.note}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2">Không có đơn hàng nào trong khoảng thời gian này.</p>
            )}
          </div>
      </section>
    </div>
  );
};

export default Reviews;