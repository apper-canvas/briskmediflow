import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/molecules/Modal'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { getBills, createBill, updateBill, deleteBill } from '@/services/api/billingService'
import { getPatients } from '@/services/api/patientService'
import { getAppointments } from '@/services/api/appointmentService'

const Billing = () => {
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBill, setEditingBill] = useState(null)
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    paidAmount: 0,
    status: 'pending'
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [billsData, patientsData, appointmentsData] = await Promise.all([
        getBills(),
        getPatients(),
        getAppointments()
      ])
      setBills(billsData)
      setPatients(patientsData)
      setAppointments(appointmentsData)
    } catch (err) {
      setError('Failed to load billing data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredBills = bills.filter(bill => {
    const patient = patients.find(p => p.Id === parseInt(bill.patientId))
    const patientName = patient ? patient.name.toLowerCase() : ''
    return patientName.includes(searchTerm.toLowerCase()) ||
           bill.Id.toString().includes(searchTerm)
  })

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0)
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      appointmentId: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      paidAmount: 0,
      status: 'pending'
    })
    setEditingBill(null)
  }

  const openModal = (bill = null) => {
    if (bill) {
      setFormData({
        patientId: bill.patientId,
        appointmentId: bill.appointmentId || '',
        items: bill.items || [{ description: '', quantity: 1, unitPrice: 0 }],
        paidAmount: bill.paidAmount || 0,
        status: bill.status || 'pending'
      })
      setEditingBill(bill)
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value }
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, items: newItems }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const billData = {
        ...formData,
        totalAmount: calculateTotal(formData.items),
        date: new Date().toISOString().split('T')[0]
      }

      if (editingBill) {
        const updatedBill = await updateBill(editingBill.Id, billData)
        setBills(prev => prev.map(b => b.Id === editingBill.Id ? updatedBill : b))
        toast.success('Bill updated successfully')
      } else {
        const newBill = await createBill(billData)
        setBills(prev => [...prev, newBill])
        toast.success('Bill created successfully')
      }
      
      closeModal()
    } catch (err) {
      toast.error('Failed to save bill')
    }
  }

  const handleDelete = async (bill) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await deleteBill(bill.Id)
        setBills(prev => prev.filter(b => b.Id !== bill.Id))
        toast.success('Bill deleted successfully')
      } catch (err) {
        toast.error('Failed to delete bill')
      }
    }
  }

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === parseInt(patientId))
    return patient ? patient.name : 'Unknown Patient'
  }

  const getBillStatusVariant = (status) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'overdue': return 'error'
      default: return 'default'
    }
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Billing</h1>
          <p className="text-gray-600 mt-1">Manage patient bills and payments</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => openModal()}
          className="mt-4 sm:mt-0"
        >
          Create Bill
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search bills by patient name or bill ID..."
          />
        </div>

        {filteredBills.length === 0 ? (
          <Empty
            icon="Receipt"
            title="No bills found"
            description={searchTerm ? "No bills match your search criteria." : "Start by creating your first bill."}
            actionLabel={!searchTerm ? "Create Bill" : undefined}
            onAction={!searchTerm ? () => openModal() : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Bill ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Paid Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <motion.tr
                    key={bill.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm">#{bill.Id.toString().padStart(4, '0')}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                          <ApperIcon name="User" size={14} className="text-white" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {getPatientName(bill.patientId)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">
                        {format(new Date(bill.date), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">
                        ${bill.totalAmount?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">
                        ${bill.paidAmount?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getBillStatusVariant(bill.status)}>
                        {bill.status || 'pending'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => openModal(bill)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Download"
                          onClick={() => toast.info('PDF generation feature coming soon!')}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDelete(bill)}
                          className="text-error hover:text-error hover:bg-error/10"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBill ? 'Edit Bill' : 'Create New Bill'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              type="select"
              label="Patient"
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              options={patients.map(p => ({ value: p.Id, label: p.name }))}
              placeholder="Select patient"
              required
            />
            <FormField
              type="select"
              label="Related Appointment (Optional)"
              value={formData.appointmentId}
              onChange={(e) => handleInputChange('appointmentId', e.target.value)}
              options={appointments.map(a => ({ 
                value: a.Id, 
                label: `${format(new Date(a.date), 'MMM d')} - ${a.timeSlot}` 
              }))}
              placeholder="Select appointment"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Bill Items</h4>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon="Plus"
                onClick={addItem}
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="md:col-span-2">
                    <FormField
                      label="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Service or item description"
                      required
                    />
                  </div>
                  <FormField
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                    required
                  />
                  <FormField
                    label="Unit Price ($)"
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    min="0"
                    required
                  />
                  <div className="flex items-end">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total
                      </label>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={() => removeItem(index)}
                            className="text-error hover:text-error hover:bg-error/10 !p-1"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4 p-3 bg-primary-50 rounded-lg">
              <div className="text-right">
                <p className="text-sm text-gray-600">Grand Total</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${calculateTotal(formData.items).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Paid Amount ($)"
              type="number"
              step="0.01"
              value={formData.paidAmount}
              onChange={(e) => handleInputChange('paidAmount', e.target.value)}
              min="0"
            />
            <FormField
              type="select"
              label="Payment Status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'paid', label: 'Paid' },
                { value: 'overdue', label: 'Overdue' }
              ]}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingBill ? 'Update Bill' : 'Create Bill'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Billing