import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getDashboardStats } from '@/services/api/dashboardService'

const Dashboard = () => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getDashboardStats()
      setStats(data)
    } catch (err) {
      setError('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadDashboardStats} />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening at your hospital today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
      >
        {/* Today's Appointments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Today's Appointments
            </h3>
            <ApperIcon name="Calendar" size={20} className="text-primary-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-600">Dr. Smith • 10:00 AM</p>
              </div>
              <span className="status-confirmed">Confirmed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Jane Wilson</p>
                <p className="text-sm text-gray-600">Dr. Johnson • 2:30 PM</p>
              </div>
              <span className="status-pending">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Bob Brown</p>
                <p className="text-sm text-gray-600">Dr. Davis • 4:15 PM</p>
              </div>
              <span className="status-confirmed">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Low Stock Alerts
            </h3>
            <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Paracetamol 500mg</p>
                <p className="text-sm text-gray-600">Only 15 tablets left</p>
              </div>
              <span className="status-low-stock">Low Stock</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Bandages</p>
                <p className="text-sm text-gray-600">Only 8 rolls left</p>
              </div>
              <span className="status-low-stock">Low Stock</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-error/5 border border-error/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Insulin</p>
                <p className="text-sm text-gray-600">Only 3 vials left</p>
              </div>
              <span className="status-low-stock">Critical</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard