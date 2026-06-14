self.addEventListener("push", function (event) {
    let data = {};
  
    if (event.data) {
      data = event.data.json();
    }
  
    const title = data.title || "Ruta SERUMS";
    const options = {
      body: data.body || "Tienes una nueva notificación.",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      data: {
        url: data.url || "/",
      },
    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  self.addEventListener("notificationclick", function (event) {
    event.notification.close();
  
    const url = event.notification.data?.url || "/";
  
    event.waitUntil(
      clients.openWindow(url)
    );
  });