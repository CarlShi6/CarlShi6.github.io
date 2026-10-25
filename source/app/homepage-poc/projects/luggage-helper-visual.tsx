import styles from "./luggage-helper-visual.module.css";

export function LuggageHelperVisual() {
  return <div className={styles.showcase} aria-label="Luggage Helper visual redesign based on the existing mobile prototype">
    <div className={styles.heading}>
      <span>Mobile experience · Visual exploration</span>
      <strong>Pack with a clearer picture.</strong>
      <p>Trip context, item guidance, and luggage status at a glance.</p>
    </div>
    <div className={styles.phones}>
      <div className={styles.stage}>
        <span className={styles.stageLabel}>01 / Set the trip</span>
        <div className={styles.phone}>
          <div className={styles.status}><span>9:41</span><span>●●●  ▰</span></div>
          <div className={styles.appHeader}><span className={styles.mark}>LH</span><span>Luggage Helper</span><span className={styles.headerDot}>•••</span></div>
          <div className={styles.screenBody}>
            <span className={styles.kicker}>YOUR TRIP</span>
            <h3>Where are you headed?</h3>
            <p>Start with your route and baggage allowance.</p>
            <div className={styles.routeCard}><div><small>FROM</small><b>JFK</b><span>New York</span></div><i aria-hidden="true">→</i><div><small>TO</small><b>PVG</b><span>Shanghai</span></div></div>
            <div className={styles.field}><span>Checked luggage limit</span><strong>23 <small>kg</small></strong></div>
            <div className={styles.primaryAction}>Continue to packing <span>→</span></div>
          </div>
          <div className={styles.homeIndicator} />
        </div>
      </div>
      <div className={styles.stage}>
        <span className={styles.stageLabel}>02 / Check an item</span>
        <div className={styles.phone}>
          <div className={styles.status}><span>9:41</span><span>●●●  ▰</span></div>
          <div className={styles.appHeader}><span>←</span><span>Add an item</span><span className={styles.headerDot}>•••</span></div>
          <div className={styles.screenBody}>
            <span className={styles.kicker}>ITEM REVIEW</span>
            <h3>Know before you pack.</h3>
            <div className={styles.itemCard}><span className={styles.itemIcon}>▣</span><div><b>18650 lithium-ion battery</b><small>Photo analysis · Estimated 0.1 kg</small></div></div>
            <div className={styles.warning}><span>!</span><div><strong>Check carrying rules</strong><p>Spare lithium batteries are generally kept in carry-on luggage. Verify your airline’s policy before travel.</p></div></div>
            <div className={styles.secondaryAction}>Review item details <span>↗</span></div>
            <div className={styles.primaryAction}>Add to packing list <span>→</span></div>
          </div>
          <div className={styles.homeIndicator} />
        </div>
      </div>
      <div className={styles.stage}>
        <span className={styles.stageLabel}>03 / See the whole bag</span>
        <div className={styles.phone}>
          <div className={styles.status}><span>9:41</span><span>●●●  ▰</span></div>
          <div className={styles.appHeader}><span className={styles.mark}>LH</span><span>My luggage</span><span className={styles.headerDot}>•••</span></div>
          <div className={styles.screenBody}>
            <span className={styles.kicker}>JFK → PVG</span>
            <h3>Your bag at a glance.</h3>
            <div className={styles.weightCard}><div><span>Packed weight</span><strong>3.9 <small>/ 23 kg</small></strong></div><div className={styles.progress}><i /></div><small>19.1 kg remaining</small></div>
            <div className={styles.listHead}><b>Items in luggage</b><span>5 items</span></div>
            <div className={styles.itemRow}><span>Shirt, jeans, T-shirt, sweater</span></div>
            <div className={styles.itemRow}><span>18650 battery · check carrying rules</span></div>
            <div className={styles.checklist}><span>✓</span><div><b>Packing checklist</b><small>Review what is still needed</small></div><span>→</span></div>
            <div className={styles.notice}>1 item needs a carrying-rule check</div>
          </div>
          <div className={styles.homeIndicator} />
        </div>
      </div>
    </div>
    <p className={styles.disclosure}>Visual redesign using existing prototype content. The original tested screens appear in the evidence below.</p>
  </div>;
}
