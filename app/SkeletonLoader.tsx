import styles from './SkeletonLoader.module.css'

export default function SkeletonLoader() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonCard}>
        <div className={styles.skeletonLogo}></div>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonSubtitle}></div>
        <div className={styles.skeletonButtonContainer}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonButton}></div>
          ))}
        </div>
        <div className={styles.skeletonFooter}></div>
      </div>
    </div>
  )
}