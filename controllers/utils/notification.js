import JournalDesActionsModel from '../../model/JournalDesActions.model.js';
import NotificationModel from '../../model/Notification.model.js';

export const enregistrerActionEtNotification = async (session, userId, actionDetail, notificationMessage) => {
    const action = new JournalDesActionsModel({
        id_utilisateur: userId,  // Correspond à l'id_utilisateur dans le modèle
        action: actionDetail,
        date_action: new Date(), // Correspond à date_action dans le modèle
        details: actionDetail, // Si vous voulez ajouter des détails supplémentaires
    });

    await action.save({ session }); // Enregistrer le journal de l'action

    // Ajouter les champs manquants `message_alerte` et `type_alerte` pour la notification
    const notification = new NotificationModel({
        id_utilisateur: userId, // Assurez-vous que le champ correspond dans le modèle de notification
        message: notificationMessage,
        message_alerte: notificationMessage, // Ajout du message d'alerte
        type_alerte: "info", // Définir un type d'alerte par défaut, par exemple "info"
        date: new Date(),
    });

    await notification.save({ session }); // Enregistrer la notification
};
