type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className={`brand-logo ${compact ? 'brand-logo--compact' : ''}`} aria-label="ServiceFlow">
      <span className="brand-logo__track" />
      <span className="brand-logo__node brand-logo__node--one" />
      <span className="brand-logo__node brand-logo__node--two" />
      <span className="brand-logo__spark" />
    </div>
  );
}
