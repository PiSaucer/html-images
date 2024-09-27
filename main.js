const { Plugin, Platform } = require("obsidian");

class HtmlLocalSrcPlugin extends Plugin {
  async onload() {
    console.log("loaded HTML-Images plugin: v1.0.0");

    // Reading Mode
    this.registerMarkdownPostProcessor((element) => {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) {
        console.warn("No active file.");
        return;
      }

      this.processImages(element, activeFile);
    });

    // TODO: Live Preview Mode
  }

  processImages(element, activeFile) {
    const targetImages = Array.from(element.getElementsByTagName("img"));
    let activePath = this.app.vault.getResourcePath(activeFile);
    activePath = activePath.substring(0, activePath.lastIndexOf("/"));

    for (const img of targetImages) {
      let cleanSrc = img.src.replace('app://obsidian.md/', '');
      cleanSrc = cleanSrc.replace('capacitor://localhost/', '');
      const imgPath = cleanSrc.startsWith('img/') ? cleanSrc : `img/${cleanSrc}`;
      const fullSrc = `${activePath}/${imgPath}`; // Construct the path correctly

      img.src = fullSrc;

      if (Platform.isMobile) {
        img.style.objectFit = "contain";
        img.style.height = "100px"; // Set height for mobile
      }
    }
  }
}

module.exports = HtmlLocalSrcPlugin;
