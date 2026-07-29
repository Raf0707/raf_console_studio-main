import { describeGpu, selectInitialQuality } from './capabilities';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shader-source';

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) || 'Shader compilation failed';
        gl.deleteShader(shader);
        throw new Error(message);
    }

    return shader;
}

function createProgram(gl) {
    const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(program) || 'Shader linking failed';
        gl.deleteProgram(program);
        throw new Error(message);
    }

    return program;
}

export function createGpuRuntime(canvas, platform, onContextLost, onContextRestored) {
    const gl = canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        desynchronized: true,
        failIfMajorPerformanceCaveat: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
    });

    if (!gl) {
        throw new Error('WebGL2 unavailable or major performance caveat');
    }

    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    const compileStart = performance.now();
    const program = createProgram(gl);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const uniforms = {
        resolution: gl.getUniformLocation(program, 'u_resolution'),
        viewport: gl.getUniformLocation(program, 'u_viewport'),
        pointer: gl.getUniformLocation(program, 'u_pointer'),
        time: gl.getUniformLocation(program, 'u_time'),
        scroll: gl.getUniformLocation(program, 'u_scroll'),
        strength: gl.getUniformLocation(program, 'u_strength'),
        surfaceCount: gl.getUniformLocation(program, 'u_surfaceCount'),
        surfaces: gl.getUniformLocation(program, 'u_surfaces[0]'),
        surfaceMeta: gl.getUniformLocation(program, 'u_surfaceMeta[0]'),
    };

    const gpu = describeGpu(gl);
    const benchmarkStart = performance.now();
    gl.viewport(0, 0, 96, 96);
    gl.uniform2f(uniforms.resolution, 96, 96);
    gl.uniform2f(uniforms.viewport, 96, 96);
    gl.uniform2f(uniforms.pointer, 48, 48);
    gl.uniform1f(uniforms.time, 0);
    gl.uniform1f(uniforms.scroll, 0);
    gl.uniform1f(uniforms.strength, 0.7);
    gl.uniform1i(uniforms.surfaceCount, 0);

    for (let index = 0; index < 18; index += 1) {
        gl.uniform1f(uniforms.time, index * 0.02);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.finish();

    const benchmarkMs = performance.now() - benchmarkStart
        + (performance.now() - compileStart) * 0.25;
    const initial = selectInitialQuality(gl, gpu, platform, benchmarkMs);

    return {
        gl,
        program,
        buffer,
        uniforms,
        gpu,
        benchmarkMs,
        initial,
        destroy() {
            canvas.removeEventListener('webglcontextlost', onContextLost, false);
            canvas.removeEventListener('webglcontextrestored', onContextRestored, false);
            if (!gl.isContextLost()) {
                gl.deleteBuffer(buffer);
                gl.deleteProgram(program);
            }
        },
    };
}
