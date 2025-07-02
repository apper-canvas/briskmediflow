import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getReportsData } from '@/services/api/reportsService'

const Reports = () => {
  const [reportsData, setReportsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState('month')

  const loadReportsData = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getReportsData()
      setReportsData(data)
    } catch (err) {
      setError('Failed to load reports data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportsData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadReportsData} />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and view hospital operational reports</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
          </select>
          <Button variant="primary" icon="Download">
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {reportsData?.totalPatients || 0}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <ApperIcon name="Users" size={24} className="text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {reportsData?.totalAppointments || 0}
              </p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <ApperIcon name="Calendar" size={24} className="text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold gradient-text font-display">
                ${reportsData?.totalRevenue?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="p-3 bg-accent-100 rounded-lg">
              <ApperIcon name="DollarSign" size={24} className="text-accent-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Bills</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {reportsData?.pendingBills || 0}
              </p>
            </div>
            <div className="p-3 bg-warning/20 rounded-lg">
              <ApperIcon name="AlertCircle" size={24} className="text-warning" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Recent Appointments
            </h3>
            <ApperIcon name="Calendar" size={20} className="text-primary-500" />
          </div>

          <div className="space-y-4">
            {reportsData?.recentAppointments?.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{appointment.patientName}</p>
                  <p className="text-sm text-gray-600">
                    {appointment.doctorName} • {format(new Date(appointment.date), 'MMM d')} at {appointment.timeSlot}
                  </p>
                </div>
                <span className={`status-${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No recent appointments</p>
            )}
          </div>
        </motion.div>

        {/* Revenue Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Revenue Breakdown
            </h3>
            <ApperIcon name="PieChart" size={20} className="text-secondary-500" />
          </div>

          <div className="space-y-4">
            {reportsData?.revenueBreakdown?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-500 mr-3"></div>
                  <span className="text-gray-700">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${item.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No revenue data available</p>
            )}
          </div>
        </motion.div>

        {/* Top Medicines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Low Stock Medicines
            </h3>
            <ApperIcon name="Package" size={20} className="text-warning" />
          </div>

          <div className="space-y-4">
            {reportsData?.lowStockMedicines?.map((medicine, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{medicine.name}</p>
                  <p className="text-sm text-gray-600">{medicine.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-warning">{medicine.quantity} left</p>
                  <p className="text-xs text-gray-500">Min: {medicine.minStock}</p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">All medicines are well stocked</p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Quick Reports
            </h3>
            <ApperIcon name="FileText" size={20} className="text-accent-600" />
          </div>

          <div className="space-y-3">
            <Button
              variant="secondary"
              icon="FileText"
              className="w-full justify-start"
            >
              Patient Registration Report
            </Button>
            <Button
              variant="secondary"
              icon="Calendar"
              className="w-full justify-start"
            >
              Appointment Summary Report
            </Button>
            <Button
              variant="secondary"
              icon="Receipt"
              className="w-full justify-start"
            >
              Billing Summary Report
            </Button>
            <Button
              variant="secondary"
              icon="Package"
              className="w-full justify-start"
            >
              Inventory Status Report
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Reports