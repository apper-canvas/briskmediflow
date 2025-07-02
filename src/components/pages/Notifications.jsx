import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import notificationService from '@/services/api/notificationService'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, searchTerm, filterType, filterStatus])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await notificationService.getAll()
      setNotifications(data)
    } catch (err) {
      setError('Failed to load notifications')
      console.error('Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterNotifications = () => {
    let filtered = notifications

    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.type === filterType)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(notification => 
        filterStatus === 'read' ? notification.read : !notification.read
      )
    }

    setFilteredNotifications(filtered)
  }

  const handleMarkAsRead = async (id) => {
    try {
      const notification = notifications.find(n => n.Id === id)
      if (notification && !notification.read) {
        await notificationService.update(id, { ...notification, read: true })
        setNotifications(prev => 
          prev.map(n => n.Id === id ? { ...n, read: true } : n)
        )
        toast.success('Notification marked as read')
      }
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  const handleMarkAsUnread = async (id) => {
    try {
      const notification = notifications.find(n => n.Id === id)
      if (notification && notification.read) {
        await notificationService.update(id, { ...notification, read: false })
        setNotifications(prev => 
          prev.map(n => n.Id === id ? { ...n, read: false } : n)
        )
        toast.success('Notification marked as unread')
      }
    } catch (error) {
      toast.error('Failed to mark notification as unread')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await notificationService.delete(id)
        setNotifications(prev => prev.filter(n => n.Id !== id))
        toast.success('Notification deleted')
      } catch (error) {
        toast.error('Failed to delete notification')
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read)
      await Promise.all(
        unreadNotifications.map(notification =>
          notificationService.update(notification.Id, { ...notification, read: true })
        )
      )
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all notifications as read')
    }
  }

  const showDetail = (notification) => {
    setSelectedNotification(notification)
    setShowDetailModal(true)
    if (!notification.read) {
      handleMarkAsRead(notification.Id)
    }
  }

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

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadNotifications} />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Notifications</h1>
          <p className="mt-2 text-gray-600">
            {unreadCount > 0 && `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="mt-4 sm:mt-0"
          >
            Mark All as Read
          </Button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search notifications..."
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="appointment">Appointments</option>
              <option value="patient">Patients</option>
              <option value="system">System</option>
              <option value="alert">Alerts</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Bell" size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:bg-gray-50 ${
                  notification.read 
                    ? 'border-gray-300 bg-gray-50/50' 
                    : 'border-primary-500 bg-white'
                }`}
                onClick={() => showDetail(notification)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${getNotificationColor(notification.type)}`}>
                      <ApperIcon name={getNotificationIcon(notification.type)} size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className={`text-lg font-medium ${
                          notification.read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-primary-500 rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-400">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              notification.read 
                                ? handleMarkAsUnread(notification.Id)
                                : handleMarkAsRead(notification.Id)
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {notification.read ? 'Mark Unread' : 'Mark Read'}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(notification.Id)
                            }}
                            className="text-gray-400 hover:text-red-600 !p-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Notification Details"
        size="md"
      >
        {selectedNotification && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${getNotificationColor(selectedNotification.type)}`}>
                <ApperIcon name={getNotificationIcon(selectedNotification.type)} size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedNotification.title}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {selectedNotification.type} notification
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-line">
                {selectedNotification.message}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {formatDistanceToNow(new Date(selectedNotification.timestamp), { addSuffix: true })}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                selectedNotification.read 
                  ? 'bg-gray-100 text-gray-600' 
                  : 'bg-primary-100 text-primary-600'
              }`}>
                {selectedNotification.read ? 'Read' : 'Unread'}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Notifications