import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import Button from '@/components/atoms/Button'
import Modal from '@/components/molecules/Modal'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '@/services/api/appointmentService'
import { getPatients } from '@/services/api/patientService'
import { getDoctors } from '@/services/api/doctorService'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week')
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    reason: '',
    notes: ''
  })

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        getAppointments(),
        getPatients(),
        getDoctors()
      ])
      setAppointments(appointmentsData)
      setPatients(patientsData)
      setDoctors(doctorsData)
    } catch (err) {
      setError('Failed to load appointments data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const getAppointmentsForDay = (date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date)
    )
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      timeSlot: '',
      reason: '',
      notes: ''
    })
    setEditingAppointment(null)
  }

  const openModal = (appointment = null) => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        reason: appointment.reason,
        notes: appointment.notes || ''
      })
      setEditingAppointment(appointment)
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
      if (editingAppointment) {
        const updatedAppointment = await updateAppointment(editingAppointment.Id, formData)
        setAppointments(prev => prev.map(a => a.Id === editingAppointment.Id ? updatedAppointment : a))
        toast.success('Appointment updated successfully')
      } else {
        const newAppointment = await createAppointment(formData)
        setAppointments(prev => [...prev, newAppointment])
        toast.success('Appointment booked successfully')
      }
      
      closeModal()
    } catch (err) {
      toast.error('Failed to save appointment')
    }
  }

  const handleDelete = async (appointment) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await deleteAppointment(appointment.Id)
        setAppointments(prev => prev.filter(a => a.Id !== appointment.Id))
        toast.success('Appointment cancelled successfully')
      } catch (err) {
        toast.error('Failed to cancel appointment')
      }
    }
  }

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === parseInt(patientId))
    return patient ? patient.name : 'Unknown Patient'
  }

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.Id === parseInt(doctorId))
    return doctor ? doctor.name : 'Unknown Doctor'
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
          <h1 className="text-3xl font-bold text-gray-900 font-display">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage patient appointments and scheduling</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => openModal()}
          className="mt-4 sm:mt-0"
        >
          Book Appointment
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              icon="ChevronLeft"
              onClick={() => setCurrentDate(addDays(currentDate, -7))}
            />
            <h2 className="text-lg font-semibold text-gray-900">
              Week of {format(getWeekDays()[0], 'MMM d, yyyy')}
            </h2>
            <Button
              variant="ghost"
              icon="ChevronRight"
              onClick={() => setCurrentDate(addDays(currentDate, 7))}
            />
          </div>
          <Button
            variant="secondary"
            icon="Calendar"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>

        {appointments.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No appointments scheduled"
            description="Start by booking your first appointment."
            actionLabel="Book Appointment"
            onAction={() => openModal()}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {getWeekDays().map((day) => {
              const dayAppointments = getAppointmentsForDay(day)
              const isToday = isSameDay(day, new Date())
              
              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    isToday 
                      ? 'bg-primary-50 border-primary-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-center mb-3">
                    <p className="text-sm font-medium text-gray-600">
                      {format(day, 'EEE')}
                    </p>
                    <p className={`text-lg font-bold ${
                      isToday ? 'text-primary-600' : 'text-gray-900'
                    }`}>
                      {format(day, 'd')}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.Id}
                        className="p-2 bg-white rounded border border-gray-200 text-xs cursor-pointer hover:shadow-sm transition-shadow"
                        onClick={() => openModal(appointment)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">
                            {appointment.timeSlot}
                          </span>
                          <Badge variant={appointment.status || 'pending'}>
                            {appointment.status || 'pending'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 truncate">
                          {getPatientName(appointment.patientId)}
                        </p>
                        <p className="text-gray-500 truncate">
                          {getDoctorName(appointment.doctorId)}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              label="Doctor"
              value={formData.doctorId}
              onChange={(e) => handleInputChange('doctorId', e.target.value)}
              options={doctors.map(d => ({ value: d.Id, label: `${d.name} - ${d.specialization}` }))}
              placeholder="Select doctor"
              required
            />
            <FormField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
            <FormField
              type="select"
              label="Time Slot"
              value={formData.timeSlot}
              onChange={(e) => handleInputChange('timeSlot', e.target.value)}
              options={timeSlots.map(time => ({ value: time, label: time }))}
              placeholder="Select time"
              required
            />
          </div>
          
          <FormField
            label="Reason for Visit"
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            required
          />

          <FormField
            label="Notes (Optional)"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>
            {editingAppointment && (
              <Button
                type="button"
                variant="danger"
                onClick={() => handleDelete(editingAppointment)}
              >
                Cancel Appointment
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
            >
              {editingAppointment ? 'Update Appointment' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Appointments