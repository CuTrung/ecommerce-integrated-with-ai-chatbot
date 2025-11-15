import { Promotion } from '../../promotions/entities/promotion.entity';
import { Order } from '../../orders/entities/order.entity';

export class ExportOrderPromotionsDto {
  orderIDs: Order['id'][];
  promotionIDs: Promotion['id'][];
}
