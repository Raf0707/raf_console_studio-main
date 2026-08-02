import styles from './RafMinimalizmLogo.module.css';

/**
 * Статичный минималистичный логотип RAF.
 *
 * Важно:
 * здесь используется точный утверждённый растр логотипа,
 * а не приблизительная перерисовка букв через SVG-path.
 *
 * placement="hero"  — крупный логотип в первом экране.
 * placement="about" — версия в блоке «О студии».
 */
export default function RafMinimalizmLogo({
  placement = 'hero',
  className = '',
}) {
  const placementClass =
      placement === 'about'
          ? styles.about
          : styles.hero;

  return (
      <div
          className={`${styles.root} ${placementClass} ${className}`}
          aria-hidden="true"
      >
        <img
            className={styles.logo}
            src="/raf-minimal-logo.png"
            alt=""
            draggable="false"
        />
      </div>
  );
}
