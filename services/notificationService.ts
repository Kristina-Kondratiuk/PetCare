import * as Notifications from "expo-notifications";

// Configure how notifications behave when app is open
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Ask user for permission to show local notifications
export const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
        throw new Error("Notification permission was not granted");
    }

    return true;
};

// Schedule local notifications and return its ID
export const scheduleLocalNotification = async ({
    title,
    body,
    date,
}: {
    title: string;
    body?: string;
    date: Date;
}) => {
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title, 
            body
        }, 
        trigger: { 
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
        },
    });

    return notificationId;
};

// Cancel scheduled notification by ID
export const cancelLocalNotification = async (notificationId: string) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
};