import uuid
from datetime import datetime
from typing import List, Dict, Optional
import logging

from ..models import QueuedStock, QueuedStockCreate
from .stock_service import StockService

logger = logging.getLogger(__name__)

class QueueService:
    """Service for managing user stock queues"""
    
    def __init__(self):
        # In production, this would be a database
        self.queues: Dict[str, List[QueuedStock]] = {}
        self.stock_service = StockService()
    
    def get_user_queue(self, user_id: str) -> List[QueuedStock]:
        """Get user's stock queue"""
        return self.queues.get(user_id, [])
    
    def add_to_queue(self, user_id: str, queue_item: QueuedStockCreate) -> QueuedStock:
        """Add stock to user's queue"""
        try:
            # Validate stock exists
            stock = self.stock_service.get_stock(queue_item.symbol)
            if not stock:
                raise ValueError(f"Stock {queue_item.symbol} not found")
            
            # Initialize queue if needed
            if user_id not in self.queues:
                self.queues[user_id] = []
            
            # Check if already in queue
            existing = next((q for q in self.queues[user_id] if q.symbol == queue_item.symbol), None)
            if existing:
                # Update confidence level instead of adding duplicate
                existing.confidence = queue_item.confidence
                logger.info(f"Updated confidence for {queue_item.symbol} in queue for user {user_id}")
                return existing
            
            # Create new queue item
            queued_stock = QueuedStock(
                id=str(uuid.uuid4()),
                user_id=user_id,
                addedAt=datetime.utcnow(),
                **queue_item.dict()
            )
            
            self.queues[user_id].append(queued_stock)
            
            logger.info(f"Added {queue_item.symbol} to queue for user {user_id}")
            return queued_stock
            
        except Exception as e:
            logger.error(f"Error adding to queue: {str(e)}")
            raise
    
    def remove_from_queue(self, user_id: str, symbol: str) -> bool:
        """Remove stock from user's queue"""
        try:
            if user_id not in self.queues:
                return False
            
            initial_length = len(self.queues[user_id])
            self.queues[user_id] = [
                q for q in self.queues[user_id] 
                if q.symbol != symbol.upper()
            ]
            
            removed = len(self.queues[user_id]) < initial_length
            
            if removed:
                logger.info(f"Removed {symbol} from queue for user {user_id}")
            
            return removed
            
        except Exception as e:
            logger.error(f"Error removing from queue: {str(e)}")
            return False
    
    def clear_queue(self, user_id: str) -> bool:
        """Clear user's entire queue"""
        try:
            if user_id in self.queues:
                queue_size = len(self.queues[user_id])
                self.queues[user_id] = []
                logger.info(f"Cleared queue for user {user_id} ({queue_size} items)")
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error clearing queue: {str(e)}")
            return False
    
    def is_in_queue(self, user_id: str, symbol: str) -> bool:
        """Check if stock is in user's queue"""
        if user_id not in self.queues:
            return False
        
        return any(q.symbol == symbol.upper() for q in self.queues[user_id])
    
    def get_queue_stats(self, user_id: str) -> Dict:
        """Get queue statistics for user"""
        try:
            queue = self.get_user_queue(user_id)
            
            if not queue:
                return {
                    "totalStocks": 0,
                    "confidenceBreakdown": {},
                    "sectorBreakdown": {},
                    "totalValue": 0,
                    "averagePrice": 0
                }
            
            # Confidence breakdown
            confidence_counts = {}
            for item in queue:
                conf = item.confidence.value
                confidence_counts[conf] = confidence_counts.get(conf, 0) + 1
            
            # Sector breakdown and value calculation
            sector_counts = {}
            total_value = 0
            total_price = 0
            
            for item in queue:
                stock = self.stock_service.get_stock(item.symbol)
                if stock:
                    # Sector breakdown
                    sector = stock.sector
                    sector_counts[sector] = sector_counts.get(sector, 0) + 1
                    
                    # Value calculation (assuming 1 share per item for stats)
                    total_value += stock.price
                    total_price += stock.price
            
            average_price = total_price / len(queue) if queue else 0
            
            return {
                "totalStocks": len(queue),
                "confidenceBreakdown": confidence_counts,
                "sectorBreakdown": sector_counts,
                "totalValue": round(total_value, 2),
                "averagePrice": round(average_price, 2)
            }
            
        except Exception as e:
            logger.error(f"Error getting queue stats: {str(e)}")
            return {}
    
    def reorder_queue(self, user_id: str, new_order: List[str]) -> bool:
        """Reorder queue based on symbol list"""
        try:
            if user_id not in self.queues:
                return False
            
            current_queue = self.queues[user_id]
            
            # Create mapping of symbols to queue items
            symbol_to_item = {item.symbol: item for item in current_queue}
            
            # Reorder based on new_order list
            reordered_queue = []
            for symbol in new_order:
                if symbol in symbol_to_item:
                    reordered_queue.append(symbol_to_item[symbol])
            
            # Add any items not in new_order to the end
            for item in current_queue:
                if item.symbol not in new_order:
                    reordered_queue.append(item)
            
            self.queues[user_id] = reordered_queue
            
            logger.info(f"Reordered queue for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error reordering queue: {str(e)}")
            return False
    
    def get_queue_with_stock_data(self, user_id: str) -> List[Dict]:
        """Get queue with enriched stock data"""
        try:
            queue = self.get_user_queue(user_id)
            enriched_queue = []
            
            for queue_item in queue:
                stock = self.stock_service.get_stock(queue_item.symbol)
                if stock:
                    enriched_item = {
                        "id": queue_item.id,
                        "symbol": queue_item.symbol,
                        "confidence": queue_item.confidence.value,
                        "addedAt": queue_item.addedAt.isoformat(),
                        "stock": {
                            "name": stock.name,
                            "price": stock.price,
                            "change": stock.change,
                            "changePercent": stock.changePercent,
                            "sector": stock.sector,
                            "marketCap": stock.marketCap,
                            "risk": stock.risk.value
                        }
                    }
                    enriched_queue.append(enriched_item)
            
            return enriched_queue
            
        except Exception as e:
            logger.error(f"Error getting enriched queue: {str(e)}")
            return []
    
    def export_queue(self, user_id: str, format: str = "json") -> Dict:
        """Export user's queue in specified format"""
        try:
            enriched_queue = self.get_queue_with_stock_data(user_id)
            stats = self.get_queue_stats(user_id)
            
            export_data = {
                "export_timestamp": datetime.utcnow().isoformat(),
                "user_id": user_id,
                "queue_stats": stats,
                "queue_items": enriched_queue
            }
            
            logger.info(f"Exported queue for user {user_id} in {format} format")
            return export_data
            
        except Exception as e:
            logger.error(f"Error exporting queue: {str(e)}")
            return {}
