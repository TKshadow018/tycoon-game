function ModelMetaItem({ icon: Icon, children }) {
  return (
    <span className="pc-model-meta">
      <Icon size={12} />
      {children}
    </span>
  )
}

export default ModelMetaItem
