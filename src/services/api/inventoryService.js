import { delay } from '@/utils/helpers'
import medicinesData from '@/services/mockData/medicines.json'

let medicines = [...medicinesData]

export const getMedicines = async () => {
  await delay(400)
  return [...medicines]
}

export const getMedicineById = async (id) => {
  await delay(200)
  const medicine = medicines.find(m => m.Id === parseInt(id))
  if (!medicine) throw new Error('Medicine not found')
  return { ...medicine }
}

export const createMedicine = async (medicineData) => {
  await delay(300)
  const newId = Math.max(...medicines.map(m => m.Id)) + 1
  const newMedicine = {
    Id: newId,
    ...medicineData
  }
  medicines.push(newMedicine)
  return { ...newMedicine }
}

export const updateMedicine = async (id, medicineData) => {
  await delay(300)
  const index = medicines.findIndex(m => m.Id === parseInt(id))
  if (index === -1) throw new Error('Medicine not found')
  
  medicines[index] = { ...medicines[index], ...medicineData }
  return { ...medicines[index] }
}

export const deleteMedicine = async (id) => {
  await delay(200)
  const index = medicines.findIndex(m => m.Id === parseInt(id))
  if (index === -1) throw new Error('Medicine not found')
  
  medicines.splice(index, 1)
  return true
}