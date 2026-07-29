import SwiftUI

/// Uses Apple's native Liquid Glass material on iOS 26+ and keeps the current
/// frosted material on older systems.
struct RafLiquidGlassContainer<Content: View>: View {
    private let cornerRadius: CGFloat
    private let content: Content

    init(
        cornerRadius: CGFloat = 28,
        @ViewBuilder content: () -> Content
    ) {
        self.cornerRadius = cornerRadius
        self.content = content()
    }

    @ViewBuilder
    var body: some View {
        if #available(iOS 26.0, *) {
            content
                .glassEffect(
                    .regular,
                    in: .rect(cornerRadius: cornerRadius)
                )
        } else {
            content
                .background(.ultraThinMaterial)
                .clipShape(
                    RoundedRectangle(
                        cornerRadius: cornerRadius,
                        style: .continuous
                    )
                )
                .overlay {
                    RoundedRectangle(
                        cornerRadius: cornerRadius,
                        style: .continuous
                    )
                    .stroke(.white.opacity(0.14), lineWidth: 1)
                }
                .shadow(color: .black.opacity(0.28), radius: 24, y: 12)
        }
    }
}
