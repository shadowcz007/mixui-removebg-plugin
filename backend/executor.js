// Remove background executor using @imgly/background-removal
// Inputs: { image_base64: string[] }
// Outputs: { image_base64: string[] }

// 在构建时会被替换为全局变量引用
// 运行时从全局 ImglyBackgroundRemoval 获取 removeBackground
const removeBackground = (typeof globalThis !== 'undefined' && globalThis.ImglyBackgroundRemoval?.removeBackground) || 
  (typeof window !== 'undefined' && window.ImglyBackgroundRemoval?.removeBackground);

if (typeof removeBackground !== 'function') {
  throw new Error('Background removal library not found. Make sure background-removal.runtime.js is loaded first.');
}

/**
 * Convert base64 data URL to Blob
 * @param {string} dataUrl
 * @returns {Blob}
 */
function dataUrlToBlob(dataUrl) {
    const [header, base64] = dataUrl.split(',');
    const mimeMatch = /data:(.*?);base64/.exec(header || '');
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}

/**
 * Convert Blob to base64 data URL
 * @param {Blob} blob
 * @param {string} mime
 * @param {number} [jpegQuality]
 * @returns {Promise<string>}
 */
function blobToDataUrl(blob, mime, jpegQuality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function execute(inputs, params = {}) {
    // 固定为 PNG 格式，不需要任何参数

    const images = Array.isArray(inputs?.image_base64)
        ? inputs.image_base64
        : (inputs?.image_base64 ? [inputs.image_base64] : []);

    if (images.length === 0) {
        return { image_base64: [] };
    }

    const results = [];

    for (const dataUrl of images) {
        // Convert to Blob
        const srcBlob = dataUrlToBlob(dataUrl);
        
        // Run background removal
        const outBlob = await removeBackground(srcBlob);

        // 固定为 PNG 格式输出
        const finalDataUrl = await blobToDataUrl(outBlob);
      
        results.push(finalDataUrl);
    }

    return { image_base64: results };
}

export default { execute };