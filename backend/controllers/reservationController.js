const Reservation = require('../models/Reservation');

// Récupérer toutes les réservations
exports.getReservations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Reservation.countDocuments();

    res.json({
      reservations,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReservation = async (req, res) => {
  try{
    const reservation = await Reservation.findById(req.params.id);
    if(!reservation){
      return res.status(404).json({message: 'Réservation non trouvée'});
    }
    res.json(reservation);
  }catch(error){
    res.status(500).json({message: error.message});
  }
}

// Créer une nouvelle réservation
exports.createReservation = async (req, res) => {
  try {
    const reservation = new Reservation({
      ...req.body,
      //userId: req.user._id
    });

    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier que l'utilisateur est autorisé à modifier la réservation
    if (reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    Object.assign(reservation, req.body);
    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Annuler une réservation
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier que l'utilisateur est autorisé à annuler la réservation
    if (reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    reservation.status = 'cancelled';
    await reservation.save();
    res.json({ message: 'Réservation annulée avec succès' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 