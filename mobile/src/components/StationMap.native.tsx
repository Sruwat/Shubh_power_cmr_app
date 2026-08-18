import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { Station } from "@/api/client";
import { fx } from "@/components/Futuristic";
import shubhMark from "../../assets/shubh-power-mark.png";

type StationMapPayload = {
  coords: { latitude: number; longitude: number };
  stations: MapStation[];
  selectedStationId?: string;
};

type MapStation = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  tag: string;
  label: string;
  color: string;
  rank: string;
  logoUri?: string;
};

export function StationMap({
  coords,
  stations,
  selectedStationId,
  onSelect,
  onLocate,
  onOpenFilters
}: {
  coords: { latitude: number; longitude: number };
  stations: Station[];
  selectedStationId?: string;
  onSelect: (station: Station) => void;
  onLocate?: () => void;
  onOpenFilters?: () => void;
}) {
  const webViewRef = useRef<WebView | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const visibleStations = useMemo(() => stations.slice(0, 9), [stations]);
  const mapStations = useMemo<MapStation[]>(
    () =>
      visibleStations.map((station, index) => {
        const meta = brandMarker(station, index);
        return {
          id: station.id,
          latitude: station.coordinates.latitude,
          longitude: station.coordinates.longitude,
          title: station.name,
          tag: meta.tag,
          label: meta.label,
          color: meta.color,
          rank: meta.rank,
          logoUri: meta.logoUri
        };
      }),
    [visibleStations]
  );

  const initialPayload = useMemo<StationMapPayload>(
    () => ({
      coords,
      stations: mapStations,
      selectedStationId
    }),
    [coords, mapStations, selectedStationId]
  );

  const html = useMemo(() => buildMapHtml(initialPayload), [initialPayload]);

  const sendCommand = (script: string) => {
    webViewRef.current?.injectJavaScript(`${script}; true;`);
  };

  useEffect(() => {
    if (!mapReady) return;
    sendCommand(`window.__shubhPowerMap && window.__shubhPowerMap.setData(${JSON.stringify(initialPayload)})`);
  }, [initialPayload, mapReady]);

  useEffect(() => {
    if (!mapReady || !selectedStationId) return;
    sendCommand(`window.__shubhPowerMap && window.__shubhPowerMap.setSelectedStationId(${JSON.stringify(selectedStationId)})`);
  }, [mapReady, selectedStationId]);

  useEffect(() => {
    if (!mapReady) return;
    sendCommand(`window.__shubhPowerMap && window.__shubhPowerMap.center(${coords.latitude}, ${coords.longitude})`);
  }, [coords.latitude, coords.longitude, mapReady]);

  return (
    <View style={{ flex: 1, backgroundColor: "#dff1f5", overflow: "hidden" }}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        setSupportMultipleWindows={false}
        onLoadEnd={() => {
          setMapReady(true);
          requestAnimationFrame(() => {
            sendCommand(`window.__shubhPowerMap && window.__shubhPowerMap.resize()`);
          });
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data) as { type?: string; id?: string };
            if (data.type === "stationPress" && data.id) {
              const station = visibleStations.find((item) => item.id === data.id);
              if (station) onSelect(station);
            }
          } catch {
            // Ignore malformed bridge messages.
          }
        }}
        style={{ flex: 1, backgroundColor: "#dff1f5" }}
      />

      <View pointerEvents="none" style={{ position: "absolute", left: 14, top: 14, alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#dce8f5" }}>
        <Text style={{ color: fx.ink, fontSize: 12, fontWeight: "900" }}>{stations.length} verified locations</Text>
        <Text style={{ color: fx.muted, fontSize: 11, fontWeight: "700" }}>Demo availability</Text>
      </View>

      <View style={{ position: "absolute", right: 14, top: 20, gap: 10 }}>
        <RoundIcon
          icon="locate"
          onPress={() => {
            sendCommand(`window.__shubhPowerMap && window.__shubhPowerMap.center(${coords.latitude}, ${coords.longitude})`);
            onLocate?.();
          }}
          label="Center map"
        />
        <RoundIcon icon="options" onPress={onOpenFilters} label="Open filters" />
      </View>
    </View>
  );
}

function RoundIcon({ icon, onPress, label }: { icon: keyof typeof Ionicons.glyphMap; onPress?: () => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "#fff", borderWidth: 1, borderColor: "#dce8f5", alignItems: "center", justifyContent: "center", shadowColor: "#0b1b33", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}
    >
      <Ionicons name={icon} size={20} color={fx.blue} />
    </Pressable>
  );
}

function buildMapHtml(payload: StationMapPayload) {
  const shubhLogoUri = Image.resolveAssetSource(shubhMark).uri;
  const initial = JSON.stringify({
    ...payload,
    shubhLogoUri
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <meta charset="utf-8" />
  <style>
    html, body, #map {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #dff1f5;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    .leaflet-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #dff1f5;
    }
    .station-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translateY(-4px);
      pointer-events: auto;
    }
    .station-marker.selected {
      transform: translateY(-7px) scale(1.08);
      filter: drop-shadow(0 8px 18px rgba(14, 78, 150, 0.22));
    }
    .rank-badge {
      width: 18px;
      height: 18px;
      border-radius: 9px;
      background: #17a95a;
      color: #fff;
      font-size: 9px;
      line-height: 18px;
      text-align: center;
      font-weight: 900;
      border: 2px solid #fff;
      margin-bottom: -2px;
      z-index: 2;
    }
    .bubble {
      min-width: 44px;
      height: 44px;
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #fff;
      box-shadow: 0 3px 10px rgba(11, 27, 51, 0.18);
      overflow: hidden;
      position: relative;
    }
    .bubble img {
      width: 24px;
      height: 24px;
      object-fit: contain;
      display: block;
    }
    .bubble span {
      color: #fff;
      font-weight: 900;
      font-size: 13px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tag {
      margin-top: 3px;
      max-width: 64px;
      padding: 2px 5px;
      border-radius: 8px;
      background: #fff;
      border: 1px solid #dce8f5;
      color: #25354f;
      font-size: 7px;
      font-weight: 900;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-marker {
      width: 46px;
      height: 46px;
      border-radius: 23px;
      background: rgba(35,196,181,0.24);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-marker .inner {
      width: 24px;
      height: 24px;
      border-radius: 12px;
      background: #23c4b5;
      border: 3px solid #fff;
    }
    .user-marker .pulse {
      position: absolute;
      width: 46px;
      height: 46px;
      border-radius: 23px;
      border: 2px solid rgba(35,196,181,0.18);
    }
    .leaflet-control-zoom {
      border: none !important;
      box-shadow: 0 6px 14px rgba(11, 27, 51, 0.14) !important;
    }
    .leaflet-control-zoom a {
      width: 34px !important;
      height: 34px !important;
      line-height: 34px !important;
      border-radius: 10px !important;
      color: #146ddf !important;
    }
    .leaflet-control-attribution {
      background: rgba(255,255,255,0.82) !important;
      color: #6f7b8d !important;
      font-size: 9px !important;
    }
  </style>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const initial = ${initial};
    const state = {
      coords: initial.coords,
      stations: initial.stations || [],
      selectedStationId: initial.selectedStationId || null,
      shubhLogoUri: initial.shubhLogoUri
    };

    const map = L.map('map', {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
      zoomSnap: 0.5
    }).setView([state.coords.latitude, state.coords.longitude], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const markerLayer = L.layerGroup().addTo(map);
    const overlayLayer = L.layerGroup().addTo(map);

    function escapeHtml(value) {
      return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function stationIcon(station) {
      const selected = station.id === state.selectedStationId;
      const bubbleColor = station.color || '#7a4df0';
      const image = station.logoUri
        ? '<img src="' + escapeHtml(station.logoUri) + '" onerror="this.style.display=\\'none\\'; this.nextElementSibling.style.display=\\'flex\\';" />' +
          '<span style="display:none">' + escapeHtml(station.label || 'S') + '</span>'
        : '<span>' + escapeHtml(station.label || 'S') + '</span>';
      return L.divIcon({
        className: '',
        html:
          '<div class="station-marker ' + (selected ? 'selected' : '') + '">' +
            '<div class="rank-badge">' + escapeHtml(station.rank || '1') + '</div>' +
            '<div class="bubble" style="background:' + escapeHtml(bubbleColor) + '">' + image + '</div>' +
            '<div class="tag">' + escapeHtml(station.tag || station.title || 'Station') + '</div>' +
          '</div>',
        iconSize: [84, 92],
        iconAnchor: [42, 60],
        popupAnchor: [0, -44]
      });
    }

    function userIcon() {
      return L.divIcon({
        className: '',
        html:
          '<div style="position:relative;width:46px;height:46px;display:flex;align-items:center;justify-content:center">' +
            '<div class="user-marker"><div class="inner"></div></div>' +
          '</div>',
        iconSize: [46, 46],
        iconAnchor: [23, 23]
      });
    }

    const userMarker = L.marker([state.coords.latitude, state.coords.longitude], {
      icon: userIcon(),
      interactive: false,
      keyboard: false
    }).addTo(overlayLayer);

    function renderStations() {
      markerLayer.clearLayers();
      (state.stations || []).forEach((station) => {
        const marker = L.marker([station.latitude, station.longitude], {
          icon: stationIcon(station),
          keyboard: false,
          riseOnHover: true
        }).addTo(markerLayer);
        marker.on('click', function () {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'stationPress', id: station.id }));
          }
        });
      });
    }

    function syncUserMarker() {
      userMarker.setLatLng([state.coords.latitude, state.coords.longitude]);
    }

    window.__shubhPowerMap = {
      setData(payload) {
        if (payload && payload.coords) {
          state.coords = payload.coords;
          syncUserMarker();
        }
        if (payload && Array.isArray(payload.stations)) {
          state.stations = payload.stations;
        }
        if (payload && typeof payload.selectedStationId !== 'undefined') {
          state.selectedStationId = payload.selectedStationId;
        }
        renderStations();
      },
      setSelectedStationId(id) {
        state.selectedStationId = id || null;
        renderStations();
      },
      center(latitude, longitude) {
        if (typeof latitude === 'number' && typeof longitude === 'number') {
          state.coords = { latitude, longitude };
          syncUserMarker();
          map.setView([latitude, longitude], Math.max(map.getZoom() || 12, 12), { animate: true });
        }
      },
      resize() {
        setTimeout(function () {
          map.invalidateSize(true);
        }, 60);
      }
    };

    map.on('moveend zoomend', function () {
      window.__shubhPowerMap && window.__shubhPowerMap.resize();
    });

    renderStations();
    setTimeout(function () {
      map.invalidateSize(true);
    }, 60);
  </script>
</body>
</html>`;
}

function brandMarker(station: Station, index: number) {
  const brand = `${station.brand ?? station.name ?? ""}`.toLowerCase();
  const shubhLogoUri = Image.resolveAssetSource(shubhMark).uri;

  if (/shubh/.test(brand)) {
    return { label: "SP", tag: "Shubh Power", color: fx.teal, rank: "S", logoUri: shubhLogoUri };
  }
  if (/tata/.test(brand)) return { label: "T", tag: "Tata Power", color: "#1862cf", rank: String((index % 5) + 1), logoUri: "https://logo.clearbit.com/tatapower.com" };
  if (/statiq/.test(brand)) return { label: "S", tag: "Statiq", color: "#7a4df0", rank: String((index % 5) + 1), logoUri: "https://logo.clearbit.com/statiq.in" };
  if (/jio-bp|jio bp|jio/.test(brand)) return { label: "J", tag: "Jio-bp", color: "#10a8ff", rank: String((index % 5) + 1), logoUri: "https://logo.clearbit.com/jiobp.com" };
  if (/adani/.test(brand)) return { label: "A", tag: "Adani", color: "#f24d6b", rank: String((index % 5) + 1), logoUri: "https://logo.clearbit.com/adani.com" };
  if (/eesl/.test(brand)) return { label: "E", tag: "EESL", color: "#1a68d8", rank: String((index % 5) + 1), logoUri: "https://logo.clearbit.com/eeslindia.org" };
  if (/sun/.test(brand)) return { label: "U", tag: "SUN Mobility", color: "#ff9a1f", rank: String((index % 5) + 1), logoUri: "https://logo.clearbit.com/sunmobility.com" };
  return { label: "Rs", tag: station.name ?? "Station", color: fx.violet, rank: String((index % 5) + 1) };
}
