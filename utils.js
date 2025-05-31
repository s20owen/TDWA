export async function preloadImages(imageMap) {
  const entries = Object.entries(imageMap);
  const loaded = await Promise.all(
    entries.map(([key, src]) => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve([key, img]);
        img.src = src;
      });
    })
  );
  return Object.fromEntries(loaded);
}
