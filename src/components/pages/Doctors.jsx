import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/molecules/Modal'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '@/services/api/doctorService'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    consultationFee: '',
    morningStart: '09:00',
    morningEnd: '12:00',
    eveningStart: '14:00',
    eveningEnd: '17:00',
    workingDays: []
  })

  const specializations = [
    { value: 'General Medicine', label: 'General Medicine' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Gynecology', label: 'Gynecology' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'Emergency Medicine', label: 'Emergency Medicine' }
  ]

  const workingDaysOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]

  const loadDoctors = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getDoctors()
      setDoctors(data)
    } catch (err) {
      setError('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.phone.includes(searchTerm) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      consultationFee: '',
      morningStart: '09:00',
      morningEnd: '12:00',
      eveningStart: '14:00',
      eveningEnd: '17:00',
      workingDays: []
    })
    setEditingDoctor(null)
  }

  const openModal = (doctor = null) => {
    if (doctor) {
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        email: doctor.email,
        phone: doctor.phone,
        consultationFee: doctor.consultationFee?.toString() || '',
        morningStart: doctor.schedule?.morning?.start || '09:00',
        morningEnd: doctor.schedule?.morning?.end || '12:00',
        eveningStart: doctor.schedule?.evening?.start || '14:00',
        eveningEnd: doctor.schedule?.evening?.end || '17:00',
        workingDays: doctor.schedule?.workingDays || []
      })
      setEditingDoctor(doctor)
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

  const handleWorkingDaysChange = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const doctorData = {
        ...formData,
        consultationFee: parseFloat(formData.consultationFee) || 0,
        schedule: {
          morning: {
            start: formData.morningStart,
            end: formData.morningEnd
          },
          evening: {
            start: formData.eveningStart,
            end: formData.eveningEnd
          },
          workingDays: formData.workingDays
        }
      }

      if (editingDoctor) {
        const updatedDoctor = await updateDoctor(editingDoctor.Id, doctorData)
        setDoctors(prev => prev.map(d => d.Id === editingDoctor.Id ? updatedDoctor : d))
        toast.success('Doctor updated successfully')
      } else {
        const newDoctor = await createDoctor(doctorData)
        setDoctors(prev => [...prev, newDoctor])
        toast.success('Doctor added successfully')
      }
      
      closeModal()
    } catch (err) {
      toast.error('Failed to save doctor')
    }
  }

  const handleDelete = async (doctor) => {
    if (window.confirm(`Are you sure you want to remove Dr. ${doctor.name}?`)) {
      try {
        await deleteDoctor(doctor.Id)
        setDoctors(prev => prev.filter(d => d.Id !== doctor.Id))
        toast.success('Doctor removed successfully')
      } catch (err) {
        toast.error('Failed to remove doctor')
      }
    }
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadDoctors} />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Doctors</h1>
          <p className="text-gray-600 mt-1">Manage doctor profiles and schedules</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => openModal()}
          className="mt-4 sm:mt-0"
        >
          Add Doctor
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
            placeholder="Search doctors by name, specialization, phone, or email..."
          />
        </div>

        {filteredDoctors.length === 0 ? (
          <Empty
            icon="UserCheck"
            title="No doctors found"
            description={searchTerm ? "No doctors match your search criteria." : "Start by adding your first doctor."}
            actionLabel={!searchTerm ? "Add Doctor" : undefined}
            onAction={!searchTerm ? () => openModal() : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                      <ApperIcon name="UserCheck" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dr. {doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => openModal(doctor)}
                      className="!p-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(doctor)}
                      className="!p-1 text-error hover:text-error hover:bg-error/10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Phone" size={16} className="mr-2" />
                    {doctor.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Mail" size={16} className="mr-2" />
                    {doctor.email}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultation Fee:</span>
                    <Badge variant="info">${doctor.consultationFee}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Working Days:</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.schedule?.workingDays?.map(day => (
                        <Badge key={day} variant="default" size="sm">
                          {day.slice(0, 3)}
                        </Badge>
  )) || <span className="text-xs text-gray-500">Not set</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Schedule:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Morning: {doctor.schedule?.morning?.start} - {doctor.schedule?.morning?.end}</div>
                      <div>Evening: {doctor.schedule?.evening?.start} - {doctor.schedule?.evening?.end}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Doctor Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <FormField
              type="select"
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              options={specializations}
              required
            />
            <FormField
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          
          <FormField
            label="Consultation Fee ($)"
            type="number"
            value={formData.consultationFee}
            onChange={(e) => handleInputChange('consultationFee', e.target.value)}
            required
          />

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Working Schedule</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Days
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {workingDaysOptions.map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.workingDays.includes(day)}
                      onChange={() => handleWorkingDaysChange(day)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                label="Morning Start"
                type="time"
                value={formData.morningStart}
                onChange={(e) => handleInputChange('morningStart', e.target.value)}
              />
              <FormField
                label="Morning End"
                type="time"
                value={formData.morningEnd}
                onChange={(e) => handleInputChange('morningEnd', e.target.value)}
              />
              <FormField
                label="Evening Start"
                type="time"
                value={formData.eveningStart}
                onChange={(e) => handleInputChange('eveningStart', e.target.value)}
              />
              <FormField
                label="Evening End"
                type="time"
                value={formData.eveningEnd}
                onChange={(e) => handleInputChange('eveningEnd', e.target.value)}
              />
            </div>
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
              {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Doctors