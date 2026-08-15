import styles from './RafMinimalizmLogo.module.css';

export default function RafMinimalizmLogo({
                                              placement = 'hero',
                                              className = '',
                                          }) {
    const placementClass =
        placement === 'about'
            ? styles.about
            : placement === 'navbar'
                ? styles.navbar
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