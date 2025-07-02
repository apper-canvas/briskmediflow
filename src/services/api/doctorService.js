import { delay } from '@/utils/helpers'
import doctorsData from '@/services/mockData/doctors.json'

let doctors = [...doctorsData]

export const getDoctors = async () => {
  await delay(400)
  return [...doctors]
}

export const getDoctorById = async (id) => {
  await delay(200)
  const doctor = doctors.find(d => d.Id === parseInt(id))
  if (!doctor) throw new Error('Doctor not found')
  return { ...doctor }
}

export const createDoctor = async (doctorData) => {
  await delay(300)
  const newId = Math.max(...doctors.map(d => d.Id)) + 1
  const newDoctor = {
    Id: newId,
    ...doctorData
  }
  doctors.push(newDoctor)
  return { ...newDoctor }
}

export const updateDoctor = async (id, doctorData) => {
  await delay(300)
  const index = doctors.findIndex(d => d.Id === parseInt(id))
  if (index === -1) throw new Error('Doctor not found')
  
  doctors[index] = { ...doctors[index], ...doctorData }
  return { ...doctors[index] }
}

export const deleteDoctor = async (id) => {
  await delay(200)
  const index = doctors.findIndex(d => d.Id === parseInt(id))
  if (index === -1) throw new Error('Doctor not found')
  
  doctors.splice(index, 1)
  return true
}