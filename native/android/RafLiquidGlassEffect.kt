package raf.console.studio.liquidglass

import android.graphics.RenderEffect
import android.graphics.RuntimeShader
import android.os.Build
import android.view.View
import androidx.annotation.RequiresApi

/**
 * Android 13+ native AGSL implementation.
 *
 * Apply this effect to the composited layer that already contains the scene
 * behind the glass. RuntimeShader filters the view's input shader; it cannot
 * sample arbitrary sibling views by itself.
 */
@RequiresApi(Build.VERSION_CODES.TIRAMISU)
class RafLiquidGlassEffect(
    shaderSource: String,
    private val strength: Float = 0.8f,
) : View.OnLayoutChangeListener {

    private val shader = RuntimeShader(shaderSource)
    private var target: View? = null

    fun attach(view: View) {
        detach()
        target = view
        view.addOnLayoutChangeListener(this)
        updateSize(view.width, view.height)
        view.setRenderEffect(
            RenderEffect.createRuntimeShaderEffect(shader, "content"),
        )
    }

    fun update(timeSeconds: Float) {
        shader.setFloatUniform("time", timeSeconds)
        target?.invalidate()
    }

    fun detach() {
        target?.removeOnLayoutChangeListener(this)
        target?.setRenderEffect(null)
        target = null
    }

    override fun onLayoutChange(
        view: View,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
        oldLeft: Int,
        oldTop: Int,
        oldRight: Int,
        oldBottom: Int,
    ) {
        updateSize(right - left, bottom - top)
    }

    private fun updateSize(width: Int, height: Int) {
        shader.setFloatUniform(
            "size",
            width.coerceAtLeast(1).toFloat(),
            height.coerceAtLeast(1).toFloat(),
        )
        shader.setFloatUniform("strength", strength)
        shader.setFloatUniform("time", 0f)
    }
}
