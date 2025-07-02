import { delay } from '@/utils/helpers'
import appointmentsData from '@/services/mockData/appointments.json'

let appointments = [...appointmentsData]

export const getAppointments = async () => {
  await delay(400)
  return [...appointments]
}

export const getAppointmentById = async (id) => {
  await delay(200)
  const appointment = appointments.find(a => a.Id === parseInt(id))
  if (!appointment) throw new Error('Appointment not found')
  return { ...appointment }
}

export const createAppointment = async (appointmentData) => {
  await delay(300)
  const newId = Math.max(...appointments.map(a => a.Id)) + 1
  const newAppointment = {
    Id: newId,
    ...appointmentData,
    status: 'pending'
  }
  appointments.push(newAppointment)
  return { ...newAppointment }
}

export const updateAppointment = async (id, appointmentData) => {
  await delay(300)
  const index = appointments.findIndex(a => a.Id === parseInt(id))
  if (index === -1) throw new Error('Appointment not found')
  
  appointments[index] = { ...appointments[index], ...appointmentData }
  return { ...appointments[index] }
}

export const deleteAppointment = async (id) => {
  await delay(200)
  const index = appointments.findIndex(a => a.Id === parseInt(id))
  if (index === -1) throw new Error('Appointment not found')
  
  appointments.splice(index, 1)
  return true
}