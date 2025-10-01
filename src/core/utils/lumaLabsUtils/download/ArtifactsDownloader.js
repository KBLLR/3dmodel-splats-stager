/**
 * @file Defines the ArtifactsDownloader class for downloading Luma Labs AI artifacts.
 * @module ArtifactsDownloader
 */

/**
 * @class ArtifactsDownloader
 * @description Handles the downloading of artifacts from a Luma Labs AI splat loader.
 */
export class ArtifactsDownloader {
    /**
     * @constructor
     * @description Initializes the ArtifactsDownloader with a list of required artifact keys.
     */
    constructor() {
        /**
         * @property {string[]} requiredArtifacts - A list of artifact keys to be downloaded.
         */
        this.requiredArtifacts = [
            'gs_web_meta',
            'gs_web_gauss1',
            'gs_web_gauss2',
            'gs_web_sh',
            'gs_web_webmeta',
            'gs_compressed_meta',
            'gs_compressed',
            'with_background_gs_camera_params',
            'semantics',
        ];
    }

    /**
     * @method downloadArtifacts
     * @description Asynchronously downloads the required artifacts from the splat loader.
     * @param {object} splatLoader - The Luma Labs AI splat loader instance.
     * @param {function} [onProgress=() => {}] - A callback function to report download progress.
     * @returns {Promise<void>} A promise that resolves when the download process is complete.
     */
    async downloadArtifacts(splatLoader, onProgress = () => {}) {
        const artifacts = await splatLoader.getArtifacts();
        
        const totalFiles = this.requiredArtifacts.reduce((total, key) => {
            return artifacts[key] ? (total + 1) : total;
        }, 0);
        
        let filesComplete = 0;
        onProgress(0);

        const blobs = await Promise.all(
            this.requiredArtifacts.map(async key => {
                const url = artifacts[key];
                if (!url) {
                    return null;
                }

                const urlFilename = url.split('/').pop();
                const fileType = urlFilename.split('.').pop();
                const filename = `${key}.${fileType}`;

                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    
                    filesComplete++;
                    onProgress(filesComplete / totalFiles);
                    
                    return { filename, url, blob };
                } catch (error) {
                    console.error(`Error downloading ${filename}:`, error);
                    return null;
                }
            })
        );

        this.triggerDownloads(blobs.filter(Boolean));
        onProgress(1);
    }

    /**
     * @method triggerDownloads
     * @description Triggers the download of files by creating and clicking anchor links.
     * @param {Array<object>} files - An array of file objects, each with a filename and blob.
     */
    triggerDownloads(files) {
        files.forEach(file => {
            const { filename, blob } = file;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url); // Clean up
        });
    }

    /**
     * @method createDownloadButton
     * @description Creates a button that, when clicked, initiates the artifact download process.
     * @param {object} splatLoader - The Luma Labs AI splat loader instance.
     * @returns {HTMLButtonElement} The created download button.
     */
    createDownloadButton(splatLoader) {
        const button = document.createElement('button');
        button.innerText = 'Download Artifacts';
        button.style.position = 'absolute';
        button.style.bottom = '5px';
        button.style.left = '5px';
        button.style.zIndex = '100';
        
        button.onclick = () => {
            this.downloadArtifacts(splatLoader, progress => {
                button.innerText = progress < 1 
                    ? `Downloading ${Math.floor(progress * 100)}%`
                    : 'Download Artifacts';
            });
        };

        return button;
    }
}
