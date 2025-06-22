export class ArtifactsDownloader {
    constructor() {
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
