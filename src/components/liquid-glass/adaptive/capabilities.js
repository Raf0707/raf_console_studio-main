export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function parsePlatform() {
    const userAgent = navigator.userAgent || '';
    const isAndroid = /Android/i.test(userAgent);
    const androidMatch = userAgent.match(/Android\s+(\d+)/i);
    const androidVersion = androidMatch
        ? Number.parseInt(androidMatch[1], 10)
        : null;

    const iPadDesktopMode =
        navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const isiOS = /iPhone|iPad|iPod/i.test(userAgent) || iPadDesktopMode;
    const iosMatch = userAgent.match(/OS\s(\d+)[_\.]/i);
    const safariVersionMatch = userAgent.match(/Version\/(\d+)/i);
    const iosVersion = iosMatch
        ? Number.parseInt(iosMatch[1], 10)
        : iPadDesktopMode && safariVersionMatch
            ? Number.parseInt(safariVersionMatch[1], 10)
            : null;

    const isMobile =
        isAndroid
        || isiOS
        || window.matchMedia('(pointer: coarse)').matches;

    if (isAndroid && (androidVersion === null || androidVersion < 13)) {
        return {
            shaderAllowed: false,
            isMobile,
            platform: 'android',
            version: androidVersion,
            reason: 'android-below-13',
        };
    }

    if (isiOS && (iosVersion === null || iosVersion < 26)) {
        return {
            shaderAllowed: false,
            isMobile,
            platform: 'ios',
            version: iosVersion,
            reason: 'ios-below-26',
        };
    }

    return {
        shaderAllowed: true,
        isMobile,
        platform: isAndroid ? 'android' : isiOS ? 'ios' : 'desktop',
        version: isAndroid ? androidVersion : isiOS ? iosVersion : null,
        reason: 'supported-platform',
    };
}

export function describeGpu(gl) {
    const extension = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = extension
        ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER);
    const vendor = extension
        ? gl.getParameter(extension.UNMASKED_VENDOR_WEBGL)
        : gl.getParameter(gl.VENDOR);

    return {
        renderer: String(renderer || 'unknown'),
        vendor: String(vendor || 'unknown'),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
    };
}

export function selectInitialQuality(gpu, platform, benchmarkMs) {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const softwareRenderer = /swiftshader|llvmpipe|software|basic render/i.test(
        `${gpu.renderer} ${gpu.vendor}`,
    );

    if (softwareRenderer || benchmarkMs > 95) {
        return {
            mode: 'glass',
            score: 0,
            reason: 'major-performance-caveat',
        };
    }

    let score = 0;
    score += cores >= 12 ? 4 : cores >= 8 ? 3 : cores >= 4 ? 2 : 0;
    score += memory >= 12 ? 3 : memory >= 8 ? 2 : memory >= 4 ? 1 : 0;
    score += gpu.maxTextureSize >= 16384
        ? 2
        : gpu.maxTextureSize >= 8192
            ? 1
            : 0;
    score += gpu.maxUniformVectors >= 512
        ? 2
        : gpu.maxUniformVectors >= 256
            ? 1
            : 0;
    score += benchmarkMs < 20 ? 3 : benchmarkMs < 45 ? 2 : benchmarkMs < 75 ? 1 : 0;

    if (platform.isMobile) {
        score = Math.min(score, 8);
    }

    if (score >= 10 && !platform.isMobile) {
        return { mode: 'shader-high', score, reason: 'gpu-benchmark-high' };
    }

    if (score >= 6) {
        return {
            mode: 'shader-medium',
            score,
            reason: 'gpu-benchmark-medium',
        };
    }

    return { mode: 'shader-low', score, reason: 'gpu-benchmark-low' };
}

export function modeSettings(mode) {
    switch (mode) {
        case 'shader-high':
            return {
                dprCap: 1.65,
                fpsCap: 60,
                strength: 1.0,
                maxSurfaces: 24,
            };
        case 'shader-medium':
            return {
                dprCap: 1.2,
                fpsCap: 45,
                strength: 0.76,
                maxSurfaces: 18,
            };
        case 'shader-low':
            return {
                dprCap: 0.9,
                fpsCap: 30,
                strength: 0.56,
                maxSurfaces: 12,
            };
        default:
            return {
                dprCap: 0.75,
                fpsCap: 24,
                strength: 0.0,
                maxSurfaces: 0,
            };
    }
}

export function setRootMode(mode, diagnostics) {
    const root = document.documentElement;
    root.classList.toggle('raf-glass-shader', mode.startsWith('shader'));
    root.classList.toggle('raf-glass-fallback', mode === 'glass');
    root.classList.toggle('raf-glass-minimal', mode === 'minimal');
    root.dataset.rafGlassMode = mode;
    root.dataset.rafShaderQuality = mode.startsWith('shader')
        ? mode.replace('shader-', '')
        : 'off';

    window.__RAF_GLASS_DIAGNOSTICS__ = {
        ...(window.__RAF_GLASS_DIAGNOSTICS__ || {}),
        ...diagnostics,
        mode,
        changedAt: new Date().toISOString(),
    };

    window.dispatchEvent(
        new CustomEvent('raf-glass-mode-change', {
            detail: window.__RAF_GLASS_DIAGNOSTICS__,
        }),
    );
}
