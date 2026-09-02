self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
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
        const target = event.notification.data?.url || "/home";
        const existing = list.find((client) => "focus" in client);
        return existing
          ? existing.focus().then(() => existing.navigate(target))
          : clients.openWindow(target);
      })
  );
});
