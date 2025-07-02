import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const NotificationPanel = ({ isOpen, onClose, notifications, onNotificationRead }) => {
  const navigate = useNavigate()

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return 'Calendar'
      case 'patient':
        return 'User'
      case 'system':
        return 'Settings'
      case 'alert':
        return 'AlertTriangle'
      default:
        return 'Bell'
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'text-blue-600 bg-blue-50'
      case 'patient':
        return 'text-green-600 bg-green-50'
      case 'system':
        return 'text-gray-600 bg-gray-50'
      case 'alert':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-primary-600 bg-primary-50'
    }
  }

  const handleNotificationClick = (notification) => {
    onNotificationRead(notification.Id)
    onClose()
  }

  const handleViewAll = () => {
    navigate('/notifications')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={onClose}
                  className="!p-1"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <ApperIcon name="Bell" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.Id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                        notification.read 
                          ? 'border-transparent opacity-75' 
                          : 'border-primary-500'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          <ApperIcon name={getNotificationIcon(notification.type)} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full text-primary-600 hover:text-primary-700"
                  onClick={handleViewAll}
                >
                  View All Notifications
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationPanel