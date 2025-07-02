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
import { getMedicines, createMedicine, updateMedicine, deleteMedicine } from '@/services/api/inventoryService'

const Inventory = () => {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    minStock: '',
    expiryDate: ''
  })

  const categories = [
    { value: 'Tablets', label: 'Tablets' },
    { value: 'Capsules', label: 'Capsules' },
    { value: 'Syrups', label: 'Syrups' },
    { value: 'Injections', label: 'Injections' },
    { value: 'Ointments', label: 'Ointments' },
    { value: 'Drops', label: 'Drops' },
    { value: 'Inhalers', label: 'Inhalers' },
    { value: 'Surgical Supplies', label: 'Surgical Supplies' },
    { value: 'Other', label: 'Other' }
  ]

  const units = [
    { value: 'pieces', label: 'Pieces' },
    { value: 'bottles', label: 'Bottles' },
    { value: 'vials', label: 'Vials' },
    { value: 'tubes', label: 'Tubes' },
    { value: 'boxes', label: 'Boxes' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'liters', label: 'Liters' }
  ]

  const loadMedicines = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMedicines()
      setMedicines(data)
    } catch (err) {
      setError('Failed to load medicines')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMedicines()
  }, [])

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockStatus = (medicine) => {
    if (medicine.quantity <= 0) return { status: 'out-of-stock', label: 'Out of Stock', variant: 'error' }
    if (medicine.quantity <= medicine.minStock) return { status: 'low-stock', label: 'Low Stock', variant: 'warning' }
    return { status: 'in-stock', label: 'In Stock', variant: 'success' }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: '',
      unit: '',
      minStock: '',
      expiryDate: ''
    })
    setEditingMedicine(null)
  }

  const openModal = (medicine = null) => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        category: medicine.category,
        quantity: medicine.quantity.toString(),
        unit: medicine.unit,
        minStock: medicine.minStock.toString(),
        expiryDate: medicine.expiryDate
      })
      setEditingMedicine(medicine)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const medicineData = {
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        minStock: parseInt(formData.minStock) || 0
      }

      if (editingMedicine) {
        const updatedMedicine = await updateMedicine(editingMedicine.Id, medicineData)
        setMedicines(prev => prev.map(m => m.Id === editingMedicine.Id ? updatedMedicine : m))
        toast.success('Medicine updated successfully')
      } else {
        const newMedicine = await createMedicine(medicineData)
        setMedicines(prev => [...prev, newMedicine])
        toast.success('Medicine added successfully')
      }
      
      closeModal()
    } catch (err) {
      toast.error('Failed to save medicine')
    }
  }

  const handleDelete = async (medicine) => {
    if (window.confirm(`Are you sure you want to remove ${medicine.name}?`)) {
      try {
        await deleteMedicine(medicine.Id)
        setMedicines(prev => prev.filter(m => m.Id !== medicine.Id))
        toast.success('Medicine removed successfully')
      } catch (err) {
        toast.error('Failed to remove medicine')
      }
    }
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadMedicines} />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Inventory</h1>
          <p className="text-gray-600 mt-1">Manage medicine stock and supplies</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => openModal()}
          className="mt-4 sm:mt-0"
        >
          Add Medicine
        </Button>
      </motion.div>

      {/* Stock Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <ApperIcon name="Package" size={24} className="text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-warning">
                {medicines.filter(m => m.quantity <= m.minStock && m.quantity > 0).length}
              </p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <ApperIcon name="AlertTriangle" size={24} className="text-warning" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-error">
                {medicines.filter(m => m.quantity <= 0).length}
              </p>
            </div>
            <div className="p-3 bg-error/10 rounded-lg">
              <ApperIcon name="AlertCircle" size={24} className="text-error" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search medicines by name or category..."
          />
        </div>

        {filteredMedicines.length === 0 ? (
          <Empty
            icon="Package"
            title="No medicines found"
            description={searchTerm ? "No medicines match your search criteria." : "Start by adding your first medicine to inventory."}
            actionLabel={!searchTerm ? "Add Medicine" : undefined}
            onAction={!searchTerm ? () => openModal() : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Medicine</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Current Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Min Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Expiry Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((medicine) => {
                  const stockStatus = getStockStatus(medicine)
                  return (
                    <motion.tr
                      key={medicine.Id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
                            <ApperIcon name="Pill" size={16} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{medicine.name}</p>
                            <p className="text-sm text-gray-600">{medicine.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="default">{medicine.category}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          {medicine.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">{medicine.minStock}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">
                          {format(new Date(medicine.expiryDate), 'MMM d, yyyy')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Edit"
                            onClick={() => openModal(medicine)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={() => handleDelete(medicine)}
                            className="text-error hover:text-error hover:bg-error/10"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Medicine Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <FormField
              type="select"
              label="Category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              options={categories}
              required
            />
            <FormField
              label="Current Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              min="0"
              required
            />
            <FormField
              type="select"
              label="Unit"
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              options={units}
              required
            />
            <FormField
              label="Minimum Stock Level"
              type="number"
              value={formData.minStock}
              onChange={(e) => handleInputChange('minStock', e.target.value)}
              min="0"
              required
            />
            <FormField
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
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
              {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Inventory