import styles from './TableScroll.module.css';

export function TableScroll({ children, className }) {
  return (
    <div className={className}>
      <div className={styles.viewport} tabIndex={0}
        role="region" aria-label="Мэдээллийн хүснэгт">
        {children}
      </div>
    </div>
  );
}
