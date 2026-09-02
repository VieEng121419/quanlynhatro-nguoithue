self.addEventListener("push", (i) => {
  let n = {};
  try {
    n = i.data ? i.data.json() : {};
  } catch (i) {
    n = {};
  }
  i.waitUntil(
    self.registration.showNotification(n.title || "Th\xf4ng b\xe1o", {
      body: n.body || "",
      icon: "/icons/icon-192.png",
      data: { url: n.url || "/home" },
    })
  );
}),
  self.addEventListener("notificationclick", (i) => {
    i.notification.close(),
      i.waitUntil(
        clients
          .matchAll({ type: "window", includeUncontrolled: !0 })
          .then((n) => {
            var t;
            let o = new URL(
                (null === (t = i.notification.data) || void 0 === t
                  ? void 0
                  : t.url) || "/home",
                self.location.origin
              ).href,
              e = n.find((i) => "focus" in i);
            return e
              ? e.focus().then(() => e.navigate(o))
              : clients.openWindow(o);
          })
      );
  }),
  [
    {
      revision: "4838487ea5d27682c9dc3b8470893d71",
      url: "/_next/app-build-manifest.json",
    },
    {
      revision: "c155cce658e53418dec34664328b51ac",
      url: "/_next/static/ZWw9uc4kfp9Ajb9zm7WQV/_buildManifest.js",
    },
    {
      revision: "b6652df95db52feb4daf4eca35380933",
      url: "/_next/static/ZWw9uc4kfp9Ajb9zm7WQV/_ssgManifest.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/117-88369d0ac5ae8f9d.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/267-f6f4ab69e36f5946.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/467-d377be462cf89d0e.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/648-36c1c031244d62a5.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/697-f6c0af792cc15126.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/7cb1fa1f-2943c685993502a3.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/878-79907e9ec40a5aaa.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/906-93e63b0833441377.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/app/_not-found/page-8e6f80112ad5f289.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/app/home/page-a2e1835c381dc580.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/app/invoices/page-540199c8948bf430.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/app/layout-2cb3518dd1b42115.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/app/login/page-5bd28a156b72c832.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/app/notifications/page-26ccb254cabcca96.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/app/page-0317d58b7dc34dc1.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/app/profile/page-317239f2c0009f0c.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/app/services/page-b0b8609b24021816.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/ca377847-7e987621759529a8.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/fd9d1056-7c9726fa819af6d4.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/framework-f66176bb897dc684.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/main-0b023bc2abe79dc3.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/main-app-a64dd9469c12ac7a.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/pages/_app-72b849fbd24ac258.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/pages/_error-7ba65e1336b92748.js",
    },
    {
      revision: "846118c33b2c0e922d7b3a7676f81f6f",
      url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
    },
    {
      revision: "ZWw9uc4kfp9Ajb9zm7WQV",
      url: "/_next/static/chunks/webpack-798d2c67fb6d34ce.js",
    },
    {
      revision: "1498389af06c170e",
      url: "/_next/static/css/1498389af06c170e.css",
    },
    {
      revision: "341fa63a",
      url: "/_next/static/media/mona-sans-latin-400-normal.341fa63a.woff2",
    },
    {
      revision: "fc737bdd",
      url: "/_next/static/media/mona-sans-latin-400-normal.fc737bdd.woff",
    },
    {
      revision: "be7c56b4",
      url: "/_next/static/media/mona-sans-latin-500-normal.be7c56b4.woff",
    },
    {
      revision: "bfca541e",
      url: "/_next/static/media/mona-sans-latin-500-normal.bfca541e.woff2",
    },
    {
      revision: "5763aa2c",
      url: "/_next/static/media/mona-sans-latin-600-normal.5763aa2c.woff",
    },
    {
      revision: "8121240d",
      url: "/_next/static/media/mona-sans-latin-600-normal.8121240d.woff2",
    },
    {
      revision: "92734fa7",
      url: "/_next/static/media/mona-sans-latin-700-normal.92734fa7.woff2",
    },
    {
      revision: "d0bf9af4",
      url: "/_next/static/media/mona-sans-latin-700-normal.d0bf9af4.woff",
    },
    {
      revision: "7b8459f7",
      url: "/_next/static/media/mona-sans-latin-ext-400-normal.7b8459f7.woff",
    },
    {
      revision: "f5bed1c1",
      url: "/_next/static/media/mona-sans-latin-ext-400-normal.f5bed1c1.woff2",
    },
    {
      revision: "1b52e2e8",
      url: "/_next/static/media/mona-sans-latin-ext-500-normal.1b52e2e8.woff2",
    },
    {
      revision: "4f6996eb",
      url: "/_next/static/media/mona-sans-latin-ext-500-normal.4f6996eb.woff",
    },
    {
      revision: "89e124ee",
      url: "/_next/static/media/mona-sans-latin-ext-600-normal.89e124ee.woff2",
    },
    {
      revision: "b684702a",
      url: "/_next/static/media/mona-sans-latin-ext-600-normal.b684702a.woff",
    },
    {
      revision: "15c72637",
      url: "/_next/static/media/mona-sans-latin-ext-700-normal.15c72637.woff",
    },
    {
      revision: "f42ada33",
      url: "/_next/static/media/mona-sans-latin-ext-700-normal.f42ada33.woff2",
    },
    {
      revision: "115df63e",
      url: "/_next/static/media/mona-sans-vietnamese-400-normal.115df63e.woff",
    },
    {
      revision: "b8657200",
      url: "/_next/static/media/mona-sans-vietnamese-400-normal.b8657200.woff2",
    },
    {
      revision: "11d8ceaf",
      url: "/_next/static/media/mona-sans-vietnamese-500-normal.11d8ceaf.woff",
    },
    {
      revision: "809070c9",
      url: "/_next/static/media/mona-sans-vietnamese-500-normal.809070c9.woff2",
    },
    {
      revision: "8d2d86c3",
      url: "/_next/static/media/mona-sans-vietnamese-600-normal.8d2d86c3.woff2",
    },
    {
      revision: "a3cf53fa",
      url: "/_next/static/media/mona-sans-vietnamese-600-normal.a3cf53fa.woff",
    },
    {
      revision: "220720cd",
      url: "/_next/static/media/mona-sans-vietnamese-700-normal.220720cd.woff2",
    },
    {
      revision: "88dbf124",
      url: "/_next/static/media/mona-sans-vietnamese-700-normal.88dbf124.woff",
    },
    {
      revision: "f50b9b0919cf8e240a1f0ebe05074964",
      url: "/icons/icon-192.png",
    },
    {
      revision: "dc7944b70e54eab1bca9a913479dcc2c",
      url: "/icons/icon-512.png",
    },
    { revision: "798ae608282727b6b1cd88724e16ffde", url: "/manifest.json" },
    { revision: "fe2446801c6f464bb68fe803e121456b", url: "/push-sw.js" },
    { revision: "19695fd7c2e4f34e031bce809b35a3e4", url: "/sw-custom.js" },
    { revision: "3f99148f41ce7a10d56c52ad961428e4", url: "/sw.js" },
  ];
