import mongoose from 'mongoose';
import Decision from '../model/Decision.model.js';
import JournalDesActions from '../model/JournalDesActions.model.js';

export const ajouterDecisionEtJournal = async (req, res) => {
  const { decisionData, journalData } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const decision = new Decision(decisionData);
    await decision.save({ session });

    const journal = new JournalDesActions(journalData);
    await journal.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ decision });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};
