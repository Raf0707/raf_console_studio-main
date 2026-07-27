'use client';

import styles from './SegmentContentLoader.module.css';

export default function SegmentContentLoader({
                                                 visible,
                                                 label = 'Загрузка проектов',
                                             }) {
    return (
        <div
            className={`${styles.loader} ${
                visible
                    ? styles.loaderVisible
                    : ''
            }`}
            aria-hidden={!visible}
            aria-busy={visible}
        >
            <div className={styles.glass}>
                <span className={styles.drop} />

                <span className={styles.text}>
          {label}
        </span>
            </div>
        </div>
    );
}