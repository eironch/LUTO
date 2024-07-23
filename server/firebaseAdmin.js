import admin from 'firebase-admin'

let config
try {
  config = await import('./secrets.js')
} catch (error) {
  try {
    config = await import('./config.js')
  } catch (error) {
    throw error
  }
}

function parseJsonIfNeeded(variable) {
  if (typeof variable === 'object') {
    return variable
  }

  try {
    return JSON.parse(variable)
  } catch (e) {
      console.error('Error parsing JSON:', e, config)
    return null
  }
}

admin.initializeApp({
    credential: admin.credential.cert(parseJsonIfNeeded(config.SERVICE_ACCOUNT_KEY)),
    storageBucket: 'gs://luto-storage.appspot.com',
})

const db = admin.firestore()
const bucket = admin.storage().bucket()

export { db, bucket }