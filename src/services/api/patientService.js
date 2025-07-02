import { delay } from '@/utils/helpers'
import patientsData from '@/services/mockData/patients.json'

let patients = [...patientsData]

export const getPatients = async () => {
  await delay(400)
  return [...patients]
}

export const getPatientById = async (id) => {
  await delay(200)
  const patient = patients.find(p => p.Id === parseInt(id))
  if (!patient) throw new Error('Patient not found')
  return { ...patient }
}

export const createPatient = async (patientData) => {
  await delay(300)
  const newId = Math.max(...patients.map(p => p.Id)) + 1
  const newPatient = {
    Id: newId,
    ...patientData,
    medicalHistory: []
  }
  patients.push(newPatient)
  return { ...newPatient }
}

export const updatePatient = async (id, patientData) => {
  await delay(300)
  const index = patients.findIndex(p => p.Id === parseInt(id))
  if (index === -1) throw new Error('Patient not found')
  
  patients[index] = { ...patients[index], ...patientData }
  return { ...patients[index] }
}

export const deletePatient = async (id) => {
  await delay(200)
  const index = patients.findIndex(p => p.Id === parseInt(id))
  if (index === -1) throw new Error('Patient not found')
  
  patients.splice(index, 1)
  return true
}