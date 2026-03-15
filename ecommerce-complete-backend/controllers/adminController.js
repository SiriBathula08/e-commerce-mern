import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// GET ADMIN DASHBOARD STATS
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get latest 5 orders
    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      latestOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MONTHLY SALES DATA
export const getMonthlySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOP SELLING PRODUCTS
export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          sold: { $sum: "$products.qty" }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
