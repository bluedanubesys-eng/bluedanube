const ERP_NAME = "Blue Danube ERP";
const ADMIN_EMAIL = "bluedanube.sys@gmail.com";
const TIMEZONE = "Asia/Yangon";
const DEFAULT_SHOP_ID = "SHOP-000001";

const SHEETS = {
  shops: "Shops",
  users: "Users",
  roles: "Roles",
  products: "Products",
  brands: "Brands",
  categories: "Categories",
  customers: "Customers",
  orders: "Orders",
  orderItems: "OrderItems",
  payments: "Payments",
  partners: "Partners",
  partnerCommissions: "PartnerCommissions",
  expenses: "Expenses",
  refunds: "Refunds",
  reports: "Reports",
  settings: "Settings",
  notifications: "Notifications",
  documents: "Documents",
  activityLogs: "ActivityLogs",
  inventoryLogs: "InventoryLogs",
  productImages: "ProductImages",
  emailLogs: "EmailLogs",
  auditLogs: "AuditLogs",
  backups: "Backups",
  emailVerifications: "EmailVerifications",
  wishlists: "Wishlists",
  reviews: "Reviews",
  coupons: "Coupons"
};

function doGet(e) {
  try {
    const p = e.parameter || {};
    const action = p.action || "health";
    const shopId = p.shopId || DEFAULT_SHOP_ID;

    if (action === "health") return json({ success: true, app: ERP_NAME, status: "running" });
    if (action === "setupSheets") return setupSheetsJson();

    if (action === "shops") return getSheetData(SHEETS.shops, "shops");
    if (action === "users") return getByShop(SHEETS.users, shopId, "users");
    if (action === "products") return getByShop(SHEETS.products, shopId, "products");
    if (action === "brands") return getByShop(SHEETS.brands, shopId, "brands");
    if (action === "categories") return getByShop(SHEETS.categories, shopId, "categories");
    if (action === "customers") return getByShop(SHEETS.customers, shopId, "customers");
    if (action === "orders") return getByShop(SHEETS.orders, shopId, "orders");
    if (action === "orderItems") return getByShop(SHEETS.orderItems, shopId, "orderItems");
    if (action === "payments") return getByShop(SHEETS.payments, shopId, "payments");
    if (action === "partners") return getByShop(SHEETS.partners, shopId, "partners");
    if (action === "commissions") return getByShop(SHEETS.partnerCommissions, shopId, "commissions");
    if (action === "expenses") return getByShop(SHEETS.expenses, shopId, "expenses");
    if (action === "refunds") return getByShop(SHEETS.refunds, shopId, "refunds");
    if (action === "dashboard") return getDashboard(shopId);
    if (action === "documents") return getByShop(SHEETS.documents, shopId, "documents");
    if (action === "notifications") return getByShop(SHEETS.notifications, shopId, "notifications");
    if (action === "activityLogs") return getByShop(SHEETS.activityLogs, shopId, "activityLogs");
    if (action === "inventoryLogs") return getByShop(SHEETS.inventoryLogs, shopId, "inventoryLogs");
    if (action === "productImages") return getByShop(SHEETS.productImages, shopId, "productImages");
    if (action === "emailLogs") return getByShop(SHEETS.emailLogs, shopId, "emailLogs");
    if (action === "auditLogs") return getByShop(SHEETS.auditLogs, shopId, "auditLogs");
    if (action === "backups") return getByShop(SHEETS.backups, shopId, "backups");
    if (action === "customerOrders") return getCustomerOrders(p.email, shopId);
    if (action === "partnerDashboard") return getPartnerDashboard(p.partnerId, shopId);

    return json({ success: false, message: "Invalid GET action" });
  } catch (err) {
    return json({ success: false, message: err.message });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const action = data.action;

    if (action === "setupSheets") return setupSheetsJson();
    if (action === "createShop") return createShop(data);
    if (action === "createUser") return createUser(data);
    if (action === "createBrand") return createBrand(data);
    if (action === "createCategory") return createCategory(data);
    if (action === "createProduct") return createProduct(data);
    if (action === "createCustomer") return createCustomer(data);
    if (action === "createPartner") return createPartner(data);
    if (action === "createOrder") return createOrder(data);
    if (action === "verifyPayment") return verifyPayment(data);
    if (action === "updateOrderStatus") return updateOrderStatus(data);
    if (action === "adminUpdateOrderStatus") return adminUpdateOrderStatus(data);
    if (action === "createExpense") return createExpense(data);
    if (action === "createRefund") return createRefund(data);
    if (action === "approveRefund") return approveRefund(data);
    if (action === "payPartnerCommission") return payPartnerCommission(data);

    // Auth
    if (action === "createAdminUser") return createAdminUser(data);
    if (action === "loginUser") return loginUser(data);
    if (action === "sendGmailVerificationCode") return sendGmailVerificationCode(data);
    if (action === "verifyGmailCode") return verifyGmailCode(data);
    if (action === "sendCustomerCheckoutOtp") return sendCustomerCheckoutOtp(data);
    if (action === "verifyCustomerCheckoutOtp") return verifyCustomerCheckoutOtp(data);

    // Uploads
    if (action === "uploadProductImage") return uploadProductImage(data);
    if (action === "uploadPaymentScreenshot") return uploadPaymentScreenshot(data);

    // Documents
    if (action === "generateInvoicePdf") return generateInvoicePdf(data);
    if (action === "generateReceiptPdf") return generateReceiptPdf(data);
    if (action === "generateDeliverySlipPdf") return generateDeliverySlipPdf(data);
    if (action === "sendOrderDocumentsEmail") return sendOrderDocumentsEmail(data);
    if (action === "sendOrderInvoiceEmail") return sendOrderInvoiceEmail(data.email || "", data.orderId);
    if (action === "sendOrderReceiptEmail") return sendOrderReceiptEmail(data.email || "", data.orderId);
    if (action === "sendOrderDeliverySlipEmail") return sendOrderDeliverySlipEmail(data.email || "", data.orderId);

    // Reports
    if (action === "exportReportCsv") return exportReportCsv(data);

    if (action === "createOrderWithPaymentScreenshot") return createOrderWithPaymentScreenshot(data);
    if (action === "createProductWithImage") return createProductWithImage(data);

    // Professional ERP additions
    if (action === "stockIn") return stockIn(data);
    if (action === "stockOut") return stockOut(data);
    if (action === "stockAdjust") return stockAdjust(data);
    if (action === "addProductImage") return addProductImage(data);
    if (action === "sendOrderStatusEmail") return sendOrderStatusEmail(data);
    if (action === "exportBackup") return exportBackup(data);
    if (action === "getProfitLossReport") return getProfitLossReport(data);
    if (action === "getInventoryValuationReport") return getInventoryValuationReport(data);
    if (action === "getPartnerPerformanceReport") return getPartnerPerformanceReport(data);
    if (action === "getBalanceSheet") return getBalanceSheet(data);
    if (action === "getCashFlowReport") return getCashFlowReport(data);
    if (action === "getPartnerSettlementReport") return getPartnerSettlementReport(data);
    if (action === "getImportCostAnalysis") return getImportCostAnalysis(data);

    if (action === "createWishlist") return createWishlist(data);
    if (action === "createReview") return createReview(data);
    if (action === "createCoupon") return createCoupon(data);
    if (action === "validateCoupon") return validateCoupon(data);
    if (action === "generateAllOrderDocuments") return generateAllOrderDocuments(data);
    if (action === "roleCheck") return roleCheck(data);

    return json({ success: false, message: "Invalid POST action" });
  } catch (err) {
    return json({ success: false, message: err.message });
  }
}

function setupSheetsJson() {
  setupSheets();
  return json({ success: true, message: "Blue Danube ERP sheets created successfully" });
}

function setupSheets() {
  createSheet(SHEETS.shops, ["Created At","Shop ID","Shop Name","Logo URL","Phone","Email","Address","Currency","Timezone","Status"]);
  createSheet(SHEETS.users, ["Created At","Shop ID","User ID","Name","Email","Phone","Role","Status"]);
  createSheet(SHEETS.roles, ["Created At","Role ID","Role Name","Permissions","Status"]);

  createSheet(SHEETS.brands, ["Created At","Shop ID","Brand ID","Brand Name","Country","Description","Status"]);
  createSheet(SHEETS.categories, ["Created At","Shop ID","Category ID","Category Name","Description","Status"]);

  createSheet(SHEETS.products, [
    "Created At","Shop ID","Product ID","Product Name","Brand","Category","Description",
    "SKU","Barcode","Image URL","Size","Color","Cost Price","Import Cost","Total Cost","Selling Price",
    "Stock Qty","Reorder Level","Owner Type","Partner ID","Status"
  ]);

  createSheet(SHEETS.customers, ["Created At","Shop ID","Customer ID","Customer Name","Phone","Email","Address","Township","Remark","Status"]);

  createSheet(SHEETS.orders, [
    "Created At","Shop ID","Order ID","Customer ID","Customer Name","Phone","Address","Township",
    "Subtotal","Discount","Delivery Fee","Tax","Grand Total","Payment Method","Payment Status",
    "Order Status","Partner ID","Commission Amount","Blue Danube Profit","Remarks","Email"
  ]);

  createSheet(SHEETS.orderItems, [
    "Created At","Shop ID","Order Item ID","Order ID","Product ID","Product Name","Brand",
    "Size","Color","Qty","Unit Price","Total Cost","Line Total","Profit"
  ]);

  createSheet(SHEETS.payments, ["Created At","Shop ID","Payment ID","Order ID","Customer Name","Amount","Payment Method","Payment Status","Verified At","Verified By"]);

  createSheet(SHEETS.partners, [
    "Created At","Shop ID","Partner ID","Partner Type","Partner Name","Phone","Email",
    "Commission Percent","Settlement Balance","Status"
  ]);

  createSheet(SHEETS.partnerCommissions, [
    "Created At","Shop ID","Commission ID","Partner ID","Partner Name","Order ID",
    "Sale Amount","Commission Amount","Status","Paid Date"
  ]);

  createSheet(SHEETS.expenses, ["Created At","Shop ID","Expense ID","Category","Description","Amount","Payment Method","Expense Date","Status"]);

  createSheet(SHEETS.refunds, ["Created At","Shop ID","Refund ID","Order ID","Customer Name","Amount","Reason","Status","Approved At"]);

  createSheet(SHEETS.reports, ["Created At","Shop ID","Report ID","Report Type","Title","Amount","Remarks"]);
  createSheet(SHEETS.settings, ["Created At","Shop ID","Setting Key","Setting Value"]);
  createSheet(SHEETS.notifications, ["Created At","Shop ID","Notification ID","To","Subject","Type","Status"]);
  createSheet(SHEETS.documents, ["Created At","Shop ID","Document ID","Document Type","Reference ID","URL","Status"]);
  createSheet(SHEETS.activityLogs, ["Created At","Shop ID","User","Action","Detail"]);

  createSheet(SHEETS.inventoryLogs, [
    "Created At","Shop ID","Log ID","Product ID","Product Name","Type",
    "Qty","Before Stock","After Stock","Reason","User"
  ]);

  createSheet(SHEETS.productImages, [
    "Created At","Shop ID","Image ID","Product ID","Image URL","Image Type","Sort Order","Status"
  ]);

  createSheet(SHEETS.emailLogs, [
    "Created At","Shop ID","Email ID","To","Subject","Type","Status","Error"
  ]);

  createSheet(SHEETS.auditLogs, [
    "Created At","Shop ID","Audit ID","User ID","Role","Action","Target","Status"
  ]);

  createSheet(SHEETS.backups, [
    "Created At","Shop ID","Backup ID","Backup Type","File URL","Status"
  ]);

  createSheet(SHEETS.emailVerifications, [
    "Created At","Shop ID","Email","Code","Expiry","Verified","Verified At","Purpose"
  ]);

  createSheet(SHEETS.wishlists, [
    "Created At","Shop ID","Wishlist ID","Customer Email","Product ID","Product Name","Status"
  ]);

  createSheet(SHEETS.reviews, [
    "Created At","Shop ID","Review ID","Product ID","Customer Name","Rating","Comment","Status"
  ]);

  createSheet(SHEETS.coupons, [
    "Created At","Shop ID","Coupon Code","Discount Type","Discount Value","Start Date","End Date","Status"
  ]);
}

function createShop(data) {
  const shopId = generateId("SHOP", SHEETS.shops);
  getSheet(SHEETS.shops).appendRow([
    new Date(), shopId, data.shopName || "Blue Danube", data.logoUrl || "",
    data.phone || "", data.email || ADMIN_EMAIL, data.address || "",
    data.currency || "MMK", data.timezone || TIMEZONE, "Active"
  ]);
  logActivity(shopId, "System", "createShop", shopId);
  return json({ success: true, shopId });
}

function createUser(data) {
  const userId = generateId("USR", SHEETS.users);
  getSheet(SHEETS.users).appendRow([
    new Date(), data.shopId || DEFAULT_SHOP_ID, userId, data.name, data.email,
    data.phone || "", data.role || "Staff", "Active"
  ]);
  return json({ success: true, userId });
}

function createBrand(data) {
  const brandId = generateId("BRD", SHEETS.brands);
  getSheet(SHEETS.brands).appendRow([
    new Date(), data.shopId || DEFAULT_SHOP_ID, brandId, data.brandName,
    data.country || "Europe", data.description || "", "Active"
  ]);
  return json({ success: true, brandId });
}

function createCategory(data) {
  const categoryId = generateId("CAT", SHEETS.categories);
  getSheet(SHEETS.categories).appendRow([
    new Date(), data.shopId || DEFAULT_SHOP_ID, categoryId, data.categoryName,
    data.description || "", "Active"
  ]);
  return json({ success: true, categoryId });
}

function createProduct(data) {
  const productId = generateId("PRD", SHEETS.products);
  const costPrice = Number(data.costPrice || 0);
  const importCost = Number(data.importCost || 0);
  const totalCost = costPrice + importCost;

  getSheet(SHEETS.products).appendRow([
    new Date(), data.shopId || DEFAULT_SHOP_ID, productId, data.productName,
    data.brand || "", data.category || "", data.description || "",
    data.sku || productId, data.barcode || productId, data.imageUrl || "", data.size || "", data.color || "",
    costPrice, importCost, totalCost, Number(data.sellingPrice || 0),
    Number(data.stockQty || 0), Number(data.reorderLevel || 0),
    data.ownerType || "Blue Danube", data.partnerId || "", "Active"
  ]);

  return json({ success: true, productId });
}

function createCustomer(data) {
  const customerId = generateId("CUS", SHEETS.customers);
  getSheet(SHEETS.customers).appendRow([
    new Date(), data.shopId || DEFAULT_SHOP_ID, customerId, data.customerName,
    data.phone || "", data.email || "", data.address || "", data.township || "",
    data.remark || "", "Active"
  ]);
  return json({ success: true, customerId });
}

function createPartner(data) {
  const partnerId = generateId("PTR", SHEETS.partners);
  getSheet(SHEETS.partners).appendRow([
    new Date(), data.shopId || DEFAULT_SHOP_ID, partnerId,
    data.partnerType || "Sales Partner", data.partnerName,
    data.phone || "", data.email || "", Number(data.commissionPercent || 0),
    0, "Active"
  ]);
  return json({ success: true, partnerId });
}

function createOrder(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;
  const orderId = generateId("ORD", SHEETS.orders);
  const items = data.items || [];
  let subtotal = 0;
  let totalCost = 0;

  items.forEach(function(item) {
    const qty = Number(item.qty || 1);
    const unitPrice = Number(item.unitPrice || 0);
    const product = findRowObject(SHEETS.products, "Product ID", item.productId);
    const itemCost = product ? Number(product["Total Cost"] || 0) : Number(item.totalCost || 0);

    subtotal += qty * unitPrice;
    totalCost += qty * itemCost;
  });

  const discount = Number(data.discount || 0);
  const deliveryFee = Number(data.deliveryFee || 0);
  const tax = Number(data.tax || 0);
  const grandTotal = subtotal - discount + deliveryFee + tax;

  const partner = data.partnerId ? findRowObject(SHEETS.partners, "Partner ID", data.partnerId) : null;
  const commissionPercent = partner ? Number(partner["Commission Percent"] || 0) : 0;
  const commissionAmount = Math.round(grandTotal * commissionPercent / 100);
  const profit = grandTotal - totalCost - commissionAmount;

  getSheet(SHEETS.orders).appendRow([
    new Date(), shopId, orderId, data.customerId || "", data.customerName,
    data.phone || "", data.address || "", data.township || "",
    subtotal, discount, deliveryFee, tax, grandTotal,
    data.paymentMethod || "", "Unpaid", "Pending",
    data.partnerId || "", commissionAmount, profit, data.remarks || "", data.email || ""
  ]);

  items.forEach(function(item) {
    createOrderItem(shopId, orderId, item);
    deductStock(item.productId, Number(item.qty || 1));
  });

  if (partner && commissionAmount > 0) {
    createPartnerCommission(shopId, partner, orderId, grandTotal, commissionAmount);
  }

  sendAdminNewOrderEmail(orderId);
  sendCustomerOrderReceivedEmail(orderId);
  logActivity(shopId, "System", "createOrder", orderId);

  return json({ success: true, orderId, grandTotal, commissionAmount, profit });
}

function createOrderItem(shopId, orderId, item) {
  const orderItemId = generateId("ITM", SHEETS.orderItems);
  const qty = Number(item.qty || 1);
  const unitPrice = Number(item.unitPrice || 0);
  const product = findRowObject(SHEETS.products, "Product ID", item.productId);
  const cost = product ? Number(product["Total Cost"] || 0) : Number(item.totalCost || 0);
  const lineTotal = qty * unitPrice;
  const profit = lineTotal - (qty * cost);

  getSheet(SHEETS.orderItems).appendRow([
    new Date(), shopId, orderItemId, orderId, item.productId,
    item.productName || (product ? product["Product Name"] : ""),
    item.brand || (product ? product.Brand : ""),
    item.size || (product ? product.Size : ""),
    item.color || (product ? product.Color : ""),
    qty, unitPrice, qty * cost, lineTotal, profit
  ]);
}

function createPartnerCommission(shopId, partner, orderId, saleAmount, commissionAmount) {
  const commissionId = generateId("COM", SHEETS.partnerCommissions);
  getSheet(SHEETS.partnerCommissions).appendRow([
    new Date(), shopId, commissionId, partner["Partner ID"], partner["Partner Name"],
    orderId, saleAmount, commissionAmount, "Unpaid", ""
  ]);

  addPartnerBalance(partner["Partner ID"], commissionAmount);
}

function verifyPayment(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;
  const paymentId = generateId("PAY", SHEETS.payments);

  getSheet(SHEETS.payments).appendRow([
    new Date(), shopId, paymentId, data.orderId, data.customerName || "",
    Number(data.amount || 0), data.paymentMethod || "", "Paid",
    new Date(), data.verifiedBy || "Admin"
  ]);

  updateOrderField(data.orderId, "Payment Status", "Paid");
  updateOrderField(data.orderId, "Order Status", "Confirmed");

  try {
    sendOrderReceiptEmail("", data.orderId);
  } catch (err) {}

  return json({ success: true, paymentId });
}

function updateOrderStatus(data) {
  updateOrderField(data.orderId, "Order Status", data.status);
  return json({ success: true, orderId: data.orderId, status: data.status });
}

function createExpense(data) {
  const expenseId = generateId("EXP", SHEETS.expenses);
  getSheet(SHEETS.expenses).appendRow([
    new Date(), data.shopId || DEFAULT_SHOP_ID, expenseId, data.category,
    data.description || "", Number(data.amount || 0),
    data.paymentMethod || "", data.expenseDate || new Date(), "Recorded"
  ]);
  return json({ success: true, expenseId });
}

function createRefund(data) {
  const refundId = generateId("REF", SHEETS.refunds);
  getSheet(SHEETS.refunds).appendRow([
    new Date(), data.shopId || DEFAULT_SHOP_ID, refundId, data.orderId,
    data.customerName || "", Number(data.amount || 0),
    data.reason || "", "Pending", ""
  ]);
  return json({ success: true, refundId });
}

function approveRefund(data) {
  updateRows(SHEETS.refunds, "Refund ID", data.refundId, {
    "Status": "Approved",
    "Approved At": new Date()
  });
  updateOrderField(data.orderId, "Order Status", "Refunded");
  return json({ success: true, refundId: data.refundId });
}

function payPartnerCommission(data) {
  updateRows(SHEETS.partnerCommissions, "Commission ID", data.commissionId, {
    "Status": "Paid",
    "Paid Date": new Date()
  });
  addPartnerBalance(data.partnerId, -Number(data.amount || 0));
  return json({ success: true });
}

function getDashboard(shopId) {
  const orders = getSheetDataArray(SHEETS.orders).filter(r => r["Shop ID"] === shopId);
  const payments = getSheetDataArray(SHEETS.payments).filter(r => r["Shop ID"] === shopId);
  const expenses = getSheetDataArray(SHEETS.expenses).filter(r => r["Shop ID"] === shopId);
  const products = getSheetDataArray(SHEETS.products).filter(r => r["Shop ID"] === shopId);
  const customers = getSheetDataArray(SHEETS.customers).filter(r => r["Shop ID"] === shopId);

  const revenue = payments.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const expenseTotal = expenses.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const netProfit = revenue - expenseTotal;
  const inventoryValue = products.reduce((s, r) => s + Number(r["Total Cost"] || 0) * Number(r["Stock Qty"] || 0), 0);

  return json({
    success: true,
    dashboard: {
      totalOrders: orders.length,
      totalRevenue: revenue,
      totalExpenses: expenseTotal,
      netProfit,
      totalProducts: products.length,
      totalCustomers: customers.length,
      inventoryValue
    }
  });
}

function deductStock(productId, qty) {
  const sheet = getSheet(SHEETS.products);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idCol = headers.indexOf("Product ID");
  const stockCol = headers.indexOf("Stock Qty");

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idCol]) === String(productId)) {
      const current = Number(rows[i][stockCol] || 0);
      sheet.getRange(i + 1, stockCol + 1).setValue(Math.max(current - qty, 0));
      return;
    }
  }
}

function addPartnerBalance(partnerId, amount) {
  const sheet = getSheet(SHEETS.partners);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idCol = headers.indexOf("Partner ID");
  const balCol = headers.indexOf("Settlement Balance");

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idCol]) === String(partnerId)) {
      const current = Number(rows[i][balCol] || 0);
      sheet.getRange(i + 1, balCol + 1).setValue(current + amount);
      return;
    }
  }
}

function updateOrderField(orderId, fieldName, value) {
  updateRows(SHEETS.orders, "Order ID", orderId, { [fieldName]: value });
}

function updateRows(sheetName, keyHeader, keyValue, fields) {
  const sheet = getSheet(sheetName);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const keyCol = headers.indexOf(keyHeader);

  if (keyCol < 0) return false;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][keyCol]) === String(keyValue)) {
      Object.keys(fields).forEach(function(field) {
        const col = headers.indexOf(field);
        if (col >= 0) sheet.getRange(i + 1, col + 1).setValue(fields[field]);
      });
      return true;
    }
  }
  return false;
}

function getByShop(sheetName, shopId, key) {
  const rows = getSheetDataArray(sheetName);
  return json({
    success: true,
    [key]: rows.filter(r => !shopId || String(r["Shop ID"]) === String(shopId))
  });
}

function getSheetData(sheetName, key) {
  return json({ success: true, [key]: getSheetDataArray(sheetName) });
}

function getSheetDataArray(sheetName) {
  const sheet = getSheet(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];

  return values.slice(1).map(function(row) {
    const obj = {};
    headers.forEach(function(h, i) {
      obj[h] = row[i];
    });
    return obj;
  });
}

function findRowObject(sheetName, keyHeader, keyValue) {
  const rows = getSheetDataArray(sheetName);
  return rows.find(r => String(r[keyHeader]) === String(keyValue)) || null;
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function createSheet(name, headers) {
  const sheet = getSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }

  const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  headers.forEach(function(h) {
    if (!existing.includes(h)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(h);
    }
  });
}

function generateId(prefix, sheetName) {
  const sheet = getSheet(sheetName);
  const num = Math.max(sheet.getLastRow(), 1);
  return prefix + "-" + String(num).padStart(6, "0");
}

function sendOrderEmail(email, customerName, orderId, total) {
  if (!email) return;

  try {
    GmailApp.sendEmail(
      email,
      "Blue Danube Order Confirmation - " + orderId,
      "",
      {
        htmlBody:
          "<h2>Blue Danube</h2>" +
          "<p>Dear " + customerName + ",</p>" +
          "<p>Your order has been created successfully.</p>" +
          "<p><b>Order ID:</b> " + orderId + "</p>" +
          "<p><b>Total:</b> " + total + " MMK</p>"
      }
    );
  } catch (err) {}
}

function logActivity(shopId, user, action, detail) {
  getSheet(SHEETS.activityLogs).appendRow([
    new Date(), shopId || DEFAULT_SHOP_ID, user || "System", action, detail || ""
  ]);
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


/* ======================================================
   AUTH SYSTEM
====================================================== */

function createAdminUser(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;
  const userId = generateId("USR", SHEETS.users);
  const password = data.password || "admin123";

  getSheet(SHEETS.users).appendRow([
    new Date(),
    shopId,
    userId,
    data.name || "Admin",
    data.email || ADMIN_EMAIL,
    data.phone || "",
    data.role || "Owner",
    "Active"
  ]);

  PropertiesService.getScriptProperties().setProperty("PWD_" + userId, password);

  return json({
    success: true,
    userId: userId,
    email: data.email || ADMIN_EMAIL,
    password: password
  });
}

function loginUser(data) {
  const email = String(data.email || "").trim();
  const password = String(data.password || "").trim();

  const users = getSheetDataArray(SHEETS.users);

  for (let i = 0; i < users.length; i++) {
    const u = users[i];

    if (String(u.Email).trim() === email && String(u.Status) === "Active") {
      const savedPassword = PropertiesService
        .getScriptProperties()
        .getProperty("PWD_" + u["User ID"]);

      if (savedPassword === password) {
        return json({
          success: true,
          user: u,
          token: Utilities.base64EncodeWebSafe(u["User ID"] + ":" + new Date().getTime())
        });
      }
    }
  }

  return json({ success: false, message: "Invalid email or password" });
}


/* ======================================================
   FILE UPLOAD SYSTEM
====================================================== */

function uploadProductImage(data) {
  const url = saveBase64File(
    data.base64,
    data.filename || "product-image.png",
    "Blue_Danube_Product_Images"
  );

  return json({ success: true, url: url });
}

function uploadPaymentScreenshot(data) {
  const url = saveBase64File(
    data.base64,
    data.filename || "payment-screenshot.png",
    "Blue_Danube_Payment_Screenshots"
  );

  return json({ success: true, url: url });
}

function saveBase64File(base64, filename, folderName) {
  if (!base64) return "";

  const cleanBase64 = String(base64).split(",").pop();
  const bytes = Utilities.base64Decode(cleanBase64);
  const contentType = getMimeType(filename);

  const blob = Utilities.newBlob(bytes, contentType, filename);
  const folder = getOrCreateFolder(folderName);
  const file = folder.createFile(blob);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) return folders.next();

  return DriveApp.createFolder(folderName);
}

function getMimeType(filename) {
  const name = String(filename || "").toLowerCase();

  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return MimeType.JPEG;
  if (name.endsWith(".png")) return MimeType.PNG;
  if (name.endsWith(".pdf")) return MimeType.PDF;

  return MimeType.PLAIN_TEXT;
}


/* ======================================================
   PDF DOCUMENT SYSTEM
====================================================== */

function generateInvoicePdf(data) {
  const order = findRowObject(SHEETS.orders, "Order ID", data.orderId);

  if (!order) return json({ success: false, message: "Order not found" });

  const items = getSheetDataArray(SHEETS.orderItems)
    .filter(function(i) {
      return String(i["Order ID"]) === String(data.orderId);
    });

  const html = buildInvoiceHtml(order, items, "INVOICE");
  const result = createPdfFromHtml(html, "Blue_Danube_Invoices", "Invoice-" + data.orderId + ".pdf");

  saveDocument(order["Shop ID"], "Invoice PDF", data.orderId, result.url);

  return json({ success: true, url: result.url });
}

function generateReceiptPdf(data) {
  const order = findRowObject(SHEETS.orders, "Order ID", data.orderId);

  if (!order) return json({ success: false, message: "Order not found" });

  const items = getSheetDataArray(SHEETS.orderItems)
    .filter(function(i) {
      return String(i["Order ID"]) === String(data.orderId);
    });

  const html = buildInvoiceHtml(order, items, "RECEIPT");
  const result = createPdfFromHtml(html, "Blue_Danube_Receipts", "Receipt-" + data.orderId + ".pdf");

  saveDocument(order["Shop ID"], "Receipt PDF", data.orderId, result.url);

  return json({ success: true, url: result.url });
}

function generateDeliverySlipPdf(data) {
  const order = findRowObject(SHEETS.orders, "Order ID", data.orderId);

  if (!order) return json({ success: false, message: "Order not found" });

  const html =
    "<html><body style='font-family:Arial;padding:28px;'>" +
    "<h1>BLUE DANUBE DELIVERY SLIP</h1>" +
    "<p><b>Order ID:</b> " + esc(order["Order ID"]) + "</p>" +
    "<p><b>Customer:</b> " + esc(order["Customer Name"]) + "</p>" +
    "<p><b>Phone:</b> " + esc(order.Phone) + "</p>" +
    "<p><b>Address:</b> " + esc(order.Address) + "</p>" +
    "<p><b>Township:</b> " + esc(order.Township) + "</p>" +
    "<p><b>Total:</b> " + esc(order["Grand Total"]) + " MMK</p>" +
    "<br><br><p>Receiver Signature: ____________________</p>" +
    "</body></html>";

  const result = createPdfFromHtml(html, "Blue_Danube_Delivery_Slips", "Delivery-" + data.orderId + ".pdf");

  saveDocument(order["Shop ID"], "Delivery Slip PDF", data.orderId, result.url);

  return json({ success: true, url: result.url });
}

function buildInvoiceHtml(order, items, title) {
  let itemRows = "";

  items.forEach(function(item, index) {
    itemRows +=
      "<tr>" +
      "<td>" + (index + 1) + "</td>" +
      "<td>" + esc(item["Product Name"]) + "</td>" +
      "<td>" + esc(item.Brand) + "</td>" +
      "<td>" + esc(item.Size) + "</td>" +
      "<td>" + esc(item.Color) + "</td>" +
      "<td>" + esc(item.Qty) + "</td>" +
      "<td>" + esc(item["Unit Price"]) + "</td>" +
      "<td>" + esc(item["Line Total"]) + "</td>" +
      "</tr>";
  });

  return `
  <html>
    <body style="font-family:Arial,Helvetica,sans-serif;padding:32px;color:#111827;">
      <div style="border:2px solid #111827;border-radius:18px;padding:24px;">
        <h1 style="margin:0;">BLUE DANUBE</h1>
        <p style="margin:6px 0 24px;color:#6b7280;">European Marketplace</p>

        <h2>${title}</h2>

        <p><b>Order ID:</b> ${esc(order["Order ID"])}</p>
        <p><b>Customer:</b> ${esc(order["Customer Name"])}</p>
        <p><b>Phone:</b> ${esc(order.Phone)}</p>
        <p><b>Address:</b> ${esc(order.Address)}</p>

        <table style="width:100%;border-collapse:collapse;margin-top:22px;">
          <thead>
            <tr>
              <th style="border:1px solid #ddd;padding:8px;">#</th>
              <th style="border:1px solid #ddd;padding:8px;">Product</th>
              <th style="border:1px solid #ddd;padding:8px;">Brand</th>
              <th style="border:1px solid #ddd;padding:8px;">Size</th>
              <th style="border:1px solid #ddd;padding:8px;">Color</th>
              <th style="border:1px solid #ddd;padding:8px;">Qty</th>
              <th style="border:1px solid #ddd;padding:8px;">Unit Price</th>
              <th style="border:1px solid #ddd;padding:8px;">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="margin-top:24px;text-align:right;">
          <p><b>Subtotal:</b> ${esc(order.Subtotal)} MMK</p>
          <p><b>Discount:</b> ${esc(order.Discount)} MMK</p>
          <p><b>Delivery Fee:</b> ${esc(order["Delivery Fee"])} MMK</p>
          <h2>Grand Total: ${esc(order["Grand Total"])} MMK</h2>
        </div>
      </div>
    </body>
  </html>`;
}

function createPdfFromHtml(html, folderName, filename) {
  const blob = HtmlService
    .createHtmlOutput(html)
    .getBlob()
    .getAs(MimeType.PDF)
    .setName(filename);

  const folder = getOrCreateFolder(folderName);
  const file = folder.createFile(blob);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return { url: file.getUrl(), blob: file.getBlob() };
}

function saveDocument(shopId, type, refId, url) {
  const documentId = generateId("DOC", SHEETS.documents);

  getSheet(SHEETS.documents).appendRow([
    new Date(),
    shopId || DEFAULT_SHOP_ID,
    documentId,
    type,
    refId,
    url,
    "Active"
  ]);
}


/* ======================================================
   REPORT EXPORT SYSTEM
====================================================== */

function exportReportCsv(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;
  const reportType = data.reportType || "orders";

  let sheetName = SHEETS.orders;

  if (reportType === "payments") sheetName = SHEETS.payments;
  if (reportType === "expenses") sheetName = SHEETS.expenses;
  if (reportType === "products") sheetName = SHEETS.products;
  if (reportType === "partners") sheetName = SHEETS.partners;

  const rows = getSheetDataArray(sheetName).filter(function(r) {
    return String(r["Shop ID"]) === String(shopId);
  });

  if (!rows.length) {
    return json({ success: false, message: "No data to export" });
  }

  const headers = Object.keys(rows[0]);

  let csv = headers.join(",") + "\n";

  rows.forEach(function(row) {
    csv += headers.map(function(h) {
      return '"' + String(row[h] || "").replace(/"/g, '""') + '"';
    }).join(",") + "\n";
  });

  const folder = getOrCreateFolder("Blue_Danube_Reports");
  const filename = "Blue-Danube-" + reportType + "-" + new Date().getTime() + ".csv";
  const file = folder.createFile(filename, csv, MimeType.CSV);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  saveDocument(shopId, "CSV Report", reportType, file.getUrl());

  return json({ success: true, url: file.getUrl() });
}


/* ======================================================
   FRONTEND FORM SUPPORT HELPERS
====================================================== */

function createOrderWithPaymentScreenshot(data) {
  const screenshotUrl = data.paymentScreenshotBase64
    ? saveBase64File(
        data.paymentScreenshotBase64,
        data.paymentScreenshotName || "payment.png",
        "Blue_Danube_Payment_Screenshots"
      )
    : "";

  data.remarks = (data.remarks || "") + " Payment Screenshot: " + screenshotUrl;

  return createOrder(data);
}

function createProductWithImage(data) {
  const imageUrl = data.imageBase64
    ? saveBase64File(
        data.imageBase64,
        data.imageName || "product.png",
        "Blue_Danube_Product_Images"
      )
    : "";

  data.description = (data.description || "") + " Image: " + imageUrl;

  return createProduct(data);
}


/* ======================================================
   GENERAL HELPERS
====================================================== */

function esc(v) {
  return String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


/* ======================================================
   PROFESSIONAL AUTH / RBAC HELPERS
====================================================== */

const ROLE_PERMISSIONS = {
  Owner: ["ALL"],
  Admin: ["PRODUCTS","ORDERS","CUSTOMERS","PAYMENTS","PARTNERS","EXPENSES","REPORTS"],
  Manager: ["PRODUCTS","ORDERS","CUSTOMERS","REPORTS"],
  Staff: ["ORDERS","CUSTOMERS"],
  Accountant: ["PAYMENTS","EXPENSES","REPORTS"],
  Partner: ["PARTNER_ORDERS","PARTNER_REPORTS"]
};

function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes("ALL") || perms.includes(permission);
}

function audit(shopId, userId, role, action, target, status) {
  const auditId = generateId("AUD", SHEETS.auditLogs);
  getSheet(SHEETS.auditLogs).appendRow([
    new Date(),
    shopId || DEFAULT_SHOP_ID,
    auditId,
    userId || "",
    role || "",
    action || "",
    target || "",
    status || "OK"
  ]);
}


/* ======================================================
   INVENTORY LEDGER SYSTEM
====================================================== */

function stockIn(data) {
  return updateStockLedger(data, "IN");
}

function stockOut(data) {
  return updateStockLedger(data, "OUT");
}

function stockAdjust(data) {
  return updateStockLedger(data, "ADJUST");
}

function updateStockLedger(data, type) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;
  const productId = data.productId;
  const qty = Number(data.qty || 0);

  if (!productId || !qty) {
    return json({ success: false, message: "Product ID and qty required" });
  }

  const sheet = getSheet(SHEETS.products);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idCol = headers.indexOf("Product ID");
  const nameCol = headers.indexOf("Product Name");
  const stockCol = headers.indexOf("Stock Qty");

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idCol]) === String(productId)) {
      const beforeStock = Number(rows[i][stockCol] || 0);
      let afterStock = beforeStock;

      if (type === "IN") afterStock = beforeStock + qty;
      if (type === "OUT") afterStock = Math.max(beforeStock - qty, 0);
      if (type === "ADJUST") afterStock = qty;

      sheet.getRange(i + 1, stockCol + 1).setValue(afterStock);

      const logId = generateId("STK", SHEETS.inventoryLogs);
      getSheet(SHEETS.inventoryLogs).appendRow([
        new Date(),
        shopId,
        logId,
        productId,
        rows[i][nameCol],
        type,
        qty,
        beforeStock,
        afterStock,
        data.reason || "",
        data.user || "System"
      ]);

      return json({ success: true, productId, beforeStock, afterStock });
    }
  }

  return json({ success: false, message: "Product not found" });
}


/* ======================================================
   PRODUCT IMAGE GALLERY
====================================================== */

function addProductImage(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;
  const productId = data.productId;

  if (!productId) return json({ success: false, message: "Product ID required" });

  let imageUrl = data.imageUrl || "";

  if (data.base64) {
    imageUrl = saveBase64File(
      data.base64,
      data.filename || "product-image.png",
      "Blue_Danube_Product_Images"
    );
  }

  const imageId = generateId("IMG", SHEETS.productImages);

  getSheet(SHEETS.productImages).appendRow([
    new Date(),
    shopId,
    imageId,
    productId,
    imageUrl,
    data.imageType || "Gallery",
    data.sortOrder || 999,
    "Active"
  ]);

  return json({ success: true, imageId, imageUrl });
}


/* ======================================================
   EMAIL NOTIFICATION ENGINE
====================================================== */

function sendOrderStatusEmail(data) {
  const order = findRowObject(SHEETS.orders, "Order ID", data.orderId);

  if (!order) return json({ success: false, message: "Order not found" });

  const email = data.email || "";
  const status = data.status || order["Order Status"];

  if (!email) return json({ success: false, message: "Email required" });

  const subject = "Blue Danube Order Update - " + data.orderId;

  const body =
    "<h2>Blue Danube</h2>" +
    "<p>Dear " + esc(order["Customer Name"]) + ",</p>" +
    "<p>Your order status has been updated.</p>" +
    "<p><b>Order ID:</b> " + esc(data.orderId) + "</p>" +
    "<p><b>Status:</b> " + esc(status) + "</p>" +
    "<p><b>Total:</b> " + esc(order["Grand Total"]) + " MMK</p>";

  return sendEmailLogged(order["Shop ID"], email, subject, "order-status", body);
}

function sendEmailLogged(shopId, to, subject, type, htmlBody) {
  const emailId = generateId("EML", SHEETS.emailLogs);

  try {
    GmailApp.sendEmail(to, subject, "", { htmlBody });

    getSheet(SHEETS.emailLogs).appendRow([
      new Date(),
      shopId || DEFAULT_SHOP_ID,
      emailId,
      to,
      subject,
      type,
      "Sent",
      ""
    ]);

    return json({ success: true, emailId });
  } catch (err) {
    getSheet(SHEETS.emailLogs).appendRow([
      new Date(),
      shopId || DEFAULT_SHOP_ID,
      emailId,
      to,
      subject,
      type,
      "Failed",
      err.message
    ]);

    return json({ success: false, message: err.message });
  }
}


/* ======================================================
   PROFESSIONAL REPORTING ENGINE
====================================================== */

function getProfitLossReport(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;

  const payments = getSheetDataArray(SHEETS.payments).filter(r => String(r["Shop ID"]) === String(shopId));
  const expenses = getSheetDataArray(SHEETS.expenses).filter(r => String(r["Shop ID"]) === String(shopId));
  const orders = getSheetDataArray(SHEETS.orders).filter(r => String(r["Shop ID"]) === String(shopId));

  const revenue = payments.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const expensesTotal = expenses.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const orderProfit = orders.reduce((s, r) => s + Number(r["Blue Danube Profit"] || 0), 0);
  const netProfit = revenue - expensesTotal;

  return json({
    success: true,
    report: {
      revenue,
      expensesTotal,
      orderProfit,
      netProfit,
      totalOrders: orders.length
    }
  });
}

function getInventoryValuationReport(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;

  const products = getSheetDataArray(SHEETS.products).filter(r => String(r["Shop ID"]) === String(shopId));

  const inventoryValue = products.reduce((s, r) => {
    return s + Number(r["Total Cost"] || 0) * Number(r["Stock Qty"] || 0);
  }, 0);

  const retailValue = products.reduce((s, r) => {
    return s + Number(r["Selling Price"] || 0) * Number(r["Stock Qty"] || 0);
  }, 0);

  const lowStock = products.filter(r => Number(r["Stock Qty"] || 0) <= Number(r["Reorder Level"] || 0));

  return json({
    success: true,
    report: {
      totalProducts: products.length,
      inventoryValue,
      retailValue,
      potentialProfit: retailValue - inventoryValue,
      lowStockCount: lowStock.length,
      lowStock
    }
  });
}

function getPartnerPerformanceReport(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;

  const commissions = getSheetDataArray(SHEETS.partnerCommissions)
    .filter(r => String(r["Shop ID"]) === String(shopId));

  const partners = {};

  commissions.forEach(c => {
    const id = c["Partner ID"];
    if (!partners[id]) {
      partners[id] = {
        partnerId: id,
        partnerName: c["Partner Name"],
        totalSales: 0,
        totalCommission: 0,
        orders: 0
      };
    }

    partners[id].totalSales += Number(c["Sale Amount"] || 0);
    partners[id].totalCommission += Number(c["Commission Amount"] || 0);
    partners[id].orders += 1;
  });

  return json({
    success: true,
    report: Object.values(partners)
  });
}


/* ======================================================
   BACKUP SYSTEM
====================================================== */

function exportBackup(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;
  const backupId = generateId("BAK", SHEETS.backups);

  const payload = {
    generatedAt: new Date(),
    shopId,
    shops: getSheetDataArray(SHEETS.shops),
    products: getSheetDataArray(SHEETS.products).filter(r => String(r["Shop ID"]) === String(shopId)),
    customers: getSheetDataArray(SHEETS.customers).filter(r => String(r["Shop ID"]) === String(shopId)),
    orders: getSheetDataArray(SHEETS.orders).filter(r => String(r["Shop ID"]) === String(shopId)),
    payments: getSheetDataArray(SHEETS.payments).filter(r => String(r["Shop ID"]) === String(shopId)),
    partners: getSheetDataArray(SHEETS.partners).filter(r => String(r["Shop ID"]) === String(shopId)),
    expenses: getSheetDataArray(SHEETS.expenses).filter(r => String(r["Shop ID"]) === String(shopId))
  };

  const folder = getOrCreateFolder("Blue_Danube_Backups");
  const file = folder.createFile(
    "Blue-Danube-Backup-" + shopId + "-" + new Date().getTime() + ".json",
    JSON.stringify(payload, null, 2),
    MimeType.PLAIN_TEXT
  );

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  getSheet(SHEETS.backups).appendRow([
    new Date(),
    shopId,
    backupId,
    "JSON",
    file.getUrl(),
    "Completed"
  ]);

  return json({ success: true, backupId, url: file.getUrl() });
}


/* ======================================================
   GMAIL OTP VERIFICATION LOGIN
====================================================== */

function sendGmailVerificationCode(data) {
  const email = String(data.email || "").trim().toLowerCase();
  const shopId = data.shopId || DEFAULT_SHOP_ID;

  if (!email) return json({ success: false, message: "Gmail required" });

  const user = findUserByEmail(email);

  if (!user) {
    return json({ success: false, message: "This Gmail account is not registered." });
  }

  if (String(user.Status) !== "Active") {
    return json({ success: false, message: "Account is not active." });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  getSheet(SHEETS.emailVerifications).appendRow([
    new Date(),
    shopId,
    email,
    code,
    expiry,
    false,
    "",
    "Login"
  ]);

  sendEmailLogged(
    shopId,
    email,
    "Blue Danube ERP Verification Code",
    "gmail-verification",
    "<h2>Blue Danube ERP</h2>" +
    "<p>Your verification code is:</p>" +
    "<h1 style='letter-spacing:6px;'>" + code + "</h1>" +
    "<p>This code will expire in 10 minutes.</p>"
  );

  return json({ success: true, message: "Verification code sent" });
}

function verifyGmailCode(data) {
  const email = String(data.email || "").trim().toLowerCase();
  const code = String(data.code || "").trim();

  if (!email || !code) {
    return json({ success: false, message: "Email and code required" });
  }

  const sheet = getSheet(SHEETS.emailVerifications);
  const rows = sheet.getDataRange().getValues();

  for (let i = rows.length - 1; i >= 1; i--) {
    const rowEmail = String(rows[i][2] || "").trim().toLowerCase();
    const rowCode = String(rows[i][3] || "").trim();
    const expiry = new Date(rows[i][4]);
    const verified = rows[i][5];

    if (rowEmail === email && rowCode === code && verified !== true) {
      if (expiry.getTime() < Date.now()) {
        return json({ success: false, message: "Verification code expired" });
      }

      sheet.getRange(i + 1, 6).setValue(true);
      sheet.getRange(i + 1, 7).setValue(new Date());

      const user = findUserByEmail(email);

      if (!user) {
        return json({ success: false, message: "User not found" });
      }

      updateRows(SHEETS.users, "User ID", user["User ID"], {
        "Status": "Active"
      });

      const token = Utilities.base64EncodeWebSafe(
        user["User ID"] + ":" + user["Shop ID"] + ":" + new Date().getTime()
      );

      audit(user["Shop ID"], user["User ID"], user.Role, "gmail-login", email, "OK");

      return json({
        success: true,
        message: "Login verified",
        token: token,
        user: user
      });
    }
  }

  return json({ success: false, message: "Invalid verification code" });
}

function findUserByEmail(email) {
  const users = getSheetDataArray(SHEETS.users);
  const target = String(email || "").trim().toLowerCase();

  return users.find(function(u) {
    return String(u.Email || "").trim().toLowerCase() === target;
  }) || null;
}


/* ======================================================
   ADVANCED FINANCE REPORTS
====================================================== */

function getBalanceSheet(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;

  const products = getSheetDataArray(SHEETS.products).filter(r => String(r["Shop ID"]) === String(shopId));
  const payments = getSheetDataArray(SHEETS.payments).filter(r => String(r["Shop ID"]) === String(shopId));
  const expenses = getSheetDataArray(SHEETS.expenses).filter(r => String(r["Shop ID"]) === String(shopId));
  const commissions = getSheetDataArray(SHEETS.partnerCommissions).filter(r => String(r["Shop ID"]) === String(shopId));

  const cash = payments.reduce((s, r) => s + Number(r.Amount || 0), 0) -
               expenses.reduce((s, r) => s + Number(r.Amount || 0), 0);

  const inventoryValue = products.reduce((s, r) => {
    return s + Number(r["Total Cost"] || 0) * Number(r["Stock Qty"] || 0);
  }, 0);

  const unpaidCommission = commissions
    .filter(r => String(r.Status).toLowerCase() !== "paid")
    .reduce((s, r) => s + Number(r["Commission Amount"] || 0), 0);

  const assets = cash + inventoryValue;
  const liabilities = unpaidCommission;
  const equity = assets - liabilities;

  return json({
    success: true,
    report: {
      assets: {
        cash,
        inventoryValue,
        totalAssets: assets
      },
      liabilities: {
        unpaidPartnerCommission: unpaidCommission,
        totalLiabilities: liabilities
      },
      equity
    }
  });
}

function getCashFlowReport(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;

  const payments = getSheetDataArray(SHEETS.payments).filter(r => String(r["Shop ID"]) === String(shopId));
  const expenses = getSheetDataArray(SHEETS.expenses).filter(r => String(r["Shop ID"]) === String(shopId));
  const commissions = getSheetDataArray(SHEETS.partnerCommissions).filter(r => String(r["Shop ID"]) === String(shopId));

  const cashIn = payments.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const expenseOut = expenses.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const commissionOut = commissions
    .filter(r => String(r.Status).toLowerCase() === "paid")
    .reduce((s, r) => s + Number(r["Commission Amount"] || 0), 0);

  const cashOut = expenseOut + commissionOut;
  const netCashFlow = cashIn - cashOut;

  return json({
    success: true,
    report: {
      cashIn,
      cashOut,
      expenseOut,
      commissionOut,
      netCashFlow
    }
  });
}

function getPartnerSettlementReport(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;

  const partners = getSheetDataArray(SHEETS.partners).filter(r => String(r["Shop ID"]) === String(shopId));
  const commissions = getSheetDataArray(SHEETS.partnerCommissions).filter(r => String(r["Shop ID"]) === String(shopId));

  const report = partners.map(function(partner) {
    const partnerId = partner["Partner ID"];

    const rows = commissions.filter(c => String(c["Partner ID"]) === String(partnerId));

    const totalSales = rows.reduce((s, r) => s + Number(r["Sale Amount"] || 0), 0);
    const totalCommission = rows.reduce((s, r) => s + Number(r["Commission Amount"] || 0), 0);
    const paidCommission = rows
      .filter(r => String(r.Status).toLowerCase() === "paid")
      .reduce((s, r) => s + Number(r["Commission Amount"] || 0), 0);

    const unpaidCommission = totalCommission - paidCommission;

    return {
      partnerId,
      partnerName: partner["Partner Name"],
      partnerType: partner["Partner Type"],
      totalOrders: rows.length,
      totalSales,
      totalCommission,
      paidCommission,
      unpaidCommission,
      settlementBalance: Number(partner["Settlement Balance"] || 0)
    };
  });

  return json({ success: true, report });
}

function getImportCostAnalysis(data) {
  const shopId = data.shopId || DEFAULT_SHOP_ID;

  const products = getSheetDataArray(SHEETS.products).filter(r => String(r["Shop ID"]) === String(shopId));

  const report = products.map(function(p) {
    const costPrice = Number(p["Cost Price"] || 0);
    const importCost = Number(p["Import Cost"] || 0);
    const totalCost = Number(p["Total Cost"] || 0);
    const sellingPrice = Number(p["Selling Price"] || 0);
    const stockQty = Number(p["Stock Qty"] || 0);

    const grossProfitPerUnit = sellingPrice - totalCost;
    const marginPercent = sellingPrice > 0 ? Math.round((grossProfitPerUnit / sellingPrice) * 10000) / 100 : 0;

    return {
      productId: p["Product ID"],
      productName: p["Product Name"],
      brand: p.Brand,
      costPrice,
      importCost,
      totalCost,
      sellingPrice,
      stockQty,
      grossProfitPerUnit,
      marginPercent,
      totalInventoryCost: totalCost * stockQty,
      potentialGrossProfit: grossProfitPerUnit * stockQty
    };
  });

  const summary = report.reduce(function(s, r) {
    s.totalImportCost += r.importCost * r.stockQty;
    s.totalInventoryCost += r.totalInventoryCost;
    s.potentialGrossProfit += r.potentialGrossProfit;
    return s;
  }, {
    totalImportCost: 0,
    totalInventoryCost: 0,
    potentialGrossProfit: 0
  });

  return json({ success: true, summary, report });
}


/* ======================================================
   FRONTEND PRODUCTION SUPPORT
====================================================== */

function getCustomerOrders(email, shopId) {
  const target = String(email || "").trim().toLowerCase();
  if (!target) return json({ success: false, message: "Email required" });

  const orders = getSheetDataArray(SHEETS.orders)
    .filter(r =>
      String(r["Shop ID"]) === String(shopId || DEFAULT_SHOP_ID) &&
      String(r.Email || r.email || "").trim().toLowerCase() === target
    );

  return json({ success: true, orders });
}

function getPartnerDashboard(partnerId, shopId) {
  if (!partnerId) return json({ success: false, message: "Partner ID required" });

  const partner = findRowObject(SHEETS.partners, "Partner ID", partnerId);
  const commissions = getSheetDataArray(SHEETS.partnerCommissions)
    .filter(r =>
      String(r["Shop ID"]) === String(shopId || DEFAULT_SHOP_ID) &&
      String(r["Partner ID"]) === String(partnerId)
    );

  const totalSales = commissions.reduce((s, r) => s + Number(r["Sale Amount"] || 0), 0);
  const totalCommission = commissions.reduce((s, r) => s + Number(r["Commission Amount"] || 0), 0);
  const paidCommission = commissions
    .filter(r => String(r.Status).toLowerCase() === "paid")
    .reduce((s, r) => s + Number(r["Commission Amount"] || 0), 0);

  return json({
    success: true,
    partner,
    dashboard: {
      totalOrders: commissions.length,
      totalSales,
      totalCommission,
      paidCommission,
      unpaidCommission: totalCommission - paidCommission
    },
    commissions
  });
}

function createWishlist(data) {
  const wishlistId = generateId("WISH", SHEETS.wishlists);
  getSheet(SHEETS.wishlists).appendRow([
    new Date(),
    data.shopId || DEFAULT_SHOP_ID,
    wishlistId,
    data.email || "",
    data.productId || "",
    data.productName || "",
    "Active"
  ]);
  return json({ success: true, wishlistId });
}

function createReview(data) {
  const reviewId = generateId("REV", SHEETS.reviews);
  getSheet(SHEETS.reviews).appendRow([
    new Date(),
    data.shopId || DEFAULT_SHOP_ID,
    reviewId,
    data.productId || "",
    data.customerName || "",
    Number(data.rating || 5),
    data.comment || "",
    "Pending"
  ]);
  return json({ success: true, reviewId });
}

function createCoupon(data) {
  getSheet(SHEETS.coupons).appendRow([
    new Date(),
    data.shopId || DEFAULT_SHOP_ID,
    data.couponCode || "",
    data.discountType || "Amount",
    Number(data.discountValue || 0),
    data.startDate || "",
    data.endDate || "",
    "Active"
  ]);
  return json({ success: true, couponCode: data.couponCode });
}


/* ======================================================
   FINAL PRODUCTION HELPERS
====================================================== */

function validateCoupon(data) {
  const code = String(data.couponCode || "").trim();
  const rows = getSheetDataArray(SHEETS.coupons || "Coupons");
  const found = rows.find(r => String(r["Coupon Code"]).trim() === code && String(r.Status).toLowerCase() === "active");
  if (!found) return json({ success: false, message: "Invalid coupon" });
  return json({ success: true, coupon: found });
}

function generateAllOrderDocuments(data) {
  const invoice = generateInvoicePdf(data);
  const receipt = generateReceiptPdf(data);
  const delivery = generateDeliverySlipPdf(data);
  return json({ success: true, message: "Documents generated. Check Documents sheet." });
}

function roleCheck(data) {
  const allowed = hasPermission(data.role || "Staff", data.permission || "");
  return json({ success: true, allowed });
}


/* ======================================================
   PDF EMAIL ATTACHMENT SYSTEM
====================================================== */

function sendOrderDocumentsEmail(data) {
  const orderId = data.orderId;
  const email = data.email || "";
  const types = data.types || ["invoice", "receipt", "delivery"];

  if (!orderId) return json({ success: false, message: "Order ID required" });

  const sent = [];

  if (types.includes("invoice")) {
    const r = sendOrderInvoiceEmail(email, orderId, true);
    sent.push("invoice");
  }

  if (types.includes("receipt")) {
    const r = sendOrderReceiptEmail(email, orderId, true);
    sent.push("receipt");
  }

  if (types.includes("delivery")) {
    const r = sendOrderDeliverySlipEmail(email, orderId, true);
    sent.push("delivery");
  }

  return json({ success: true, orderId: orderId, sent: sent });
}

function sendOrderInvoiceEmail(email, orderId, silent) {
  const bundle = createOrderPdfBundle(orderId, "INVOICE");
  if (!bundle.success) return silent ? bundle : json(bundle);

  const to = resolveOrderEmail(bundle.order, email);
  if (!to) return silent ? { success: false, message: "Customer email not found" } : json({ success: false, message: "Customer email not found" });

  const subject = "Blue Danube Invoice - " + orderId;
  const body =
    "<h2>Blue Danube</h2>" +
    "<p>Dear " + esc(bundle.order["Customer Name"]) + ",</p>" +
    "<p>Your order invoice is attached as a PDF.</p>" +
    "<p><b>Order ID:</b> " + esc(orderId) + "</p>" +
    "<p><b>Total:</b> " + esc(bundle.order["Grand Total"]) + " MMK</p>";

  const result = sendEmailLoggedWithAttachments(
    bundle.order["Shop ID"],
    to,
    subject,
    "invoice-pdf",
    body,
    [bundle.invoiceBlob]
  );

  return silent ? result : json(result);
}

function sendOrderReceiptEmail(email, orderId, silent) {
  const bundle = createOrderPdfBundle(orderId, "RECEIPT");
  if (!bundle.success) return silent ? bundle : json(bundle);

  const to = resolveOrderEmail(bundle.order, email);
  if (!to) return silent ? { success: false, message: "Customer email not found" } : json({ success: false, message: "Customer email not found" });

  const subject = "Blue Danube Receipt - " + orderId;
  const body =
    "<h2>Blue Danube</h2>" +
    "<p>Dear " + esc(bundle.order["Customer Name"]) + ",</p>" +
    "<p>Your payment receipt is attached as a PDF.</p>" +
    "<p><b>Order ID:</b> " + esc(orderId) + "</p>" +
    "<p><b>Payment Status:</b> " + esc(bundle.order["Payment Status"]) + "</p>" +
    "<p><b>Total:</b> " + esc(bundle.order["Grand Total"]) + " MMK</p>";

  const result = sendEmailLoggedWithAttachments(
    bundle.order["Shop ID"],
    to,
    subject,
    "receipt-pdf",
    body,
    [bundle.receiptBlob]
  );

  return silent ? result : json(result);
}

function sendOrderDeliverySlipEmail(email, orderId, silent) {
  const bundle = createOrderPdfBundle(orderId, "DELIVERY");
  if (!bundle.success) return silent ? bundle : json(bundle);

  const to = resolveOrderEmail(bundle.order, email);
  if (!to) return silent ? { success: false, message: "Customer email not found" } : json({ success: false, message: "Customer email not found" });

  const subject = "Blue Danube Delivery Slip - " + orderId;
  const body =
    "<h2>Blue Danube</h2>" +
    "<p>Dear " + esc(bundle.order["Customer Name"]) + ",</p>" +
    "<p>Your delivery slip is attached as a PDF.</p>" +
    "<p><b>Order ID:</b> " + esc(orderId) + "</p>";

  const result = sendEmailLoggedWithAttachments(
    bundle.order["Shop ID"],
    to,
    subject,
    "delivery-slip-pdf",
    body,
    [bundle.deliveryBlob]
  );

  return silent ? result : json(result);
}

function createOrderPdfBundle(orderId, mode) {
  const order = findRowObject(SHEETS.orders, "Order ID", orderId);
  if (!order) return { success: false, message: "Order not found" };

  const items = getSheetDataArray(SHEETS.orderItems)
    .filter(function(i) {
      return String(i["Order ID"]) === String(orderId);
    });

  let invoiceBlob = null;
  let receiptBlob = null;
  let deliveryBlob = null;

  if (mode === "INVOICE" || mode === "ALL") {
    const html = buildInvoiceHtml(order, items, "INVOICE");
    const pdf = createPdfFromHtml(html, "Blue_Danube_Invoices", "Invoice-" + orderId + ".pdf");
    saveDocument(order["Shop ID"], "Invoice PDF", orderId, pdf.url);
    invoiceBlob = pdf.blob;
  }

  if (mode === "RECEIPT" || mode === "ALL") {
    const html = buildInvoiceHtml(order, items, "RECEIPT");
    const pdf = createPdfFromHtml(html, "Blue_Danube_Receipts", "Receipt-" + orderId + ".pdf");
    saveDocument(order["Shop ID"], "Receipt PDF", orderId, pdf.url);
    receiptBlob = pdf.blob;
  }

  if (mode === "DELIVERY" || mode === "ALL") {
    const html = buildBlueDanubeDeliverySlipHtml(order);
    const pdf = createPdfFromHtml(html, "Blue_Danube_Delivery_Slips", "Delivery-" + orderId + ".pdf");
    saveDocument(order["Shop ID"], "Delivery Slip PDF", orderId, pdf.url);
    deliveryBlob = pdf.blob;
  }

  return {
    success: true,
    order: order,
    invoiceBlob: invoiceBlob,
    receiptBlob: receiptBlob,
    deliveryBlob: deliveryBlob
  };
}

function buildBlueDanubeDeliverySlipHtml(order) {
  return (
    "<html><body style='font-family:Arial;padding:28px;color:#111827;'>" +
    "<div style='border:2px solid #111827;border-radius:18px;padding:24px;'>" +
    "<h1 style='margin:0;'>BLUE DANUBE DELIVERY SLIP</h1>" +
    "<p style='color:#6b7280;'>Commercial Marketplace</p>" +
    "<hr>" +
    "<p><b>Order ID:</b> " + esc(order["Order ID"]) + "</p>" +
    "<p><b>Customer:</b> " + esc(order["Customer Name"]) + "</p>" +
    "<p><b>Phone:</b> " + esc(order.Phone) + "</p>" +
    "<p><b>Address:</b> " + esc(order.Address) + "</p>" +
    "<p><b>Township:</b> " + esc(order.Township) + "</p>" +
    "<p><b>Payment:</b> " + esc(order["Payment Status"]) + "</p>" +
    "<h2>Total: " + esc(order["Grand Total"]) + " MMK</h2>" +
    "<br><br><p>Receiver Signature: ____________________</p>" +
    "</div></body></html>"
  );
}

function resolveOrderEmail(order, fallbackEmail) {
  if (fallbackEmail) return fallbackEmail;
  if (order.Email) return order.Email;
  if (order.email) return order.email;

  if (order["Customer ID"]) {
    const customer = findRowObject(SHEETS.customers, "Customer ID", order["Customer ID"]);
    if (customer && customer.Email) return customer.Email;
  }

  return "";
}

function sendEmailLoggedWithAttachments(shopId, to, subject, type, htmlBody, attachments) {
  const emailId = generateId("EML", SHEETS.emailLogs);

  try {
    GmailApp.sendEmail(to, subject, "", {
      htmlBody:
        "<div style='font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:28px;'>" +
        "<div style='max-width:680px;margin:0 auto;background:#ffffff;border-radius:22px;padding:28px;border:1px solid #e5e7eb;'>" +
        htmlBody +
        "<hr style='border:none;border-top:1px solid #e5e7eb;margin:26px 0;'>" +
        "<p style='font-size:12px;color:#6b7280;'>This is an automated email from Blue Danube ERP.</p>" +
        "</div></div>",
      attachments: attachments || []
    });

    getSheet(SHEETS.emailLogs).appendRow([
      new Date(),
      shopId || DEFAULT_SHOP_ID,
      emailId,
      to,
      subject,
      type,
      "Sent",
      ""
    ]);

    return { success: true, emailId: emailId };
  } catch (err) {
    getSheet(SHEETS.emailLogs).appendRow([
      new Date(),
      shopId || DEFAULT_SHOP_ID,
      emailId,
      to,
      subject,
      type,
      "Failed",
      err.message
    ]);

    return { success: false, message: err.message };
  }
}


/* ======================================================
   CUSTOMER CHECKOUT OTP - NO USER ACCOUNT REQUIRED
====================================================== */

function sendCustomerCheckoutOtp(data) {
  const email = String(data.email || "").trim().toLowerCase();
  const shopId = data.shopId || DEFAULT_SHOP_ID;

  if (!email) return json({ success: false, message: "Customer Gmail required" });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  getSheet(SHEETS.emailVerifications).appendRow([
    new Date(),
    shopId,
    email,
    code,
    expiry,
    false,
    "",
    "Checkout"
  ]);

  sendEmailLogged(
    shopId,
    email,
    "Blue Danube Checkout Verification Code",
    "checkout-otp",
    "<h2>Blue Danube Checkout</h2>" +
    "<p>Your checkout verification code is:</p>" +
    "<h1 style='letter-spacing:6px;'>" + code + "</h1>" +
    "<p>This code will expire in 10 minutes.</p>"
  );

  return json({ success: true, message: "OTP sent to customer Gmail" });
}

function verifyCustomerCheckoutOtp(data) {
  const email = String(data.email || "").trim().toLowerCase();
  const code = String(data.code || "").trim();

  if (!email || !code) return json({ success: false, message: "Email and OTP required" });

  const sheet = getSheet(SHEETS.emailVerifications);
  const rows = sheet.getDataRange().getValues();

  for (let i = rows.length - 1; i >= 1; i--) {
    const rowEmail = String(rows[i][2] || "").trim().toLowerCase();
    const rowCode = String(rows[i][3] || "").trim();
    const expiry = new Date(rows[i][4]);
    const verified = rows[i][5];
    const purpose = String(rows[i][7] || "");

    if (rowEmail === email && rowCode === code && purpose === "Checkout" && verified !== true) {
      if (expiry.getTime() < Date.now()) {
        return json({ success: false, message: "OTP expired" });
      }

      sheet.getRange(i + 1, 6).setValue(true);
      sheet.getRange(i + 1, 7).setValue(new Date());

      return json({ success: true, message: "Customer Gmail verified" });
    }
  }

  return json({ success: false, message: "Invalid OTP" });
}


/* ======================================================
   ADMIN ORDER APPROVAL + CUSTOMER EMAIL WORKFLOW
====================================================== */

function adminUpdateOrderStatus(data) {
  const orderId = data.orderId;
  const status = data.status;
  const note = data.note || "";

  if (!orderId || !status) {
    return json({ success: false, message: "Order ID and status required" });
  }

  const order = findRowObject(SHEETS.orders, "Order ID", orderId);
  if (!order) return json({ success: false, message: "Order not found" });

  updateOrderField(orderId, "Order Status", status);

  if (status === "Approved") updateOrderField(orderId, "Payment Status", "Pending Verification");
  if (status === "Payment Verified") updateOrderField(orderId, "Payment Status", "Paid");
  if (status === "Cancelled") updateOrderField(orderId, "Payment Status", "Cancelled");

  sendCustomerOrderStatusAutoEmail(orderId, status, note);
  logActivity(order["Shop ID"], "Admin", "adminUpdateOrderStatus", orderId + " -> " + status);

  return json({ success: true, orderId: orderId, status: status });
}

function sendAdminNewOrderEmail(orderId) {
  const order = findRowObject(SHEETS.orders, "Order ID", orderId);
  if (!order) return;

  const items = getSheetDataArray(SHEETS.orderItems).filter(function(i) {
    return String(i["Order ID"]) === String(orderId);
  });

  let itemRows = "";
  items.forEach(function(item) {
    itemRows +=
      "<tr>" +
      "<td style='padding:8px;border:1px solid #ddd;'>" + esc(item["Product Name"]) + "</td>" +
      "<td style='padding:8px;border:1px solid #ddd;'>" + esc(item.Qty) + "</td>" +
      "<td style='padding:8px;border:1px solid #ddd;'>" + esc(item["Line Total"]) + " MMK</td>" +
      "</tr>";
  });

  const html =
    "<h2>New Blue Danube Order</h2>" +
    "<p>A customer has submitted a new order. Please review and approve it in Admin Orders.</p>" +
    "<p><b>Order ID:</b> " + esc(orderId) + "</p>" +
    "<p><b>Customer:</b> " + esc(order["Customer Name"]) + "</p>" +
    "<p><b>Phone:</b> " + esc(order.Phone) + "</p>" +
    "<p><b>Email:</b> " + esc(resolveOrderEmail(order, "")) + "</p>" +
    "<p><b>Address:</b> " + esc(order.Address) + "</p>" +
    "<p><b>Grand Total:</b> " + esc(order["Grand Total"]) + " MMK</p>" +
    "<table style='border-collapse:collapse;width:100%;margin-top:16px;'>" +
    "<thead><tr><th style='padding:8px;border:1px solid #ddd;'>Product</th><th style='padding:8px;border:1px solid #ddd;'>Qty</th><th style='padding:8px;border:1px solid #ddd;'>Total</th></tr></thead>" +
    "<tbody>" + itemRows + "</tbody></table>";

  sendEmailLogged(order["Shop ID"], ADMIN_EMAIL, "New Order Approval Required - " + orderId, "admin-new-order", html);
}

function sendCustomerOrderReceivedEmail(orderId) {
  const order = findRowObject(SHEETS.orders, "Order ID", orderId);
  if (!order) return;

  const email = resolveOrderEmail(order, "");
  if (!email) return;

  const html =
    "<h2>Order Received</h2>" +
    "<p>Dear " + esc(order["Customer Name"]) + ",</p>" +
    "<p>We have received your order. Our team will review and confirm it soon.</p>" +
    "<p><b>Order ID:</b> " + esc(orderId) + "</p>" +
    "<p><b>Status:</b> Pending Review</p>" +
    "<p><b>Total:</b> " + esc(order["Grand Total"]) + " MMK</p>";

  sendEmailLogged(order["Shop ID"], email, "Order Received - " + orderId, "customer-order-received", html);
}

function sendCustomerOrderStatusAutoEmail(orderId, status, note) {
  const order = findRowObject(SHEETS.orders, "Order ID", orderId);
  if (!order) return;

  const email = resolveOrderEmail(order, "");
  if (!email) return;

  const messages = {
    "Approved": "Your order has been approved and is now being processed.",
    "Payment Verified": "Your payment has been verified successfully.",
    "Packaging": "Your order is now being packed.",
    "Shipped": "Your order has been shipped.",
    "Out for Delivery": "Your order is out for delivery.",
    "Delivered": "Your order has been delivered successfully. Thank you for shopping with Blue Danube.",
    "Cancelled": "Your order has been cancelled. Please contact support if you have questions."
  };

  const html =
    "<h2>Order Status Update</h2>" +
    "<p>Dear " + esc(order["Customer Name"]) + ",</p>" +
    "<p>" + esc(messages[status] || "Your order status has been updated.") + "</p>" +
    "<p><b>Order ID:</b> " + esc(orderId) + "</p>" +
    "<p><b>Current Status:</b> " + esc(status) + "</p>" +
    "<p><b>Total:</b> " + esc(order["Grand Total"]) + " MMK</p>" +
    (note ? "<p><b>Note:</b> " + esc(note) + "</p>" : "");

  sendEmailLogged(order["Shop ID"], email, "Order Update - " + orderId + " - " + status, "customer-order-status", html);
}
