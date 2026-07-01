export default function HelpIcon({
  tip,
  onDark = false,
  tipRight = false,
}: {
  tip: string;
  onDark?: boolean;
  tipRight?: boolean;
}) {
  const cls = ['help-icon', onDark && 'on-dark', tipRight && 'tip-right'].filter(Boolean).join(' ');
  return (
    <span className={cls} tabIndex={0} aria-label="Ayuda" data-tip={tip}>
      ?
    </span>
  );
}
