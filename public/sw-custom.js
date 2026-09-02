self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Thông báo", {
      body: data.body || "",
      icon: "/icons/icon-192.png",
      data: { url: data.url || "/home" },
    })
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        const target = new URL(
          event.notification.data?.url || "/home",
          self.location.origin
        ).href;
        const existing = list.find((client) => "focus" in client);
        return existing
          ? existing.focus().then(() => existing.navigate(target))
          : clients.openWindow(target);
      })
  );
});
self.__WB_MANIFEST;
