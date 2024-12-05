require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'must be at least 3 characters long'],
    required: [true, 'Name is required'],
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d{5,}$/.test(value)
      },
      message: (props) =>
        `${props.value}  needs to be 8 characters and  in the format XX-XXXXX or XXX-XXXXX`,
    },
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
