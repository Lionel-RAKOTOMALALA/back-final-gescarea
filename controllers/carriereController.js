import mongoose from 'mongoose';
import HistoriqueCarriere from '../model/HistoriqueCarriere.model.js';
import AffectationEmploye from '../model/AffectationEmploye.model.js';

export const ajouterEvenementCarriere = async (req, res) => {
  const { historiqueData, affectationData } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const historique = new HistoriqueCarriere(historiqueData);
    await historique.save({ session });

    if (affectationData) {
      await AffectationEmploye.updateOne(
        { employeId: historiqueData.employeId },
        { $set: affectationData },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ historique });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};
