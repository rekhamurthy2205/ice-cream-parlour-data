const Item = require("../models/item");

const addUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Create and save the new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

report = async (req, res) => {
  try {
    const { date } = req.body;

    // Validate the 'date' input format (YYYY-MM)
    if (!date || !/^\d{4}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: "Invalid date format provided. Expected format: YYYY-MM",
      });
    }

    // Split the 'date' into year and month
    const [year, month] = date.split("-");

    // Validate month and year values
    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month provided" });
    }
    if (!year || isNaN(year) || year < 1000 || year > 9999) {
      return res.status(400).json({ error: "Invalid year provided" });
    }

    // Count the total number of items in the collection
    const totalItems = await Item.countDocuments();

    // Format the month and year as "YYYY-MM" string
    const monthYear = `${year}-${month.padStart(2, "0")}`;

    console.log(`Fetching data for month-year: ${monthYear}`);

    // Count the documents matching the specified month and year (using $regex to match the "YYYY-MM" format)
    const count = await Item.countDocuments({
      date: { $regex: `^${monthYear}` }, // Match the first 7 characters (YYYY-MM) in the date field
    });

    console.log(`Documents matching ${monthYear}: ${count}`);

    // Find the most popular item (most quantity sold) in the specified month
    const popularItem = await Item.aggregate([
      {
        $match: {
          date: { $regex: `^${monthYear}` }, // Match the first 7 characters (YYYY-MM) in the date field
        },
      },
      {
        $group: {
          _id: "$SKU", // Group by SKU or item name (adjust if necessary)
          totalQuantity: { $sum: "$Quantity" },
        },
      },
      {
        $sort: { totalQuantity: -1 }, // Sort by total quantity in descending order
      },
      { $limit: 1 }, // Get only the top item
    ]);

    console.log("Most popular item:", popularItem);

    // Find the min, max, and average quantity sold for the most popular item
    const mostPopularSKU = popularItem[0]?._id;

    const ordersStats = await Item.aggregate([
      {
        $match: {
          SKU: mostPopularSKU, // Filter for the most popular item
          date: { $regex: `^${monthYear}` }, // Match the first 7 characters (YYYY-MM) in the date field
        },
      },
      {
        $group: {
          _id: "$SKU", // Group by SKU
          minOrders: { $min: "$Quantity" }, // Min quantity sold
          maxOrders: { $max: "$Quantity" }, // Max quantity sold
          avgOrders: { $avg: "$Quantity" }, // Avg quantity sold
        },
      },
    ]);

    console.log("Orders statistics for most popular item:", ordersStats);

    // Find the most revenue-generating items in the specified month
    const revenueItems = await Item.aggregate([
      {
        $match: {
          date: { $regex: `^${monthYear}` }, // Match the first 7 characters (YYYY-MM) in the date field
        },
      },
      {
        $group: {
          _id: "$SKU", // Group by SKU or item name
          totalRevenue: { $sum: { $multiply: ["$Quantity", "$Price"] } }, // Calculate revenue (Quantity * Price)
        },
      },
      {
        $sort: { totalRevenue: -1 }, // Sort by total revenue in descending order
      },
      { $limit: 5 }, // Get top 5 revenue-generating items
    ]);

    console.log("Revenue-generating items:", revenueItems);

    // Extract the popular item's name and total quantity
    const mostPopularItem = popularItem[0] || {}; // If no popular item, set as empty object

    const response = [
      { cardname: "Total Sales", cardValue: totalItems },
      { cardname: "Monthly Sales", cardValue: count },
      {
        cardname: "Popular Items",
        cardValue: mostPopularItem._id
          ? {
              name: mostPopularItem._id,
              quantity_sold: mostPopularItem.totalQuantity,
              min_orders: ordersStats[0]?.minOrders || 0,
              max_orders: ordersStats[0]?.maxOrders || 0,
              avg_orders: ordersStats[0]?.avgOrders || 0,
            }
          : null,
      },
      {
        cardname: "Top Revenue Items",
        cardValue: revenueItems.map((item) => ({
          name: item._id,
          total_revenue: item.totalRevenue,
        })),
      },
      {
        cardname: "Order Stats",
        cardValue: {
          year,
          month,
        },
      },
    ];

    res.json(response);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { report, addUser };
