import { PrismaClient } from '@prisma/client';
import { AI_MODEL_USER_EMAIL } from '../src/common/services/ai/consts/ai.const';
import { SYSTEM_USER_GMAIL } from '../src/app/users/consts/user.const';

const prisma = new PrismaClient();

export const createProdData = async () => {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // 1. Tạo Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'nguyen.van.a@gmail.com',
        password: '$2b$10$YourHashedPasswordHere1',
        firstName: 'Nguyễn Văn',
        lastName: 'A',
        fullAddress: '123 Đường Lê Lợi, Phường Bến Nghé',
        city: 'Quận 1',
        province: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        phone: '0901234567',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        email: 'tran.thi.b@gmail.com',
        password: '$2b$10$YourHashedPasswordHere2',
        firstName: 'Trần Thị',
        lastName: 'B',
        fullAddress: '456 Đường Nguyễn Huệ, Phường Bến Thành',
        city: 'Quận 1',
        province: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        phone: '0912345678',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        email: 'le.van.c@gmail.com',
        password: '$2b$10$YourHashedPasswordHere3',
        firstName: 'Lê Văn',
        lastName: 'C',
        fullAddress: '789 Đường Võ Văn Tần, Phường 5',
        city: 'Quận 3',
        province: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        phone: '0923456789',
        status: 'active',
      },
    }),
    await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        firstName: 'Admin',
        fullAddress: '',
        password: '$2b$10$tcW4LxZLisafLJ1AYXE6Qe3nAsr.RT/iPAoemf2fwvamQ9ReI06cq',
      },
    }),
    await prisma.user.create({
      data: {
        email: AI_MODEL_USER_EMAIL,
        firstName: 'User AI Model',
        fullAddress: '',
        password: crypto.randomUUID(),
      },
    }),
    await prisma.user.create({
      data: {
        email: SYSTEM_USER_GMAIL,
        firstName: 'System User',
        fullAddress: '',
        password: crypto.randomUUID(),
      },
    }),
  ]);

  console.log('✅ Đã tạo users');

  // 2. Tạo Vendors
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        userID: users[0].id,
        name: 'TechStore Vietnam',
        slug: 'techstore-vietnam',
        description: 'Cửa hàng điện tử và công nghệ hàng đầu Việt Nam',
        logoUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766',
        taxCode: '0123456789',
        totalProducts: 0,
        totalOrders: 0,
        status: 'active',
      },
    }),
    prisma.vendor.create({
      data: {
        userID: users[1].id,
        name: 'Fashion House Saigon',
        slug: 'fashion-house-saigon',
        description: 'Thời trang cao cấp cho phái đẹp',
        logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        taxCode: '0987654321',
        totalProducts: 0,
        totalOrders: 0,
        status: 'active',
      },
    }),
    prisma.vendor.create({
      data: {
        userID: users[2].id,
        name: 'HomeDecor & Living',
        slug: 'homedecor-living',
        description: 'Đồ trang trí nội thất và đồ gia dụng',
        logoUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a',
        taxCode: '0111222333',
        totalProducts: 0,
        totalOrders: 0,
        status: 'active',
      },
    }),
  ]);

  console.log('✅ Đã tạo vendors');

  // 3. Tạo Roles
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: 'Super Admin',
        description: 'Quản trị viên hệ thống',
        isSystemRole: true,
      },
    }),
    prisma.role.create({
      data: {
        name: 'Vendor Owner',
        description: 'Chủ cửa hàng',
        isSystemRole: true,
      },
    }),
    prisma.role.create({
      data: {
        name: 'Vendor Manager',
        description: 'Quản lý cửa hàng',
        isSystemRole: false,
      },
    }),
    prisma.role.create({
      data: {
        name: 'Vendor Staff',
        description: 'Nhân viên cửa hàng',
        isSystemRole: false,
      },
    }),
  ]);

  console.log('✅ Đã tạo roles');

  // 4. Tạo Permissions
  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        name: 'Xem sản phẩm',
        description: 'Quyền xem danh sách sản phẩm',
        key: '[/product]_[read]',
        isSystemPermission: true,
      },
    }),
    prisma.permission.create({
      data: {
        name: 'Tạo sản phẩm',
        description: 'Quyền tạo sản phẩm mới',
        key: '[/product]_[create]',
        isSystemPermission: true,
      },
    }),
    prisma.permission.create({
      data: {
        name: 'Quản lý sản phẩm',
        description: 'Quyền quản lý toàn bộ sản phẩm',
        key: '[/product]_[manage]',
        isSystemPermission: true,
      },
    }),
    prisma.permission.create({
      data: {
        name: 'Xem đơn hàng',
        description: 'Quyền xem danh sách đơn hàng',
        key: '[/order]_[read]',
        isSystemPermission: true,
      },
    }),
    prisma.permission.create({
      data: {
        name: 'Quản lý đơn hàng',
        description: 'Quyền quản lý toàn bộ đơn hàng',
        key: '[/order]_[manage]',
        isSystemPermission: true,
      },
    }),
  ]);

  console.log('✅ Đã tạo permissions');

  // 5. Gán quyền cho roles
  await Promise.all([
    // Super Admin - tất cả quyền
    ...permissions.map((perm) =>
      prisma.rolePermission.create({
        data: {
          roleID: roles[0].id,
          permissionID: perm.id,
        },
      }),
    ),
    // Vendor Owner - tất cả quyền
    ...permissions.map((perm) =>
      prisma.rolePermission.create({
        data: {
          roleID: roles[1].id,
          permissionID: perm.id,
        },
      }),
    ),
    // Vendor Manager - read và manage
    prisma.rolePermission.create({
      data: {
        roleID: roles[2].id,
        permissionID: permissions[0].id,
      },
    }),
    prisma.rolePermission.create({
      data: {
        roleID: roles[2].id,
        permissionID: permissions[2].id,
      },
    }),
    prisma.rolePermission.create({
      data: {
        roleID: roles[2].id,
        permissionID: permissions[3].id,
      },
    }),
    // Vendor Staff - chỉ read
    prisma.rolePermission.create({
      data: {
        roleID: roles[3].id,
        permissionID: permissions[0].id,
      },
    }),
    prisma.rolePermission.create({
      data: {
        roleID: roles[3].id,
        permissionID: permissions[3].id,
      },
    }),
  ]);

  console.log('✅ Đã gán permissions cho roles');

  // 6. Tạo UserRole
  await Promise.all([
    prisma.userRole.create({
      data: {
        userID: users[3].id,
        roleID: roles[0].id,
        status: 'active',
      },
    }),
    prisma.userRole.create({
      data: {
        userID: users[0].id,
        roleID: roles[1].id,
        status: 'active',
      },
    }),
    prisma.userRole.create({
      data: {
        userID: users[1].id,
        roleID: roles[1].id,
        status: 'active',
      },
    }),
    prisma.userRole.create({
      data: {
        userID: users[2].id,
        roleID: roles[1].id,
        status: 'active',
      },
    }),
  ]);

  console.log('✅ Đã tạo user-vendor-role');

  // 7. Tạo Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Điện tử',
        slug: 'dien-tu',
        description: 'Các sản phẩm điện tử',
        imageUrl:
          'https://images.unsplash.com/photo-1498049794561-7780e7231661',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Thời trang',
        slug: 'thoi-trang',
        description: 'Quần áo và phụ kiện',
        imageUrl:
          'https://images.unsplash.com/photo-1445205170230-053b83016050',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Nội thất',
        slug: 'noi-that',
        description: 'Đồ nội thất và trang trí',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      },
    }),
  ]);

  // Tạo subcategories
  const subcategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Laptop',
        slug: 'laptop',
        description: 'Máy tính xách tay',
        parentID: categories[0].id,
        imageUrl:
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Điện thoại',
        slug: 'dien-thoai',
        description: 'Smartphone và phụ kiện',
        parentID: categories[0].id,
        imageUrl:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Áo nữ',
        slug: 'ao-nu',
        description: 'Áo sơ mi, áo thun nữ',
        parentID: categories[1].id,
        imageUrl:
          'https://images.unsplash.com/photo-1485231183945-fffde7cc051e',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Váy',
        slug: 'vay',
        description: 'Váy dài, váy ngắn',
        parentID: categories[1].id,
        imageUrl:
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ghế sofa',
        slug: 'ghe-sofa',
        description: 'Ghế sofa phòng khách',
        parentID: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      },
    }),
  ]);

  console.log('✅ Đã tạo categories');

  // 8. Tạo Products
  const products = await Promise.all([
    // TechStore products
    prisma.product.create({
      data: {
        vendorID: vendors[0].id,
        name: 'MacBook Pro 14" M3',
        slug: 'macbook-pro-14-m3',
        description:
          'MacBook Pro 14 inch với chip M3 mạnh mẽ, RAM 16GB, SSD 512GB',
        sku: 'MBP-M3-14-512',
        price: 45990000,
        stockQuantity: 15,
        status: 'active',
      },
    }),
    prisma.product.create({
      data: {
        vendorID: vendors[0].id,
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'iPhone 15 Pro Max 256GB - Titan tự nhiên',
        sku: 'IP15PM-256-TN',
        price: 33990000,
        stockQuantity: 25,
        status: 'active',
      },
    }),
    prisma.product.create({
      data: {
        vendorID: vendors[0].id,
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Samsung Galaxy S24 Ultra 512GB - Màu đen',
        sku: 'SGS24U-512-BK',
        price: 32990000,
        stockQuantity: 20,
        status: 'active',
      },
    }),
    // Fashion House products
    prisma.product.create({
      data: {
        vendorID: vendors[1].id,
        name: 'Váy Maxi Hoa Nhí',
        slug: 'vay-maxi-hoa-nhi',
        description: 'Váy maxi dáng dài họa tiết hoa nhí thanh lịch',
        sku: 'VM-HN-001',
        price: 650000,
        stockQuantity: 50,
        status: 'active',
      },
    }),
    prisma.product.create({
      data: {
        vendorID: vendors[1].id,
        name: 'Áo Sơ Mi Trắng Công Sở',
        slug: 'ao-so-mi-trang-cong-so',
        description: 'Áo sơ mi trắng form đẹp dành cho văn phòng',
        sku: 'ASM-TR-002',
        price: 350000,
        stockQuantity: 80,
        status: 'active',
      },
    }),
    // HomeDecor products
    prisma.product.create({
      data: {
        vendorID: vendors[2].id,
        name: 'Ghế Sofa 3 Chỗ Bọc Vải',
        slug: 'ghe-sofa-3-cho-boc-vai',
        description: 'Ghế sofa 3 chỗ ngồi bọc vải cao cấp màu xám',
        sku: 'SF3-VAI-XAM',
        price: 8500000,
        stockQuantity: 10,
        status: 'active',
      },
    }),
    prisma.product.create({
      data: {
        vendorID: vendors[2].id,
        name: 'Bàn Làm Việc Gỗ Oak',
        slug: 'ban-lam-viec-go-oak',
        description: 'Bàn làm việc gỗ oak tự nhiên 120x60cm',
        sku: 'BLV-OAK-120',
        price: 4500000,
        stockQuantity: 15,
        status: 'active',
      },
    }),
  ]);

  console.log('✅ Đã tạo products');

  // 9. Gán categories cho products
  await Promise.all([
    prisma.productCategory.create({
      data: { productID: products[0].id, categoryID: subcategories[0].id },
    }),
    prisma.productCategory.create({
      data: { productID: products[1].id, categoryID: subcategories[1].id },
    }),
    prisma.productCategory.create({
      data: { productID: products[2].id, categoryID: subcategories[1].id },
    }),
    prisma.productCategory.create({
      data: { productID: products[3].id, categoryID: subcategories[3].id },
    }),
    prisma.productCategory.create({
      data: { productID: products[4].id, categoryID: subcategories[2].id },
    }),
    prisma.productCategory.create({
      data: { productID: products[5].id, categoryID: subcategories[4].id },
    }),
    prisma.productCategory.create({
      data: { productID: products[6].id, categoryID: categories[2].id },
    }),
  ]);

  console.log('✅ Đã gán categories cho products');

  // 10. Tạo Product Variants
  const variants = await Promise.all([
    // MacBook variants
    prisma.productVariant.create({
      data: {
        productID: products[0].id,
        name: '16GB RAM - 512GB SSD - Xám',
        sku: 'MBP-M3-16-512-GRAY',
        price: 45990000,
        stockQuantity: 10,
        attributes: { ram: '16GB', storage: '512GB', color: 'Xám' },
      },
    }),
    prisma.productVariant.create({
      data: {
        productID: products[0].id,
        name: '16GB RAM - 1TB SSD - Xám',
        sku: 'MBP-M3-16-1TB-GRAY',
        price: 52990000,
        stockQuantity: 5,
        attributes: { ram: '16GB', storage: '1TB', color: 'Xám' },
      },
    }),
    // iPhone variants
    prisma.productVariant.create({
      data: {
        productID: products[1].id,
        name: '256GB - Titan Tự Nhiên',
        sku: 'IP15PM-256-TN',
        price: 33990000,
        stockQuantity: 15,
        attributes: { storage: '256GB', color: 'Titan Tự Nhiên' },
      },
    }),
    prisma.productVariant.create({
      data: {
        productID: products[1].id,
        name: '512GB - Titan Tự Nhiên',
        sku: 'IP15PM-512-TN',
        price: 39990000,
        stockQuantity: 10,
        attributes: { storage: '512GB', color: 'Titan Tự Nhiên' },
      },
    }),
    // Samsung variants
    prisma.productVariant.create({
      data: {
        productID: products[2].id,
        name: '512GB - Đen',
        sku: 'SGS24U-512-BK',
        price: 32990000,
        stockQuantity: 20,
        attributes: { storage: '512GB', color: 'Đen' },
      },
    }),
    // Dress variants
    prisma.productVariant.create({
      data: {
        productID: products[3].id,
        name: 'Size S',
        sku: 'VM-HN-001-S',
        price: 650000,
        stockQuantity: 15,
        attributes: { size: 'S' },
      },
    }),
    prisma.productVariant.create({
      data: {
        productID: products[3].id,
        name: 'Size M',
        sku: 'VM-HN-001-M',
        price: 650000,
        stockQuantity: 20,
        attributes: { size: 'M' },
      },
    }),
    prisma.productVariant.create({
      data: {
        productID: products[3].id,
        name: 'Size L',
        sku: 'VM-HN-001-L',
        price: 650000,
        stockQuantity: 15,
        attributes: { size: 'L' },
      },
    }),
    // Shirt variants
    prisma.productVariant.create({
      data: {
        productID: products[4].id,
        name: 'Size M',
        sku: 'ASM-TR-002-M',
        price: 350000,
        stockQuantity: 30,
        attributes: { size: 'M' },
      },
    }),
    prisma.productVariant.create({
      data: {
        productID: products[4].id,
        name: 'Size L',
        sku: 'ASM-TR-002-L',
        price: 350000,
        stockQuantity: 50,
        attributes: { size: 'L' },
      },
    }),
    // Sofa variant
    prisma.productVariant.create({
      data: {
        productID: products[5].id,
        name: 'Màu Xám',
        sku: 'SF3-VAI-XAM',
        price: 8500000,
        stockQuantity: 10,
        attributes: { color: 'Xám', material: 'Vải' },
      },
    }),
    // Desk variant
    prisma.productVariant.create({
      data: {
        productID: products[6].id,
        name: '120x60cm',
        sku: 'BLV-OAK-120',
        price: 4500000,
        stockQuantity: 15,
        attributes: { dimensions: '120x60cm', material: 'Gỗ Oak' },
      },
    }),
  ]);

  console.log('✅ Đã tạo product variants');

  // 11. Tạo Product Images
  const productImages = await Promise.all([
    // MacBook images
    prisma.productImage.create({
      data: {
        name: 'MacBook Pro Front',
        productID: products[0].id,
        imageUrl:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        sortOrder: 1,
      },
    }),
    prisma.productImage.create({
      data: {
        name: 'MacBook Pro Side',
        productID: products[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef',
        sortOrder: 2,
      },
    }),
    // iPhone images
    prisma.productImage.create({
      data: {
        name: 'iPhone 15 Pro Max Front',
        productID: products[1].id,
        imageUrl:
          'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5',
        sortOrder: 1,
      },
    }),
    // Samsung images
    prisma.productImage.create({
      data: {
        name: 'Samsung S24 Ultra',
        productID: products[2].id,
        imageUrl:
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
        sortOrder: 1,
      },
    }),
    // Dress images
    prisma.productImage.create({
      data: {
        name: 'Váy Maxi',
        productID: products[3].id,
        imageUrl:
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
        sortOrder: 1,
      },
    }),
    // Shirt images
    prisma.productImage.create({
      data: {
        name: 'Áo Sơ Mi Trắng',
        productID: products[4].id,
        imageUrl:
          'https://images.unsplash.com/photo-1485231183945-fffde7cc051e',
        sortOrder: 1,
      },
    }),
    // Sofa images
    prisma.productImage.create({
      data: {
        name: 'Ghế Sofa',
        productID: products[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
        sortOrder: 1,
      },
    }),
    // Desk images
    prisma.productImage.create({
      data: {
        name: 'Bàn Làm Việc',
        productID: products[6].id,
        imageUrl:
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd',
        sortOrder: 1,
      },
    }),
  ]);

  console.log('✅ Đã tạo product images');

  // 12. Tạo Promotions
  const promotions = await Promise.all([
    prisma.promotion.create({
      data: {
        code: 'WELCOME2024',
        name: 'Chào mừng khách hàng mới',
        description: 'Giảm 10% cho đơn hàng đầu tiên',
        type: 'percentage',
        value: 10,
        usageLimit: 1000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'active',
      },
    }),
    prisma.promotion.create({
      data: {
        code: 'FREESHIP',
        name: 'Miễn phí vận chuyển',
        description: 'Miễn phí ship cho đơn từ 500k',
        type: 'free_shipping',
        value: 0,
        usageLimit: null,
        startDate: new Date('2024-01-01'),
        status: 'active',
      },
    }),
    prisma.promotion.create({
      data: {
        code: 'NEWYEAR100K',
        name: 'Tết 2024',
        description: 'Giảm 100k cho đơn từ 2 triệu',
        type: 'fixed_amount',
        value: 100000,
        usageLimit: 500,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-15'),
        status: 'active',
      },
    }),
  ]);

  console.log('✅ Đã tạo promotions');

  // 13. Tạo Cart cho users
  const carts = await Promise.all([
    prisma.cart.create({
      data: {
        userID: users[0].id,
      },
    }),
    prisma.cart.create({
      data: {
        userID: users[1].id,
      },
    }),
  ]);

  console.log('✅ Đã tạo carts');

  // 14. Tạo Cart Items
  const cartItems = await Promise.all([
    prisma.cartItem.create({
      data: {
        cartID: carts[0].id,
        productVariantID: variants[2].id, // iPhone 256GB
        quantity: 1,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartID: carts[0].id,
        productVariantID: variants[5].id, // Váy Size S
        quantity: 2,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartID: carts[1].id,
        productVariantID: variants[0].id, // MacBook
        quantity: 1,
      },
    }),
  ]);

  console.log('✅ Đã tạo cart items');

  // 15. Tạo Orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-0001',
        userID: users[0].id,
        status: 'delivered',
        subtotal: 34640000,
        taxAmount: 3464000,
        shippingAmount: 50000,
        discountAmount: 3464000,
        totalAmount: 34690000,
        currency: 'VND',
        notes: 'Giao hàng giờ hành chính',
        shippedAt: new Date('2024-01-10'),
        deliveredAt: new Date('2024-01-12'),
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-0002',
        userID: users[1].id,
        status: 'processing',
        subtotal: 1300000,
        taxAmount: 130000,
        shippingAmount: 30000,
        discountAmount: 130000,
        totalAmount: 1330000,
        currency: 'VND',
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-0003',
        userID: users[2].id,
        status: 'confirmed',
        subtotal: 8500000,
        taxAmount: 850000,
        shippingAmount: 100000,
        discountAmount: 0,
        totalAmount: 9450000,
        currency: 'VND',
      },
    }),
  ]);

  console.log('✅ Đã tạo orders');

  // 16. Tạo Order Items
  const orderItems = await Promise.all([
    // Order 1 - iPhone 256GB
    prisma.orderItem.create({
      data: {
        orderID: orders[0].id,
        productVariantID: variants[2].id,
        quantity: 1,
        unitPrice: 33990000,
        totalPrice: 33990000,
        productVariantSnapshot: {
          productName: 'iPhone 15 Pro Max',
          variantName: '256GB - Titan Tự Nhiên',
          sku: 'IP15PM-256-TN',
          attributes: { storage: '256GB', color: 'Titan Tự Nhiên' },
        },
      },
    }),
    // Order 1 - Váy Size S x2
    prisma.orderItem.create({
      data: {
        orderID: orders[0].id,
        productVariantID: variants[5].id,
        quantity: 2,
        unitPrice: 650000,
        totalPrice: 1300000,
        productVariantSnapshot: {
          productName: 'Váy Maxi Hoa Nhí',
          variantName: 'Size S',
          sku: 'VM-HN-001-S',
          attributes: { size: 'S' },
        },
      },
    }),
    // Order 2 - Áo Sơ Mi Size M x2
    prisma.orderItem.create({
      data: {
        orderID: orders[1].id,
        productVariantID: variants[8].id,
        quantity: 2,
        unitPrice: 350000,
        totalPrice: 700000,
        productVariantSnapshot: {
          productName: 'Áo Sơ Mi Trắng Công Sở',
          variantName: 'Size M',
          sku: 'ASM-TR-002-M',
          attributes: { size: 'M' },
        },
      },
    }),
    // Order 2 - Váy Size M
    prisma.orderItem.create({
      data: {
        orderID: orders[1].id,
        productVariantID: variants[6].id,
        quantity: 1,
        unitPrice: 650000,
        totalPrice: 650000,
        productVariantSnapshot: {
          productName: 'Váy Maxi Hoa Nhí',
          variantName: 'Size M',
          sku: 'VM-HN-001-M',
          attributes: { size: 'M' },
        },
      },
    }),
    // Order 3 - Ghế Sofa
    prisma.orderItem.create({
      data: {
        orderID: orders[2].id,
        productVariantID: variants[10].id,
        quantity: 1,
        unitPrice: 8500000,
        totalPrice: 8500000,
        productVariantSnapshot: {
          productName: 'Ghế Sofa 3 Chỗ Bọc Vải',
          variantName: 'Màu Xám',
          sku: 'SF3-VAI-XAM',
          attributes: { color: 'Xám', material: 'Vải' },
        },
      },
    }),
  ]);

  console.log('✅ Đã tạo order items');

  // 17. Tạo Order Addresses
  const orderAddresses = await Promise.all([
    // Order 1 - Shipping Address
    prisma.orderAddress.create({
      data: {
        orderID: orders[0].id,
        type: 'shipping',
        firstName: 'Nguyễn Văn',
        lastName: 'A',
        fullAddress: '123 Đường Lê Lợi, Phường Bến Nghé',
        city: 'Quận 1',
        province: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        phone: '0901234567',
      },
    }),
    // Order 1 - Billing Address
    prisma.orderAddress.create({
      data: {
        orderID: orders[0].id,
        type: 'billing',
        firstName: 'Nguyễn Văn',
        lastName: 'A',
        company: 'Công ty ABC',
        fullAddress: '123 Đường Lê Lợi, Phường Bến Nghé',
        city: 'Quận 1',
        province: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        phone: '0901234567',
      },
    }),
    // Order 2 - Shipping Address
    prisma.orderAddress.create({
      data: {
        orderID: orders[1].id,
        type: 'shipping',
        firstName: 'Trần Thị',
        lastName: 'B',
        fullAddress: '456 Đường Nguyễn Huệ, Phường Bến Thành',
        city: 'Quận 1',
        province: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        phone: '0912345678',
      },
    }),
    // Order 3 - Shipping Address
    prisma.orderAddress.create({
      data: {
        orderID: orders[2].id,
        type: 'shipping',
        firstName: 'Lê Văn',
        lastName: 'C',
        fullAddress: '789 Đường Võ Văn Tần, Phường 5',
        city: 'Quận 3',
        province: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        phone: '0923456789',
      },
    }),
    // Order 3 - Pickup Address
    prisma.orderAddress.create({
      data: {
        orderID: orders[2].id,
        type: 'pickup',
        firstName: 'HomeDecor',
        lastName: 'Store',
        company: 'HomeDecor & Living',
        fullAddress: '100 Đường Trần Hưng Đạo, Phường Cầu Ông Lãnh',
        city: 'Quận 1',
        province: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        phone: '02838123456',
      },
    }),
  ]);

  console.log('✅ Đã tạo order addresses');

  // 18. Tạo Order Promotions
  await Promise.all([
    prisma.orderPromotion.create({
      data: {
        orderID: orders[0].id,
        promotionID: promotions[0].id, // WELCOME2024 - 10%
        discountAmount: 3464000,
      },
    }),
    prisma.orderPromotion.create({
      data: {
        orderID: orders[1].id,
        promotionID: promotions[0].id, // WELCOME2024 - 10%
        discountAmount: 130000,
      },
    }),
  ]);

  console.log('✅ Đã tạo order promotions');

  // 19. Tạo Payments
  const payments = await Promise.all([
    // Payment cho Order 1 - Đã hoàn thành
    prisma.payment.create({
      data: {
        orderID: orders[0].id,
        type: 'eWallet',
        status: 'completed',
        amount: 34690000,
        transactionID: 'MOMO-2024-001-ABC123',
        createdAt: new Date('2024-01-08'),
      },
    }),
    // Payment cho Order 2 - Đã hoàn thành
    prisma.payment.create({
      data: {
        orderID: orders[1].id,
        type: 'bankTransfer',
        status: 'completed',
        amount: 1330000,
        transactionID: 'VCB-2024-002-DEF456',
        createdAt: new Date('2024-01-15'),
      },
    }),
    // Payment cho Order 3 - Đang chờ
    prisma.payment.create({
      data: {
        orderID: orders[2].id,
        type: 'creditCard',
        status: 'pending',
        amount: 9450000,
        transactionID: null,
      },
    }),
  ]);

  console.log('✅ Đã tạo payments');

  // 20. Tạo Notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userID: users[0].id,
        title: 'Đơn hàng đã được giao thành công',
        message:
          'Đơn hàng #ORD-2024-0001 của bạn đã được giao thành công. Cảm ơn bạn đã mua hàng!',
        isRead: true,
      },
    }),
    prisma.notification.create({
      data: {
        userID: users[0].id,
        title: 'Sản phẩm mới từ TechStore',
        message: 'iPhone 15 Pro Max vừa có hàng! Đặt ngay để nhận ưu đãi.',
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userID: users[1].id,
        title: 'Đơn hàng đang được xử lý',
        message:
          'Đơn hàng #ORD-2024-0002 đang được chuẩn bị. Chúng tôi sẽ giao hàng trong 2-3 ngày.',
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userID: users[1].id,
        title: 'Khuyến mãi đặc biệt',
        message:
          'Giảm giá 20% cho tất cả sản phẩm thời trang. Áp dụng từ 20/01 đến 25/01.',
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userID: users[2].id,
        title: 'Xác nhận đơn hàng',
        message:
          'Đơn hàng #ORD-2024-0003 đã được xác nhận. Vui lòng thanh toán để hoàn tất.',
        isRead: true,
      },
    }),
    prisma.notification.create({
      data: {
        userID: users[2].id,
        title: 'Nhắc nhở thanh toán',
        message:
          'Đơn hàng #ORD-2024-0003 đang chờ thanh toán. Vui lòng thanh toán trong 24h.',
        isRead: false,
      },
    }),
  ]);

  console.log('✅ Đã tạo notifications');

  // 21. Tạo Chat Messages - Cuộc hội thoại với chatbot
  const aiModelUserID = users[3].id;

  // ========== SESSION 1: User 0 (Nguyễn Văn A) - Tư vấn mua iPhone ==========
  const session1_msg1 = await prisma.chatMessage.create({
    data: {
      userID: users[0].id,
      sessionID: 'session-001',
      message: 'Chào bot, tôi muốn tìm hiểu về iPhone 15 Pro Max',
      context: JSON.stringify({
        intent: 'product_inquiry',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-20T09:00:00'),
    },
  });

  const session1_msg2 = await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-001',
      parentID: session1_msg1.id,
      message:
        'Xin chào! Tôi là chatbot hỗ trợ của TechStore Vietnam 🤖\n\nChúng tôi hiện có iPhone 15 Pro Max với các phiên bản sau:\n\n📱 256GB - Titan Tự Nhiên: 33,990,000 VNĐ\n📱 512GB - Titan Tự Nhiên: 39,990,000 VNĐ\n\nCả hai phiên bản đều còn hàng. Bạn quan tâm phiên bản nào ạ?',
      context: JSON.stringify({
        intent: 'bot_response',
        products_found: ['iPhone 15 Pro Max'],
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-20T09:00:15'),
    },
  });

  const session1_msg3 = await prisma.chatMessage.create({
    data: {
      userID: users[0].id,
      sessionID: 'session-001',
      message: 'Phiên bản 256GB có khuyến mãi gì không?',
      context: JSON.stringify({
        intent: 'promotion_inquiry',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-20T09:01:30'),
    },
  });

  const session1_msg4 = await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-001',
      parentID: session1_msg3.id,
      message:
        'Hiện tại chúng tôi có các ưu đãi sau:\n\n🎁 Mã WELCOME2024: Giảm 10% cho đơn hàng đầu tiên\n🎁 Mã FREESHIP: Miễn phí vận chuyển cho đơn từ 500k\n\nNếu bạn là khách hàng mới, bạn có thể tiết kiệm được khoảng 3,399,000 VNĐ khi áp dụng mã WELCOME2024! 💰',
      context: JSON.stringify({
        intent: 'bot_response',
        promotions_shown: ['WELCOME2024', 'FREESHIP'],
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-20T09:01:45'),
    },
  });

  const session1_msg5 = await prisma.chatMessage.create({
    data: {
      userID: users[0].id,
      sessionID: 'session-001',
      message: 'Tuyệt vời! Vậy tôi có thể thanh toán bằng cách nào?',
      context: JSON.stringify({
        intent: 'payment_inquiry',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-20T09:03:00'),
    },
  });

  const session1_msg6 = await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-001',
      parentID: session1_msg5.id,
      message:
        'Chúng tôi hỗ trợ nhiều hình thức thanh toán:\n\n💳 Thẻ tín dụng/ghi nợ\n🏦 Chuyển khoản ngân hàng\n📱 Ví điện tử (MoMo, ZaloPay, VNPay)\n💵 Thanh toán khi nhận hàng (COD)\n\nBạn có muốn tôi thêm sản phẩm vào giỏ hàng và hướng dẫn đặt hàng không? 🛒',
      context: JSON.stringify({
        intent: 'bot_response',
        payment_methods_shown: true,
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-20T09:03:20'),
    },
  });

  const session1_msg7 = await prisma.chatMessage.create({
    data: {
      userID: users[0].id,
      sessionID: 'session-001',
      message: 'Vâng, hãy thêm vào giỏ hàng giúp tôi',
      context: JSON.stringify({
        intent: 'add_to_cart',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-20T09:04:00'),
    },
  });

  await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-001',
      parentID: session1_msg7.id,
      message:
        'Đã thêm iPhone 15 Pro Max 256GB vào giỏ hàng! ✅\n\n🛍️ Tổng giá trị giỏ hàng: 33,990,000 VNĐ\n💰 Sau khi áp mã WELCOME2024: 30,591,000 VNĐ\n\nBạn có thể vào trang Giỏ hàng để hoàn tất đơn hàng. Cảm ơn bạn đã tin tưởng TechStore! 🙏',
      context: JSON.stringify({
        intent: 'bot_response',
        action: 'added_to_cart',
        product_id: products[1].id,
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-20T09:04:15'),
    },
  });

  // ========== SESSION 2: User 1 (Trần Thị B) - Theo dõi đơn hàng ==========
  const session2_msg1 = await prisma.chatMessage.create({
    data: {
      userID: users[1].id,
      sessionID: 'session-002',
      message: 'Xin chào, tôi muốn kiểm tra trạng thái đơn hàng ORD-2024-0002',
      context: JSON.stringify({
        intent: 'order_tracking',
        order_number: 'ORD-2024-0002',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-21T14:30:00'),
    },
  });

  const session2_msg2 = await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-002',
      parentID: session2_msg1.id,
      message:
        'Xin chào! Tôi đã tìm thấy đơn hàng của bạn 🔍\n\n📦 Đơn hàng: #ORD-2024-0002\n📊 Trạng thái: Đang xử lý\n💵 Tổng tiền: 1,330,000 VNĐ\n\nĐơn hàng của bạn bao gồm:\n- Áo Sơ Mi Trắng Công Sở (Size M) x2\n- Váy Maxi Hoa Nhí (Size M) x1\n\nĐơn hàng đang được chuẩn bị và sẽ được giao trong 2-3 ngày tới! 🚚',
      context: JSON.stringify({
        intent: 'bot_response',
        order_found: true,
        order_id: orders[1].id,
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-21T14:30:20'),
    },
  });

  const session2_msg3 = await prisma.chatMessage.create({
    data: {
      userID: users[1].id,
      sessionID: 'session-002',
      message: 'Tuyệt vời! Tôi có thể thay đổi địa chỉ giao hàng không?',
      context: JSON.stringify({
        intent: 'change_address',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-21T14:32:00'),
    },
  });

  const session2_msg4 = await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-002',
      parentID: session2_msg3.id,
      message:
        'Đơn hàng của bạn đang ở trạng thái "Đang xử lý" nên vẫn có thể thay đổi địa chỉ! ✅\n\nĐể thay đổi địa chỉ giao hàng, bạn có thể:\n1️⃣ Vào mục "Đơn hàng của tôi" → Chọn đơn hàng → Nhấn "Sửa địa chỉ"\n2️⃣ Hoặc liên hệ hotline: 1900-xxxx để được hỗ trợ trực tiếp\n\nBạn cần hỗ trợ thêm gì nữa không? 😊',
      context: JSON.stringify({
        intent: 'bot_response',
        can_change_address: true,
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-21T14:32:25'),
    },
  });

  const session2_msg5 = await prisma.chatMessage.create({
    data: {
      userID: users[1].id,
      sessionID: 'session-002',
      message: 'Không, cảm ơn!',
      context: JSON.stringify({
        intent: 'end_conversation',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-21T14:33:00'),
    },
  });

  await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-002',
      parentID: session2_msg5.id,
      message:
        'Cảm ơn bạn đã mua sắm tại Fashion House Saigon! 🌸\n\nNếu có bất kỳ thắc mắc nào, đừng ngại liên hệ với tôi nhé. Chúc bạn một ngày tốt lành! 💖',
      context: JSON.stringify({
        intent: 'bot_response',
        session_ended: true,
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-21T14:33:10'),
    },
  });

  // ========== SESSION 3: User 2 (Lê Văn C) - Tư vấn nội thất ==========
  const session3_msg1 = await prisma.chatMessage.create({
    data: {
      userID: users[2].id,
      sessionID: 'session-003',
      message: 'Hi bot, tôi đang tìm ghế sofa cho phòng khách khoảng 25m2',
      context: JSON.stringify({
        intent: 'product_recommendation',
        category: 'furniture',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:15:00'),
    },
  });

  const session3_msg2 = await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-003',
      parentID: session3_msg1.id,
      message:
        'Xin chào! Tuyệt vời, tôi có thể giúp bạn tìm ghế sofa phù hợp! 🛋️\n\nVới phòng khách 25m2, tôi đề xuất:\n\n✨ Ghế Sofa 3 Chỗ Bọc Vải - Màu Xám\n💰 Giá: 8,500,000 VNĐ\n📐 Kích thước: Phù hợp với phòng 20-30m2\n🎨 Màu sắc: Xám hiện đại, dễ phối hợp\n✅ Còn hàng: 10 bộ\n\nChất liệu vải cao cấp, thiết kế tối giản nhưng sang trọng. Bạn có muốn xem thêm chi tiết không? 📸',
      context: JSON.stringify({
        intent: 'bot_response',
        products_recommended: [products[5].id],
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:15:30'),
    },
  });

  const session3_msg3 = await prisma.chatMessage.create({
    data: {
      userID: users[2].id,
      sessionID: 'session-003',
      message: 'Có màu khác không? Tôi muốn màu be hoặc kem',
      context: JSON.stringify({
        intent: 'color_inquiry',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:17:00'),
    },
  });

  const session3_msg4 = await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-003',
      parentID: session3_msg3.id,
      message:
        'Hiện tại model này chỉ có màu xám bạn nhé! 😅\n\nTuy nhiên, tôi có thể đề xuất một số lựa chọn khác:\n\n1️⃣ Bạn có thể liên hệ với cửa hàng để đặt hàng màu be/kem (thời gian: 2-3 tuần)\n2️⃣ Màu xám rất dễ kết hợp với gối trang trí màu be/kem để tạo điểm nhấn 🎨\n3️⃣ Hoặc tôi có thể tìm các mẫu sofa khác có màu bạn muốn\n\nBạn muốn làm theo cách nào? 🤔',
      context: JSON.stringify({
        intent: 'bot_response',
        alternative_suggested: true,
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:17:35'),
    },
  });

  const session3_msg5 = await prisma.chatMessage.create({
    data: {
      userID: users[2].id,
      sessionID: 'session-003',
      message: 'Ý tưởng phối gối hay đấy! Chính sách bảo hành như thế nào?',
      context: JSON.stringify({
        intent: 'warranty_inquiry',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:19:00'),
    },
  });

  const session3_msg6 = await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-003',
      parentID: session3_msg5.id,
      message:
        'Chính sách bảo hành của chúng tôi:\n\n🛡️ Bảo hành 2 năm cho khung sofa\n🛡️ Bảo hành 1 năm cho vải bọc và đệm\n🔄 Đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất\n🚚 Vận chuyển và lắp đặt miễn phí trong nội thành TP.HCM\n\nNgoài ra, chúng tôi còn hỗ trợ bảo dưỡng định kỳ với chi phí ưu đãi! 💪',
      context: JSON.stringify({
        intent: 'bot_response',
        warranty_info_provided: true,
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:19:40'),
    },
  });

  const session3_msg7 = await prisma.chatMessage.create({
    data: {
      userID: users[2].id,
      sessionID: 'session-003',
      message: 'OK, tôi sẽ đặt mua. Có thể thanh toán COD không?',
      context: JSON.stringify({
        intent: 'purchase_intent',
        payment_method: 'COD',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:21:00'),
    },
  });

  const session3_msg8 = await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-003',
      parentID: session3_msg7.id,
      message:
        'Rất tiếc, với sản phẩm nội thất giá trị cao (>5 triệu), chúng tôi không hỗ trợ COD 😔\n\nNhưng bạn có thể chọn:\n💳 Thanh toán online (giảm thêm 2%)\n🏦 Chuyển khoản trước 50%, còn lại khi nhận hàng\n💰 Trả góp 0% qua thẻ tín dụng (3-6 tháng)\n\nPhương thức nào phù hợp với bạn nhất? 🙂',
      context: JSON.stringify({
        intent: 'bot_response',
        payment_options_provided: true,
        cod_not_available: true,
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:21:30'),
    },
  });

  const session3_msg9 = await prisma.chatMessage.create({
    data: {
      userID: users[2].id,
      sessionID: 'session-003',
      message: 'Vậy tôi chọn chuyển khoản 50% trước',
      context: JSON.stringify({
        intent: 'payment_selected',
        method: 'partial_transfer',
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:23:00'),
    },
  });

  await prisma.chatMessage.create({
    data: {
      userID: aiModelUserID,
      sessionID: 'session-003',
      parentID: session3_msg9.id,
      message:
        'Tuyệt vời! Đây là hướng dẫn đặt hàng:\n\n1️⃣ Nhấn nút "Đặt hàng ngay" trên trang sản phẩm\n2️⃣ Điền thông tin giao hàng\n3️⃣ Chọn "Chuyển khoản một phần (50%)"\n4️⃣ Bạn sẽ nhận được thông tin chuyển khoản qua email\n\n💰 Số tiền cần chuyển: 4,250,000 VNĐ (50%)\n💰 Còn lại: 4,250,000 VNĐ (thanh toán khi nhận hàng)\n\nSau khi nhận được tiền, chúng tôi sẽ giao hàng trong 3-5 ngày! 🚛✨\n\nCảm ơn bạn đã tin tưởng HomeDecor & Living! 🏠💚',
      context: JSON.stringify({
        intent: 'bot_response',
        order_guidance_provided: true,
        payment_amount: 4250000,
        timestamp: new Date().toISOString(),
      }),
      createdAt: new Date('2024-01-22T10:23:45'),
    },
  });

  console.log('✅ Đã tạo chat messages (3 cuộc hội thoại đầy đủ)');

  // 22. Update vendor statistics
  await Promise.all([
    prisma.vendor.update({
      where: { id: vendors[0].id },
      data: {
        totalProducts: 3,
        totalOrders: 2,
      },
    }),
    prisma.vendor.update({
      where: { id: vendors[1].id },
      data: {
        totalProducts: 2,
        totalOrders: 2,
      },
    }),
    prisma.vendor.update({
      where: { id: vendors[2].id },
      data: {
        totalProducts: 2,
        totalOrders: 1,
      },
    }),
  ]);

  console.log('✅ Đã cập nhật thống kê vendors');

  console.log('🎉 Seed hoàn tất!');
  console.log('📊 Tổng kết dữ liệu:');
  console.log(`- Users: ${users.length}`);
  console.log(`- Vendors: ${vendors.length}`);
  console.log(`- Roles: ${roles.length}`);
  console.log(`- Permissions: ${permissions.length}`);
  console.log('- Categories: 8 (3 cha + 5 con)');
  console.log(`- Products: ${products.length}`);
  console.log(`- Product Variants: ${variants.length}`);
  console.log(`- Product Images: ${productImages.length}`);
  console.log(`- Orders: ${orders.length}`);
  console.log(`- Order Items: ${orderItems.length}`);
  console.log(`- Order Addresses: ${orderAddresses.length}`);
  console.log(`- Promotions: ${promotions.length}`);
  console.log(`- Carts: ${carts.length}`);
  console.log(`- Cart Items: ${cartItems.length}`);
  console.log(`- Payments: ${payments.length}`);
  console.log(`- Notifications: ${notifications.length}`);
  console.log(`- Chat Messages: ${await prisma.chatMessage.count()}`);
};
