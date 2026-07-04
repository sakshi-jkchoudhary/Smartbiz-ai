export function Input({ label, error, className = '', ...rest }) {
  return (
    <div className={className}>
      {label && <label className="label-text">{label}</label>}
      <input className="input-field" {...rest} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...rest }) {
  return (
    <div className={className}>
      {label && <label className="label-text">{label}</label>}
      <select className="input-field" {...rest}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...rest }) {
  return (
    <div className={className}>
      {label && <label className="label-text">{label}</label>}
      <textarea className="input-field resize-none" rows={3} {...rest} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
