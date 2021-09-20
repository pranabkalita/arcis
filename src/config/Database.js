import mongoose from 'mongoose'

import log from 'utils/Logger'

export const connect = () => {
  const dbUrl = process.env.dbUrl

  return mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      log.info('Database Connected')
    })
    .catch((error) => {
      log.error('DB ERROR: ', error)
      process.exit(1)
    })
}
