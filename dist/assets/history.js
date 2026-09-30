/* Bounded editor history. Decoded assets and immutable datasets are shared. */
(() => {
  "use strict";
  window.CertificateHistory = {
    create({ state, design, restore, onChange, onButtons, limit = 50 }) {
      const assetIds = new WeakMap();
      let assetSequence = 0, entries = [], index = -1, queued = false, applying = false;
      let group = null, previousGroup = null, previousTime = 0;
      const scalarKeys = ["blankBackground", "backgroundImage", "backgroundSourceImage", "backgroundSourceSrc", "backgroundName", "exportQuality"];
      const copyLayers = (layers) => layers.map((item) => ({ ...item, ...(item.crop ? { crop: { ...item.crop } } : {}) }));
      function snapshot() {
        const value = {
          design: { ...design }, records: state.records,
          fields: copyLayers(state.fields), images: copyLayers(state.images),
          photos: copyLayers(state.photos), shapes: copyLayers(state.shapes),
          layerOrder: [...state.layerOrder], customFonts: [...state.customFonts],
          backgroundCrop: state.backgroundCrop ? { ...state.backgroundCrop } : null,
          selectedField: state.selectedField, selectedIds: [...state.selectedIds], currentRecord: state.currentRecord
        };
        for (const key of scalarKeys) value[key] = state[key];
        return value;
      }
      function assetId(asset) {
        if (!asset) return null;
        if (!assetIds.has(asset)) assetIds.set(asset, ++assetSequence);
        return assetIds.get(asset);
      }
      function signature(value) {
        // Normalize only editor assets. CSV column names can be any string,
        // including "image", "data" or "selectedField".
        return JSON.stringify({
          ...value, selectedField: undefined, selectedIds: undefined, currentRecord: undefined,
          records: assetId(value.records),
          backgroundSourceSrc: undefined,
          backgroundImage: assetId(value.backgroundImage),
          backgroundSourceImage: assetId(value.backgroundSourceImage),
          images: value.images.map(({ image, sourceImage, src, sourceSrc, ...item }) => ({
            ...item, image: assetId(image), sourceImage: assetId(sourceImage)
          })),
          customFonts: value.customFonts.map(({ family, fontFace }) => ({ family, asset: assetId(fontFace) }))
        });
      }
      const buttons = () => onButtons(index > 0, index < entries.length - 1);
      function capture() {
        if (applying || state.interaction) return;
        const value = snapshot(), key = signature(value), now = Date.now();
        if (key === entries[index]?.key) {
          // Navigation and selection aren't edits, but restore the right selection on undo.
          entries[index].value.selectedField = value.selectedField;
          entries[index].value.selectedIds = value.selectedIds;
          entries[index].value.currentRecord = value.currentRecord;
          return;
        }
        const merge = group && group === previousGroup && now - previousTime < 750 && index > 0 && index === entries.length - 1;
        entries.splice(index + 1);
        if (merge) entries[index] = { value, key };
        else { entries.push({ value, key }); index++; }
        if (entries.length > limit + 1) { entries.shift(); index--; }
        previousGroup = group; previousTime = now;
        buttons(); onChange();
      }
      function schedule() {
        if (applying || queued) return;
        queued = true;
        queueMicrotask(() => { queued = false; capture(); });
      }
      function travel(delta) {
        capture();
        const next = index + delta;
        if (next < 0 || next >= entries.length || state.interaction) return;
        applying = true;
        try {
          index = next;
          const value = entries[index].value;
          for (const key of scalarKeys) state[key] = value[key];
          for (const key of ["fields", "images", "photos", "shapes"]) state[key] = copyLayers(value[key]);
          state.records = value.records;
          state.layerOrder = [...value.layerOrder];
          state.customFonts = [...value.customFonts];
          state.backgroundCrop = value.backgroundCrop ? { ...value.backgroundCrop } : null;
          state.selectedField = value.selectedField; state.selectedIds = [...value.selectedIds];
          state.currentRecord = value.currentRecord;
          Object.assign(design, value.design);
          restore();
        } finally { applying = false; group = previousGroup = null; buttons(); }
        onChange();
      }
      const initial = snapshot(); entries.push({ value: initial, key: signature(initial) }); index = 0; buttons();
      return { schedule, capture, undo: () => travel(-1), redo: () => travel(1), setGroup: (key) => { group = key; } };
    }
  };
})();
