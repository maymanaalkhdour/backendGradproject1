const mongoose = require('mongoose');
const { ManagingIncident } = require('./models/ManagingIncounterSession'); // Adjust the path if necessary

async function removeIdPatientNumberField() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Doctormanagementdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await ManagingIncident.updateMany({}, { $unset: { idpatientnumber: "" } });
        console.log('Removed idpatientnumber field from all documents');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

removeIdPatientNumberField();
