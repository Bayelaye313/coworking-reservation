const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    spaceType: {
        type: String,
        enum: ['bureau', 'salle_reunion', 'espace_commun'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Middleware pour vérifier les conflits de réservation
reservationSchema.pre('save', async function(next) {
    if (this.isModified('status') && this.status === 'cancelled') {
        return next();
    }

    const existingReservation = await this.constructor.findOne({
        date: this.date,
        spaceType: this.spaceType,
        status: 'active',
        _id: { $ne: this._id },
        $or: [
            {
                startTime: { $lte: this.startTime },
                endTime: { $gt: this.startTime }
            },
            {
                startTime: { $lt: this.endTime },
                endTime: { $gte: this.endTime }
            }
        ]
    });

    if (existingReservation) {
        next(new Error('Ce créneau est déjà réservé'));
    }
    next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
