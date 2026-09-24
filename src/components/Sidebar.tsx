interface SidebarProps {
  chatName: string;
}

export function Sidebar({ chatName }: SidebarProps) {
  return (
    <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '20px', backgroundColor: '#f0f2f5' }}>
      <h2>Чаты</h2>
      <div style={{ padding: '10px', backgroundColor: '#e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
        <strong>{chatName}</strong>
        <p style={{ fontSize: '12px', color: '#666' }}>Нажмите, чтобы открыть</p>
      </div>
    </div>
  );
}
