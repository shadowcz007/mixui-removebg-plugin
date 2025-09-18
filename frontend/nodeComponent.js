// RemoveBGNode component
// Dependencies (React, Handle, Position) are provided by the plugin system

function RemoveBGNode({ data }) {
  // 不再需要任何参数状态，固定为 PNG 格式

  return React.createElement(
    'div',
    {
      style: {
        padding: '12px',
        background: 'linear-gradient(145deg, hsl(220, 15%, 14%), hsl(220, 15%, 16%))',
        border: '2px solid hsl(270, 50%, 40%)',
        borderRadius: '12px',
        width: '240px',
        color: 'hsl(220, 8%, 92%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
      }
    },
    React.createElement(Handle, {
      type: 'target',
      position: Position.Left,
      id: 'image_base64',
      style: { background: 'hsl(270, 50%, 40%)', border: '2px solid hsl(270, 50%, 40%)' }
    }),
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          fontWeight: '600',
          fontSize: '14px'
        }
      },
      React.createElement(
        'div',
        {
          style: {
            width: '20px',
            height: '20px',
            background: 'hsl(270, 50%, 40%)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }
        },
        '🧼'
      ),
      data.label || 'Remove Background'
    ),
    React.createElement(
      'div',
      { style: { fontSize: '12px', marginBottom: '8px', color: 'hsl(220, 8%, 65%)' } },
      '输出格式: PNG'
    ),
    React.createElement(Handle, {
      type: 'source',
      position: Position.Right,
      id: 'image_base64',
      style: { background: 'hsl(270, 50%, 40%)', border: '2px solid hsl(270, 50%, 40%)' }
    })
  );
}

// 确保默认导出，供打包器正确产出可用组件
export default RemoveBGNode;