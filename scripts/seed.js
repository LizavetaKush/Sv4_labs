const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

dotenv.config()

const Publication = require('../models/Publication')
const Recipient = require('../models/Recipient')
const Subscription = require('../models/Subscription')

const dataPath = path.join(__dirname, '..', 'data')

const loadJSON = (filename) => {
  const filePath = path.join(dataPath, filename)
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Ошибка при чтении файла ${filename}:`, error.message)
    return null
  }
}

const seedDatabase = async (clearExisting = false) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✓ Подключено к MongoDB')

    if (clearExisting) {
      console.log('Очистка существующих данных...')
      await Publication.deleteMany({})
      await Recipient.deleteMany({})
      await Subscription.deleteMany({})
      console.log('✓ Существующие данные удалены')
    }

    console.log('\nЗагрузка изданий...')
    const publicationsData = loadJSON('publications.json')
    if (publicationsData) {
      let createdPublications = 0
      let skippedPublications = 0

      for (const pub of publicationsData) {
        try {
          const existing = await Publication.findOne({ index: pub.index })
          if (!existing) {
            await Publication.create(pub)
            createdPublications++
          } else {
            skippedPublications++
          }
        } catch (error) {
          console.error(`Ошибка при создании издания ${pub.index}:`, error.message)
        }
      }
      console.log(`✓ Издания: создано ${createdPublications}, пропущено ${skippedPublications}`)
    }

    console.log('\nЗагрузка получателей...')
    const recipientsData = loadJSON('recipients.json')
    if (recipientsData) {
      let createdRecipients = 0
      let skippedRecipients = 0

      for (const rec of recipientsData) {
        try {
          const existing = await Recipient.findOne({ code: rec.code })
          if (!existing) {
            await Recipient.create(rec)
            createdRecipients++
          } else {
            skippedRecipients++
          }
        } catch (error) {
          console.error(`Ошибка при создании получателя ${rec.code}:`, error.message)
        }
      }
      console.log(`✓ Получатели: создано ${createdRecipients}, пропущено ${skippedRecipients}`)
    }

    console.log('\nЗагрузка подписок...')
    const subscriptionsData = loadJSON('subscriptions.json')
    if (subscriptionsData) {
      let createdSubscriptions = 0
      let skippedSubscriptions = 0
      let errorSubscriptions = 0

      for (const sub of subscriptionsData) {
        try {
          const recipient = await Recipient.findOne({ code: sub.recipientCode })
          if (!recipient) {
            console.warn(`⚠ Получатель с кодом ${sub.recipientCode} не найден, подписка пропущена`)
            errorSubscriptions++
            continue
          }

          const publication = await Publication.findOne({ index: sub.publicationIndex })
          if (!publication) {
            console.warn(`⚠ Издание с индексом ${sub.publicationIndex} не найдено, подписка пропущена`)
            errorSubscriptions++
            continue
          }

          const existing = await Subscription.findOne({
            recipientCode: sub.recipientCode,
            publicationIndex: sub.publicationIndex,
            startMonth: sub.startMonth,
            startYear: sub.startYear,
          })

          if (!existing) {
            await Subscription.create(sub)
            createdSubscriptions++
          } else {
            skippedSubscriptions++
          }
        } catch (error) {
          console.error(`Ошибка при создании подписки:`, error.message)
          errorSubscriptions++
        }
      }
      console.log(`✓ Подписки: создано ${createdSubscriptions}, пропущено ${skippedSubscriptions}, ошибок ${errorSubscriptions}`)
    }

    const totalPublications = await Publication.countDocuments()
    const totalRecipients = await Recipient.countDocuments()
    const totalSubscriptions = await Subscription.countDocuments()
    const total = totalPublications + totalRecipients + totalSubscriptions

    console.log('\n' + '='.repeat(50))
    console.log('ИТОГИ ЗАПОЛНЕНИЯ БАЗЫ ДАННЫХ:')
    console.log('='.repeat(50))
    console.log(`Издания: ${totalPublications}`)
    console.log(`Получатели: ${totalRecipients}`)
    console.log(`Подписки: ${totalSubscriptions}`)
    console.log(`Всего записей: ${total}`)
    console.log('='.repeat(50))

    if (total >= 50) {
      console.log('✓ База данных успешно заполнена (не менее 50 записей)')
    } else {
      console.warn(`⚠ В базе данных менее 50 записей (${total})`)
    }

    await mongoose.connection.close()
    console.log('\n✓ Подключение к MongoDB закрыто')
    process.exit(0)
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error)
    await mongoose.connection.close()
    process.exit(1)
  }
}

const args = process.argv.slice(2)
const clearExisting = args.includes('--clear') || args.includes('-c')

seedDatabase(clearExisting)
